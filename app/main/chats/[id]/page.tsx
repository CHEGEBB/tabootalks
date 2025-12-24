/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Client, Databases, Query, Account, Storage } from 'appwrite';
import Image from 'next/image';
import {
  Send, ArrowLeft, Gift, Heart, Smile, Paperclip, Crown, Zap, Shield,
  CheckCircle, Volume2, VolumeX, MapPin, Clock, Sparkles, ChevronRight,
  Image as ImageIcon, Users, Home, MoreVertical, Search, Eye, MessageCircle,
  RefreshCw, Plus, UserPlus, TrendingUp, Activity, Award, Clock4,
  Target, BarChart3, CreditCard, Phone, Video, Star, Camera, X,
  LucideSpeaker,
  MessageCircleHeart
} from 'lucide-react';
import personaService, { ParsedPersonaProfile } from '@/lib/services/personaService';
import LayoutController from '@/components/layout/LayoutController';
import dynamic from 'next/dynamic';
import giftHandlerService, { ChatGiftMessage as ImportedChatGiftMessage } from '@/lib/services/giftHandlerService';
import giftService from '@/lib/services/giftService';

// Dynamically import emoji picker to avoid SSR issues
const EmojiPicker = dynamic(
  () => import('emoji-picker-react'),
  { ssr: false }
);

// Types
interface Message {
  $id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
  conversationId: string;
  isGift?: boolean;
  giftData?: string;
  giftId?: string;
  giftName?: string;
  giftPrice?: number;
  giftImage?: string;
  photoUrl?: string;  // ADD THIS LINE - for AI-sent photos
}
export interface ChatGiftMessage {
  type: 'gift';
  giftId: number;
  giftName: string;
  giftImage?: string;
  message?: string;
  isAnimated: boolean;
  animationUrl?: string;
  price: number;
  category?: string;
  timestamp: string;
  documentId?: string;
}

interface Conversation {
  $id: string;
  userId: string;
  botProfileId: string;
  lastMessage: string;
  lastMessageAt: string;
  messageCount: number;
  isActive: boolean;
}

interface ConversationWithBot extends Conversation {
  bot?: ParsedPersonaProfile;
}

interface User {
  $id: string;
  username: string;
  credits: number;
  profilePic?: string;
}

