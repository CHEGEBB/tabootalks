'use client';

import { CheckCircle, Clock, CheckCheck } from 'lucide-react';
import Image from 'next/image';

interface Chat {
  id: string;
  userId: number;
  username: string;
  age: number;
  location: string;
  profileImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  isVerified: boolean;
}

interface ChatListProps {
  chats: Chat[];
  activeChatId: string;
  onSelectChat: (chatId: string) => void;
  searchQuery: string;
}

export default function ChatList({ chats, activeChatId, onSelectChat, searchQuery }: ChatListProps) {
  const filteredChats = chats.filter(chat =>
    chat.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const truncateText = (text: string, maxLength = 30) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-1">
      {filteredChats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onSelectChat(chat.id)}
          className={`p-4 cursor-pointer transition-all duration-200 ${
            activeChatId === chat.id
              ? 'bg-gradient-to-r from-purple-50 to-white border-l-4 border-[#5e17eb]'
              : 'hover:bg-gray-50 border-l-4 border-transparent'
          }`}
        >
          <div className="flex items-start gap-3">
            {/* Profile Image with Online Status */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={chat.profileImage}
                  alt={chat.username}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              {chat.isOnline ? (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              ) : (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 rounded-full border-2 border-white"></div>
              )}
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {chat.username}, {chat.age}
                  </h4>
                  {chat.isVerified && (
                    <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-100 flex-shrink-0" />
                  )}
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatTime(chat.lastMessageTime)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 truncate">
                  {truncateText(chat.lastMessage, 40)}
                </p>
                <div className="flex items-center gap-2">
                  {chat.lastMessage.includes('sent a photo') ? (
                    <span className="text-xs text-gray-400">📷 Photo</span>
                  ) : chat.lastMessage.includes('sent a gift') ? (
                    <span className="text-xs text-gray-400">🎁 Gift</span>
                  ) : null}
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1">
                  {chat.unreadCount > 0 ? (
                    <>
                      <div className="w-2 h-2 bg-[#ff2e2e] rounded-full animate-pulse"></div>
                      <span className="text-xs text-[#ff2e2e] font-medium">
                        {chat.unreadCount} new
                      </span>
                    </>
                  ) : (
                    <div className="flex items-center gap-1 text-gray-400">
                      <CheckCheck className="w-3 h-3" />
                      <span className="text-xs">Read</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>{chat.location}</span>
                  {chat.isOnline && (
                    <>
                      <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                      <span className="text-green-600">Online</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {filteredChats.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">No chats found</div>
          <p className="text-sm text-gray-500">
            {searchQuery ? 'Try a different search term' : 'Start a new conversation!'}
          </p>
        </div>
      )}
    </div>
  );
}