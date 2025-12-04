'use client';

import { useState } from 'react';
import { Image as ImageIcon, Gift, Smile, Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  credits: number;
  onBuyCredits: () => void;
  onSendPhoto?: () => void;
  onSendGift?: () => void;
}

export default function ChatInput({
  onSendMessage,
  credits,
  onBuyCredits,
  onSendPhoto,
  onSendGift
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (message.trim() && credits > 0) {
      onSendMessage(message.trim());
      setMessage('');
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {/* Low Credits Warning */}
      {credits <= 5 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                ⚠️ Credits are low! <span className="font-bold">{credits} credits left</span>
              </p>
              <p className="text-xs text-red-600 mt-1">
                Top up to continue chatting
              </p>
            </div>
            <button
              onClick={onBuyCredits}
              className="ml-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg font-medium hover:bg-red-700 transition-colors whitespace-nowrap"
            >
              Get Credits
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onSendPhoto}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
          >
            <ImageIcon className="w-4 h-4" />
            <span className="text-sm">Photo</span>
          </button>
          <button
            onClick={onSendGift}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
          >
            <Gift className="w-4 h-4" />
            <span className="text-sm">Gift</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors">
            <Smile className="w-4 h-4" />
            <span className="text-sm">Stickers</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{credits} credits</span>
          <button
            onClick={onBuyCredits}
            className="px-3 py-1.5 bg-[#5e17eb] text-white text-sm rounded-lg hover:bg-[#4a13c4] transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Message Input */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setIsTyping(e.target.value.length > 0);
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e17eb]/20 focus:border-[#5e17eb] transition-all"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            {isTyping && (
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleSend}
          disabled={!message.trim() || credits <= 0}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            !message.trim() || credits <= 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#ff2e2e] text-white hover:bg-[#e62626]'
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Credit Cost Info */}
      <div className="mt-2 text-center">
        <p className="text-xs text-gray-500">
          💎 1 credit per message • 📷 15 credits per photo • 🎁 25 credits for explicit photos
        </p>
      </div>
    </div>
  );
}