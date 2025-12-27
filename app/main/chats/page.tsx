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
  Target, BarChart3, RefreshCw, Trash2, AlertCircle,
  X
} from 'lucide-react';
import personaService, { ParsedPersonaProfile } from '@/lib/services/personaService';
import LayoutController from '@/components/layout/LayoutController';
import { useThemeColors } from '@/lib/hooks/useThemeColors';

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
  const colors = useThemeColors();
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
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
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
      setShowDeleteModal(null);
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

  // SWIPE HANDLERS - iPhone Style
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
    
    // If swiped more than 60px, show delete modal
    if (offset > 60) {
      setShowDeleteModal(conversationId);
    } else {
      // Reset swipe
      setSwipeOffset(prev => ({ ...prev, [conversationId]: 0 }));
    }
    
    setSwipingId(null);
    swipeStartX.current[conversationId] = 0;
  };

  const resetSwipe = (conversationId: string) => {
    setSwipeOffset(prev => ({ ...prev, [conversationId]: 0 }));
    setShowDeleteModal(null);
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
      <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
        <LayoutController />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <div 
              className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4"
              style={{ 
                borderColor: colors.secondary,
                borderTopColor: 'transparent'
              }}
            ></div>
            <p style={{ color: colors.secondaryText }}>Loading conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <LayoutController />
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="rounded-2xl max-w-md w-full p-6 animate-scale-in"
            style={{ 
              backgroundColor: colors.cardBackground,
              border: `1px solid ${colors.border}`
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
              >
                <Trash2 className="w-8 h-8" style={{ color: colors.danger }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: colors.primaryText }}>
                Delete Conversation?
              </h3>
              <p className="mb-6" style={{ color: colors.secondaryText }}>
                This will permanently delete your conversation with{' '}
                <span className="font-semibold" style={{ color: colors.primaryText }}>
                  {conversations.find(c => c.$id === showDeleteModal)?.bot?.username || 'this user'}
                </span>. This action cannot be undone.
              </p>
              
              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={() => deleteConversation(showDeleteModal)}
                  disabled={isDeleting === showDeleteModal}
                  className="w-full py-3 font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ 
                    backgroundColor: colors.danger,
                    color: 'white'
                  }}
                >
                  {isDeleting === showDeleteModal ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Yes, Delete
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="w-full py-3 font-medium rounded-xl transition-colors"
                  style={{ 
                    border: `1px solid ${colors.border}`,
                    color: colors.primaryText,
                    backgroundColor: 'transparent'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-[calc(250vh-64px)] w-full">
        <div className="w-full max-w-[1400px] mx-auto flex h-full">
          
          {/* Left Sidebar - Chat List */}
          <div 
            className="w-[400px] min-h-[1000px] flex-shrink-0 overflow-hidden flex flex-col"
            style={{ 
              backgroundColor: colors.background,
              borderRight: `1px solid ${colors.border}`,
              borderLeft: `1px solid ${colors.border}`
            }}
          >
            <div 
              className="px-6 py-4"
              style={{ 
                backgroundColor: colors.background,
                borderBottom: `1px solid ${colors.border}`
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold" style={{ color: colors.secondary }}>
                    {currentUser?.credits || 0}
                  </span>
                  <button 
                    onClick={handleBuyCredits}
                    className="px-3 py-1 text-white text-sm rounded-lg transition-all shadow-sm"
                    style={{ 
                      background: `linear-gradient(to right, ${colors.secondary}, ${colors.primary})`
                    }}
                  >
                    Add Credits
                  </button>
                </div>
                <button 
                  onClick={() => router.push('/main')}
                  style={{ color: colors.secondaryText }}
                  className="hover:opacity-80 transition-colors"
                >
                  <Home className="w-5 h-5" />
                </button>
              </div>
              
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                  style={{ color: colors.placeholderText }}
                />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none transition-all"
                  style={{
                    backgroundColor: colors.inputBackground,
                    border: `1px solid ${colors.border}`,
                    color: colors.primaryText
                  }}
                />
              </div>
              
              {/* Tabs */}
              <div className="flex space-x-2 mb-2">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === 'all' ? 'text-white shadow-sm' : ''
                  }`}
                  style={
                    activeFilter === 'all' 
                      ? { background: `linear-gradient(to right, ${colors.secondary}, ${colors.primary})` }
                      : {
                          backgroundColor: colors.panelBackground,
                          color: colors.secondaryText
                        }
                  }
                >
                  All Chats
                </button>
                <button
                  onClick={() => setActiveFilter('active')}
                  className={`flex-1py-2.5 px-4 rounded-lg text-sm font-medium transition-all relative ${
                    activeFilter === 'active' ? 'text-white shadow-sm' : ''
                  }`}
                  style={
                    activeFilter === 'active'
                      ? { background: `linear-gradient(to right, ${colors.secondary}, ${colors.primary})` }
                      : {
                          backgroundColor: colors.panelBackground,
                          color: colors.secondaryText
                        }
                  }
                >
                  Active Now
                  <span className="absolute -top-1 -right-1 text-white bg-red-500  text-xs px-1.5 py-0.5 rounded-full">
                    {conversations.filter(c => c.isActive).length}
                  </span>
                </button>
              </div>
            </div>

            {/* Chat List - Scrollable */}
            <div className="flex-1 overflow-y-auto" style={{ backgroundColor: colors.background }}>
              {conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <div 
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${colors.panelBackground}, ${colors.inputBackground})` }}
                  >
                    <MessageCircle className="w-8 h-8" style={{ color: colors.secondaryText }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: colors.primaryText }}>
                    No conversations yet
                  </h3>
                  <p className="mb-4" style={{ color: colors.secondaryText }}>Start chatting with someone!</p>
                  <button
                    onClick={goToDiscoverPage}
                    className="px-4 py-2 text-white rounded-lg shadow-sm"
                    style={{ background: `linear-gradient(to right, ${colors.secondary}, ${colors.primary})` }}
                  >
                    Discover People
                  </button>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: colors.borderLight }}>
                  {filteredConversations.map(conv => {
                    const botProfile = conv.bot;
                    const isSwiping = swipingId === conv.$id;
                    const offset = swipeOffset[conv.$id] || 0;
                    
                    return (
                      <div
                        key={conv.$id}
                        className={`relative transition-all duration-200 ${isDeleting === conv.$id ? 'opacity-50' : ''}`}
                        style={{ transform: `translateX(-${offset}px)` }}
                      >
                        {/* iPhone-style Delete Button (Red background that appears behind) */}
                        <div 
                          className="absolute right-0 top-0 bottom-0 flex items-center justify-center transition-all duration-200"
                          style={{ 
                            width: `${Math.min(offset, 80)}px`,
                            backgroundColor: colors.danger,
                            opacity: offset > 20 ? 0.95 : 0
                          }}
                        >
                          {offset > 40 && (
                            <div className="flex flex-col items-center">
                              <Trash2 className="w-5 h-5 text-white mb-1" />
                              <span className="text-xs text-white font-medium">Delete</span>
                            </div>
                          )}
                        </div>

                        {/* Chat Item */}
                        <div
                          className="relative"
                          style={{ 
                            backgroundColor: colors.background,
                            borderBottom: `1px solid ${colors.borderLight}`
                          }}
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
                            className="flex items-center gap-3 p-4 cursor-pointer transition-all"
                            style={{ backgroundColor: colors.hoverBackground }}
                            onClick={(e) => {
                              if (offset > 10) {
                                e.preventDefault();
                                resetSwipe(conv.$id);
                              }
                            }}
                          >
                            {/* Profile Image */}
                            <div className="relative flex-shrink-0">
                              <div 
                                className="w-12 h-12 rounded-full overflow-hidden shadow-sm"
                                style={{ border: `2px solid ${colors.background}` }}
                              >
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
                                  <div 
                                    className="w-full h-full flex items-center justify-center"
                                    style={{ background: `linear-gradient(135deg, ${colors.panelBackground}, ${colors.inputBackground})` }}
                                  >
                                    <UserPlus className="w-6 h-6" style={{ color: colors.secondaryText }} />
                                  </div>
                                )}
                              </div>
                              {conv.isActive && (
                                <div 
                                  className="absolute bottom-0 right-0 w-3 h-3 rounded-full"
                                  style={{ 
                                    border: `2px solid ${colors.background}`,
                                    backgroundColor: colors.success
                                  }}
                                ></div>
                              )}
                            </div>

                            {/* Chat Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold truncate" style={{ color: colors.primaryText }}>
                                    {botProfile?.username || 'Unknown'}
                                  </h4>
                                  {botProfile?.isVerified && (
                                    <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-100 flex-shrink-0" />
                                  )}
                                  <span className="text-xs" style={{ color: colors.tertiaryText }}>
                                    {botProfile?.age ? `, ${botProfile.age}` : ''}
                                  </span>
                                </div>
                                <span className="text-xs whitespace-nowrap" style={{ color: colors.tertiaryText }}>
                                  {formatTime(conv.lastMessageAt)}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <p className="text-sm truncate max-w-[200px]" style={{ color: colors.secondaryText }}>
                                  {conv.lastMessage || 'Start a conversation...'}
                                </p>
                                {conv.messageCount > 0 && (
                                  <span 
                                    className="text-xs px-2 py-0.5 rounded-full min-w-[40px] text-center"
                                    style={{ 
                                      backgroundColor: `${colors.secondary}10`,
                                      color: colors.secondary
                                    }}
                                  >
                                    {conv.messageCount} msg{conv.messageCount !== 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                              
                              {/* Location */}
                              {botProfile?.location && (
                                <div className="flex items-center gap-1 mt-1">
                                  <MapPin className="w-3 h-3" style={{ color: colors.tertiaryText }} />
                                  <span className="text-xs" style={{ color: colors.tertiaryText }}>
                                    {botProfile.location}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Delete Icon Button (Desktop - Small) */}
                            <div className="relative group">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setShowDeleteModal(conv.$id);
                                }}
                                className="p-2 rounded-full transition-colors group"
                                style={{ color: colors.secondaryText }}
                                title="Delete chat"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              {/* Tooltip */}
                              <div className="absolute right-0 top-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <div className="text-xs px-2 py-1 rounded whitespace-nowrap"
                                  style={{ 
                                    backgroundColor: colors.cardBackground,
                                    color: colors.primaryText,
                                    border: `1px solid ${colors.border}`
                                  }}
                                >
                                  Delete chat
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar Footer */}
            <div 
              className="p-4"
              style={{ 
                borderTop: `1px solid ${colors.border}`,
                backgroundColor: colors.background
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
                  >
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
                    <p className="font-medium text-sm" style={{ color: colors.primaryText }}>
                      {currentUser?.username}
                    </p>
                    <p className="text-xs flex items-center gap-1" style={{ color: colors.secondaryText }}>
                      <Zap className="w-3 h-3" />
                      <span className="font-semibold" style={{ color: colors.secondary }}>
                        {currentUser?.credits || 0}
                      </span> credits
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
                <div 
                  className="px-4 py-3 rounded-xl flex items-center justify-between"
                  style={{ 
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid rgba(239, 68, 68, 0.2)`,
                    color: colors.danger
                  }}
                >
                  <span className="text-sm">{error}</span>
                  <button 
                    onClick={() => setError('')}
                    className="hover:opacity-70"
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
                  <div 
                    className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.secondary}10, rgba(236, 72, 153, 0.1))`
                    }}
                  >
                    <MessageCircle className="w-12 h-12" style={{ color: colors.secondary }} />
                  </div>
                  <h1 className="text-2xl font-bold mb-4" style={{ color: colors.primaryText }}>
                    Welcome to TabooTalks
                  </h1>
                  <p className="max-w-2xl mx-auto mb-6" style={{ color: colors.secondaryText }}>
                    Connect with interesting people from around the world. Every message brings you closer to new friends and experiences.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-2xl mx-auto">
                    <button
                      onClick={goToDiscoverPage}
                      className="px-6 py-3 font-medium rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                      style={{ 
                        backgroundColor: colors.secondary,
                        color: 'white'
                      }}
                    >
                      <Users className="w-5 h-5" />
                      Discover People
                    </button>
                    <button
                      onClick={handleBuyCredits}
                      className="px-6 py-3 font-medium rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                      style={{ 
                        background: 'linear-gradient(to right, #f59e0b, #f97316)',
                        color: 'white'
                      }}
                    >
                      <CreditCard className="w-5 h-5" />
                      Get Credits
                    </button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div 
                    className="p-6 rounded-xl border shadow-sm"
                    style={{ 
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${colors.secondary}10` }}
                      >
                        <Users className="w-5 h-5" style={{ color: colors.secondary }} />
                      </div>
                      <div>
                        <div className="text-xl font-bold" style={{ color: colors.primaryText }}>250+</div>
                        <div className="text-sm" style={{ color: colors.secondaryText }}>Active Users</div>
                      </div>
                    </div>
                    <p className="text-sm" style={{ color: colors.secondaryText }}>
                      Real people ready to chat right now
                    </p>
                  </div>
                  
                  <div 
                    className="p-6 rounded-xl border shadow-sm"
                    style={{ 
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                      >
                        <MessageCircle className="w-5 h-5" style={{ color: colors.success }} />
                      </div>
                      <div>
                        <div className="text-xl font-bold" style={{ color: colors.primaryText }}>99%</div>
                        <div className="text-sm" style={{ color: colors.secondaryText }}>Response Rate</div>
                      </div>
                    </div>
                    <p className="text-sm" style={{ color: colors.secondaryText }}>
                      Fast replies from engaged users
                    </p>
                  </div>
                  
                  <div 
                    className="p-6 rounded-xl border shadow-sm"
                    style={{ 
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
                      >
                        <Shield className="w-5 h-5" style={{ color: colors.secondary }} />
                      </div>
                      <div>
                        <div className="text-xl font-bold" style={{ color: colors.primaryText }}>100%</div>
                        <div className="text-sm" style={{ color: colors.secondaryText }}>Verified Profiles</div>
                      </div>
                    </div>
                    <p className="text-sm" style={{ color: colors.secondaryText }}>
                      Authentic connections guaranteed
                    </p>
                  </div>
                </div>

                {/* Suggested People Section */}
                <div className="w-full">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: colors.primaryText }}>
                        <Sparkles className="w-5 h-5" style={{ color: colors.warning }} />
                        Suggested People
                      </h2>
                      <p className="text-sm mt-1" style={{ color: colors.secondaryText }}>
                        Based on your interests and location
                      </p>
                    </div>
                    <button
                      onClick={loadSuggestedBots}
                      className="font-medium flex items-center gap-2 text-sm mt-2 sm:mt-0"
                      style={{ color: colors.secondary }}
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
                          className="rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                          style={{ 
                            backgroundColor: colors.cardBackground,
                            borderColor: colors.border
                          }}
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
                                <div 
                                  className="text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
                                  style={{ backgroundColor: colors.secondary }}
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  <span className="hidden sm:inline">Verified</span>
                                </div>
                              )}
                              {bot.isOnline && (
                                <div 
                                  className="text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
                                  style={{ backgroundColor: colors.success }}
                                >
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
                            <p className="text-sm mb-3 line-clamp-2 min-h-[40px]" style={{ color: colors.secondaryText }}>
                              &ldquo;{bot.bio}&rdquo;
                            </p>

                            {bot.interests && bot.interests.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-4">
                                {bot.interests.slice(0, 2).map((interest, idx) => (
                                  <span 
                                    key={idx} 
                                    className="px-2 py-1 text-xs rounded-lg transition-colors"
                                    style={{ 
                                      backgroundColor: colors.panelBackground,
                                      color: colors.secondaryText
                                    }}
                                  >
                                    {interest}
                                  </span>
                                ))}
                                {bot.interests.length > 2 && (
                                  <span 
                                    className="px-2 py-1 text-xs rounded-lg"
                                    style={{ 
                                      backgroundColor: colors.panelBackground,
                                      color: colors.secondaryText
                                    }}
                                  >
                                    +{bot.interests.length - 2}
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="flex gap-2">
                              <button
                                onClick={() => startNewChat(bot.$id)}
                                className="flex-1 py-2.5 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                                style={{ 
                                  backgroundColor: colors.secondary,
                                  color: 'white'
                                }}
                              >
                                <MessageCircle className="w-4 h-4" />
                                <span className="hidden sm:inline">Start Chat</span>
                                <span className="sm:hidden">Chat</span>
                              </button>
                              <button
                                onClick={() => router.push(`/main/profile/${bot.$id}`)}
                                className="px-3 py-2.5 font-medium rounded-xl transition-colors"
                                style={{ 
                                  border: `1px solid ${colors.border}`,
                                  color: colors.secondaryText,
                                  backgroundColor: 'transparent'
                                }}
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
                    <div 
                      className="text-center py-8 rounded-xl"
                      style={{ backgroundColor: colors.panelBackground }}
                    >
                      <MessageCircle className="w-12 h-12 mx-auto mb-4" style={{ color: colors.tertiaryText }} />
                      <h3 className="text-lg font-semibold mb-2" style={{ color: colors.primaryText }}>
                        No suggestions available
                      </h3>
                      <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: colors.secondaryText }}>
                        Check back later or try refreshing for new suggestions
                      </p>
                      <button
                        onClick={loadSuggestedBots}
                        className="px-6 py-2.5 font-medium rounded-xl transition-colors text-sm"
                        style={{ 
                          border: `1px solid ${colors.border}`,
                          color: colors.secondaryText,
                          backgroundColor: 'transparent'
                        }}
                      >
                        Try Again
                      </button>
                    </div>
                  ) : null}
                </div>

                {/* Credit Warning */}
                {currentUser && currentUser.credits < 20 && (
                  <div className="mt-8 w-full max-w-4xl">
                    <div 
                      className="rounded-xl p-6"
                      style={{ 
                        background: 'linear-gradient(to right, rgba(251, 191, 36, 0.1), rgba(249, 115, 22, 0.1))',
                        border: `1px solid rgba(251, 191, 36, 0.2)`
                      }}
                    >
                      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ background: 'linear-gradient(to right, rgba(251, 191, 36, 0.2), rgba(249, 115, 22, 0.2))' }}
                          >
                            <Zap className="w-6 h-6" style={{ color: colors.warning }} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold mb-1" style={{ color: colors.primaryText }}>
                              ⚡ Don&apos;t Lose Your Connection!
                            </h3>
                            <p className="text-sm" style={{ color: colors.secondaryText }}>
                              You have <span className="font-bold" style={{ color: colors.secondary }}>
                                {currentUser.credits}
                              </span> credits left. 
                              Top up now to keep chatting.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleBuyCredits}
                          className="px-6 py-3 font-bold rounded-xl transition-all hover:scale-105 whitespace-nowrap text-sm"
                          style={{ 
                            background: 'linear-gradient(to right, #f59e0b, #f97316)',
                            color: 'white'
                          }}
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
                  <div 
                    className="px-6 py-4"
                    style={{ 
                      backgroundColor: colors.background,
                      borderBottom: `1px solid ${colors.border}`
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-2xl font-bold" style={{ color: colors.primaryText }}>
                          Your Conversations
                        </h1>
                        <p className="text-sm mt-1" style={{ color: colors.secondaryText }}>
                          {filteredConversations.length} chats • {conversations.filter(c => c.bot?.isOnline).length} online now
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm" style={{ color: colors.secondaryText }}>Available Credits</p>
                          <p className="text-xl font-bold" style={{ color: colors.secondary }}>
                            {currentUser?.credits || 0}
                          </p>
                        </div>
                        <button
                          onClick={goToDiscoverPage}
                          className="px-6 py-3 font-medium rounded-xl transition-all shadow-sm flex items-center gap-2"
                          style={{ 
                            background: `linear-gradient(to right, ${colors.secondary}, ${colors.primary})`,
                            color: 'white'
                          }}
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
                      <div 
                        className="rounded-xl p-4"
                        style={{ 
                          background: 'linear-gradient(to right, rgba(251, 191, 36, 0.1), rgba(249, 115, 22, 0.1))',
                          border: `1px solid rgba(251, 191, 36, 0.2)`
                        }}
                      >
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-12 h-12 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)' }}
                            >
                              <Crown className="w-6 h-6" style={{ color: colors.warning }} />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm" style={{ color: colors.primaryText }}>
                                ⚠️ Low Credits Warning!
                              </h4>
                              <p className="text-xs mt-1" style={{ color: colors.secondaryText }}>
                                Only <span className="font-bold" style={{ color: colors.secondary }}>
                                  {currentUser.credits}
                                </span> credits remaining. 
                                Top up to continue your conversations.
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={handleBuyCredits}
                            className="px-4 py-2 font-bold rounded-xl transition-colors whitespace-nowrap text-sm"
                            style={{ 
                              backgroundColor: colors.primaryText,
                              color: colors.background
                            }}
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
                      className="inline-flex items-center gap-2 px-4 py-2 font-medium rounded-xl transition-colors text-sm"
                      style={{ 
                        border: `1px solid ${colors.border}`,
                        color: colors.secondaryText,
                        backgroundColor: 'transparent'
                      }}
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh Conversations
                    </button>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div 
                  className="w-[320px] min-h-[1000px] overflow-y-auto p-6"
                  style={{ 
                    backgroundColor: colors.background,
                    borderLeft: `1px solid ${colors.border}`,
                    borderRight: `1px solid ${colors.border}`
                  }}
                >
                  {/* Activity Stats */}
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.primaryText }}>
                      <Activity className="w-5 h-5" style={{ color: colors.secondary }} />
                      Your Activity
                    </h2>
                    
                    <div className="space-y-4">
                      <div 
                        className="rounded-xl p-4"
                        style={{ 
                          background: `linear-gradient(to right, ${colors.secondary}10, rgba(236, 72, 153, 0.1))`
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ background: `linear-gradient(to right, ${colors.secondary}, #a855f7)` }}
                            >
                              <MessageCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm" style={{ color: colors.secondaryText }}>Total Messages</p>
                              <p className="text-2xl font-bold" style={{ color: colors.primaryText }}>{stats.totalMessages}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div 
                          className="rounded-xl p-4"
                          style={{ 
                            background: 'linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1))'
                          }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4" style={{ color: '#3b82f6' }} />
                            <p className="text-xs" style={{ color: colors.secondaryText }}>Active Chats</p>
                          </div>
                          <p className="text-xl font-bold" style={{ color: colors.primaryText }}>{stats.activeChats}</p>
                        </div>

                        <div 
                          className="rounded-xl p-4"
                          style={{ 
                            background: 'linear-gradient(to right, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))'
                          }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="w-4 h-4" style={{ color: colors.success }} />
                            <p className="text-xs" style={{ color: colors.secondaryText }}>Credits Used</p>
                          </div>
                          <p className="text-xl font-bold" style={{ color: colors.primaryText }}>{stats.creditsSpent}</p>
                        </div>
                      </div>

                      <div 
                        className="rounded-xl p-4"
                        style={{ 
                          background: 'linear-gradient(to right, rgba(251, 191, 36, 0.1), rgba(249, 115, 22, 0.1))'
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" style={{ color: colors.warning }} />
                            <p className="text-sm font-medium" style={{ color: colors.primaryText }}>Response Time</p>
                          </div>
                          <span className="text-xs font-bold" style={{ color: colors.warning }}>
                            {stats.averageResponseTime}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs" style={{ color: colors.tertiaryText }}>
                          <span>Avg. response</span>
                          <span>Fast ⚡</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="mb-8">
                    <h3 className="font-bold mb-3" style={{ color: colors.primaryText }}>Quick Stats</h3>
                    <div className="space-y-3">
                      <div 
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{ backgroundColor: colors.panelBackground }}
                      >
                        <div className="flex items-center gap-2">
                          <Clock4 className="w-4 h-4" style={{ color: colors.tertiaryText }} />
                          <span className="text-sm" style={{ color: colors.secondaryText }}>Longest Chat</span>
                        </div>
                        <span className="font-medium" style={{ color: colors.primaryText }}>
                          {stats.longestConversation}
                        </span>
                      </div>
                      <div 
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{ backgroundColor: colors.panelBackground }}
                      >
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4" style={{ color: colors.tertiaryText }} />
                          <span className="text-sm" style={{ color: colors.secondaryText }}>Most Active</span>
                        </div>
                        <span className="font-medium" style={{ color: colors.primaryText }}>
                          {stats.mostActiveHour}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mb-8">
                    <h3 className="font-bold mb-3" style={{ color: colors.primaryText }}>Quick Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={goToDiscoverPage}
                        className="w-full py-3 font-medium rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                        style={{ 
                          background: `linear-gradient(to right, ${colors.secondary}, ${colors.primary})`,
                          color: 'white'
                        }}
                      >
                        <Users className="w-4 h-4" />
                        Discover More People
                      </button>
                      <button
                        onClick={handleBuyCredits}
                        className="w-full py-3 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                        style={{ 
                          border: `1px solid ${colors.secondary}`,
                          color: colors.secondary,
                          backgroundColor: 'transparent'
                        }}
                      >
                        <Zap className="w-4 h-4" />
                        Buy Credits
                      </button>
                    </div>
                  </div>

                  {/* Tips & Tricks */}
                  <div 
                    className="rounded-xl p-4 border"
                    style={{ 
                      background: `linear-gradient(to right, ${colors.panelBackground}, ${colors.inputBackground})`,
                      borderColor: colors.border
                    }}
                  >
                    <h3 className="font-bold mb-2 flex items-center gap-2" style={{ color: colors.primaryText }}>
                      <Sparkles className="w-4 h-4" style={{ color: colors.warning }} />
                      Pro Tip
                    </h3>
                    <p className="text-sm mb-3" style={{ color: colors.secondaryText }}>
                      Send messages during peak hours (6 PM - 10 PM) for faster responses!
                    </p>
                    <div className="flex items-center justify-between text-xs" style={{ color: colors.tertiaryText }}>
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
        <div 
          className="px-4 py-3 backdrop-blur-sm"
          style={{ 
            backgroundColor: `${colors.background}95`,
            borderBottom: `1px solid ${colors.border}`
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-sm" style={{ color: colors.primaryText }}>TabooTalks</h1>
                <p className="text-xs" style={{ color: colors.secondaryText }}>
                  <span className="font-semibold" style={{ color: colors.secondary }}>
                    {currentUser?.credits || 0}
                  </span> credits
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={goToDiscoverPage}
                className="p-2 text-white rounded-lg transition-colors"
                style={{ backgroundColor: colors.secondary }}
              >
                <Plus className="w-5 h-5" />
              </button>
              <button 
                className="p-2 rounded-lg transition-colors"
                style={{ 
                  color: colors.secondaryText,
                  backgroundColor: 'transparent'
                }}
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-auto" style={{ backgroundColor: colors.background }}>
          {/* Error Message */}
          {error && (
            <div className="mx-4 mt-4">
              <div 
                className="px-4 py-3 rounded-xl flex items-center justify-between"
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid rgba(239, 68, 68, 0.2)`,
                  color: colors.danger
                }}
              >
                <span className="text-sm">{error}</span>
                <button 
                  onClick={() => setError('')}
                  className="hover:opacity-70"
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
                  
                  return (
                    <div
                      key={conv.$id}
                      className="relative"
                      style={{ transform: `translateX(-${offset}px)` }}
                    >
                      {/* iPhone-style Delete Red Background */}
                      <div 
                        className="absolute right-0 top-0 bottom-0 flex items-center justify-center transition-all duration-200"
                        style={{ 
                          width: `${Math.min(offset, 80)}px`,
                          backgroundColor: colors.danger,
                          opacity: offset > 20 ? 0.95 : 0
                        }}
                      >
                        {offset > 40 && (
                          <div className="flex flex-col items-center">
                            <Trash2 className="w-5 h-5 text-white mb-1" />
                            <span className="text-xs text-white font-medium">Delete</span>
                          </div>
                        )}
                      </div>

                      {/* Chat Item */}
                      <div
                        className="rounded-xl border overflow-hidden"
                        style={{ 
                          backgroundColor: colors.cardBackground,
                          borderColor: colors.border
                        }}
                        onTouchStart={(e) => handleSwipeStart(e, conv.$id)}
                        onTouchMove={(e) => handleSwipeMove(e, conv.$id)}
                        onTouchEnd={() => handleSwipeEnd(conv.$id)}
                      >
                        <Link
                          href={`/main/chats/${conv.$id}`}
                          className="block p-4 transition-all"
                          style={{ backgroundColor: colors.hoverBackground }}
                          onClick={(e) => {
                            if (offset > 10) {
                              e.preventDefault();
                              resetSwipe(conv.$id);
                            }
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div 
                                className="w-14 h-14 rounded-full overflow-hidden shadow-md"
                                style={{ border: `2px solid ${colors.background}` }}
                              >
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
                                <div 
                                  className="absolute bottom-0 right-0 w-3 h-3 rounded-full"
                                  style={{ 
                                    backgroundColor: colors.success,
                                    border: `2px solid ${colors.background}`
                                  }}
                                ></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1">
                                  <h3 className="font-bold text-sm truncate" style={{ color: colors.primaryText }}>
                                    {conv.bot?.username}
                                  </h3>
                                  {conv.bot?.isVerified && (
                                    <CheckCircle className="w-3 h-3 text-blue-500 fill-blue-100" />
                                  )}
                                </div>
                                <span className="text-xs" style={{ color: colors.tertiaryText }}>
                                  {formatTime(conv.lastMessageAt)}
                                </span>
                              </div>
                              <p className="text-xs truncate mb-1" style={{ color: colors.secondaryText }}>
                                {conv.lastMessage || 'Start a conversation...'}
                              </p>
                              <div className="flex items-center justify-between">
                                {conv.bot?.location && (
                                  <span className="text-xs flex items-center gap-1" style={{ color: colors.tertiaryText }}>
                                    <MapPin className="w-3 h-3" />
                                    {conv.bot.location}
                                  </span>
                                )}
                                {conv.messageCount > 0 && (
                                  <span 
                                    className="text-xs px-2 py-1 rounded-full min-w-[50px] text-center"
                                    style={{ 
                                      backgroundColor: `${colors.secondary}10`,
                                      color: colors.secondary
                                    }}
                                  >
                                    {conv.messageCount} msg{conv.messageCount !== 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Mobile Delete Button (Small Icon) */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowDeleteModal(conv.$id);
                              }}
                              className="p-2 rounded-full transition-colors"
                              style={{ color: colors.secondaryText }}
                              title="Delete chat"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Credit Warning Banner Mobile */}
              {currentUser && currentUser.credits < 10 && (
                <div className="mt-6">
                  <div 
                    className="rounded-xl p-4"
                    style={{ 
                      background: 'linear-gradient(to right, rgba(251, 191, 36, 0.1), rgba(249, 115, 22, 0.1))',
                      border: `1px solid rgba(251, 191, 36, 0.2)`
                    }}
                  >
                    <div className="flex flex-col items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)' }}
                        >
                          <Crown className="w-6 h-6" style={{ color: colors.warning }} />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm" style={{ color: colors.primaryText }}>
                            ⚠️ Low Credits!
                          </h4>
                          <p className="text-xs mt-1" style={{ color: colors.secondaryText }}>
                            {currentUser.credits} credits left
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleBuyCredits}
                        className="w-full px-4 py-2 font-bold rounded-xl transition-colors text-sm"
                        style={{ 
                          backgroundColor: colors.primaryText,
                          color: colors.background
                        }}
                      >
                        💎 Get Credits
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Stats */}
              <div className="mt-6">
                <h3 className="font-bold mb-3" style={{ color: colors.primaryText }}>Your Activity</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    className="rounded-xl p-4"
                    style={{ 
                      background: `linear-gradient(to right, ${colors.secondary}10, rgba(236, 72, 153, 0.1))`
                    }}
                  >
                    <p className="text-xs" style={{ color: colors.secondaryText }}>Total Messages</p>
                    <p className="text-xl font-bold" style={{ color: colors.primaryText }}>{stats.totalMessages}</p>
                  </div>
                  <div 
                    className="rounded-xl p-4"
                    style={{ 
                      background: 'linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1))'
                    }}
                  >
                    <p className="text-xs" style={{ color: colors.secondaryText }}>Active Chats</p>
                    <p className="text-xl font-bold" style={{ color: colors.primaryText }}>{stats.activeChats}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* No Conversations Mobile */
            <div className="p-4">
              <div className="text-center">
                <div 
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.secondary}10, rgba(236, 72, 153, 0.1))`
                  }}
                >
                  <MessageCircle className="w-10 h-10" style={{ color: colors.secondary }} />
                </div>
                <h1 className="text-xl font-bold mb-2" style={{ color: colors.primaryText }}>Welcome to TabooTalks</h1>
                <p className="text-sm mb-6" style={{ color: colors.secondaryText }}>
                  Connect with interesting people from around the world.
                </p>
                
                <div className="flex flex-col gap-2">
                  <button
                    onClick={goToDiscoverPage}
                    className="px-6 py-3 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                    style={{ 
                      backgroundColor: colors.secondary,
                      color: 'white'
                    }}
                  >
                    <Users className="w-5 h-5" />
                    Discover People
                  </button>
                  <button
                    onClick={handleBuyCredits}
                    className="px-6 py-3 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                    style={{ 
                      background: 'linear-gradient(to right, #f59e0b, #f97316)',
                      color: 'white'
                    }}
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