interface AppwriteGiftDocument {
  $id: string;
  senderId: string;
  recipientId: string;
  recipientName: string;
  giftId: string;
  giftName: string;
  giftPrice: number;
  giftImage?: string;
  message?: string;
  sentAt: string;
  isAnimated: boolean;
  animationUrl?: string;
  category?: string;
  status: string;
  conversationId?: string;
  $createdAt: string;
  $updatedAt: string;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;

  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [botProfile, setBotProfile] = useState<ParsedPersonaProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isRequestingPhoto, setIsRequestingPhoto] = useState(false);
  const [showPhotoRequestConfirm, setShowPhotoRequestConfirm] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [error, setError] = useState('');
  const [isNewConversation, setIsNewConversation] = useState(false);
  const [actualConversationId, setActualConversationId] = useState<string>('');
  const [isMuted, setIsMuted] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [respondedGifts, setRespondedGifts] = useState<Set<string>>(new Set());

  // Gift states
  const [giftsInChat, setGiftsInChat] = useState<ChatGiftMessage[]>([]);
  const [giftsFromGiftsCollection, setGiftsFromGiftsCollection] = useState<AppwriteGiftDocument[]>([]);
  const [showGiftAnimation, setShowGiftAnimation] = useState<ChatGiftMessage | null>(null);
  const [newGiftNotification, setNewGiftNotification] = useState<ChatGiftMessage | null>(null);

  const [showPhotoViewer, setShowPhotoViewer] = useState<{
    url: string;
    message: Message
  } | null>(null);

  // Chat list sidebar states
  const [conversations, setConversations] = useState<ConversationWithBot[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active'>('all');
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);

  // Sticker state
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [stickers, setStickers] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const mobileInputContainerRef = useRef<HTMLDivElement>(null);
  const stickerPickerRef = useRef<HTMLDivElement>(null);

  const [showGiftAnimationOverlay, setShowGiftAnimationOverlay] = useState<ChatGiftMessage | null>(null);

  // Initialize Appwrite
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  const databases = new Databases(client);
  const storage = new Storage(client);
  const account = new Account(client);

  const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const FUNCTION_URL = process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_AI_CHATBOT!;

  // Load stickers
  useEffect(() => {
    const loadStickers = async () => {
      try {
        const response = await fetch('/data/stickers.json');
        const data = await response.json();
        setStickers(data);
      } catch (error) {
        console.error('Error loading stickers:', error);
        // Fallback stickers
        setStickers([
          { id: 1, name: 'Smile', emoji: '😊', category: 'happy' },
          { id: 2, name: 'Heart', emoji: '❤️', category: 'love' },
          { id: 3, name: 'Laugh', emoji: '😂', category: 'happy' },
          { id: 4, name: 'Fire', emoji: '🔥', category: 'cool' },
          { id: 5, name: 'Star', emoji: '⭐', category: 'cool' },
          { id: 6, name: 'Wink', emoji: '😉', category: 'flirty' },
        ]);
      }
    };

    loadStickers();
  }, []);

  const getProfileImageUrl = (fileId?: string) => {
    if (!fileId) return null;
    try {
      return storage.getFilePreview(
        process.env.NEXT_PUBLIC_APPWRITE_BUCKET_PROFILE_PHOTOS!,
        fileId
      );
    } catch (error) {
      console.error('Error getting profile image:', error);
      return null;
    }
  };

  // Load gifts from gifts collection (ONLY for display, NOT for triggering responses)
  const loadGiftsFromGiftsCollection = async (conversationId: string) => {
    try {
      console.log('Loading gifts for conversation:', conversationId);

      const currentUser = await account.get();
      const userId = currentUser.$id;

      const giftsResponse = await databases.listDocuments(
        DATABASE_ID,
        'gifts',
        [
          Query.equal('conversationId', conversationId),
          Query.orderAsc('sentAt'),
          Query.limit(50)
        ]
      );

      console.log(`Found ${giftsResponse.documents.length} gifts in collection`);

      const gifts = giftsResponse.documents as unknown as AppwriteGiftDocument[];
      return gifts;
    } catch (error: any) {
      console.error('Error loading gifts from collection:', error);
      return [];
    }
  };

  // Convert Appwrite gift document to ChatGiftMessage
  const convertToChatGiftMessage = (giftDoc: AppwriteGiftDocument): ChatGiftMessage => {
    return {
      type: 'gift',
      giftId: parseInt(giftDoc.giftId),
      giftName: giftDoc.giftName,
      giftImage: giftDoc.giftImage,
      message: giftDoc.message,
      isAnimated: giftDoc.isAnimated,
      animationUrl: giftDoc.animationUrl,
      price: giftDoc.giftPrice,
      category: giftDoc.category,
      timestamp: giftDoc.sentAt || giftDoc.$createdAt,
      documentId: giftDoc.$id
    };
  };

  // ============ REMOVED: Gift response polling ============
  // The backend will handle all gift responses automatically

  // Close emoji/sticker picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (stickerPickerRef.current && !stickerPickerRef.current.contains(event.target as Node)) {
        setShowStickerPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Add this near your other useEffects in the ChatPage component
  useEffect(() => {
    const handleWinkMessage = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const hasWink = searchParams.get('wink') === 'true';

      if (hasWink && currentUser && botProfile && !isSending) {
        // Remove the wink parameter from URL
        window.history.replaceState(null, '', `/main/chats/${conversationId}`);

        // Send wink as a message
        const winkMessage = "😉";

        // Optimistic update
        const tempUserMessage: Message = {
          $id: `wink_${Date.now()}`,
          role: 'user',
          content: winkMessage,
          timestamp: new Date().toISOString(),
          conversationId: actualConversationId || 'pending'
        };
        setMessages(prev => [...prev, tempUserMessage]);

        // Send the wink message to AI
        await sendWinkMessage(winkMessage);
      }
    };

    if (typeof window !== 'undefined') {
      handleWinkMessage();
    }
  }, [currentUser, botProfile, conversationId]);

  // Add this function to send wink message
  const sendWinkMessage = async (winkMessage: string) => {
    if (!currentUser || !botProfile) return;

    setIsSending(true);
    setError('');
    setStreamingText('');
    setTypingIndicator(true);

    try {
      if (!FUNCTION_URL) {
        throw new Error('Chat function is not configured');
      }

      const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.$id,
          botProfileId: botProfile.$id,
          message: winkMessage,
          conversationId: actualConversationId || undefined,
          isNewConversation: isNewConversation,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status}`);
      }

      // Handle SSE stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullBotResponse = '';
      let newConvId = actualConversationId;
      let buffer = '';

      if (!reader) {
        throw new Error('No response stream');
      }

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim().startsWith('data: ')) {
              try {
                const jsonStr = line.substring(6);
                const data = JSON.parse(jsonStr);

                if (data.chunk) {
                  fullBotResponse += data.chunk;
                  setStreamingText(fullBotResponse);
                }

                if (data.conversationId && !actualConversationId) {
                  newConvId = data.conversationId;
                  setActualConversationId(data.conversationId);
                  setIsNewConversation(false);

                  window.history.replaceState(null, '', `/main/chats/${data.conversationId}`);
                }

                if (data.done) {
                  if (data.creditsUsed) {
                    setCurrentUser(prev => prev ? {
                      ...prev,
                      credits: prev.credits - data.creditsUsed
                    } : null);
                  }

                  // Handle photo URL from AI
                  if (data.photoUrl) {
                    console.log('📸 AI sent a photo:', data.photoUrl);
                    // Photo will be loaded when messages are reloaded
                  }
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e);
              }
            }
          }
        }
      } catch (streamError) {
        console.error('Error reading SSE stream:', streamError);
      }

      // Clear streaming
      setStreamingText('');
      setTypingIndicator(false);

      // Reload messages
      setTimeout(async () => {
        try {
          const finalConvId = newConvId || actualConversationId;
          if (!finalConvId) return;

          const messagesData = await databases.listDocuments(
            DATABASE_ID,
            'messages',
            [
              Query.equal('conversationId', finalConvId),
              Query.orderAsc('timestamp'),
              Query.limit(100)
            ]
          );
          setMessages(messagesData.documents as any);

          if (newConvId) {
            const convData = await databases.getDocument(
              DATABASE_ID,
              'conversations',
              finalConvId
            );
            setConversation(convData as any);
          }

        } catch (err) {
          console.error('❌ Error reloading messages:', err);
        }
      }, 500);

    } catch (err: any) {
      console.error('❌ Send wink error:', err);
      setTypingIndicator(false);

      if (err.message.includes('credits')) {
        setError('Insufficient credits to send wink');
      } else if (err.message.includes('404')) {
        setError('Chat function not found. Please try again later.');
      } else if (err.message.includes('failed to fetch')) {
        setError('Network error. Please check your connection.');
      } else if (err.message.includes('500')) {
        setError('Server error. Please try again.');
      } else {
        setError('Failed to send wink. Please try again.');
      }
    } finally {
      setIsSending(false);
    }
  };

  // Handle sticker click
  const handleStickerClick = (sticker: any) => {
    console.log('Sticker clicked:', sticker);

    // Auto-send sticker as a message
    if (currentUser && botProfile) {
      const stickerMessage = sticker.emoji || sticker.name;

      // Create optimistic sticker message
      const tempMessage: Message = {
        $id: `sticker_${Date.now()}`,
        role: 'user',
        content: stickerMessage,
        timestamp: new Date().toISOString(),
        conversationId: actualConversationId || 'pending'
      };

      setMessages(prev => [...prev, tempMessage]);
      setShowStickerPicker(false);

      // Send sticker as regular message
      sendStickerAsMessage(stickerMessage);
    }
  };

  // Send sticker as regular message
  const sendStickerAsMessage = async (stickerContent: string) => {
    if (!currentUser || !botProfile) return;

    setIsSending(true);
    setError('');
    setStreamingText('');
    setTypingIndicator(true);

    try {
      if (!FUNCTION_URL) {
        throw new Error('Chat function is not configured');
      }

      const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.$id,
          botProfileId: botProfile.$id,
          message: stickerContent,
          conversationId: actualConversationId || undefined,
          isNewConversation: isNewConversation,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status}`);
      }

      // Handle SSE stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullBotResponse = '';
      let newConvId = actualConversationId;
      let buffer = '';

      if (!reader) {
        throw new Error('No response stream');
      }

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim().startsWith('data: ')) {
              try {
                const jsonStr = line.substring(6);
                const data = JSON.parse(jsonStr);

                if (data.chunk) {
                  fullBotResponse += data.chunk;
                  setStreamingText(fullBotResponse);
                }

                if (data.conversationId && !actualConversationId) {
                  newConvId = data.conversationId;
                  setActualConversationId(data.conversationId);
                  setIsNewConversation(false);

                  window.history.replaceState(null, '', `/main/chats/${data.conversationId}`);
                }

                if (data.done && data.creditsUsed) {
                  setCurrentUser(prev => prev ? {
                    ...prev,
                    credits: prev.credits - data.creditsUsed
                  } : null);
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e);
              }
            }
          }
        }
      } catch (streamError) {
        console.error('Error reading SSE stream:', streamError);
      }

      // Clear streaming
      setStreamingText('');
      setTypingIndicator(false);

      // Reload messages
      setTimeout(async () => {
        try {
          const finalConvId = newConvId || actualConversationId;
          if (!finalConvId) return;

          const messagesData = await databases.listDocuments(
            DATABASE_ID,
            'messages',
            [
              Query.equal('conversationId', finalConvId),
              Query.orderAsc('timestamp'),
              Query.limit(100)
            ]
          );
          setMessages(messagesData.documents as any);

          if (newConvId) {
            const convData = await databases.getDocument(
              DATABASE_ID,
              'conversations',
              finalConvId
            );
            setConversation(convData as any);
          }

        } catch (err) {
          console.error('❌ Error reloading messages:', err);
        }
      }, 500);

    } catch (err: any) {
      console.error('❌ Send sticker error:', err);
      setTypingIndicator(false);

      if (err.message.includes('credits')) {
        setError('Insufficient credits to send sticker');
      } else if (err.message.includes('404')) {
        setError('Chat function not found. Please try again later.');
      } else if (err.message.includes('failed to fetch')) {
        setError('Network error. Please check your connection.');
      } else if (err.message.includes('500')) {
        setError('Server error. Please try again.');
      } else {
        setError('Failed to send sticker. Please try again.');
      }
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const handleCreditsUpdated = () => {
      console.log('Chat page: Credits updated event received');
      if (currentUser?.$id) {
        const refreshUser = async () => {
          try {
            const accountData = await account.get();
            const userData = await databases.getDocument(
              DATABASE_ID,
              'users',
              accountData.$id
            );
            setCurrentUser(userData as any);
            console.log('Chat page: Refreshed user credits:', userData.credits);
          } catch (error) {
            console.error('Error refreshing user:', error);
          }
        };
        refreshUser();
      }
    };

    window.addEventListener('credits-updated', handleCreditsUpdated);
    return () => {
      window.removeEventListener('credits-updated', handleCreditsUpdated);
    };
  }, [currentUser?.$id]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, giftsInChat]);

  // Load everything on mount
  useEffect(() => {
    if (conversationId) {
      loadChatData();
      loadConversations();
    } else {
      setIsLoading(false);
      setError('Invalid conversation ID');
    }
  }, [conversationId]);

  const loadChatData = async () => {
    try {
      setIsLoading(true);
      setError('');
      setIsNewConversation(false);

      // 1. Get current user
      const accountData = await account.get();

      const userData = await databases.getDocument(
        DATABASE_ID,
        'users',
        accountData.$id
      );
      setCurrentUser(userData as any);

      // 2. Try to load as a conversation first
      let convExists = false;
      let botId = conversationId;

      try {
        const convData = await databases.getDocument(
          DATABASE_ID,
          'conversations',
          conversationId
        );

        if (convData.userId !== accountData.$id) {
          setError('You do not have permission to access this conversation.');
          return;
        }

        setConversation(convData as any);
        setActualConversationId(convData.$id);
        botId = convData.botProfileId;
        convExists = true;

      } catch (convErr: any) {
        convExists = false;
      }

      // 3. Use personaService to load bot profile
      try {
        const botData = await personaService.getPersonaById(botId);
        setBotProfile(botData);

        if (!convExists) {
          setIsNewConversation(true);
          setActualConversationId('');
        }

      } catch (botErr: any) {
        console.error('❌ Bot profile not found:', botErr);
        setError('This person could not be found.');
        return;
      }

      // 4. If conversation exists, load messages AND gifts
      if (convExists) {
        try {
          // Load messages
          const messagesData = await databases.listDocuments(
            DATABASE_ID,
            'messages',
            [
              Query.equal('conversationId', conversationId),
              Query.orderAsc('timestamp'),
              Query.limit(100)
            ]
          );
          setMessages(messagesData.documents as any);

          // Load gifts from gifts collection (ONLY for display)
          const giftsFromGiftsColl = await loadGiftsFromGiftsCollection(conversationId);

          // Convert gifts from gifts collection to ChatGiftMessage format
          const convertedGifts = giftsFromGiftsColl.map(convertToChatGiftMessage);

          setGiftsInChat(convertedGifts);
          setGiftsFromGiftsCollection(giftsFromGiftsColl);

        } catch (msgErr) {
          console.error('Error loading messages/gifts:', msgErr);
          setMessages([]);
          setGiftsInChat([]);
          setGiftsFromGiftsCollection([]);
        }
      } else {
        setMessages([]);
        setGiftsInChat([]);
        setGiftsFromGiftsCollection([]);
      }

    } catch (err: any) {
      console.error('❌ Error loading chat data:', err);

      if (err.code === 401 || err.message.includes('Unauthorized')) {
        setError('Please log in to view chats.');
        router.push('/login');
      } else {
        setError('Failed to load chat. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversations = async () => {
    try {
      setIsLoadingConversations(true);

      const accountData = await account.get();

      const conversationsData = await databases.listDocuments(
        DATABASE_ID,
        'conversations',
        [
          Query.equal('userId', accountData.$id),
          Query.orderDesc('lastMessageAt'),
          Query.limit(50)
        ]
      );

      const conversationsWithBots = await Promise.all(
        conversationsData.documents.map(async (conv) => {
          try {
            const botData = await personaService.getPersonaById(conv.botProfileId);

            return {
              ...conv,
              bot: {
                ...botData,
                isOnline: Math.random() > 0.3
              }
            };
          } catch (err: any) {
            console.error(`❌ Bot ${conv.botProfileId} not found`);
            return {
              ...conv,
              bot: {
                $id: conv.botProfileId,
                username: 'Unknown User',
                age: 0,
                gender: 'unknown',
                profilePic: '/default-avatar.png',
                bio: 'This user could not be found',
                location: 'Unknown',
                isVerified: false,
                isPremium: false,
                preferences: {},
                goals: {},
                interests: []
              } as any
            };
          }
        })
      );

      setConversations(conversationsWithBots as any);

    } catch (err: any) {
      console.error('❌ Error loading conversations:', err);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  // ============ REMOVED: sendGiftResponseToAI function ============
  // The backend handles gift responses automatically through giftService

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentUser) {
      return;
    }

    if (!botProfile) {
      setError('Cannot send message: Person not found');
      return;
    }

    if (isSending) {
      return;
    }

    const userMessageText = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);
    setError('');
    setStreamingText('');
    setTypingIndicator(true);
    setShowEmojiPicker(false);
    setShowStickerPicker(false);

    // Optimistic update
    const tempUserMessage: Message = {
      $id: `temp_${Date.now()}`,
      role: 'user',
      content: userMessageText,
      timestamp: new Date().toISOString(),
      conversationId: actualConversationId || 'pending'
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      if (!FUNCTION_URL) {
        throw new Error('Chat function is not configured');
      }

      const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.$id,
          botProfileId: botProfile.$id,
          message: userMessageText,
          conversationId: actualConversationId || undefined,
          isNewConversation: isNewConversation,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status}`);
      }

      // Handle SSE stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullBotResponse = '';
      let newConvId = actualConversationId;
      let buffer = ''; // Buffer for incomplete lines

      if (!reader) {
        throw new Error('No response stream');
      }

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Append new chunk to buffer
          buffer += decoder.decode(value, { stream: true });

          // Split by newlines but keep the last incomplete line in buffer
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep the last (possibly incomplete) line

          for (const line of lines) {
            if (line.trim().startsWith('data: ')) {
              try {
                const jsonStr = line.substring(6);
                const data = JSON.parse(jsonStr);

                if (data.chunk) {
                  fullBotResponse += data.chunk;
                  setStreamingText(fullBotResponse);
                }

                if (data.conversationId && !actualConversationId) {
                  newConvId = data.conversationId;
                  setActualConversationId(data.conversationId);
                  setIsNewConversation(false);

                  window.history.replaceState(null, '', `/main/chats/${data.conversationId}`);
                }

                if (data.done && data.creditsUsed) {
                  setCurrentUser(prev => prev ? {
                    ...prev,
                    credits: prev.credits - data.creditsUsed
                  } : null);
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e);
              }
            }
          }
        }
      } catch (streamError) {
        console.error('Error reading SSE stream:', streamError);
      }

      // Clear streaming
      setStreamingText('');
      setTypingIndicator(false);

      // Reload messages
      setTimeout(async () => {
        try {
          const finalConvId = newConvId || actualConversationId;
          if (!finalConvId) return;

          const messagesData = await databases.listDocuments(
            DATABASE_ID,
            'messages',
            [
              Query.equal('conversationId', finalConvId),
              Query.orderAsc('timestamp'),
              Query.limit(100)
            ]
          );
          setMessages(messagesData.documents as any);

          if (newConvId) {
            const convData = await databases.getDocument(
              DATABASE_ID,
              'conversations',
              finalConvId
            );
            setConversation(convData as any);
          }

        } catch (err) {
          console.error('❌ Error reloading messages:', err);
        }
      }, 500);

    } catch (err: any) {
      console.error('❌ Send message error:', err);

      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.$id !== tempUserMessage.$id));
      setTypingIndicator(false);

      if (err.message.includes('credits')) {
        setError('Insufficient credits to send message');
      } else if (err.message.includes('404')) {
        setError('Chat function not found. Please try again later.');
      } else if (err.message.includes('failed to fetch')) {
        setError('Network error. Please check your connection.');
      } else if (err.message.includes('500')) {
        setError('Server error. Please try again.');
      } else {
        setError('Failed to send message. Please try again.');
      }
    } finally {
      setIsSending(false);
    }
  };
  // Request a photo from the AI (costs 10 credits)
  const requestPhoto = async () => {
    if (!currentUser || !botProfile) return;

    // Check credits first
    if (currentUser.credits < 10) {
      setError('You need 10 credits to request a photo');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setIsRequestingPhoto(true);
    setShowPhotoRequestConfirm(false);
    setError('');
    setStreamingText('');
    setTypingIndicator(true);

    // Optimistic update - show user's request
    const tempUserMessage: Message = {
      $id: `photo_req_${Date.now()}`,
      role: 'user',
      content: '📸 Requested a photo',
      timestamp: new Date().toISOString(),
      conversationId: actualConversationId || 'pending'
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      if (!FUNCTION_URL) {
        throw new Error('Chat function is not configured');
      }

      const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.$id,
          botProfileId: botProfile.$id,
          message: 'Can you send me a photo?', // The actual message to AI
          conversationId: actualConversationId || undefined,
          isNewConversation: isNewConversation,
          isPhotoRequest: true,  // THIS TRIGGERS 10 CREDIT COST
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Photo request failed:', errorText);
        throw new Error(`Server error: ${response.status}`);
      }

      // Handle SSE stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullBotResponse = '';
      let newConvId = actualConversationId;
      let buffer = '';

      if (!reader) {
        throw new Error('No response stream');
      }

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim().startsWith('data: ')) {
              try {
                const jsonStr = line.substring(6);
                const data = JSON.parse(jsonStr);

                if (data.chunk) {
                  fullBotResponse += data.chunk;
                  setStreamingText(fullBotResponse);
                }

                if (data.conversationId && !actualConversationId) {
                  newConvId = data.conversationId;
                  setActualConversationId(data.conversationId);
                  setIsNewConversation(false);
                  window.history.replaceState(null, '', `/main/chats/${data.conversationId}`);
                }

                if (data.done && data.creditsUsed) {
                  // Update credits (should be -10)
                  setCurrentUser(prev => prev ? {
                    ...prev,
                    credits: prev.credits - data.creditsUsed
                  } : null);

                  console.log('📸 Photo request cost:', data.creditsUsed, 'credits');
                }

                if (data.photoUrl) {
                  console.log('📸 AI sent photo:', data.photoUrl);
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e);
              }
            }
          }
        }
      } catch (streamError) {
        console.error('Error reading SSE stream:', streamError);
      }

      // Clear streaming
      setStreamingText('');
      setTypingIndicator(false);

      // Reload messages to get the photo
      setTimeout(async () => {
        try {
          const finalConvId = newConvId || actualConversationId;
          if (!finalConvId) return;

          const messagesData = await databases.listDocuments(
            DATABASE_ID,
            'messages',
            [
              Query.equal('conversationId', finalConvId),
              Query.orderAsc('timestamp'),
              Query.limit(100)
            ]
          );
          setMessages(messagesData.documents as any);

          if (newConvId) {
            const convData = await databases.getDocument(
              DATABASE_ID,
              'conversations',
              finalConvId
            );
            setConversation(convData as any);
          }

        } catch (err) {
          console.error('❌ Error reloading messages:', err);
        }
      }, 500);

    } catch (err: any) {
      console.error('❌ Photo request error:', err);

      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.$id !== tempUserMessage.$id));
      setTypingIndicator(false);

      if (err.message.includes('credits')) {
        setError('Insufficient credits to request photo');
      } else if (err.message.includes('404')) {
        setError('Chat function not found. Please try again later.');
      } else if (err.message.includes('failed to fetch')) {
        setError('Network error. Please check your connection.');
      } else if (err.message.includes('500')) {
        setError('Server error. Please try again.');
      } else {
        setError('Failed to request photo. Please try again.');
      }
    } finally {
      setIsRequestingPhoto(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatConversationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleBuyCredits = () => {
    router.push('/main/credits');
  };

  const goToDiscoverPage = () => {
    router.push('/main/people');
  };

  const handleEmojiSelect = useCallback((emojiObject: any) => {
    setInputMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const startNewChat = async (botId: string) => {
    try {
      router.push(`/main/chats/${botId}`);
    } catch (err: any) {
      console.error('❌ Error starting chat:', err);
      setError(err.message || 'Failed to start chat');
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.bot?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === 'active') {
      return matchesSearch && conv.isActive;
    }

    return matchesSearch;
  });

  // Function to render gift messages
  const renderGiftMessage = (giftData: ChatGiftMessage, index: number, isMobile = false) => {
    return (
      <div key={`gift-${index}`} className="flex justify-end">
        <div className={`${isMobile ? 'max-w-[85%] p-3' : 'max-w-[75%] p-4'} rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200`}>
          <div className={`flex items-start gap-${isMobile ? '2' : '3'}`}>
            {/* Gift Preview */}
            <div
              onClick={() => giftData.isAnimated && setShowGiftAnimationOverlay(giftData)}
              className={`${isMobile ? 'w-10 h-10 p-1' : 'w-12 h-12 p-2'} rounded-lg overflow-hidden bg-white flex-shrink-0 cursor-pointer hover:scale-105 transition-transform`}
            >
              {giftData.giftImage ? (
                <Image
                  src={giftData.giftImage}
                  alt={giftData.giftName}
                  width={isMobile ? 40 : 48}
                  height={isMobile ? 40 : 48}
                  className="object-contain w-full h-full"
                />
              ) : (
                <Gift className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-amber-500 mx-auto`} />
              )}
            </div>

            <div className="flex-1">
              <div className={`flex items-center gap-${isMobile ? '1' : '2'} mb-1`}>
                <span className={`font-bold text-gray-900 ${isMobile ? 'text-sm' : ''}`}>🎁 Gift Sent!</span>
                <span className={`${isMobile ? 'text-xs px-1 py-0.5' : 'text-xs px-2 py-0.5'} bg-amber-100 text-amber-800 rounded-full`}>
                  {giftData.price} credits
                </span>
              </div>
              <p className={`font-semibold text-gray-800 mb-1 ${isMobile ? 'text-sm' : ''}`}>{giftData.giftName}</p>
              {giftData.message && (
                <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'} italic mb-${isMobile ? '1' : '2'}`}>&ldquo;{giftData.message}&rdquo;</p>
              )}
              <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-500`}>
                {formatTime(giftData.timestamp)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Function to render photo messages sent by AI
  const renderPhotoMessage = (msg: Message, index: number, isMobile = false) => {
    if (!msg.photoUrl) return null;

    return (
      <div key={`photo-${index}`} className="flex justify-start">
        <div className={`${isMobile ? 'max-w-[85%]' : 'max-w-[75%]'} rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm`}>
          {/* Message text (if any) */}
          {msg.content && (
            <div className="p-3">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{msg.content}</p>
            </div>
          )}

          {/* Photo */}
          <div
            onClick={() => setShowPhotoViewer({ url: msg.photoUrl!, message: msg })}
            className="relative cursor-pointer hover:opacity-95 transition-opacity"
          >
            <Image
              src={msg.photoUrl}
              alt={`Photo from ${botProfile?.username}`}
              width={isMobile ? 300 : 400}
              height={isMobile ? 300 : 400}
              className="w-full h-auto object-cover"
              unoptimized={msg.photoUrl?.startsWith('http')}
            />
            {/* Overlay hint */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors flex items-center justify-center">
              <div className="opacity-0 hover:opacity-100 transition-opacity bg-white/90 px-3 py-2 rounded-full">
                <span className="text-xs font-medium text-gray-700">Click to view</span>
              </div>
            </div>
          </div>

          {/* Timestamp */}
          <div className="px-3 pb-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{formatTime(msg.timestamp)}</span>
              <span className="flex items-center gap-1">
                <Camera className="w-3 h-3" />
                Photo
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Function to handle gift animation close
  const handleGiftAnimationClose = () => {
    setShowGiftAnimation(null);
    setShowGiftAnimationOverlay(null);
  };

  // Combine and sort all messages and gifts chronologically
  const getAllChatItems = () => {
    const allItems: Array<{
      type: 'message' | 'gift';
      data: Message | ChatGiftMessage;
      timestamp: string;
      index: number;
    }> = [];

    // Add messages
    messages.forEach((msg, index) => {
      if (!msg.isGift && !giftHandlerService.parseGiftMessage(msg)) {
        allItems.push({
          type: 'message',
          data: msg,
          timestamp: msg.timestamp,
          index
        });
      }
    });

    // Add gifts
    giftsInChat.forEach((gift, index) => {
      allItems.push({
        type: 'gift',
        data: gift,
        timestamp: gift.timestamp,
        index
      });
    });

    // Sort chronologically
    allItems.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return allItems;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <LayoutController />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#5e17eb] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-gray-600 font-medium">Loading conversation...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state - bot not found or access denied
  if (error && !botProfile) {
    return (
      <div className="min-h-screen bg-white">
        <LayoutController />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white p-4">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center mx-auto mb-6">
              <div className="text-4xl">💬</div>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Chat Not Found</h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/main/chats')}
                className="w-full px-6 py-3.5 bg-[#5e17eb] text-white font-medium rounded-xl hover:bg-[#4a13c4] transition-colors"
              >
                ← Back to Chats
              </button>
              <button
                onClick={() => router.push('/main/people')}
                className="w-full px-6 py-3.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Discover People
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <LayoutController />

      <div className="flex h-screen bg-white">
        {/* Desktop: 3-Column Layout */}
        <div className="hidden lg:flex w-full max-w-[1400px] mx-auto">

          {/* Left Sidebar - Chat List */}
          <div className="w-[400px] flex-shrink-0 border border-gray-200 h-full overflow-hidden flex flex-col bg-white scrollbar-thin">
            {/* Fixed Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#5e17eb]">{currentUser?.credits || 0}</span>
                  <button
                    onClick={handleBuyCredits}
                    className="px-3 py-1 bg-gradient-to-r from-[#5e17eb] to-[#8a4bff] text-white text-sm rounded-lg hover:from-[#4a13c4] hover:to-[#7238ff] transition-all shadow-sm"
                  >
                    Add Credits
                  </button>
                </div>
                <button
                  onClick={() => router.push('/main')}
                  className="text-gray-600 hover:text-[#5e17eb] transition-colors"
                >
                  <Home className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e17eb]/20 focus:border-[#5e17eb] transition-all text-gray-900"
                />
              </div>

              {/* Tabs */}
              <div className="flex space-x-2 mb-2">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${activeFilter === 'all'
                      ? 'bg-gradient-to-r from-[#5e17eb] to-[#8a4bff] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  All Chats
                </button>
                <button
                  onClick={() => setActiveFilter('active')}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all relative ${activeFilter === 'active'
                      ? 'bg-gradient-to-r from-[#5e17eb] to-[#8a4bff] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  Active Now
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {conversations.filter(c => c.isActive).length}
                  </span>
                </button>
              </div>
            </div>

            {/* Chat List - Scrollable */}
            <div className="flex-1 overflow-y-auto bg-white scrollbar-thin">
              {isLoadingConversations ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-2 border-[#5e17eb] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading conversations...</p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
                  <p className="text-gray-600 mb-4">Start chatting with someone!</p>
                  <button
                    onClick={goToDiscoverPage}
                    className="px-4 py-2 bg-gradient-to-r from-[#5e17eb] to-[#8a4bff] text-white rounded-lg hover:from-[#4a13c4] hover:to-[#7238ff] shadow-sm"
                  >
                    Discover People
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredConversations.map(conv => {
                    const botProfile = conv.bot;

                    return (
                      <div
                        key={conv.$id}
                        onClick={() => router.push(`/main/chats/${conv.$id}`)}
                        className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-all border-b border-gray-100 ${conversationId === conv.$id ? 'bg-purple-50 hover:bg-purple-50' : ''
                          }`}
                      >
                        {/* Profile Image */}
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                            {botProfile?.profilePic ? (
                              <Image
                                src={botProfile.profilePic}
                                alt={botProfile.username || 'Bot'}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                                unoptimized={botProfile.profilePic?.startsWith('http')}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                                <UserPlus className="w-6 h-6 text-gray-500" />
                              </div>
                            )}
                          </div>
                          {/* Online Status */}
                          {conv.isActive && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500"></div>
                          )}
                        </div>

                        {/* Chat Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          {/* Top row: Username + age + verified + time */}
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2 min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {botProfile?.username || 'Unknown'}
                              </h4>
                              {botProfile?.isVerified && (
                                <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-100 flex-shrink-0" />
                              )}
                              {botProfile?.age && (
                                <span className="text-xs text-gray-500 flex-shrink-0">
                                  , {botProfile.age}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0 ml-2">
                              {formatTime(conv.lastMessageAt)}
                            </span>
                          </div>
                        
                          {/* Middle row: Last message + message count badge */}
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm text-gray-600 truncate flex-1 min-w-0">
                              {conv.lastMessage || 'Start a conversation...'}
                            </p>
                            {conv.messageCount > 0 && (
                              <span className="flex-shrink-0 px-3 py-1 text-xs font-medium text-[#5e17eb] bg-[#5e17eb]/10 rounded-full min-w-[52px] text-center">
                                {conv.messageCount} {conv.messageCount === 1 ? 'msg' : 'msgs'}
                              </span>
                            )}
                          </div>
                        
                          {/* Bottom row: Location */}
                          {botProfile?.location && (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              <span className="text-xs text-gray-500 truncate">
                                {botProfile.location}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar Footer */}
            <div className="border-t border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-500">
                    {currentUser?.profilePic ? (
                      <Image
                        src={currentUser.profilePic}
                        alt={currentUser.username}
                        width={40}
                        height={40}
                        className="object-cover"
                        unoptimized={currentUser.profilePic?.startsWith('http')}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                        {currentUser?.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{currentUser?.username}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span className="font-semibold text-[#5e17eb]">{currentUser?.credits || 0}</span> credits
                    </p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Center - Messages Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/main/chats')}
                  className="flex items-center gap-2 text-gray-600 hover:text-[#5e17eb] transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">All Chats</span>
                </button>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                      <Image
                        src={botProfile?.profilePic || '/default-avatar.png'}
                        alt={botProfile?.username || 'User'}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                        unoptimized={botProfile?.profilePic?.startsWith('http')}
                      />
                    </div>
                    {botProfile?.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-gray-900">
                        {botProfile?.username}
                      </h2>
                      {botProfile?.isVerified && (
                        <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-100" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {botProfile?.isOnline ? 'Online now' : 'Last active recently'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-gradient-to-r from-[#5e17eb]/10 to-purple-500/10 px-3 py-2 rounded-lg">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-bold text-gray-900">{currentUser?.credits || 0}</span>
                </div>
              </div>
            </div>

            {/* Credit Warning */}
            {currentUser && currentUser.credits < 10 && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-y border-amber-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        ⚡ Low credits! Only {currentUser.credits} left
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleBuyCredits}
                    className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    Get Credits
                  </button>
                </div>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white to-gray-50 scrollbar-thin">
              {isNewConversation && (
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#5e17eb]/10 to-purple-500/10 px-6 py-4 rounded-2xl border border-[#5e17eb]/20">
                    <MessageCircleHeart className="w-6 h-6 text-amber-500" />
                    <div className="text-left">
                      <h3 className="font-bold text-gray-900">Start a new conversation</h3>
                      <p className="text-sm text-gray-600">Send your first message to {botProfile?.username}!</p>
                    </div>
                  </div>
                </div>
              )}

              {error && botProfile && (
                <div className="mb-6">
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between">
                    <span className="text-sm">{error}</span>
                    <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">×</button>
                  </div>
                </div>
              )}

              <div className="space-y-4 max-w-3xl mx-auto">
                {messages.length === 0 && giftsInChat.length === 0 && !streamingText && botProfile && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-xl">
                      <Image
                        src={botProfile.profilePic || '/default-avatar.png'}
                        alt={botProfile.username}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                        unoptimized={botProfile.profilePic?.startsWith('http')}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Chat with {botProfile.username}
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      {botProfile.bio}
                    </p>
                  </div>
                )}

                {/* Render all items chronologically */}
                {getAllChatItems().map((item, index) => {
                  if (item.type === 'message') {
                    const msg = item.data as Message;

                    // Check if this is a photo message
                    if (msg.photoUrl && msg.role === 'bot') {
                      return renderPhotoMessage(msg, index, false); // or true for mobile
                    }

                    return (
                      <div
                        key={`msg-${index}-${msg.$id}`}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl p-4 ${msg.role === 'user'
                              ? 'bg-gradient-to-r from-[#5e17eb] to-purple-600 text-white rounded-br-none'
                              : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none shadow-sm'
                            }`}
                        >
                          <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                          <div className={`flex items-center justify-end mt-2 text-xs ${msg.role === 'user' ? 'text-white/80' : 'text-gray-500'
                            }`}>
                            {formatTime(msg.timestamp)}
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}

                {(typingIndicator || isSending) && !streamingText && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none p-4 shadow-sm">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                {streamingText && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none p-4 shadow-sm max-w-[75%]">
                      <p className="whitespace-pre-wrap text-sm">{streamingText}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        typing...
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div ref={messagesEndRef} />
            </div>

            {/* Sticker Picker */}
            {/* Sticker Picker */}
            {showStickerPicker && (
              <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-50 shadow-xl rounded-lg bg-white border border-gray-200"
                ref={stickerPickerRef}
                style={{ width: '400px', maxHeight: '400px', overflowY: 'auto' }}>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Stickers</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {stickers.map((sticker) => (
                      <button
                        key={sticker.id}
                        onClick={() => handleStickerClick(sticker)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-2xl flex items-center justify-center"
                        title={sticker.name}
                      >
                        {sticker.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Emoji Picker */}
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-50 shadow-xl rounded-lg" ref={emojiPickerRef}>
                <EmojiPicker
                  onEmojiClick={handleEmojiSelect}
                  theme={undefined}
                  height={350}
                  width={350}
                  searchDisabled={false}
                  skinTonesDisabled={true}
                  previewConfig={{
                    showPreview: false
                  }}
                />
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-gray-200 bg-white p-4 relative" style={{ zIndex: 10 }}>
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors text-sm relative"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowStickerPicker(!showStickerPicker)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors text-sm"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => router.push(`/main/virtual-gifts/${botProfile?.$id}`)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors text-sm"
                  >
                    <Gift className="w-4 h-4" />
                  </button>

                  {/* NEW: Request Photo Button */}
                  <button
                    onClick={() => setShowPhotoRequestConfirm(true)}
                    disabled={isRequestingPhoto || (currentUser ? currentUser.credits < 10 : false)}
                    className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-purple-700 rounded-xl transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Request a photo (10 credits)"
                  >
                    <Camera className="w-4 h-4" />
                    <span className="text-xs font-medium">Photo (10)</span>
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors text-sm"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex gap-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message ${botProfile?.username}...`}
                    className="flex-1 px-5 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5e17eb]/20 focus:border-[#5e17eb] text-sm transition-all"
                    disabled={isSending}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isSending || !inputMessage.trim()}
                    className="px-5 py-3 bg-gradient-to-r from-[#5e17eb] to-purple-600 text-white font-medium rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    {isSending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span className="font-medium text-gray-700">{currentUser?.credits || 0}</span>
                    <span>credits • 1 msg = 1 • photo = 10</span>
                  </div>
                  <button
                    onClick={handleBuyCredits}
                    className="text-[#5e17eb] hover:text-[#4a13c4] font-medium flex items-center gap-1"
                  >
                    Get more
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Profile Info */}
          <div className="w-[320px] flex-shrink-0 border-l border-gray-200 bg-white overflow-y-auto scrollbar-thin">
            <div className="p-6">
              <div className="mb-6">
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <Image
                    src={botProfile?.profilePic || '/default-avatar.png'}
                    alt={botProfile?.username || 'User'}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                    unoptimized={botProfile?.profilePic?.startsWith('http')}
                  />
                </div>
                <div className="text-center mt-4">
                  <h3 className="text-xl font-bold text-gray-900">{botProfile?.username}</h3>
                  <div className="flex items-center justify-center gap-2 mt-2 text-sm">
                    <span className="text-gray-600">{botProfile?.age} years</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-600">{botProfile?.gender}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full ${botProfile?.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  <div className={`w-2 h-2 rounded-full ${botProfile?.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="font-medium text-sm">{botProfile?.isOnline ? 'Online Now' : 'Online'}</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-2 text-sm">About</h4>
                <p className="text-gray-600 text-sm">{botProfile?.bio}</p>
              </div>

              {botProfile?.location && (
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    Location
                  </h4>
                  <p className="text-gray-600 text-sm">{botProfile.location}</p>
                </div>
              )}

              {botProfile?.interests && botProfile.interests.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-3 text-sm">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {botProfile.interests.map((interest, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {botProfile?.personalityTraits && botProfile.personalityTraits.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-3 text-sm">Personality</h4>
                  <div className="flex flex-wrap gap-2">
                    {botProfile.personalityTraits.map((trait, idx) => (
                      <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-gray-50 p-3 rounded-xl text-center">
                  <div className="text-lg font-bold text-[#5e17eb]">
                    {botProfile?.totalChats || 0}
                  </div>
                  <div className="text-xs text-gray-600">Chats</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl text-center">
                  <div className="text-lg font-bold text-green-500">
                    {botProfile?.totalMatches || 0}
                  </div>
                  <div className="text-xs text-gray-600">Matches</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl text-center">
                  <div className="text-lg font-bold text-amber-500">
                    {botProfile?.followingCount || 0}
                  </div>
                  <div className="text-xs text-gray-600">Followers</div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/main/virtual-gifts/${botProfile?.$id}`)}
                  className="w-full py-3 bg-gradient-to-r from-[#5e17eb] to-purple-600 text-white font-medium rounded-xl hover:shadow-md transition-all text-sm"
                >
                  <Gift className="w-4 h-4 inline mr-2" />
                  Send Virtual Gift
                </button>
                <button className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm">
                  Report User
                </button>
                <button className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm">
                  Block User
                </button>
              </div>

              {botProfile?.isVerified && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-blue-500" />
                    <div>
                      <h4 className="font-bold text-blue-800 text-sm">Verified Profile</h4>
                      <p className="text-xs text-blue-700 mt-1">
                        This user has been verified by our team
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col h-screen w-full">
          {/* Mobile Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/main/chats')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <Image
                      src={botProfile?.profilePic || '/default-avatar.png'}
                      alt={botProfile?.username || 'User'}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                      unoptimized={botProfile?.profilePic?.startsWith('http')}
                    />
                  </div>
                  {botProfile?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1">
                    <h2 className="font-bold text-gray-900 text-sm">
                      {botProfile?.username}
                    </h2>
                    {botProfile?.isVerified && (
                      <CheckCircle className="w-3 h-3 text-blue-500 fill-blue-100" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {botProfile?.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gradient-to-r from-[#5e17eb]/10 to-purple-500/10 px-2 py-1 rounded-lg">
                <Crown className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-bold text-gray-900">{currentUser?.credits || 0}</span>
              </div>
            </div>
          </div>

          {currentUser && currentUser.credits < 10 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <p className="text-xs font-medium text-amber-800">
                    Low credits: {currentUser.credits}
                  </p>
                </div>
                <button
                  onClick={handleBuyCredits}
                  className="px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-lg"
                >
                  Get More
                </button>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 pb-24 bg-gradient-to-b from-white to-gray-50">
            {isNewConversation && (
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#5e17eb]/10 to-purple-500/10 px-4 py-3 rounded-xl border border-[#5e17eb]/20">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 text-sm">New conversation</h3>
                    <p className="text-xs text-gray-600">Say hi to {botProfile?.username}!</p>
                  </div>
                </div>
              </div>
            )}

            {error && botProfile && (
              <div className="mb-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg flex items-center justify-between text-sm">
                  <span>{error}</span>
                  <button onClick={() => setError('')}>×</button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {messages.length === 0 && giftsInChat.length === 0 && !streamingText && botProfile && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-xl">
                    <Image
                      src={botProfile.profilePic || '/default-avatar.png'}
                      alt={botProfile.username}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                      unoptimized={botProfile.profilePic?.startsWith('http')}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {botProfile.username}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {botProfile.bio}
                  </p>
                </div>
              )}

              {/* Render all items chronologically for mobile */}
              {getAllChatItems().map((item, index) => {
                if (item.type === 'message') {
                  const msg = item.data as Message;

                  // Check if this is a photo message
                  if (msg.photoUrl && msg.role === 'bot') {
                    return renderPhotoMessage(msg, index, false); // or true for mobile
                  }

                  return (
                    <div
                      key={`msg-${index}-${msg.$id}`}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl p-4 ${msg.role === 'user'
                            ? 'bg-gradient-to-r from-[#5e17eb] to-purple-600 text-white rounded-br-none'
                            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none shadow-sm'
                          }`}
                      >
                        <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                        <div className={`flex items-center justify-end mt-2 text-xs ${msg.role === 'user' ? 'text-white/80' : 'text-gray-500'
                          }`}>
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                }
              })}

              {(typingIndicator || isSending) && !streamingText && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none p-3 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {streamingText && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none p-3 shadow-sm max-w-[85%]">
                    <p className="whitespace-pre-wrap text-sm">{streamingText}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      typing...
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Fixed at bottom */}
          <div className="border-t border-gray-200 bg-white pb-20" ref={mobileInputContainerRef}>
            {/* Sticker Picker - Fixed overlay */}
            {showStickerPicker && (
              <div className="fixed inset-x-0 bottom-0 z-50 bg-white shadow-2xl border-t border-gray-300"
                style={{ height: '50vh' }}
                ref={stickerPickerRef}>
                <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-medium text-gray-700">Select Sticker</h3>
                  <button
                    onClick={() => setShowStickerPicker(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="h-full overflow-y-auto p-4">
                  <div className="grid grid-cols-4 gap-3">
                    {stickers.map((sticker) => (
                      <button
                        key={sticker.id}
                        onClick={() => handleStickerClick(sticker)}
                        className="p-3 hover:bg-gray-100 rounded-lg transition-colors text-3xl flex items-center justify-center"
                        title={sticker.name}
                      >
                        {sticker.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Emoji Picker - Fixed overlay */}
            {showEmojiPicker && (
              <div className="fixed inset-x-0 bottom-0 z-50 bg-white shadow-2xl border-t border-gray-300"
                style={{ height: '50vh' }}
                ref={emojiPickerRef}>
                <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-medium text-gray-700">Select Emoji</h3>
                  <button
                    onClick={() => setShowEmojiPicker(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="h-full overflow-hidden">
                  <EmojiPicker
                    onEmojiClick={handleEmojiSelect}
                    theme={undefined}
                    height="100%"
                    width="100%"
                    searchDisabled={false}
                    skinTonesDisabled={true}
                    previewConfig={{
                      showPreview: false
                    }}
                  />
                </div>
              </div>
            )}

            {/* Input Container */}
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg active:bg-gray-300 touch-manipulation"
                >
                  <Smile className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowStickerPicker(!showStickerPicker)}
                  className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg active:bg-gray-300 touch-manipulation"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => router.push(`/main/virtual-gifts/${botProfile?.$id}`)}
                  className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg active:bg-gray-300 touch-manipulation"
                >
                  <Gift className="w-5 h-5" />
                </button>

                {/* NEW: Request Photo Button - Mobile */}
                <button
                  onClick={() => setShowPhotoRequestConfirm(true)}
                  disabled={isRequestingPhoto || (currentUser ? currentUser.credits < 10 : false)}
                  className="flex items-center gap-1 px-2.5 py-2.5 bg-gradient-to-r from-purple-100 to-pink-100 active:from-purple-200 active:to-pink-200 text-purple-700 rounded-lg touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Request photo (10 credits)"
                >
                  <Camera className="w-5 h-5" />
                  <span className="text-xs font-bold">10</span>
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${botProfile?.username}...`}
                  className="flex-1 px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5e17eb]/20 text-base touch-manipulation"
                  disabled={isSending}
                  style={{ fontSize: '16px' }}
                />
                <button
                  onClick={sendMessage}
                  disabled={isSending || !inputMessage.trim()}
                  className="px-5 py-3 bg-gradient-to-r from-[#5e17eb] to-purple-600 text-white font-medium rounded-xl disabled:opacity-50 active:opacity-90 touch-manipulation min-w-[60px] flex items-center justify-center"
                >
                  {isSending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-500" />
                  {currentUser?.credits || 0} credits
                </span>
                <button onClick={handleBuyCredits} className="text-[#5e17eb] font-medium">
                  Get more
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gift Animation Modal */}
      {showGiftAnimation && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-lg">🎁 Gift Animation</h3>
              <button
                onClick={handleGiftAnimationClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mb-6">
              <div className="w-48 h-48 mx-auto mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                {showGiftAnimation.giftImage ? (
                  <Image
                    src={showGiftAnimation.giftImage}
                    alt={showGiftAnimation.giftName}
                    width={192}
                    height={192}
                    className="object-contain w-full h-full p-4"
                  />
                ) : (
                  <Gift className="w-24 h-24 text-purple-400" />
                )}
              </div>
              <h4 className="font-bold text-xl text-gray-900 mb-2">{showGiftAnimation.giftName}</h4>
              <p className="text-gray-600">
                An animated gift has been delivered to {botProfile?.username}!
              </p>
              {showGiftAnimation.message && (
                <p className="text-gray-700 mt-2 italic">&ldquo;{showGiftAnimation.message}&rdquo;</p>
              )}
            </div>
            <div className="text-center">
              <button
                onClick={handleGiftAnimationClose}
                className="px-6 py-3 bg-gradient-to-r from-[#5e17eb] to-purple-600 text-white font-medium rounded-xl hover:shadow-md transition-all"
              >
                Continue Chatting
              </button>
            </div>
          </div>
        </div>
      )}
      {showGiftAnimationOverlay && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 text-2xl">🎁 Animated Gift</h3>
                <button
                  onClick={() => setShowGiftAnimationOverlay(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 mb-6">
                <div className="w-64 h-64 mx-auto">
                  {showGiftAnimationOverlay.giftImage ? (
                    <Image
                      src={showGiftAnimationOverlay.giftImage}
                      alt={showGiftAnimationOverlay.giftName}
                      width={256}
                      height={256}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <Gift className="w-32 h-32 text-purple-400 mx-auto" />
                  )}
                </div>
              </div>

              <div className="text-center">
                <h4 className="font-bold text-xl text-gray-900 mb-2">{showGiftAnimationOverlay.giftName}</h4>
                <p className="text-gray-600 mb-4">
                  You sent this animated gift to {botProfile?.username}
                </p>
                {showGiftAnimationOverlay.message && (
                  <p className="text-gray-700 text-lg italic mb-6">&ldquo;{showGiftAnimationOverlay.message}&rdquo;</p>
                )}
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-3 rounded-xl border border-amber-200">
                    <Crown className="w-5 h-5 text-amber-500" />
                    <span className="text-xl font-bold text-gray-900">{showGiftAnimationOverlay.price}</span>
                    <span className="text-gray-600">credits</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowGiftAnimationOverlay(null)}
                  className="px-8 py-3 bg-gradient-to-r from-[#5e17eb] to-purple-600 text-white font-medium rounded-xl hover:shadow-md transition-all"
                >
                  Continue Chatting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Photo Request Confirmation Modal */}
      {showPhotoRequestConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 animate-in slide-in-from-bottom">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                <Camera className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">Request a Photo?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Ask {botProfile?.username} to send you a photo
              </p>

              {/* Cost Display */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  <span className="text-2xl font-bold text-gray-900">10</span>
                  <span className="text-gray-600">credits</span>
                </div>
                <p className="text-xs text-gray-500">
                  Your balance: <span className="font-bold text-purple-600">{currentUser?.credits || 0}</span> credits
                </p>
              </div>

              {/* Warning if low credits */}
              {currentUser && currentUser.credits < 10 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-red-700 font-medium">
                    ⚠️ Insufficient credits! You need 10 credits.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <button
                onClick={requestPhoto}
                disabled={!currentUser || currentUser.credits < 10}
                className="w-full py-3 bg-gradient-to-r from-[#5e17eb] to-purple-600 text-white font-medium rounded-xl hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRequestingPhoto ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Requesting...
                  </span>
                ) : (
                  'Yes, Request Photo'
                )}
              </button>
              <button
                onClick={() => setShowPhotoRequestConfirm(false)}
                className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>

            {currentUser && currentUser.credits < 10 && (
              <button
                onClick={() => {
                  setShowPhotoRequestConfirm(false);
                  router.push('/main/credits');
                }}
                className="w-full mt-3 py-2 text-sm text-[#5e17eb] hover:text-[#4a13c4] font-medium"
              >
                Get More Credits →
              </button>
            )}
          </div>
        </div>
      )}
      {/* Photo Viewer Modal - Improved */}
{showPhotoViewer && (
  <div 
    className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
    onClick={() => setShowPhotoViewer(null)} // Click outside to close
  >
    <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
      {/* Close X Button - Top Right */}
      <button 
        onClick={() => setShowPhotoViewer(null)}
        className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 backdrop-blur-sm"
        aria-label="Close photo viewer"
      >
        <X className="w-6 h-6" />
      </button>
      
      {/* Photo Container */}
      <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
        {/* Photo */}
        <div className="relative bg-black">
          <Image
            src={showPhotoViewer.url}
            alt={`Photo from ${botProfile?.username}`}
            width={1200}
            height={1200}
            className="w-full h-auto object-contain max-h-[85vh]"
            unoptimized={showPhotoViewer.url?.startsWith('http')}
          />
        </div>
        
        {/* Photo Info Footer */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                <Image
                  src={botProfile?.profilePic || '/default-avatar.png'}
                  alt={botProfile?.username || 'User'}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                  unoptimized={botProfile?.profilePic?.startsWith('http')}
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{botProfile?.username}</p>
                <p className="text-xs text-gray-500">{formatTime(showPhotoViewer.message.timestamp)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.open(showPhotoViewer.url, '_blank')}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open
              </button>
              <button
                onClick={() => setShowPhotoViewer(null)}
                className="px-4 py-2 bg-[#5e17eb] hover:bg-[#4a13c4] text-white rounded-lg transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
          
          {showPhotoViewer.message.content && (
            <p className="mt-3 text-gray-700 text-sm">{showPhotoViewer.message.content}</p>
          )}
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}