/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/services/conversationService.ts - STABLE VERSION
import { 
    getConversationMessages, 
    saveMessage, 
    getRecentMessages,
    Message as AppwriteMessage 
  } from '@/lib/appwrite/messages';
  import { 
    getOrCreateConversation, 
    updateConversation, 
    getUserConversations,
    Conversation as AppwriteConversation 
  } from '@/lib/appwrite/conversations';
  import { personaService, ParsedPersonaProfile } from './personaService';
  
  export interface ChatMessage {
    id: string;
    role: 'user' | 'bot' | 'assistant';
    content: string;
    timestamp: string;
    sender?: 'user' | 'bot';
  }
  
  export interface Conversation {
    id: string;
    conversationId: string;
    botProfileId: string;
    userId: string;
    botProfile?: ParsedPersonaProfile;
    lastMessage: string;
    lastMessageAt: string;
    messageCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface UserConversations {
    conversations: Conversation[];
    botProfiles: Record<string, ParsedPersonaProfile>;
  }
  
  // CACHE KEYS
  const CONVERSATIONS_CACHE_KEY = 'chat_conversations_cache';
  const MESSAGES_CACHE_PREFIX = 'chat_messages_';
  const CACHE_TIMESTAMP_KEY = 'chat_cache_timestamp';
  const CACHE_TTL = 30 * 60 * 1000; // 30 minutes cache TTL (longer)
  
  class ConversationService {
    private cache: Map<string, any> = new Map();
    private fetchPromises: Map<string, Promise<any>> = new Map(); // Track ongoing fetches
  
    /**
     * Get conversations from cache or API - PREVENT DUPLICATE FETCHES
     */
    async getCachedUserConversations(userId: string): Promise<UserConversations> {
      const cacheKey = `${CONVERSATIONS_CACHE_KEY}_${userId}`;
      
      // Check if we're already fetching
      if (this.fetchPromises.has(cacheKey)) {
        console.log('⏳ Waiting for existing fetch to complete');
        return await this.fetchPromises.get(cacheKey);
      }
      
      // Check memory cache first
      if (this.cache.has(cacheKey)) {
        console.log('💾 Using memory cached conversations');
        return this.cache.get(cacheKey);
      }
      
      // Check localStorage cache
      const cached = this.getFromLocalStorage(cacheKey);
      if (cached && this.isCacheValid(cacheKey)) {
        console.log('💾 Using localStorage cached conversations');
        this.cache.set(cacheKey, cached);
        return cached;
      }
      
      // Create fetch promise to prevent duplicate fetches
      const fetchPromise = this.fetchUserConversationsWithProfiles(userId);
      this.fetchPromises.set(cacheKey, fetchPromise);
      
      try {
        const data = await fetchPromise;
        
        // Cache in memory
        this.cache.set(cacheKey, data);
        
        // Cache in localStorage
        this.saveToLocalStorage(cacheKey, data);
        this.updateCacheTimestamp(cacheKey);
        
        return data;
      } finally {
        // Remove the promise from tracking
        this.fetchPromises.delete(cacheKey);
      }
    }
  
    /**
     * Get messages from cache or API - PREVENT DUPLICATE FETCHES
     */
    async getCachedMessages(conversationId: string, forceRefresh = false): Promise<ChatMessage[]> {
      const cacheKey = `${MESSAGES_CACHE_PREFIX}${conversationId}`;
      
      // Check if we're already fetching
      if (this.fetchPromises.has(cacheKey)) {
        console.log(`⏳ Waiting for existing message fetch for ${conversationId}`);
        return await this.fetchPromises.get(cacheKey);
      }
      
      // Don't use cache if force refresh
      if (!forceRefresh) {
        // Check memory cache
        if (this.cache.has(cacheKey)) {
          console.log(`💾 Using memory cached messages for ${conversationId}`);
          return this.cache.get(cacheKey);
        }
        
        // Check localStorage
        const cached = this.getFromLocalStorage(cacheKey);
        if (cached && this.isCacheValid(cacheKey)) {
          console.log(`💾 Using localStorage cached messages for ${conversationId}`);
          this.cache.set(cacheKey, cached);
          return cached;
        }
      }
      
      // Create fetch promise
      const fetchPromise = this.loadMessages(conversationId);
      this.fetchPromises.set(cacheKey, fetchPromise);
      
      try {
        const messages = await fetchPromise;
        
        // Cache
        this.cache.set(cacheKey, messages);
        this.saveToLocalStorage(cacheKey, messages);
        this.updateCacheTimestamp(cacheKey);
        
        return messages;
      } finally {
        this.fetchPromises.delete(cacheKey);
      }
    }
  
    /**
     * Get or create conversation and load messages - STABLE VERSION
     */
    async getConversation(
      userId: string, 
      botProfileId: string, 
      loadMessages: boolean = true
    ) {
      // Get conversation
      const appwriteConversation = await getOrCreateConversation(userId, botProfileId);
      
      // Get bot profile
      let botProfile: ParsedPersonaProfile | null = null;
      try {
        botProfile = await personaService.getPersonaById(botProfileId);
      } catch (error) {
        console.error('Error loading bot profile:', error);
      }
  
      // Format conversation
      const conversation: Conversation = {
        id: appwriteConversation.$id,
        conversationId: appwriteConversation.conversationId,
        botProfileId: appwriteConversation.botProfileId,
        userId: appwriteConversation.userId,
        botProfile: botProfile || undefined,
        lastMessage: appwriteConversation.lastMessage || '',
        lastMessageAt: appwriteConversation.lastMessageAt,
        messageCount: appwriteConversation.messageCount || 0,
        isActive: appwriteConversation.isActive || true,
        createdAt: appwriteConversation.$createdAt,
        updatedAt: appwriteConversation.$updatedAt
      };
  
      // Load messages from cache or API
      let messages: ChatMessage[] = [];
      if (loadMessages) {
        messages = await this.getCachedMessages(appwriteConversation.conversationId);
      }
  
      return {
        conversation,
        messages,
        botProfile
      };
    }
  
    /**
     * Get all conversations for a user with bot profiles - Separate method for fetching
     */
    private async fetchUserConversationsWithProfiles(userId: string): Promise<UserConversations> {
      console.log('🌐 Fetching conversations from API');
      const appwriteConversations = await getUserConversations(userId);
      
      const conversations: Conversation[] = [];
      const botProfiles: Record<string, ParsedPersonaProfile> = {};
      
      for (const conv of appwriteConversations) {
        try {
          const botProfile = await personaService.getPersonaById(conv.botProfileId);
          
          botProfiles[conv.botProfileId] = botProfile;
          
          conversations.push({
            id: conv.$id,
            conversationId: conv.conversationId,
            botProfileId: conv.botProfileId,
            userId: conv.userId,
            botProfile,
            lastMessage: conv.lastMessage || '',
            lastMessageAt: conv.lastMessageAt,
            messageCount: conv.messageCount || 0,
            isActive: conv.isActive || true,
            createdAt: conv.$createdAt,
            updatedAt: conv.$updatedAt
          });
        } catch (error) {
          console.error(`Error loading profile for ${conv.botProfileId}:`, error);
          conversations.push({
            id: conv.$id,
            conversationId: conv.conversationId,
            botProfileId: conv.botProfileId,
            userId: conv.userId,
            lastMessage: conv.lastMessage || '',
            lastMessageAt: conv.lastMessageAt,
            messageCount: conv.messageCount || 0,
            isActive: conv.isActive || true,
            createdAt: conv.$createdAt,
            updatedAt: conv.$updatedAt
          });
        }
      }
      
      return {
        conversations,
        botProfiles
      };
    }
  
    /**
     * Load messages for a conversation
     */
    private async loadMessages(conversationId: string): Promise<ChatMessage[]> {
      console.log(`🌐 Fetching messages from API for ${conversationId}`);
      const appwriteMessages = await getConversationMessages(conversationId, 100);
      
      return appwriteMessages.map((msg: AppwriteMessage) => this.transformMessage(msg));
    }
  
    /**
     * Send a message and update cache - OPTIMIZED
     */
    async sendMessage(
      conversationId: string,
      userId: string,
      botProfileId: string,
      userMessage: string,
      botResponse: string
    ) {
      try {
        // Save messages to Appwrite
        const savedUserMessage = await saveMessage(
          conversationId,
          userId,
          botProfileId,
          'user',
          userMessage,
          0
        );
        
        const savedBotMessage = await saveMessage(
          conversationId,
          userId,
          botProfileId,
          'bot',
          botResponse,
          1
        );
        
        // Update conversation
        await updateConversation(conversationId, botResponse);
        
        // Update cache immediately with new messages
        const cacheKey = `${MESSAGES_CACHE_PREFIX}${conversationId}`;
        const currentMessages = this.cache.get(cacheKey) || [];
        const newMessages = [
          ...currentMessages,
          this.transformMessage(savedUserMessage),
          this.transformMessage(savedBotMessage)
        ];
        
        this.cache.set(cacheKey, newMessages);
        this.saveToLocalStorage(cacheKey, newMessages);
        this.updateCacheTimestamp(cacheKey);
        
        console.log('✅ Messages cached and saved');
        
        return {
          userMessage: this.transformMessage(savedUserMessage),
          botMessage: this.transformMessage(savedBotMessage)
        };
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    }
  
    /**
     * Update conversation in cache (without refetching everything)
     */
    updateConversationInCache(botProfileId: string, updates: Partial<Conversation>) {
      const userId = this.getUserIdFromCache();
      if (!userId) return;
      
      const cacheKey = `${CONVERSATIONS_CACHE_KEY}_${userId}`;
      const cachedData = this.cache.get(cacheKey) as UserConversations;
      
      if (cachedData) {
        const updatedConversations = cachedData.conversations.map(conv => 
          conv.botProfileId === botProfileId 
            ? { ...conv, ...updates }
            : conv
        );
        
        const updatedData = {
          ...cachedData,
          conversations: updatedConversations
        };
        
        this.cache.set(cacheKey, updatedData);
        this.saveToLocalStorage(cacheKey, updatedData);
        this.updateCacheTimestamp(cacheKey);
      }
    }
  
    /**
     * Add messages to cache for a specific conversation
     */
    addMessagesToCache(conversationId: string, messages: ChatMessage[]) {
      const cacheKey = `${MESSAGES_CACHE_PREFIX}${conversationId}`;
      const currentMessages = this.cache.get(cacheKey) || [];
      const newMessages = [...currentMessages, ...messages];
      
      this.cache.set(cacheKey, newMessages);
      this.saveToLocalStorage(cacheKey, newMessages);
      this.updateCacheTimestamp(cacheKey);
    }
  
    /**
     * Clear cache for specific items only
     */
    clearCache(keys?: string[]) {
      if (keys) {
        keys.forEach(key => {
          this.cache.delete(key);
          localStorage.removeItem(key);
          localStorage.removeItem(`${CACHE_TIMESTAMP_KEY}_${key}`);
        });
      } else {
        this.cache.clear();
      }
    }
  
    /**
     * Check if cache is fresh (recently updated)
     */
    isCacheFresh(key: string, maxAgeMs: number = 10000): boolean {
      const timestamp = localStorage.getItem(`${CACHE_TIMESTAMP_KEY}_${key}`);
      if (!timestamp) return false;
      
      const age = Date.now() - parseInt(timestamp);
      return age < maxAgeMs;
    }
  
    /**
     * Transform Appwrite message to ChatMessage
     */
    private transformMessage(appwriteMessage: AppwriteMessage): ChatMessage {
      return {
        id: appwriteMessage.$id,
        role: appwriteMessage.role as 'user' | 'bot',
        content: appwriteMessage.content,
        timestamp: appwriteMessage.timestamp || appwriteMessage.$createdAt,
        sender: appwriteMessage.role as 'user' | 'bot'
      };
    }
  
    /**
     * LocalStorage helpers
     */
    private saveToLocalStorage(key: string, data: any) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
    }
  
    private getFromLocalStorage(key: string): any {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        console.error('Failed to get from localStorage:', e);
        return null;
      }
    }
  
    private updateCacheTimestamp(key: string) {
      try {
        localStorage.setItem(`${CACHE_TIMESTAMP_KEY}_${key}`, Date.now().toString());
      } catch (e) {
        console.error('Failed to update cache timestamp:', e);
      }
    }
  
    private isCacheValid(key: string): boolean {
      try {
        const timestamp = localStorage.getItem(`${CACHE_TIMESTAMP_KEY}_${key}`);
        if (!timestamp) return false;
        
        const age = Date.now() - parseInt(timestamp);
        return age < CACHE_TTL;
      } catch (e) {
        return false;
      }
    }
  
    private getUserIdFromCache(): string | null {
      // Try to get userId from cached conversations
      for (const [key, value] of this.cache.entries()) {
        if (key.startsWith(CONVERSATIONS_CACHE_KEY)) {
          return key.replace(`${CONVERSATIONS_CACHE_KEY}_`, '');
        }
      }
      return null;
    }
  }
  
  export const conversationService = new ConversationService();