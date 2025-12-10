/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Search, MoreVertical, Phone, Video, UserPlus, Filter, ChevronLeft, CheckCircle, XCircle, Clock, CheckCheck, Image as ImageIcon, Gift, Mail, Send, Smile, Paperclip, Home, Compass, PlusSquare, Users, MessageCircleCodeIcon } from 'lucide-react';
import Image from 'next/image';
import LayoutController from '@/components/layout/LayoutController';
import ChatBubble from '@/components/features/chat/ChatBubble';
import ChatInput from '@/components/features/chat/ChatInput';
import ChatList from '@/components/features/chat/ChatList';
import EmojiPicker from 'emoji-picker-react';

// Mock data for chat conversations
const mockChats = [
  {
    id: '1',
    userId: 101,
    username: 'Sophie',
    age: 28,
    location: 'Berlin, Germany',
    profileImage: 'https://images.unsplash.com/photo-1456885284447-7dd4bb8720bf?q=80&w=687&fit=crop',
    lastMessage: 'If I send you a picture of me smiling, what would you send me?',
    lastMessageTime: '11:45 AM',
    unreadCount: 2,
    isOnline: true,
    isVerified: true,
    isActive: true,
    messages: [
      { id: '1', sender: 'Sophie', text: 'Hello there! How are you doing today?', time: '11:30 AM', isRead: true },
      { id: '2', sender: 'user', text: 'I\'m doing great, thanks for asking! 😊 How about you?', time: '11:32 AM', isRead: true },
      { id: '3', sender: 'Sophie', text: 'Just enjoying this beautiful weather ☀️ Want to chat?', time: '11:35 AM', isRead: true },
      { id: '4', sender: 'Sophie', text: 'If I send you a picture of me smiling, what would you send me?', time: '11:45 AM', isRead: false },
    ]
  },
  {
    id: '2',
    userId: 102,
    username: 'Emma',
    age: 32,
    location: 'Munich, Germany',
    profileImage: 'https://images.unsplash.com/photo-1522765312985-2a1e2bce9ad7?q=80&w=687&fit=crop',
    lastMessage: 'That dress suits me, I hope?',
    lastMessageTime: '4:25 AM',
    unreadCount: 0,
    isOnline: true,
    isVerified: true,
    isActive: true,
    messages: [
      { id: '1', sender: 'Emma', text: 'Hey! I saw your profile and wanted to say hi 😊', time: '4:20 AM', isRead: true },
      { id: '2', sender: 'user', text: 'Hi Emma! Thanks for reaching out 😊', time: '4:22 AM', isRead: true },
      { id: '3', sender: 'Emma', text: 'That dress suits me, I hope? 👗', time: '4:25 AM', isRead: true },
    ]
  },
  {
    id: '3',
    userId: 103,
    username: 'Marina',
    age: 26,
    location: 'Hamburg, Germany',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=800&fit=crop',
    lastMessage: 'My friends say I\'m strong... but strength comes in many forms 💪',
    lastMessageTime: 'Dec 3',
    unreadCount: 1,
    isOnline: false,
    isVerified: false,
    isActive: true,
    messages: [
      { id: '1', sender: 'Marina', text: 'Hello! Are you new here too?', time: 'Dec 3', isRead: true },
      { id: '2', sender: 'user', text: 'Yes, just joined recently!', time: 'Dec 3', isRead: true },
      { id: '3', sender: 'Marina', text: 'My friends say I\'m strong... but strength comes in many forms 💪', time: 'Dec 3', isRead: false },
    ]
  },
  {
    id: '4',
    userId: 104,
    username: 'Darya',
    age: 30,
    location: 'Frankfurt, Germany',
    profileImage: 'https://images.unsplash.com/photo-1680783147882-1f48af96e349?q=80&w=837&fit=crop',
    lastMessage: 'Poltava gave me roots, America gave me wings 🌎',
    lastMessageTime: 'Dec 3',
    unreadCount: 0,
    isOnline: true,
    isVerified: true,
    isActive: false,
    messages: [
      { id: '1', sender: 'Darya', text: 'Good morning! Ready for the day?', time: 'Dec 3', isRead: true },
      { id: '2', sender: 'Darya', text: 'Poltava gave me roots, America gave me wings 🌎', time: 'Dec 3', isRead: true },
    ]
  },
  {
    id: '5',
    userId: 105,
    username: 'Natalyia',
    age: 29,
    location: 'Cologne, Germany',
    profileImage: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=800&fit=crop',
    lastMessage: 'hi john! how are you? How do you hope your day is going?',
    lastMessageTime: 'Dec 3',
    unreadCount: 3,
    isOnline: false,
    isVerified: true,
    isActive: false,
    messages: [
      { id: '1', sender: 'Natalyia', text: 'hi john! how are you? How do you hope your day is going?', time: 'Dec 3', isRead: false },
    ]
  },
  {
    id: '6',
    userId: 106,
    username: 'Darlia',
    age: 27,
    location: 'Stuttgart, Germany',
    profileImage: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=800&h=800&fit=crop',
    lastMessage: 'The photo isn\'t loud, it\'s intimate. Like, "this is our little secret" 🤫',
    lastMessageTime: 'Dec 3',
    unreadCount: 0,
    isOnline: true,
    isVerified: false,
    isActive: false,
    messages: [
      { id: '1', sender: 'Darlia', text: 'The photo isn\'t loud, it\'s intimate. Like, "this is our little secret" 🤫', time: 'Dec 3', isRead: true },
    ]
  },
  {
    id: '7',
    userId: 107,
    username: 'Daniela',
    age: 31,
    location: 'Berlin, Germany',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=800&fit=crop',
    lastMessage: 'HELLO! 👋',
    lastMessageTime: 'Dec 1',
    unreadCount: 0,
    isOnline: true,
    isVerified: true,
    isActive: false,
    messages: [
      { id: '1', sender: 'Daniela', text: 'HELLO! 👋', time: 'Dec 1', isRead: true },
    ]
  },
];

