/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================
// FILE 1: lib/hooks/useChatService.ts (UPDATED)
// ============================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SendMessageParams {
  userId: string;
  botProfileId: string;
  message: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
  isRead?: boolean;
}

export interface Chat {
  id: string;
  botProfileId: string;
  username: string;
  age: number;
  location: string;
  profileImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  isVerified: boolean;
  isActive: boolean;
  messages: Message[];
}

export const useChatService = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Navigate to chat with a specific person
   */
  const openChat = (botProfileId: string) => {
    router.push(`/main/chats/${botProfileId}`);
  };

  /**
   * Navigate to main chats page
   */
  const goToChats = () => {
    router.push('/main/chats');
  };

  /**
   * Send a message to AI bot
   */
  const sendMessage = async ({
    userId,
    botProfileId,
    message
  }: SendMessageParams) => {
    if (!message.trim()) {
      throw new Error('Message cannot be empty');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          botProfileId,
          message: message.trim()
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to send message');
      }

      return {
        botResponse: data.data.botResponse,
        creditsRemaining: data.data.creditsRemaining,
        conversationId: data.data.conversationId,
        timestamp: data.data.timestamp
      };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to send message';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load conversation history
   */
  const loadConversation = async (userId: string, botProfileId: string) => {
    try {
      const response = await fetch(`/api/chat/conversation?userId=${userId}&botProfileId=${botProfileId}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data.messages || [];
      }
      return [];
    } catch (err) {
      console.error('Error loading conversation:', err);
      return [];
    }
  };

  /**
   * Load all user chats
   */
  const loadUserChats = async (userId: string) => {
    try {
      const response = await fetch(`/api/chat/chats?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data.chats || [];
      }
      return [];
    } catch (err) {
      console.error('Error loading chats:', err);
      return [];
    }
  };

  /**
   * Mark messages as read
   */
  const markAsRead = async (userId: string, botProfileId: string) => {
    try {
      await fetch('/api/chat/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, botProfileId })
      });
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  /**
   * Check user credits
   */
  const checkCredits = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/credits`);
      const data = await response.json();
      return data.credits || 0;
    } catch (err) {
      console.error('Error checking credits:', err);
      return 0;
    }
  };

  return {
    openChat,
    goToChats,
    sendMessage,
    loadConversation,
    loadUserChats,
    markAsRead,
    checkCredits,
    loading,
    error
  };
};