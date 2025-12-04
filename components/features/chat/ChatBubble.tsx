'use client';

import { CheckCheck } from 'lucide-react';
import Image from 'next/image';

interface ChatBubbleProps {
  message: string;
  isOwn: boolean;
  time: string;
  isRead: boolean;
  senderName?: string;
  profileImage?: string;
}

export default function ChatBubble({ message, isOwn, time, isRead, senderName, profileImage }: ChatBubbleProps) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} items-end gap-2 mb-2`}>
      {/* Profile Image for received messages */}
      {!isOwn && profileImage && (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mb-1">
          <Image
            src={profileImage}
            alt={senderName || 'User'}
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className={`max-w-[80%] lg:max-w-[70%] ${isOwn ? 'ml-auto' : 'mr-auto'}`}>
        {!isOwn && senderName && (
          <div className="text-xs font-medium text-gray-500 mb-1 ml-1">{senderName}</div>
        )}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isOwn
              ? 'bg-[#5e17eb] text-white rounded-br-none'
              : 'bg-gray-100 text-gray-900 rounded-bl-none'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message}</p>
        </div>
        <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-gray-400">{time}</span>
          {isOwn && (
            <CheckCheck
              className={`w-3 h-3 ${isRead ? 'text-blue-500' : 'text-gray-400'}`}
            />
          )}
        </div>
      </div>
      
      {/* Profile Image for sent messages */}
      {isOwn && profileImage && (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mb-1">
          <Image
            src={profileImage}
            alt="You"
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}