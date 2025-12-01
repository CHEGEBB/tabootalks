// components/ui/ChatBubble.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatBubbleProps {
  message: string;
  isUser?: boolean;
  timestamp?: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isUser = false, timestamp = '12:34 PM' }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-[70%] ${isUser ? 'order-1' : 'order-0'}`}>
          <div 
            className={`px-4 py-3 rounded-2xl shadow-sm ${
              isUser 
                ? 'bg-gradient-to-r from-[#5e17eb] to-[#4F50FF] text-white' 
                : 'bg-white border border-gray-100 text-gray-700'
            }`}
          >
            <p>{message}</p>
          </div>
          <p className={`text-xs mt-1 ${isUser ? 'text-right' : 'text-left'} text-gray-500`}>{timestamp}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatBubble;