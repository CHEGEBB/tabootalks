/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/services/conversationService.ts - FIXED VERSION
import { 
    getConversationMessages, 
    saveMessage, 
    Message as AppwriteMessage 
  } from '@/lib/appwrite/messages';
  import { 
    getOrCreateConversation, 
    updateConversation, 
    getUserConversations,
    Conversation as AppwriteConversation 
  } from '@/lib/appwrite/conversations';
  import { personaService, ParsedPersonaProfile } from './personaService';
  import { authService } from './authService';
  
  // ✅ FIXED: Remove 'assistant' from role type
  export interface ChatMessage {
    id: string;
    role: 'user' | 'bot'; // ✅ Only 'user' or 'bot'
    content: string;
    timestamp: string;
    sender?: 'user' | 'bot';
    userId: string;
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
    userId: string;
  }
  
  const CONVERSATIONS_CACHE_PREFIX = 'chat_conversations_cache_';
  const MESSAGES_CACHE_PREFIX = 'chat_messages_';
  const CACHE_TIMESTAMP_KEY = 'chat_cache_timestamp';
  const CACHE_TTL = 30 * 60 * 1000;
  const LOGGED_IN_USER_KEY = 'conversation_service_user_id';
  
  class ConversationService {
    private cache: Map<string, any> = new Map();
    private fetchPromises: Map<string, Promise<any>> = new Map();
    private loggedInUserId: string | null = null;
  
    /**
     * 🔒 CRITICAL: Initialize service with logged-in user
     */
    async initialize(): Promise<string | null> {
      try {
        console.log('🔐 Initializing ConversationService...');
        
        const currentUser = await authService.getCurrentUser();
        
        if (!currentUser || !currentUser.user || !currentUser.user.$id) {
          console.error('❌ No logged-in user found during initialization');
          this.loggedInUserId = null;
          localStorage.removeItem(LOGGED_IN_USER_KEY);
          return null;
        }
        
        const userId = currentUser.user.$id;
        this.loggedInUserId = userId;
        localStorage.setItem(LOGGED_IN_USER_KEY, userId);
        
        console.log('✅ ConversationService initialized for user:', userId);
        return userId;
      } catch (error) {
        console.error('❌ Failed to initialize ConversationService:', error);
        this.loggedInUserId = null;
        localStorage.removeItem(LOGGED_IN_USER_KEY);
        return null;
      }
    }
  
    /**
     * 🔒 Get currently authenticated user ID
     */
    private async getAuthenticatedUserId(): Promise<string> {
      if (this.loggedInUserId) {
        return this.loggedInUserId;
      }
      
      const storedUserId = localStorage.getItem(LOGGED_IN_USER_KEY);
      if (storedUserId) {
        this.loggedInUserId = storedUserId;
        return storedUserId;
      }
      
      const currentUser = await authService.getCurrentUser();
      
      if (!currentUser || !currentUser.user || !currentUser.user.$id) {
        throw new Error('Authentication required. Please log in.');
      }
      
      const userId = currentUser.user.$id;
      this.loggedInUserId = userId;
      localStorage.setItem(LOGGED_IN_USER_KEY, userId);
      
      return userId;
    }
  
    /**
     * 🔒 VERIFY: Requested userId matches authenticated user
     */
    private async verifyUserAccess(requestedUserId: string): Promise<void> {
      const authenticatedUserId = await this.getAuthenticatedUserId();
      
      if (authenticatedUserId !== requestedUserId) {
        console.error(`❌ SECURITY BREACH ATTEMPT!`);
        this.clearAllCache();
        this.loggedInUserId = null;
        localStorage.removeItem(LOGGED_IN_USER_KEY);
        throw new Error('SECURITY VIOLATION: Access denied. Please log in again.');
      }
    }
  
    /**
     * Get conversations - automatically uses authenticated user
     */
    async getCachedUserConversations(): Promise<UserConversations> {
      const userId = await this.getAuthenticatedUserId();
      const cacheKey = `${CONVERSATIONS_CACHE_PREFIX}${userId}`;
      
      if (this.fetchPromises.has(cacheKey)) {
        return await this.fetchPromises.get(cacheKey);
      }
      
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (cached.userId === userId) {
          return cached;
        }
        this.cache.delete(cacheKey);
      }
      
      const cached = this.getFromLocalStorage(cacheKey);
      if (cached && this.isCacheValid(cacheKey) && cached.userId === userId) {
        this.cache.set(cacheKey, cached);
        return cached;
      }
      
      const fetchPromise = this.fetchUserConversationsWithProfiles(userId);
      this.fetchPromises.set(cacheKey, fetchPromise);
      
      try {
        const data = await fetchPromise;
        this.cache.set(cacheKey, data);
        this.saveToLocalStorage(cacheKey, data);
        this.updateCacheTimestamp(cacheKey);
        return data;
      } finally {
        this.fetchPromises.delete(cacheKey);
      }
    }
  
    /**
     * Get messages for conversation
     */
    async getCachedMessages(conversationId: string, forceRefresh = false): Promise<ChatMessage[]> {
      const userId = await this.getAuthenticatedUserId();
      const cacheKey = `${MESSAGES_CACHE_PREFIX}${conversationId}_${userId}`;
      
      if (this.fetchPromises.has(cacheKey)) {
        return await this.fetchPromises.get(cacheKey);
      }
      
      if (!forceRefresh) {
        if (this.cache.has(cacheKey)) {
          return this.cache.get(cacheKey);
        }
        
        const cached = this.getFromLocalStorage(cacheKey);
        if (cached && this.isCacheValid(cacheKey)) {
          this.cache.set(cacheKey, cached);
          return cached;
        }
      }
      
      const fetchPromise = this.loadMessages(conversationId, userId);
      this.fetchPromises.set(cacheKey, fetchPromise);
      
      try {
        const messages = await fetchPromise;
        this.cache.set(cacheKey, messages);
        this.saveToLocalStorage(cacheKey, messages);
        this.updateCacheTimestamp(cacheKey);
        return messages;
      } finally {
        this.fetchPromises.delete(cacheKey);
      }
    }
  
    /**
     * Get or create conversation
     */
    async getConversation(botProfileId: string, loadMessages: boolean = true) {
      const userId = await this.getAuthenticatedUserId();
      
      const appwriteConversation = await getOrCreateConversation(userId, botProfileId);
      
      if (appwriteConversation.userId !== userId) {
        throw new Error('SECURITY VIOLATION: This conversation does not belong to you.');
      }
      
      let botProfile: ParsedPersonaProfile | null = null;
      try {
        botProfile = await personaService.getPersonaById(botProfileId);
      } catch (error) {
        console.error('Error loading bot profile:', error);
      }
  
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
     * Fetch conversations with profiles
     */
    private async fetchUserConversationsWithProfiles(userId: string): Promise<UserConversations> {
      await this.verifyUserAccess(userId);
      
      const appwriteConversations = await getUserConversations(userId);
      
      const conversations: Conversation[] = [];
      const botProfiles: Record<string, ParsedPersonaProfile> = {};
      
      for (const conv of appwriteConversations) {
        if (conv.userId !== userId) {
          console.error(`❌ SECURITY: Skipping conversation ${conv.$id}`);
          continue;
        }
        
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
        botProfiles,
        userId
      };
    }
  
    /**
     * Load messages with filtering
     */
    private async loadMessages(conversationId: string, userId: string): Promise<ChatMessage[]> {
      await this.verifyUserAccess(userId);
      
      const appwriteMessages = await getConversationMessages(conversationId, 100);
      
      const filteredMessages = appwriteMessages.filter(msg => {
        const isUserMessage = msg.userId === userId;
        const isBotMessage = msg.role === 'bot';
        return isUserMessage || isBotMessage;
      });
      
      return filteredMessages.map((msg: AppwriteMessage) => this.transformMessage(msg, userId));
    }
  
    /**
     * Send message
     */
    async sendMessage(
      conversationId: string,
      botProfileId: string,
      userMessage: string,
      botResponse: string
    ) {
      const userId = await this.getAuthenticatedUserId();
      
      try {
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
        
        await updateConversation(conversationId, botResponse);
        
        const cacheKey = `${MESSAGES_CACHE_PREFIX}${conversationId}_${userId}`;
        const currentMessages = this.cache.get(cacheKey) || [];
        const newMessages = [
          ...currentMessages,
          this.transformMessage(savedUserMessage, userId),
          this.transformMessage(savedBotMessage, userId)
        ];
        
        this.cache.set(cacheKey, newMessages);
        this.saveToLocalStorage(cacheKey, newMessages);
        this.updateCacheTimestamp(cacheKey);
        
        return {
          userMessage: this.transformMessage(savedUserMessage, userId),
          botMessage: this.transformMessage(savedBotMessage, userId)
        };
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    }
  
    /**
     * Clear all cache on logout
     */
    clearAllCache() {
      this.cache.clear();
      this.fetchPromises.clear();
      this.loggedInUserId = null;
      
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (
          key.includes(CONVERSATIONS_CACHE_PREFIX) || 
          key.includes(MESSAGES_CACHE_PREFIX) ||
          key.includes(CACHE_TIMESTAMP_KEY) ||
          key === LOGGED_IN_USER_KEY
        )) {
          localStorage.removeItem(key);
        }
      }
    }
  
    /**
     * ✅ FIXED: Transform message - normalize role to 'user' or 'bot'
     */
    private transformMessage(appwriteMessage: AppwriteMessage, userId: string): ChatMessage {
      // Normalize role: 'assistant' becomes 'bot'
      let role: 'user' | 'bot' = 'bot';
      if (appwriteMessage.role === 'user') {
        role = 'user';
      } else if (appwriteMessage.role === 'bot' || appwriteMessage.role === 'assistant') {
        role = 'bot';
      }
  
      return {
        id: appwriteMessage.$id,
        role: role,
        content: appwriteMessage.content,
        timestamp: appwriteMessage.timestamp || appwriteMessage.$createdAt,
        sender: role,
        userId: appwriteMessage.userId || userId
      };
    }
  
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
  }
  
  export const conversationService = new ConversationService();