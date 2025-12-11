/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/main/chats/[id]/page.tsx - FIXED VERSION (NO RELOADS)
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { 
  Send, ChevronLeft, Search, CheckCircle, CheckCheck, 
  Image as ImageIcon, Gift, Mail, Smile, Phone, Video,
  MoreVertical, UserPlus, Home, Compass, PlusSquare, Users,
  MessageCircleCodeIcon, MapPin, Eye, Camera, Heart, Star,
  Paperclip, Sparkles, Clock, XCircle, Filter, X
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCredits } from '@/lib/hooks/useCredits';
import { conversationService, Conversation, ChatMessage } from '@/lib/services/conversationService';
import { ParsedPersonaProfile } from '@/lib/services/personaService';
import LayoutController from '@/components/layout/LayoutController';
import { useChatStore } from '@/store/chatStore'; 
import { useChat } from '@/lib/hooks/useChat';

// Chat Bubble Component - UPDATED with optimistic handling AND PERSONA PROFILE
const ChatBubble = ({ message, isOwn, time, isRead, senderName, isOptimistic, profilePic }: any) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isOwn && profilePic && (
        <div className="flex-shrink-0 mr-2 self-end">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
            <Image
              src={profilePic}
              alt={senderName}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      <div className={`max-w-[70%] ${isOwn ? 'ml-auto' : 'mr-auto'}`}>
        {!isOwn && (
          <div className="text-xs text-gray-500 mb-1 font-medium flex items-center gap-2">
            {!profilePic && (
              <div className="w-4 h-4 rounded-full bg-gray-200"></div>
            )}
            {senderName}
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isOwn
              ? 'bg-gradient-to-r from-[#5e17eb] to-[#8a4bff] text-white rounded-br-none shadow-md'
              : 'bg-gray-100 text-gray-900 rounded-bl-none shadow-sm'
          } ${isOptimistic ? 'opacity-80' : ''}`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message}</p>
          <div className={`text-xs mt-2 flex items-center ${isOwn ? 'text-purple-200 justify-end' : 'text-gray-500 justify-start'}`}>
            <span className="flex items-center gap-1">
              {time}
              {isOptimistic && <span className="ml-1 text-xs opacity-70">Sending...</span>}
              {!isOptimistic && isOwn && isRead && (
                <CheckCheck className="w-3 h-3 ml-1" />
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreditsModal = ({ onClose, onBuyCredits }: any) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        
        {/* Modal Header with Money Bag SVG */}
        <div className="relative pt-10 pb-6 px-8 text-center bg-gradient-to-b from-amber-50 via-yellow-50 to-white">
          {/* Money bag from assets/money.svg */}
          <div className="w-24 h-24 mx-auto mb-4">
            <img src="/assets/coins.svg" alt="Money bag" className="w-full h-full drop-shadow-xl animate-bounce" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Don&apos;t Lose Your Connection!</h2>
          <p className="text-gray-600">Credits are low. Top up to continue</p>
          <p className="text-gray-600 font-medium">chatting 😊
        
          </p>
         
        </div>
        
        {/* Modal Content */}
        <div className="px-8 pb-8">
          
          {/* Action Button */}
          <button
            onClick={onBuyCredits}
            className="w-full py-4 bg-gradient-to-r from-[#ff2e2e] to-[#ff5e5e] text-white rounded-xl font-bold text-lg hover:from-[#e62525] hover:to-[#ff4a4a] hover:scale-105 transition-all shadow-lg hover:shadow-xl mb-4"
          >
            Get Credits Now
          </button>
          
          {/* Credits Info */}
          <div className="text-center bg-purple-50 rounded-lg p-3 border border-purple-200">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-700">1 credits per message</span> • 
              <span className="text-[#5e17eb] font-bold"> 50% bonus</span> on first purchase
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { profile: userProfile, loading: authLoading } = useAuth();
  const { credits: userCredits, isLoading: creditsLoading, refreshCredits } = useCredits();
  
  const activeBotId = params.id as string;
  
  // Use global store instead of useState
  const { 
    conversations, 
    messagesByBot, 
    botProfiles,
    setConversations,
    setMessages,
    addMessage,
    updateBotProfile
  } = useChatStore();
  
  // Use chat hook for message handling
  const { 
    isTyping,
    sending,
    sendMessage: chatSendMessage 
  } = useChat(activeBotId, userProfile?.userId || '');
  
  // Local state only for UI
  const [messageInput, setMessageInput] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active'>('all');
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  
  // Memoize active data
  const activeBot = useMemo(() => botProfiles[activeBotId], [botProfiles, activeBotId]);
  const activeMessages = useMemo(() => messagesByBot[activeBotId] || [], [messagesByBot, activeBotId]);
  const activeConversation = useMemo(() => 
    conversations.find(c => c.botProfileId === activeBotId), 
    [conversations, activeBotId]
  );

  // SHOW CREDITS MODAL WHEN CREDITS REACH ZERO
  useEffect(() => {
    if (userCredits !== null && userCredits <= 0) {
      setShowCreditsModal(true);
    } else {
      setShowCreditsModal(false);
    }
  }, [userCredits]);

  useEffect(() => {
    if (userProfile?.userId && conversations.length === 0) {
      loadConversations();
    }
  }, [userProfile?.userId]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, isTyping]); // Added isTyping to trigger scroll when typing starts

  // Load conversations with caching - FIXED
  const loadConversations = useCallback(async () => {
    if (!userProfile?.userId) return;
    
    try {
      // CHANGE: Remove true parameter - use cache!
      const { conversations: convos, botProfiles: profiles } = 
        await conversationService.getCachedUserConversations(userProfile.userId);
      
      // Set state in store
      setConversations(convos);
      
      // Update bot profiles
      Object.entries(profiles).forEach(([id, profile]) => {
        updateBotProfile(id, profile);
      });
      
      // Auto-redirect logic - NO RELOAD
      if (activeBotId === 'empty' && convos.length > 0) {
        const firstBotId = convos[0].botProfileId;
        router.replace(`/main/chats/${firstBotId}`, { scroll: false });
      }
      
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  }, [userProfile?.userId, activeBotId, router, setConversations, updateBotProfile]);

  // Send message - FIXED WITH OPTIMISTIC UPDATES
  const handleSendMessage = useCallback(async () => {
    if (!messageInput.trim() || !userProfile?.userId || sending || !userCredits || userCredits <= 0) return;
    
    const userMessage = messageInput.trim();
    setMessageInput('');
    
    try {
      // This handles everything - NO MANUAL RELOADS
      await chatSendMessage(userMessage);
      
      // Silently refresh credits in background
      refreshCredits();
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      alert('Error: ' + (error.message || 'Failed to send message'));
    }
  }, [messageInput, userProfile, sending, userCredits, chatSendMessage, refreshCredits]);

  // Switch conversation - INSTANT (NO RELOAD)
  const switchChat = useCallback((botId: string) => {
    // Use shallow routing - changes URL without page reload
    router.push(`/main/chats/${botId}`, { scroll: false });
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  }, [router]);

  // Format time
  const formatTime = useCallback((timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Now';
    }
  }, []);

  // Format date for conversation list
  const formatDate = useCallback((timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 60) {
        return `${diffMins}m ago`;
      } else if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else if (diffDays < 7) {
        return `${diffDays}d ago`;
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    } catch {
      return 'Now';
    }
  }, []);

  // Emoji handler
  const handleEmojiClick = (emojiObject: any) => {
    setMessageInput(prev => prev + emojiObject.emoji);
  };

  // Handle buy credits
  const handleBuyCredits = () => {
    setShowCreditsModal(false);
    router.push('/main/credits');
  };

  // Handle send photo - FIXED
  const handleSendPhoto = useCallback(async () => {
    if (userCredits < 10) {
      setShowCreditsModal(true);
      return;
    }
    
    const photoMessage = '📷 [Photo sent]';
    setMessageInput(photoMessage);
    
    // Use the same send function for consistency
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  }, [userCredits, handleSendMessage]);

  // Handle send gift - FIXED
  const handleSendGift = useCallback(async () => {
    if (userCredits < 15) {
      setShowCreditsModal(true);
      return;
    }
    
    const giftMessage = '🎁 [Gift sent]';
    setMessageInput(giftMessage);
    
    // Use the same send function for consistency
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  }, [userCredits, handleSendMessage]);

  // Handle send virtual kiss - FIXED
  const handleSendKiss = useCallback(async () => {
    if (userCredits < 5) {
      setShowCreditsModal(true);
      return;
    }
    
    const kissMessage = '😘 [Virtual kiss sent]';
    setMessageInput(kissMessage);
    
    // Use the same send function for consistency
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  }, [userCredits, handleSendMessage]);

  // Filter chats
  const filteredChats = useMemo(() => {
    return conversations.filter(chat => {
      const botProfile = chat.botProfile || botProfiles[chat.botProfileId];
      const matchesSearch = botProfile?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeTab === 'active') {
        return matchesSearch && chat.isActive;
      }
      
      return matchesSearch;
    });
  }, [conversations, botProfiles, searchQuery, activeTab]);

  // Handle key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  if (authLoading || creditsLoading) {
    return (
      <div className="min-h-screen bg-white">
        <LayoutController />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#5e17eb] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading chat...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <LayoutController />
      
      {/* CREDITS MODAL - Shows when credits are zero */}
      {showCreditsModal && (
        <CreditsModal 
          onClose={() => setShowCreditsModal(false)}
          onBuyCredits={handleBuyCredits}
        />
      )}
      
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-[calc(100vh-64px)] w-full justify-center">
        <div className="w-full max-w-[1400px] mx-auto flex h-full">
          
          {/* Left Sidebar - Chat List */}
          <div className="w-[400px] flex-shrink-0 border-r border-gray-200 h-full overflow-hidden flex flex-col bg-white">
            {/* Fixed Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              {/* Top Bar with Credits */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#5e17eb]">{userCredits}</span>
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
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'all'
                      ? 'bg-gradient-to-r from-[#5e17eb] to-[#8a4bff] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Chats
                </button>
                <button
                  onClick={() => setActiveTab('active')}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all relative ${
                    activeTab === 'active'
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
                    <MessageCircleCodeIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
                  <p className="text-gray-600 mb-4">Start chatting with someone!</p>
                  <button
                    onClick={() => router.push('/main')}
                    className="px-4 py-2 bg-gradient-to-r from-[#5e17eb] to-[#8a4bff] text-white rounded-lg hover:from-[#4a13c4] hover:to-[#7238ff] shadow-sm"
                  >
                    Discover People
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredChats.map(conv => {
                    const botProfile = conv.botProfile || botProfiles[conv.botProfileId];
                    const isActive = conv.botProfileId === activeBotId;
                    const hasMessages = messagesByBot[conv.botProfileId]?.length > 0;
                    
                    return (
                      <div
                        key={conv.botProfileId}
                        onClick={() => switchChat(conv.botProfileId)}
                        className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-all ${
                          isActive ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-[#5e17eb]' : ''
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
                              {formatDate(conv.lastMessageAt)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">
                              {conv.lastMessage || 'Start a conversation...'}
                            </p>
                            {hasMessages && messagesByBot[conv.botProfileId]?.length > 0 && (
                              <span className="text-xs font-medium text-[#5e17eb] bg-purple-100 px-2 py-0.5 rounded-full">
                                {messagesByBot[conv.botProfileId]?.length}
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
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col border-r border-gray-200">
            {activeBot ? (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                          {activeBot.profilePic ? (
                            <Image
                              src={activeBot.profilePic}
                              alt={activeBot.username}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                              <UserPlus className="w-8 h-8 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500"></div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-lg">{activeBot.username}, {activeBot.age}</h3>
                          {activeBot.isVerified && (
                            <div className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                              <CheckCircle className="w-3 h-3" />
                              Verified
                            </div>
                          )}
                          {activeConversation?.isActive && (
                            <div className="flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              Online
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{activeBot.location}</span>
                          {activeBot.interests && activeBot.interests.length > 0 && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span>{activeBot.interests.slice(0, 2).join(', ')}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-[#5e17eb]">
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-[#5e17eb]">
                        <Video className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-[#5e17eb]">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
                  {activeMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                        <MessageCircleCodeIcon className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Start Chatting!</h3>
                      <p className="text-gray-600 mb-6 max-w-md text-center">
                        Say hello to {activeBot.username} and start your conversation.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setMessageInput('👋 Hello!');
                            setTimeout(handleSendMessage, 100);
                          }}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          👋 Say Hello
                        </button>
                        <button
                          onClick={() => {
                            setMessageInput('Hi there! How are you?');
                            setTimeout(handleSendMessage, 100);
                          }}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          💬 Start Chat
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 max-w-3xl mx-auto">
                      {activeMessages.map((message) => (
                        <ChatBubble
                          key={message.id}
                          message={message.content}
                          isOwn={message.role === 'user'}
                          time={formatTime(message.timestamp)}
                          isRead={true}
                          senderName={message.role === 'user' ? 'You' : activeBot.username}
                          isOptimistic={message.isOptimistic}
                          profilePic={message.role === 'user' ? undefined : activeBot.profilePic}
                        />
                      ))}
                      
                      {/* TYPING INDICATOR - Shows when AI is replying */}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                              {activeBot.profilePic ? (
                                <Image
                                  src={activeBot.profilePic}
                                  alt={activeBot.username}
                                  width={32}
                                  height={32}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                                  <UserPlus className="w-4 h-4 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3">
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Credit Cost Info */}
                <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">2 cr/min</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      <span className="font-medium">10 cr</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      <span className="font-medium">15 cr</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-500" />
                      <span className="font-medium">5 cr</span>
                    </span>
                    <button 
                      onClick={handleBuyCredits}
                      className="text-[#5e17eb] font-medium hover:underline"
                    >
                      Get More Credits
                    </button>
                  </div>
                </div>

                {/* Chat Input Area */}
                <div className="bg-white border-t border-gray-200 p-4">
                  {showEmojiPicker && (
                    <div className="absolute bottom-20 left-0 right-0 z-50">
                      <div className="max-w-md mx-auto">
                        <EmojiPicker
                          onEmojiClick={handleEmojiClick}
                          width="100%"
                          height={350}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                        showEmojiPicker 
                          ? 'bg-gradient-to-r from-[#5e17eb] to-[#8a4bff] text-white shadow-sm' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Smile className="w-4 h-4" />
                      <span className="text-xs">Stickers</span>
                    </button>
                    <button
                      onClick={handleSendPhoto}
                      disabled={userCredits < 10}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                        userCredits < 10
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-xs">Photo</span>
                    </button>
                    <button
                      onClick={handleSendGift}
                      disabled={userCredits < 15}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                        userCredits < 15
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Gift className="w-4 h-4" />
                      <span className="text-xs">Gifts</span>
                    </button>
                    <button
                      onClick={handleSendKiss}
                      disabled={userCredits < 5}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                        userCredits < 5
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Heart className="w-4 h-4" />
                      <span className="text-xs">Kiss</span>
                    </button>
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={`Message ${activeBot.username}...`}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5e17eb]/20 focus:border-[#5e17eb] transition-all text-gray-900 placeholder-gray-500"
                        disabled={sending || !userCredits || userCredits <= 0}
                      />
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#5e17eb]"
                      >
                        <Smile className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || sending || !userCredits || userCredits <= 0}
                      className={`p-3 rounded-full transition-all ${
                        !messageInput.trim() || sending || !userCredits || userCredits <= 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#5e17eb] to-[#8a4bff] text-white hover:from-[#4a13c4] hover:to-[#7238ff] shadow-sm'
                      }`}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : activeBotId === 'empty' ? (
              // Empty state
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                  <MessageCircleCodeIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Select a Chat</h3>
                <p className="text-gray-600 mb-6 max-w-md text-center">
                  Choose a conversation from the sidebar to start chatting.
                </p>
                <button
                  onClick={() => router.push('/main')}
                  className="py-3 px-6 bg-gradient-to-r from-[#5e17eb] to-[#8a4bff] text-white rounded-lg font-medium hover:from-[#4a13c4] hover:to-[#7238ff] transition-all shadow-sm"
                >
                  Discover People
                </button>
              </div>
            ) : (
              // Loading state
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-3 border-[#5e17eb] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading conversation...</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-[320px] flex-shrink-0 border-l border-gray-200 h-full overflow-y-auto bg-white">
            <div className="p-6">
              {activeBot ? (
                <>
                  {/* Profile Details */}
                  <div className="text-center mb-6">
                    <div className="relative mx-auto w-24 h-24 mb-4">
                      <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                        {activeBot.profilePic ? (
                          <Image
                            src={activeBot.profilePic}
                            alt={activeBot.username}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                            <UserPlus className="w-12 h-12 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white bg-green-500"></div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{activeBot.username}, {activeBot.age}</h3>
                    <p className="text-gray-600">{activeBot.location}</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Active now
                      </span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-3 mb-6">
                    <button 
                      onClick={() => router.push(`/main/profile/${activeBotId}`)}
                      className="w-full py-3 bg-gradient-to-r from-[#5e17eb] to-[#8a4bff] text-white rounded-lg font-medium hover:from-[#4a13c4] hover:to-[#7238ff] transition-all shadow-sm"
                    >
                      View Full Profile
                    </button>
                    <button 
                      onClick={handleSendGift}
                      disabled={userCredits < 15}
                      className={`w-full py-3 rounded-lg font-medium transition-all ${
                        userCredits < 15
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-[#5e17eb] text-[#5e17eb] hover:bg-purple-50'
                      }`}
                    >
                      Send Virtual Gift (15 cr)
                    </button>
                  </div>

                  {/* Chat Stats */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-6 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Chat Statistics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Messages:</span>
                        <span className="font-bold text-blue-700 text-lg">{activeMessages.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Your messages:</span>
                        <span className="font-bold text-blue-700 text-lg">{activeMessages.filter(m => m.role === 'user').length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Credits spent:</span>
                        <span className="font-bold text-[#ff2e2e] text-lg">
                          {activeMessages.filter(m => m.role === 'user').length}
                        </span>
                      </div>
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Chat duration:</span>
                          <span className="font-medium text-gray-900">
                            {activeMessages.length > 0 ? 'Ongoing' : 'New'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}

              {/* Fixed Cards Area */}
              <div className="space-y-4">
                {/* Get More Credits Card */}
                <div className="bg-gradient-to-r from-[#5e17eb] to-[#ff2e2e] rounded-xl p-4 text-white shadow-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-lg mb-1">Get More Credits</h4>
                      <p className="text-sm opacity-90">Chat without limits</p>
                    </div>
                    <Sparkles className="w-6 h-6 opacity-80" />
                  </div>
                  <button
                    onClick={handleBuyCredits}
                    className="w-full py-3 bg-white text-[#5e17eb] rounded-lg font-bold hover:bg-gray-100 transition-all mt-2"
                  >
                    Buy Now
                  </button>
                </div>

                {/* My Activity Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-3">My Activity</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <div className="text-2xl font-bold text-[#5e17eb]">{conversations.length}</div>
                      <div className="text-xs text-gray-600 font-medium">Chats</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                      <div className="text-2xl font-bold text-[#5e17eb]">{conversations.filter(c => c.isActive).length}</div>
                      <div className="text-xs text-gray-600 font-medium">Active</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Credits left:</span>
                      <span className="font-bold text-[#5e17eb]">{userCredits}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-[calc(100vh-64px)]">
        {!showSidebar && activeBot ? (
          /* Mobile Chat View */
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSidebar(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                      {activeBot.profilePic ? (
                        <Image
                          src={activeBot.profilePic}
                          alt={activeBot.username}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                          <UserPlus className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500"></div>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">{activeBot.username}</h2>
                    <p className="text-sm text-gray-500">
                      Online now
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
              {activeMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                    <MessageCircleCodeIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Start chatting!</h3>
                  <p className="text-gray-600 text-center mb-4">
                    Say hello to {activeBot.username}
                  </p>
                  <button
                    onClick={() => {
                      setMessageInput('👋 Hello!');
                      setTimeout(handleSendMessage, 100);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-[#5e17eb] to-[#8a4bff] text-white rounded-lg font-medium"
                  >
                    👋 Say Hello
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} ${message.role !== 'user' ? 'items-end' : ''}`}
                    >
                      {message.role !== 'user' && activeBot.profilePic && (
                        <div className="flex-shrink-0 mr-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                            <Image
                              src={activeBot.profilePic}
                              alt={activeBot.username}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                      <div 
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          message.role === 'user' 
                            ? 'bg-gradient-to-r from-[#5e17eb] to-[#8a4bff] text-white rounded-br-none' 
                            : 'bg-gray-100 text-gray-900 rounded-bl-none'
                        } ${message.isOptimistic ? 'opacity-80' : ''}`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                        <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-purple-200' : 'text-gray-500'}`}>
                          {formatTime(message.timestamp)}
                          {message.isOptimistic && <span className="ml-1 text-xs opacity-70">Sending...</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* TYPING INDICATOR FOR MOBILE */}
                  {isTyping && (
                    <div className="flex justify-start items-end">
                      <div className="flex-shrink-0 mr-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                          {activeBot.profilePic ? (
                            <Image
                              src={activeBot.profilePic}
                              alt={activeBot.username}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                              <UserPlus className="w-4 h-4 text-gray-500" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-3">
              {showEmojiPicker && (
                <div className="absolute bottom-16 left-0 right-0 z-50">
                  <div className="mx-4">
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      width="100%"
                      height={300}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message ${activeBot.username}...`}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-900 placeholder-gray-500"
                    disabled={!activeBot || sending || !userCredits || userCredits <= 0}
                  />
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || !activeBot || sending || !userCredits || userCredits <= 0}
                  className={`p-3 rounded-full ${
                    !messageInput.trim() || !activeBot || sending || !userCredits || userCredits <= 0
                      ? 'bg-gray-300 text-gray-500'
                      : 'bg-gradient-to-r from-[#5e17eb] to-[#8a4bff] text-white'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Mobile Chat List */
          <div className="flex-1 overflow-hidden bg-white">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#5e17eb] text-lg">{userCredits}</span>
                  <button 
                    onClick={handleBuyCredits}
                    className="px-3 py-1 bg-gradient-to-r from-[#5e17eb] to-[#8a4bff] text-white text-sm rounded-lg"
                  >
                    Add
                  </button>
                </div>
                <button 
                  onClick={() => router.push('/main')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Home className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900"
                />
              </div>
              
              {/* Tabs */}
              <div className="flex space-x-1 mb-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium ${
                    activeTab === 'all'
                      ? 'bg-gradient-to-r from-[#5e17eb] to-[#8a4bff] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab('active')}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium ${
                    activeTab === 'active'
                      ? 'bg-gradient-to-r from-[#5e17eb] to-[#8a4bff] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Active
                </button>
              </div>
            </div>

            {/* Chat List */}
            <div className="overflow-y-auto h-[calc(100%-140px)]">
              {filteredChats.map(conv => {
                const botProfile = conv.botProfile || botProfiles[conv.botProfileId];
                
                return (
                  <div
                    key={conv.botProfileId}
                    onClick={() => {
                      switchChat(conv.botProfileId);
                      setShowSidebar(false);
                    }}
                    className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                          {botProfile?.profilePic ? (
                            <Image
                              src={botProfile.profilePic}
                              alt={botProfile.username || 'Bot'}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
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
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1">
                            <h4 className="font-medium text-gray-900">{botProfile?.username}</h4>
                            {botProfile?.isVerified && (
                              <CheckCircle className="w-3 h-3 text-blue-500" />
                            )}
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(conv.lastMessageAt)}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                        {botProfile?.location && (
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{botProfile.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}