// Mock requests
const mockRequests = [
  {
    id: 'r1',
    userId: 108,
    username: 'Miled',
    age: 28,
    location: 'Berlin, Germany',
    profileImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&fit=crop',
    requestTime: '2 hours ago',
    message: 'Every day that passes here I feel like I\'m losing the chance to find love. Tell me, do you feel the same way?',
    status: 'pending'
  }
];

export default function ChatsPage() {
  const [chats, setChats] = useState(mockChats);
  const [requests, setRequests] = useState(mockRequests);
  const [activeChat, setActiveChat] = useState(mockChats[0]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'requests'>('all');
  const [userCredits, setUserCredits] = useState(150);
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // Current user data
  const currentUser = {
    name: 'John',
    credits: userCredits
  };

  const filteredChats = chats.filter(chat => {
    if (activeTab === 'requests') return false;
    
    const matchesSearch = chat.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'active') {
      return matchesSearch && chat.isActive;
    }
    
    return matchesSearch;
  });

  const handleOpenChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setActiveChat(chat);
      setIsChatOpen(true);
      
      // Mark messages as read
      setChats(prev => prev.map(c => 
        c.id === chatId ? { ...c, unreadCount: 0, messages: c.messages.map(m => ({ ...m, isRead: true })) } : c
      ));
    }
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim() || userCredits <= 0) return;
    
    const newMessage = {
      id: Date.now().toString(),
      sender: 'user' as const,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };
    
    // Update active chat
    setActiveChat(prev => ({
      ...prev,
      lastMessage: text.length > 30 ? text.substring(0, 30) + '...' : text,
      lastMessageTime: newMessage.time,
      messages: [...prev.messages, newMessage]
    }));
    
    // Update in chats list
    setChats(prev => prev.map(chat => 
      chat.id === activeChat.id 
        ? { 
            ...chat, 
            lastMessage: text.length > 30 ? text.substring(0, 30) + '...' : text,
            lastMessageTime: newMessage.time,
            messages: [...chat.messages, newMessage]
          }
        : chat
    ));
    
    // Deduct credit
    setUserCredits(prev => prev - 1);
    setMessageInput('');
    setIsTyping(false);
    setShowEmojiPicker(false);
    
    // Simulate AI response after delay
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        sender: activeChat.username,
        text: getAIResponse(text),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false
      };
      
      setActiveChat(prev => ({
        ...prev,
        lastMessage: aiResponse.text.length > 30 ? aiResponse.text.substring(0, 30) + '...' : aiResponse.text,
        lastMessageTime: aiResponse.time,
        messages: [...prev.messages, aiResponse]
      }));
      
      setChats(prev => prev.map(chat => 
        chat.id === activeChat.id 
          ? { 
              ...chat, 
              lastMessage: aiResponse.text.length > 30 ? aiResponse.text.substring(0, 30) + '...' : aiResponse.text,
              lastMessageTime: aiResponse.time,
              messages: [...chat.messages, aiResponse],
              unreadCount: chat.unreadCount + 1
            }
          : chat
      ));
    }, 2000);
  };

  const handleAcceptRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      // Move request to chats
      const newChat = {
        id: `new-${requestId}`,
        userId: request.userId,
        username: request.username,
        age: request.age,
        location: request.location,
        profileImage: request.profileImage,
        lastMessage: request.message,
        lastMessageTime: 'Now',
        unreadCount: 0,
        isOnline: true,
        isVerified: true,
        isActive: true,
        messages: [
          { id: '1', sender: request.username, text: request.message, time: 'Now', isRead: false }
        ]
      };
      
      setChats(prev => [newChat, ...prev]);
      setRequests(prev => prev.filter(r => r.id !== requestId));
      
      // Open the new chat
      setActiveChat(newChat);
      setIsChatOpen(true);
    }
  };

  const handleDeclineRequest = (requestId: string) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const handleBuyCredits = () => {
    alert('Redirecting to credits purchase page...');
  };

  const handleSendPhoto = () => {
    if (userCredits >= 10) {
      setUserCredits(prev => prev - 10);
      // In real app, this would open file picker and upload
      const photoMessage = {
        id: Date.now().toString(),
        sender: 'user' as const,
        text: '📷 [Photo sent]',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false
      };
      
      setActiveChat(prev => ({
        ...prev,
        lastMessage: '📷 [Photo sent]',
        lastMessageTime: photoMessage.time,
        messages: [...prev.messages, photoMessage]
      }));
    } else {
      alert('Not enough credits! Need 10 credits for photos.');
    }
  };

  const handleSendSticker = () => {
    if (userCredits >= 5) {
      setUserCredits(prev => prev - 5);
      const stickerMessage = {
        id: Date.now().toString(),
        sender: 'user' as const,
        text: '😊 [Sticker sent]',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false
      };
      
      setActiveChat(prev => ({
        ...prev,
        lastMessage: '😊 [Sticker sent]',
        lastMessageTime: stickerMessage.time,
        messages: [...prev.messages, stickerMessage]
      }));
    } else {
      alert('Not enough credits! Need 5 credits for stickers.');
    }
  };

  const handleSendGift = () => {
    if (userCredits >= 15) {
      setUserCredits(prev => prev - 15);
      const giftMessage = {
        id: Date.now().toString(),
        sender: 'user' as const,
        text: '🎁 [Gift sent]',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false
      };
      
      setActiveChat(prev => ({
        ...prev,
        lastMessage: '🎁 [Gift sent]',
        lastMessageTime: giftMessage.time,
        messages: [...prev.messages, giftMessage]
      }));
    } else {
      alert('Not enough credits! Need 15 credits for gifts.');
    }
  };

  const getAIResponse = (userMessage: string) => {
    const responses = [
      "That's interesting! Tell me more 😊",
      "I feel the same way sometimes! 💭",
      "What do you think about that? 🤔",
      "I'd love to hear more about your thoughts on this! 💕",
      "That makes me smile! 😄",
      "You have such interesting things to say! ✨",
      "I appreciate you sharing that with me! 🌟",
      "Let's keep this conversation going! 💬",
      "I'm really enjoying our chat! 😊",
      "What else would you like to talk about? 💭"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleEmojiClick = (emojiObject: any) => {
    setMessageInput(prev => prev + emojiObject.emoji);
  };

  return (
    <div className="min-h-screen bg-white">
      <LayoutController />
      
      {/* Desktop Layout - Centered Container */}
      <div className="hidden lg:flex h-[calc(100vh-64px)] w-full justify-center">
        <div className="w-full max-w-[1400px] mx-auto flex h-full">
          {/* Left Sidebar - Chat List */}
          <div className="w-[400px] flex-shrink-0 border-r border-gray-200 h-full overflow-hidden flex flex-col">
            {/* Fixed Header for Chat List */}
            <div className="bg-white border-b border-gray-200 px-4 py-3">
              {/* Top Bar with Title and Credits */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#5e17eb]">{userCredits}</span>
                  <button 
                    onClick={handleBuyCredits}
                    className="px-3 py-1 bg-[#5e17eb] text-white text-sm rounded-lg hover:bg-[#4a13c4] transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e17eb]/20 focus:border-[#5e17eb] transition-all text-gray-900"
                />
              </div>
              
              {/* Tabs */}
              <div className="flex space-x-2 mb-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'all'
                      ? 'bg-[#5e17eb] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All chats
                </button>
                <button
                  onClick={() => setActiveTab('active')}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all relative ${
                    activeTab === 'active'
                      ? 'bg-[#5e17eb] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Active
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {chats.filter(c => c.isActive).length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all relative ${
                    activeTab === 'requests'
                      ? 'bg-[#5e17eb] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Requests
                  {requests.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#ff2e2e] text-white text-xs px-1.5 py-0.5 rounded-full">
                      {requests.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Chat List or Requests - Scrollable */}
            <div className="flex-1 overflow-y-auto bg-white">
              {activeTab === 'requests' ? (
                // Requests List
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Connection Requests</h3>
                  {requests.map(request => (
                    <div key={request.id} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#5e17eb]">
                            <Image
                              src={request.profileImage}
                              alt={request.username}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{request.username}, {request.age}</h4>
                            {request.status === 'pending' && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Pending</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{request.location}</p>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{request.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{request.requestTime}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="flex-1 py-2 bg-[#5e17eb] text-white rounded-lg font-medium hover:bg-[#4a13c4] transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineRequest(request.id)}
                          className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Chat List
                <div className="divide-y divide-gray-100">
                  {filteredChats.map(chat => (
                    <div
                      key={chat.id}
                      onClick={() => handleOpenChat(chat.id)}
                      className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        activeChat.id === chat.id ? 'bg-purple-50' : ''
                      }`}
                    >
                      {/* Profile Image - Always rounded */}
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <Image
                            src={chat.profileImage}
                            alt={chat.username}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Online Status Dot */}
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          chat.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                        {/* Active Chat Indicator */}
                        {chat.isActive && (
                          <div className="absolute top-0 right-0 w-2 h-2 bg-[#ff2e2e] rounded-full"></div>
                        )}
                      </div>

                      {/* Chat Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1">
                            <h4 className="font-medium text-gray-900 truncate">
                              {chat.username}, {chat.age}
                            </h4>
                            {chat.isVerified && (
                              <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-100 flex-shrink-0" />
                            )}
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {chat.lastMessageTime}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 truncate">
                          {chat.lastMessage}
                        </p>
                        
                        {/* Status Indicators */}
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-1">
                            {chat.unreadCount > 0 ? (
                              <span className="text-xs font-medium text-[#ff2e2e]">
                                {chat.unreadCount} new
                              </span>
                            ) : (
                              <div className="flex items-center gap-1 text-gray-400">
                                <CheckCheck className="w-3 h-3" />
                                <span className="text-xs">Read</span>
                              </div>
                            )}
                          </div>
                          {chat.isActive && (
                            <div className="flex items-center gap-1 text-xs">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              <span className="text-green-600">Active</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col border-r border-gray-200">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={activeChat.profileImage}
                        alt={activeChat.username}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      activeChat.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{activeChat.username}, {activeChat.age}</h3>
                      {activeChat.isVerified && (
                        <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-100" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {activeChat.isOnline ? 'Online now' : 'Last seen recently'}
                    </p>
                  </div>
                </div>
                
              </div>
            </div>

            {/* Messages Area - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
              <div className="space-y-4 max-w-3xl mx-auto">
                {activeChat.messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message.text}
                    isOwn={message.sender === 'user'}
                    time={message.time}
                    isRead={message.isRead}
                    senderName={message.sender === 'user' ? 'You' : activeChat.username}
                  />
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
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
            </div>

            {/* Credit Cost Info */}
            <div className="px-6 py-2 bg-gray-100 border-t border-gray-200">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  💬 <span className="font-medium">2 cr/min</span>
                </span>
                <span className="flex items-center gap-1">
                  📷 <span className="font-medium">10 cr</span>
                </span>
                <span className="flex items-center gap-1">
                  🎁 <span className="font-medium">15 cr</span>
                </span>
                <span className="flex items-center gap-1">
                  😊 <span className="font-medium">5 cr</span>
                </span>
                <button 
                  onClick={handleBuyCredits}
                  className="text-[#5e17eb] font-medium hover:underline"
                >
                  Get Credits
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
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                    showEmojiPicker ? 'bg-[#5e17eb] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <Smile className="w-4 h-4" />
                  <span className="text-xs">Stickers</span>
                </button>
                <button
                  onClick={handleSendPhoto}
                  className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-xs">Photo</span>
                </button>
                <button
                  onClick={handleSendGift}
                  className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                >
                  <Gift className="w-4 h-4" />
                  <span className="text-xs">Gifts</span>
                </button>
                <button
                  onClick={() => handleSendMessage("Let's talk more!")}
                  className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-xs">Let&apos;s talk</span>
                </button>
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => {
                      setMessageInput(e.target.value);
                      setIsTyping(e.target.value.length > 0);
                    }}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5e17eb]/20 focus:border-[#5e17eb] transition-all text-gray-900 placeholder-gray-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(messageInput)}
                  />
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => handleSendMessage(messageInput)}
                  disabled={!messageInput.trim() || userCredits <= 0}
                  className={`p-3 rounded-full transition-all ${
                    !messageInput.trim() || userCredits <= 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#5e17eb] text-white hover:bg-[#4a13c4]'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Desktop Only */}
          <div className="w-[320px] flex-shrink-0 border-l border-gray-200 h-full overflow-y-auto">
            <div className="p-6">
              {/* Profile Details */}
              <div className="text-center mb-6">
                <div className="relative mx-auto w-24 h-24 mb-4">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <Image
                      src={activeChat.profileImage}
                      alt={activeChat.username}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white ${
                    activeChat.isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{activeChat.username}, {activeChat.age}</h3>
                <p className="text-gray-600">{activeChat.location}</p>
                <div className="mt-2">
                  {activeChat.isActive ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Active now
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      Last seen recently
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3 mb-6">
                <button className="w-full py-3 bg-[#5e17eb] text-white rounded-lg font-medium hover:bg-[#4a13c4] transition-colors">
                  View Full Profile
                </button>
                <button 
                  onClick={handleSendGift}
                  className="w-full py-3 bg-white border border-[#5e17eb] text-[#5e17eb] rounded-lg font-medium hover:bg-purple-50 transition-colors"
                >
                  Send Virtual Gift (15 cr)
                </button>
              </div>

              {/* Chat Stats */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Chat Statistics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Messages exchanged:</span>
                    <span className="font-medium text-blue-700">{activeChat.messages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Your messages:</span>
                    <span className="font-medium text-blue-700">{activeChat.messages.filter(m => m.sender === 'user').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Credits spent:</span>
                    <span className="font-medium text-[#ff2e2e]">
                      {activeChat.messages.filter(m => m.sender === 'user').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chat duration:</span>
                    <span className="font-medium text-red-500">2 days</span>
                  </div>
                </div>
              </div>

              {/* Fixed Cards Area */}
              <div className="space-y-4">
                {/* Get More Credits Card */}
                <div className="bg-gradient-to-r from-[#5e17eb] to-[#ff2e2e] rounded-xl p-4 text-white">
                  <h4 className="font-bold mb-2">Get More Credits</h4>
                  <p className="text-sm mb-3">Chat without limits</p>
                  <button
                    onClick={handleBuyCredits}
                    className="w-full py-2 bg-white text-[#5e17eb] rounded-lg font-bold hover:bg-gray-100 transition-colors"
                  >
                    Buy Now
                  </button>
                </div>

                {/* My Activity Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h4 className="font-bold text-gray-900 mb-3">My Activity</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#5e17eb]">24</div>
                      <div className="text-xs text-gray-600">Chats</div>
                    </div>
                   
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#5e17eb]">89</div>
                      <div className="text-xs text-gray-600">Following</div>
                    </div>
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Full width with bottom navigation */}
      <div className="lg:hidden flex flex-col h-[calc(100vh-64px)]">
        {/* Chat List View */}
        {!isChatOpen ? (
          <div className="flex-1 overflow-hidden bg-white pb-16">
            {/* Header - No side padding */}
            <div className="bg-white border-b border-gray-200 px-0">
              {/* Credits Bar */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#5e17eb]">{userCredits}</span>
                  <button 
                    onClick={handleBuyCredits}
                    className="px-3 py-1 bg-[#5e17eb] text-white text-sm rounded-lg hover:bg-[#4a13c4] transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {/* Search - Full width */}
              <div className="px-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none text-sm text-gray-900"
                  />
                </div>
              </div>
              
              {/* Tabs - Full width */}
              <div className="flex space-x-1 px-4 mb-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium ${
                    activeTab === 'all'
                      ? 'bg-[#5e17eb] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  All chats
                </button>
                <button
                  onClick={() => setActiveTab('active')}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium ${
                    activeTab === 'active'
                      ? 'bg-[#5e17eb] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium ${
                    activeTab === 'requests'
                      ? 'bg-[#5e17eb] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Requests
                </button>
              </div>
            </div>

            {/* Chat List - Full width */}
            <div className="overflow-y-auto h-[calc(100%-140px)]">
              {filteredChats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => handleOpenChat(chat.id)}
                  className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={chat.profileImage}
                          alt={chat.username}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Online Status Dot */}
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        chat.isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
                          <h4 className="font-medium text-gray-900">{chat.username}</h4>
                          {chat.isActive && (
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{chat.lastMessageTime}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                      {chat.unreadCount > 0 && (
                        <div className="mt-1">
                          <span className="text-xs text-[#ff2e2e] font-medium">
                            {chat.unreadCount} new
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Mobile Chat View - Full width */
          <div className="flex-1 flex flex-col bg-white pb-16">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCloseChat}
                  className="p-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={activeChat.profileImage}
                        alt={activeChat.username}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      activeChat.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">{activeChat.username}</h2>
                    <p className="text-sm text-gray-500">
                      {activeChat.isOnline ? 'Online now' : 'Last seen recently'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages - Full width with proper spacing */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
              <div className="space-y-4">
                {activeChat.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.sender === 'user' 
                          ? 'bg-[#5e17eb] rounded-br-none' 
                          : 'bg-gray-100 rounded-bl-none'
                      }`}
                    >
                      {/* Message text - WHITE for user messages, dark for others */}
                      <p className={message.sender === 'user' ? 'text-white' : 'text-gray-900'}>
                        {message.text}
                      </p>
                      
                      {/* Time - Lighter color for user messages, gray for others */}
                      <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-purple-200' : 'text-gray-500'}`}>
                        {message.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Credit Cost Info - Mobile */}
            <div className="px-4 py-2 bg-gray-100 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  💬 <span className="font-medium">2 cr/min</span>
                </div>
                <div className="flex items-center gap-1">
                  📷 <span className="font-medium">10 cr</span>
                </div>
                <div className="flex items-center gap-1">
                  🎁 <span className="font-medium">15 cr</span>
                </div>
                <div className="flex items-center gap-1">
                  😊 <span className="font-medium">5 cr</span>
                </div>
              </div>
            </div>

            {/* Chat Input - Fixed at bottom */}
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
              
              {/* Message Input - Always visible */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-full focus:outline-none text-sm text-gray-900 placeholder-gray-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(messageInput)}
                  />
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => handleSendMessage(messageInput)}
                  disabled={!messageInput.trim() || userCredits <= 0}
                  className={`p-3 rounded-full ${
                    !messageInput.trim() || userCredits <= 0
                      ? 'bg-gray-300 text-gray-500'
                      : 'bg-[#5e17eb] text-white'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* Action Buttons - Mobile */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm ${
                    showEmojiPicker ? 'bg-[#5e17eb] text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <Smile className="w-4 h-4" />
                  Stickers
                </button>
                <button
                  onClick={handleSendPhoto}
                  className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg text-gray-700 text-sm"
                >
                  <ImageIcon className="w-4 h-4" />
                  Photo
                </button>
                <button
                  onClick={handleSendGift}
                  className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg text-gray-700 text-sm"
                >
                  <Gift className="w-4 h-4" />
                  Gifts
                </button>
                <button
                  onClick={() => handleSendMessage("Let's talk more!")}
                  className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg text-gray-700 text-sm"
                >
                  <Mail className="w-4 h-4" />
                  Let&apos;s talk
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation - Mobile Only */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
          <div className="flex justify-around items-center h-16">
            <button className="flex flex-col items-center justify-center flex-1 p-2">
              <Home className="w-6 h-6 text-gray-600" />
              <span className="text-xs mt-1 text-gray-600">Home</span>
            </button>
            <button className="flex flex-col items-center justify-center flex-1 p-2">
              <Compass className="w-6 h-6 text-gray-600" />
              <span className="text-xs mt-1 text-gray-600">Discover</span>
            </button>
            <button className="flex flex-col items-center justify-center flex-1 p-2">
              <PlusSquare className="w-6 h-6 text-gray-600" />
              <span className="text-xs mt-1 text-gray-600">Create</span>
            </button>
            <button className="flex flex-col items-center justify-center flex-1 p-2 text-[#5e17eb]">
              <MessageCircleCodeIcon className="w-6 h-6" />
              <span className="text-xs mt-1">Chats</span>
            </button>
            <button className="flex flex-col items-center justify-center flex-1 p-2">
              <Users className="w-6 h-6 text-gray-600" />
              <span className="text-xs mt-1 text-gray-600">People</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}