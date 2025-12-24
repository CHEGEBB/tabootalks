/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Client, Databases, Query, Account, Storage } from 'appwrite';
import Image from 'next/image';
import { 
  Search, CheckCircle, MapPin, Zap, Crown, 
  Sparkles, Users, CreditCard, MessageCircle, 
  Plus, MoreVertical, Home, Eye, Gift, Mail,
  Shield, Phone, Video, Heart, Send, Smile,
  ChevronLeft, Camera, Star, Paperclip, Clock,
  UserPlus, TrendingUp, Activity, Award, Clock4,
  Target, BarChart3, RefreshCw, Trash2, AlertCircle
} from 'lucide-react';
import personaService, { ParsedPersonaProfile } from '@/lib/services/personaService';
import LayoutController from '@/components/layout/LayoutController';

// Types
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
  email?: string;
}

interface SuggestedBot extends ParsedPersonaProfile {
  isOnline?: boolean;
}

export default function ChatsPage() {
  const [conversations, setConversations] = useState<ConversationWithBot[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [suggestedBots, setSuggestedBots] = useState<SuggestedBot[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active'>('all');
  const [showSidebar, setShowSidebar] = useState(true);
  const [stats, setStats] = useState({
    totalMessages: 0,
    activeChats: 0,
    creditsSpent: 0,
    averageResponseTime: '2m',
    longestConversation: '45m',
    mostActiveHour: '8 PM'
  });
  
  // Delete functionality states
  const [swipingId, setSwipingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<{ [key: string]: number }>({});
  
  const router = useRouter();
  const swipeStartX = useRef<{ [key: string]: number }>({});

  // Initialize Appwrite
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  const databases = new Databases(client);
  const storage = new Storage(client);
  const account = new Account(client);

  const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

  useEffect(() => {
    loadConversations();
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

  const calculateStats = (conversations: ConversationWithBot[]) => {
    const totalMessages = conversations.reduce((sum, conv) => sum + conv.messageCount, 0);
    const activeChats = conversations.filter(conv => conv.isActive).length;
    const creditsSpent = conversations.reduce((sum, conv) => sum + conv.messageCount, 0);
    
    const responseTimes = ['1m', '2m', '3m', '5m', '10m'];
    const randomTime = responseTimes[Math.floor(Math.random() * responseTimes.length)];
    
    const conversationLengths = ['15m', '30m', '45m', '1h', '2h'];
    const randomLength = conversationLengths[Math.floor(Math.random() * conversationLengths.length)];
    
    const hours = ['2 PM', '6 PM', '8 PM', '10 PM', '12 AM'];
    const randomHour = hours[Math.floor(Math.random() * hours.length)];
    
    setStats({
      totalMessages,
      activeChats,
      creditsSpent,
      averageResponseTime: randomTime,
      longestConversation: randomLength,
      mostActiveHour: randomHour
    });
  };

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Get current user
      const accountData = await account.get();
      
      const userData = await databases.getDocument(
        DATABASE_ID,
        'users',
        accountData.$id
      );
      setCurrentUser(userData as any);

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

      if (conversationsData.documents.length === 0) {
        loadSuggestedBots();
      } else {
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
        calculateStats(conversationsWithBots as any);
      }

    } catch (err: any) {
      console.error('❌ Error loading conversations:', err);
      setError(err.message || 'Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSuggestedBots = async () => {
    try {
      setIsLoadingSuggestions(true);
      
      const suggestions = await personaService.getRandomPersonas(6);
      
      const suggestedBotsWithStatus = suggestions.map((bot) => ({
        ...bot,
        isOnline: Math.random() > 0.3,
        isVerified: bot.isVerified || false,
        bio: bot.bio || 'Start a conversation!',
        location: bot.location || 'Unknown location'
      }));
      
      setSuggestedBots(suggestedBotsWithStatus);
      
    } catch (err: any) {
      console.error('❌ Error loading suggestions:', err);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // DELETE CONVERSATION FUNCTION
  const deleteConversation = async (conversationId: string) => {
    try {
      setIsDeleting(conversationId);
      setError('');

      // Delete from Appwrite backend
      await databases.deleteDocument(
        DATABASE_ID,
        'conversations',
        conversationId
      );

      // Remove from local state
      setConversations(prev => prev.filter(conv => conv.$id !== conversationId));
      
      // Recalculate stats
      calculateStats(conversations.filter(conv => conv.$id !== conversationId));
      
      // Reset delete states
      setDeleteConfirmId(null);
      setSwipingId(null);
      setSwipeOffset(prev => ({ ...prev, [conversationId]: 0 }));

      console.log('✅ Conversation deleted successfully');

    } catch (err: any) {
      console.error('❌ Error deleting conversation:', err);
      setError(err.message || 'Failed to delete conversation');
    } finally {
      setIsDeleting(null);
    }
  };

  // SWIPE HANDLERS
  const handleSwipeStart = (e: React.TouchEvent | React.MouseEvent, conversationId: string) => {
    if ('touches' in e) {
      swipeStartX.current[conversationId] = e.touches[0].clientX;
    } else {
      swipeStartX.current[conversationId] = e.clientX;
    }
    setSwipingId(conversationId);
  };

  const handleSwipeMove = (e: React.TouchEvent | React.MouseEvent, conversationId: string) => {
    if (!swipeStartX.current[conversationId]) return;
    
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = swipeStartX.current[conversationId] - currentX;
    
    // Only allow left swipe (negative diff) and limit to 80px
    if (diff > 0) {
      const offset = Math.min(diff, 80);
      setSwipeOffset(prev => ({ ...prev, [conversationId]: offset }));
    }
  };

  const handleSwipeEnd = (conversationId: string) => {
    const offset = swipeOffset[conversationId] || 0;
    
    // If swiped more than 50px, show delete confirmation
    if (offset > 50) {
      setDeleteConfirmId(conversationId);
    } else {
      // Reset swipe
      setSwipeOffset(prev => ({ ...prev, [conversationId]: 0 }));
    }
    
    setSwipingId(null);
    swipeStartX.current[conversationId] = 0;
  };

  const resetSwipe = (conversationId: string) => {
    setSwipeOffset(prev => ({ ...prev, [conversationId]: 0 }));
    setDeleteConfirmId(null);
  };

  const startNewChat = async (botId: string) => {
    try {
      const accountData = await account.get();
      const userData = await databases.getDocument(
        DATABASE_ID,
        'users',
        accountData.$id
      );

      if (userData.credits < 1) {
        setError('Insufficient credits to start a chat');
        return;
      }

      const conversationData = {
        userId: accountData.$id,
        botProfileId: botId,
        lastMessage: '',
        lastMessageAt: new Date().toISOString(),
        messageCount: 0,
        isActive: true
      };

      const conversation = await databases.createDocument(
        DATABASE_ID,
        'conversations',
        'unique()',
        conversationData
      );

      router.push(`/main/chats/${conversation.$id}`);

    } catch (err: any) {
      console.error('❌ Error starting chat:', err);
      setError(err.message || 'Failed to start chat');
    }
  };

  const goToDiscoverPage = () => {
    router.push('/main/people');
  };

  const handleBuyCredits = () => {
    router.push('/main/credits');
  };

  const formatTime = (timestamp: string) => {
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

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.bot?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'active') {
      return matchesSearch && conv.isActive;
    }
    
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <LayoutController />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#5e17eb] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <LayoutController />
      
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-[calc(200vh-64px)] w-full">
        <div className="w-full max-w-[1400px] mx-auto flex h-full">
          
          {/* Left Sidebar - Chat List */}
          <div className="w-[400px] min-h-[1000px] flex-shrink-0 border-r border-l border-gray-200 overflow-hidden flex flex-col bg-white">            <div className="bg-white border-b border-gray-200 px-6 py-4">
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
            <div className="flex-1 overflow-y-auto bg-white">
              {conversations.length === 0 ? (
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
                    const isSwiping = swipingId === conv.$id;
                    const offset = swipeOffset[conv.$id] || 0;
                    const showDeleteConfirm = deleteConfirmId === conv.$id;
                    
                    return (
                      <div
                        key={conv.$id}
                        className={`relative transition-all duration-200 ${isDeleting === conv.$id ? 'opacity-50' : ''}`}
                        style={{ transform: `translateX(-${offset}px)` }}
                      >
                        {/* Delete Button (Hidden behind chat) */}
                        <div className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center bg-red-500 rounded-r-lg">
                          <button
                            onClick={() => deleteConversation(conv.$id)}
                            disabled={isDeleting === conv.$id}
                            className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                          >
                            {isDeleting === conv.$id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4" />
                                <span className="text-xs font-medium">Delete</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Chat Item */}
                        <div
                          className={`relative bg-white ${showDeleteConfirm ? 'border-2 border-red-500' : 'border-b border-gray-100'}`}
                          onTouchStart={(e) => handleSwipeStart(e, conv.$id)}
                          onTouchMove={(e) => handleSwipeMove(e, conv.$id)}
                          onTouchEnd={() => handleSwipeEnd(conv.$id)}
                          onMouseDown={(e) => handleSwipeStart(e, conv.$id)}
                          onMouseMove={(e) => handleSwipeMove(e, conv.$id)}
                          onMouseUp={() => handleSwipeEnd(conv.$id)}
                          onMouseLeave={() => {
                            if (swipingId === conv.$id) {
                              handleSwipeEnd(conv.$id);
                            }
                          }}
                        >
                          <Link
                            href={`/main/chats/${conv.$id}`}
                            className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-all"
                            onClick={(e) => {
                              if (offset > 10 || showDeleteConfirm) {
                                e.preventDefault();
                                resetSwipe(conv.$id);
                              }
                            }}
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
                                  {formatTime(conv.lastMessageAt)}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600 truncate max-w-[200px]">
                                  {conv.lastMessage || 'Start a conversation...'}
                                </p>
                                {conv.messageCount > 0 && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs bg-[#5e17eb]/10 text-[#5e17eb] px-2 py-0.5 rounded-full min-w-[40px] text-center">
                                      {conv.messageCount} msg{conv.messageCount !== 1 ? 's' : ''}
                                    </span>
                                    {showDeleteConfirm && (
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          resetSwipe(conv.$id);
                                        }}
                                        className="text-xs text-gray-500 hover:text-gray-700"
                                      >
                                        Cancel
                                      </button>
                                    )}
                                  </div>
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

                            {/* Delete Menu Button (Desktop only) */}
                            <div className="relative group">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setDeleteConfirmId(deleteConfirmId === conv.$id ? null : conv.$id);
                                }}
                                className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                              >
                                <MoreVertical className="w-5 h-5" />
                              </button>
                              
                              {/* Delete Dropdown */}
                              {deleteConfirmId === conv.$id && (
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                  <div className="p-3 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">Delete this chat?</p>
                                    <p className="text-xs text-gray-500 mt-1">This action cannot be undone</p>
                                  </div>
                                  <div className="p-2">
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        deleteConversation(conv.$id);
                                      }}
                                      disabled={isDeleting === conv.$id}
                                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                                    >
                                      {isDeleting === conv.$id ? (
                                        <>
                                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                          Deleting...
                                        </>
                                      ) : (
                                        <>
                                          <Trash2 className="w-4 h-4" />
                                          Yes, Delete Chat
                                        </>
                                      )}
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setDeleteConfirmId(null);
                                      }}
                                      className="w-full mt-2 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </Link>

                          {/* Delete Confirmation Banner */}
                          {showDeleteConfirm && (
                            <div className="absolute top-0 left-0 right-0 bottom-0 bg-red-50 border border-red-200 flex items-center justify-between px-4">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                <span className="text-sm font-medium text-red-700">Swipe to delete</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => resetSwipe(conv.$id)}
                                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => deleteConversation(conv.$id)}
                                  disabled={isDeleting === conv.$id}
                                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                                >
                                  {isDeleting === conv.$id ? 'Deleting...' : 'Delete'}
                                </button>
                              </div>
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
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className={`flex-1 flex flex-col ${conversations.length === 0 ? 'min-h-[800px]' : ''}`}>
            {/* Error Message */}
            {error && (
              <div className="mx-6 mt-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between">
                  <span className="text-sm">{error}</span>
                  <button 
                    onClick={() => setError('')}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* NO CONVERSATIONS STATE */}
            {conversations.length === 0 && !isLoading && (
              <div className="flex-1 flex flex-col p-8">
                {/* Welcome Header */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#5e17eb]/10 to-pink-500/10 mb-6">
                    <MessageCircle className="w-12 h-12 text-[#5e17eb]" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Welcome to TabooTalks
                  </h1>
                  <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                    Connect with interesting people from around the world. Every message brings you closer to new friends and experiences.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-2xl mx-auto">
                    <button
                      onClick={goToDiscoverPage}
                      className="px-6 py-3 bg-[#5e17eb] text-white font-medium rounded-xl hover:bg-[#4a13c4] transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <Users className="w-5 h-5" />
                      Discover People
                    </button>
                    <button
                      onClick={handleBuyCredits}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:opacity-90 transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-5 h-5" />
                      Get Credits
                    </button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#5e17eb]/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-[#5e17eb]" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-900">250+</div>
                        <div className="text-sm text-gray-600">Active Users</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Real people ready to chat right now</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-900">99%</div>
                        <div className="text-sm text-gray-600">Response Rate</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Fast replies from engaged users</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-900">100%</div>
                        <div className="text-sm text-gray-600">Verified Profiles</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Authentic connections guaranteed</p>
                  </div>
                </div>

                {/* Suggested People Section */}
                <div className="w-full">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        Suggested People
                      </h2>
                      <p className="text-gray-600 text-sm mt-1">Based on your interests and location</p>
                    </div>
                    <button
                      onClick={loadSuggestedBots}
                      className="text-[#5e17eb] hover:text-[#4a13c4] font-medium flex items-center gap-2 text-sm mt-2 sm:mt-0"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                  </div>

                  {suggestedBots.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {suggestedBots.map((bot) => (
                        <div
                          key={bot.$id}
                          className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                        >
                          {/* Profile Image */}
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={bot.profilePic || '/default-avatar.png'}
                              alt={bot.username}
                              width={400}
                              height={192}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                              unoptimized={bot.profilePic?.startsWith('http')}
                            />
                            <div className="absolute top-3 right-3 flex flex-col gap-1">
                              {bot.isVerified && (
                                <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  <span className="hidden sm:inline">Verified</span>
                                </div>
                              )}
                              {bot.isOnline && (
                                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                  <span className="hidden sm:inline">Online</span>
                                </div>
                              )}
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                              <h3 className="text-lg font-bold text-white">
                                {bot.username}, {bot.age}
                              </h3>
                              <div className="flex items-center gap-2 text-white/90 text-xs mt-1">
                                <MapPin className="w-3 h-3" />
                                {bot.location}
                              </div>
                            </div>
                          </div>

                          {/* Profile Info */}
                          <div className="p-4">
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[40px]">
                              &ldquo;{bot.bio}&rdquo;
                            </p>

                            {bot.interests && bot.interests.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-4">
                                {bot.interests.slice(0, 2).map((interest, idx) => (
                                  <span 
                                    key={idx} 
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition-colors"
                                  >
                                    {interest}
                                  </span>
                                ))}
                                {bot.interests.length > 2 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                                    +{bot.interests.length - 2}
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="flex gap-2">
                              <button
                                onClick={() => startNewChat(bot.$id)}
                                className="flex-1 py-2.5 bg-[#5e17eb] text-white font-medium rounded-xl hover:bg-[#4a13c4] transition-colors flex items-center justify-center gap-2 text-sm"
                              >
                                <MessageCircle className="w-4 h-4" />
                                <span className="hidden sm:inline">Start Chat</span>
                                <span className="sm:hidden">Chat</span>
                              </button>
                              <button
                                onClick={() => router.push(`/main/profile/${bot.$id}`)}
                                className="px-3 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                                title="View Profile"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : !isLoadingSuggestions ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No suggestions available</h3>
                      <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
                        Check back later or try refreshing for new suggestions
                      </p>
                      <button
                        onClick={loadSuggestedBots}
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : null}
                </div>

                {/* Credit Warning */}
                {currentUser && currentUser.credits < 20 && (
                  <div className="mt-8 w-full max-w-4xl">
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
                      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center">
                            <Zap className="w-6 h-6 text-amber-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              ⚡ Don&apos;t Lose Your Connection!
                            </h3>
                            <p className="text-gray-700 text-sm">
                              You have <span className="font-bold text-[#5e17eb]">{currentUser.credits}</span> credits left. 
                              Top up now to keep chatting.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleBuyCredits}
                          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:opacity-90 transition-all hover:scale-105 whitespace-nowrap text-sm"
                        >
                          Get Credits Now 🔴
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* HAS CONVERSATIONS STATE */}
            {conversations.length > 0 && (
              <div className="flex-1 flex">
                {/* Left Content */}
                <div className="flex-1 flex flex-col">
                  {/* Desktop Header */}
                  <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">Your Conversations</h1>
                        <p className="text-gray-600 text-sm mt-1">
                          {filteredConversations.length} chats • {conversations.filter(c => c.bot?.isOnline).length} online now
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Available Credits</p>
                          <p className="text-xl font-bold text-[#5e17eb]">{currentUser?.credits || 0}</p>
                        </div>
                        <button
                          onClick={goToDiscoverPage}
                          className="px-6 py-3 bg-gradient-to-r from-[#5e17eb] to-[#8a4bff] text-white font-medium rounded-xl hover:from-[#4a13c4] hover:to-[#7238ff] transition-all shadow-sm flex items-center gap-2"
                        >
                          <Plus className="w-5 h-5" />
                          Start New Chat
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Credit Warning Banner */}
                  {currentUser && currentUser.credits < 10 && (
                    <div className="mx-6 mt-6">
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                              <Crown className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm">
                                ⚠️ Low Credits Warning!
                              </h4>
                              <p className="text-gray-700 text-xs mt-1">
                                Only <span className="font-bold text-[#5e17eb]">{currentUser.credits}</span> credits remaining. 
                                Top up to continue your conversations.
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={handleBuyCredits}
                            className="px-4 py-2 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors whitespace-nowrap text-sm"
                          >
                            💎 Get Credits Now
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Refresh Button */}
                  <div className="mt-6 px-6">
                    <button
                      onClick={loadConversations}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh Conversations
                    </button>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-[320px] border-l border-r min-h-[1000px] border-gray-200 bg-white overflow-y-auto p-6">
                  {/* Activity Stats */}
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-[#5e17eb]" />
                      Your Activity
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#5e17eb] to-purple-500 flex items-center justify-center">
                              <MessageCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Messages</p>
                              <p className="text-2xl font-bold text-gray-900">{stats.totalMessages}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-blue-600" />
                            <p className="text-xs text-gray-600">Active Chats</p>
                          </div>
                          <p className="text-xl font-bold text-gray-900">{stats.activeChats}</p>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="w-4 h-4 text-green-600" />
                            <p className="text-xs text-gray-600">Credits Used</p>
                          </div>
                          <p className="text-xl font-bold text-gray-900">{stats.creditsSpent}</p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-amber-600" />
                            <p className="text-sm font-medium text-gray-900">Response Time</p>
                          </div>
                          <span className="text-xs font-bold text-amber-700">{stats.averageResponseTime}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>Avg. response</span>
                          <span>Fast ⚡</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="mb-8">
                    <h3 className="font-bold text-gray-900 mb-3">Quick Stats</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Clock4 className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Longest Chat</span>
                        </div>
                        <span className="font-medium text-gray-900">{stats.longestConversation}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Most Active</span>
                        </div>
                        <span className="font-medium text-gray-900">{stats.mostActiveHour}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mb-8">
                    <h3 className="font-bold text-gray-900 mb-3">Quick Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={goToDiscoverPage}
                        className="w-full py-3 bg-gradient-to-r from-[#5e17eb] to-[#8a4bff] text-white font-medium rounded-xl hover:from-[#4a13c4] hover:to-[#7238ff] transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                        <Users className="w-4 h-4" />
                        Discover More People
                      </button>
                      <button
                        onClick={handleBuyCredits}
                        className="w-full py-3 border border-[#5e17eb] text-[#5e17eb] font-medium rounded-xl hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        Buy Credits
                      </button>
                    </div>
                  </div>

                  {/* Tips & Tricks */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Pro Tip
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Send messages during peak hours (6 PM - 10 PM) for faster responses!
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Response rate: 95%</span>
                      <span>Peak hours</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-[calc(100vh-64px)]">
        {/* Mobile Header */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5e17eb] to-purple-600 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-sm">TabooTalks</h1>
                <p className="text-xs text-gray-500">
                  <span className="font-semibold text-[#5e17eb]">{currentUser?.credits || 0}</span> credits
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={goToDiscoverPage}
                className="p-2 bg-[#5e17eb] text-white rounded-lg hover:bg-[#4a13c4]"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-auto bg-white">
          {/* Error Message */}
          {error && (
            <div className="mx-4 mt-4">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between">
                <span className="text-sm">{error}</span>
                <button 
                  onClick={() => setError('')}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Mobile Chat List */}
          {conversations.length > 0 ? (
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                {filteredConversations.map((conv) => {
                  const isSwiping = swipingId === conv.$id;
                  const offset = swipeOffset[conv.$id] || 0;
                  const showDeleteConfirm = deleteConfirmId === conv.$id;
                  
                  return (
                    <div
                      key={conv.$id}
                      className="relative"
                      style={{ transform: `translateX(-${offset}px)` }}
                    >
                      {/* Delete Button (Hidden behind chat) */}
                      <div className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-center bg-red-500 rounded-r-lg">
                        <button
                          onClick={() => deleteConversation(conv.$id)}
                          disabled={isDeleting === conv.$id}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isDeleting === conv.$id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {/* Chat Item */}
                      <div
                        className={`bg-white rounded-xl border ${showDeleteConfirm ? 'border-red-500' : 'border-gray-200'} overflow-hidden`}
                        onTouchStart={(e) => handleSwipeStart(e, conv.$id)}
                        onTouchMove={(e) => handleSwipeMove(e, conv.$id)}
                        onTouchEnd={() => handleSwipeEnd(conv.$id)}
                      >
                        <Link
                          href={`/main/chats/${conv.$id}`}
                          className="block p-4 hover:bg-gray-50 transition-all"
                          onClick={(e) => {
                            if (offset > 10 || showDeleteConfirm) {
                              e.preventDefault();
                              resetSwipe(conv.$id);
                            }
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                                <Image
                                  src={conv.bot?.profilePic || '/default-avatar.png'}
                                  alt={conv.bot?.username || 'User'}
                                  width={56}
                                  height={56}
                                  className="object-cover"
                                  unoptimized={conv.bot?.profilePic?.startsWith('http')}
                                />
                              </div>
                              {conv.bot?.isOnline && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1">
                                  <h3 className="font-bold text-gray-900 text-sm truncate">
                                    {conv.bot?.username}
                                  </h3>
                                  {conv.bot?.isVerified && (
                                    <CheckCircle className="w-3 h-3 text-blue-500 fill-blue-100" />
                                  )}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {formatTime(conv.lastMessageAt)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 truncate mb-1">
                                {conv.lastMessage || 'Start a conversation...'}
                              </p>
                              <div className="flex items-center justify-between">
                                {conv.bot?.location && (
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {conv.bot.location}
                                  </span>
                                )}
                                {conv.messageCount > 0 && (
                                  <span className="text-xs bg-[#5e17eb]/10 text-[#5e17eb] px-2 py-1 rounded-full min-w-[50px] text-center">
                                    {conv.messageCount} msg{conv.messageCount !== 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>

                        {/* Delete Confirmation Banner (Mobile) */}
                        {showDeleteConfirm && (
                          <div className="bg-red-50 border-t border-red-200 p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                <span className="text-xs font-medium text-red-700">Delete this chat?</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => resetSwipe(conv.$id)}
                                  className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => deleteConversation(conv.$id)}
                                  disabled={isDeleting === conv.$id}
                                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                                >
                                  {isDeleting === conv.$id ? 'Deleting...' : 'Delete'}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Credit Warning Banner Mobile */}
              {currentUser && currentUser.credits < 10 && (
                <div className="mt-6">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex flex-col items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                          <Crown className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">
                            ⚠️ Low Credits!
                          </h4>
                          <p className="text-gray-700 text-xs mt-1">
                            {currentUser.credits} credits left
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleBuyCredits}
                        className="w-full px-4 py-2 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors text-sm"
                      >
                        💎 Get Credits
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Stats */}
              <div className="mt-6">
                <h3 className="font-bold text-gray-900 mb-3">Your Activity</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                    <p className="text-xs text-gray-600">Total Messages</p>
                    <p className="text-xl font-bold text-gray-900">{stats.totalMessages}</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
                    <p className="text-xs text-gray-600">Active Chats</p>
                    <p className="text-xl font-bold text-gray-900">{stats.activeChats}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* No Conversations Mobile */
            <div className="p-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#5e17eb]/10 to-pink-500/10 mb-4">
                  <MessageCircle className="w-10 h-10 text-[#5e17eb]" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">Welcome to TabooTalks</h1>
                <p className="text-gray-600 text-sm mb-6">
                  Connect with interesting people from around the world.
                </p>
                
                <div className="flex flex-col gap-2">
                  <button
                    onClick={goToDiscoverPage}
                    className="px-6 py-3 bg-[#5e17eb] text-white font-medium rounded-xl hover:bg-[#4a13c4] transition-all flex items-center justify-center gap-2"
                  >
                    <Users className="w-5 h-5" />
                    Discover People
                  </button>
                  <button
                    onClick={handleBuyCredits}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Get Credits
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}