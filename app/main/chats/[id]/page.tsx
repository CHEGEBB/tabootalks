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
  Target, BarChart3, CreditCard, Phone, Video, Star, Camera, X
} from 'lucide-react';
import personaService, { ParsedPersonaProfile } from '@/lib/services/personaService';
import LayoutController from '@/components/layout/LayoutController';
import dynamic from 'next/dynamic';

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
  const [streamingText, setStreamingText] = useState('');
  const [error, setError] = useState('');
  const [isNewConversation, setIsNewConversation] = useState(false);
  const [actualConversationId, setActualConversationId] = useState<string>('');
  const [isMuted, setIsMuted] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);
  
  // Chat list sidebar states
  const [conversations, setConversations] = useState<ConversationWithBot[]>([]);
  const [suggestedBots, setSuggestedBots] = useState<ParsedPersonaProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active'>('all');
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const mobileInputContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize Appwrite
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
  
  const databases = new Databases(client);
  const storage = new Storage(client);
  const account = new Account(client);
  
  const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const FUNCTION_URL = process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_AI_CHATBOT!;

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

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

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
        
        // Verify this conversation belongs to current user
        if (convData.userId !== accountData.$id) {
          setError('You do not have permission to access this conversation.');
          return;
        }
        
        setConversation(convData as any);
        setActualConversationId(convData.$id);
        botId = convData.botProfileId;
        convExists = true;

      } catch (convErr: any) {
        // Conversation doesn't exist - this might be a botProfileId
        convExists = false;
      }

      // 3. Use personaService to load bot profile
      try {
        const botData = await personaService.getPersonaById(botId);
        
        setBotProfile(botData);

        // If conversation doesn't exist, this is a new conversation
        if (!convExists) {
          setIsNewConversation(true);
          setActualConversationId('');
        }

      } catch (botErr: any) {
        console.error('❌ Bot profile not found:', botErr);
        setError('This person could not be found.');
        return;
      }

      // 4. If conversation exists, load messages
      if (convExists) {
        try {
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
        } catch (msgErr) {
          setMessages([]);
        }
      } else {
        setMessages([]);
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
      
      // Get current user
      const accountData = await account.get();
      
      // Get user's conversations
      const conversationsData = await databases.listDocuments(
        DATABASE_ID,
        'conversations',
        [
          Query.equal('userId', accountData.$id),
          Query.orderDesc('lastMessageAt'),
          Query.limit(50)
        ]
      );

      // Load bot profiles for existing conversations using personaService
      const conversationsWithBots = await Promise.all(
        conversationsData.documents.map(async (conv) => {
          try {
            const botData = await personaService.getPersonaById(conv.botProfileId);
            
            return {
              ...conv,
              bot: {
                ...botData,
                isOnline: Math.random() > 0.3 // Simulate online status for now
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
    setShowEmojiPicker(false); // Close emoji picker when sending

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

      if (!reader) {
        throw new Error('No response stream');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
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
              // Silently handle parse errors
            }
          }
        }
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
      
      // Show user-friendly error
      if (err.message.includes('credits')) {
        setError('Insufficient credits to send message');
      } else if (err.message.includes('404')) {
        setError('Chat function not found. Please try again later.');
      } else if (err.message.includes('failed to fetch')) {
        setError('Network error. Please check your connection.');
      } else {
        setError('Failed to send message. Please try again.');
      }
    } finally {
      setIsSending(false);
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
    // Focus input after a small delay to ensure it works
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const startNewChat = async (botId: string) => {
    try {
      // Navigate directly to the bot for new chat
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
          
          {/* Left Sidebar - Chat List (copied from chats page) */}
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
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === 'all'
                      ? 'bg-gradient-to-r from-[#5e17eb] to-[#8a4bff] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Chats
                </button>
                <button
                  onClick={() => setActiveFilter('active')}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all relative ${
                    activeFilter === 'active'
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
                        className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-all border-b border-gray-100 ${
                          conversationId === conv.$id ? 'bg-purple-50 hover:bg-purple-50' : ''
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
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {botProfile?.username || 'Unknown'}
                              </h4>
                              {botProfile?.isVerified && (
                                <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-100 flex-shrink-0" />
                              )}
                              <span className="text-xs text-gray-500">
                                {botProfile?.age ? `, ${botProfile.age}` : ''}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {formatConversationTime(conv.lastMessageAt)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">
                              {conv.lastMessage || 'Start a conversation...'}
                            </p>
                            {conv.messageCount > 0 && (
                              <span className="w-full h-6 flex justify-center text-xs font-medium text-[#5e17eb] bg-purple-100 px-2 py-0.5 rounded-full">
                                {conv.messageCount} msgs
                              </span>
                            )}
                          </div>
                          
                          {/* Location */}
                          {botProfile?.location && (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{botProfile.location}</span>
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
                    <Sparkles className="w-6 h-6 text-amber-500" />
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
                {messages.length === 0 && !streamingText && botProfile && (
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

                {messages.map((msg) => (
                  <div
                    key={msg.$id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl p-4 ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-[#5e17eb] to-purple-600 text-white rounded-br-none'
                          : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                      <div className={`flex items-center justify-end mt-2 text-xs ${
                        msg.role === 'user' ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}

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
            <div className="border-t border-gray-200 bg-white p-4">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-2 mb-3">
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors text-sm relative"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors text-sm">
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors text-sm">
                    <Gift className="w-4 h-4" />
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
                    <span>credits • 1 message = 1 credit</span>
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

          {/* Right Sidebar - Profile Info (Always Visible) */}
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
                <button className="w-full py-3 bg-gradient-to-r from-[#5e17eb] to-purple-600 text-white font-medium rounded-xl hover:shadow-md transition-all text-sm">
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

        {/* Mobile Layout - Optimized for Touch */}
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

          {/* Messages Area - Takes remaining space */}
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
              {messages.length === 0 && !streamingText && botProfile && (
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

              {messages.map((msg) => (
                <div
                  key={msg.$id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-[#5e17eb] to-purple-600 text-white rounded-br-none'
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                    <div className={`text-xs mt-1 ${msg.role === 'user' ? 'text-white/80' : 'text-gray-500'}`}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))}

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
                <button className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg active:bg-gray-300 touch-manipulation">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg active:bg-gray-300 touch-manipulation">
                  <Gift className="w-5 h-5" />
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
                  style={{ fontSize: '16px' }} // Prevents iOS zoom
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
    </div>
  );
}