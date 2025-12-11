/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/hooks/useChat.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';

export const useChat = (botId: string, userId: string) => {
  const [isTyping, setIsTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Fix: Get the entire messagesByBot object, then extract the specific bot's messages
  // This creates a stable reference that won't cause infinite loops
  const messagesByBot = useChatStore((state) => state.messagesByBot);
  const messages = messagesByBot[botId] || [];
  
  // Typing indicator management
  const showTypingIndicator = useCallback(() => {
    setIsTyping(true);
    
    // Auto-hide after 3 seconds if no response
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 3000);
  }, []);
  
  const hideTypingIndicator = useCallback(() => {
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, []);
  
  // Send message with proper flow
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || sending) return;
    
    setSending(true);
    
    try {
      // 1. Add optimistic user message
      const userMessage = {
        id: `optimistic_${Date.now()}`,
        role: 'user' as const,
        content: content.trim(),
        timestamp: new Date().toISOString(),
        isOptimistic: true
      };
      
      // Add to store
      useChatStore.getState().addMessage(botId, userMessage);
      
      // 2. Show typing indicator for bot
      showTypingIndicator();
      
      // 3. Send to API
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          botProfileId: botId,
          message: content.trim()
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // 4. Remove typing indicator
        hideTypingIndicator();
        
        // 5. Remove optimistic messages and add real ones
        const currentMessages = useChatStore.getState().messagesByBot[botId] || [];
        const filteredMessages = currentMessages.filter(m => 
          !m.isOptimistic
        );
        
        // Add real messages
        const realMessages = [
          ...filteredMessages,
          {
            id: `user_${Date.now()}`,
            role: 'user' as const,
            content: content.trim(),
            timestamp: new Date().toISOString()
          },
          {
            id: `bot_${Date.now() + 1}`,
            role: 'bot' as const,
            content: data.data.botResponse,
            timestamp: new Date().toISOString()
          }
        ];
        
        // Update store
        useChatStore.getState().setMessages(botId, realMessages);
        
        // 6. Update conversation list
        const convs = useChatStore.getState().conversations;
        const updatedConvs = convs.map(c => 
          c.botProfileId === botId 
            ? { 
                ...c, 
                lastMessage: data.data.botResponse.substring(0, 40) + '...',
                lastMessageAt: new Date().toISOString(),
                messageCount: (c.messageCount || 0) + 2
              }
            : c
        );
        
        useChatStore.getState().setConversations(updatedConvs);
        
        return { success: true, data: data.data };
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      hideTypingIndicator();
      
      // Remove optimistic message on error
      const currentMessages = useChatStore.getState().messagesByBot[botId] || [];
      const filteredMessages = currentMessages.filter(m => 
        !m.isOptimistic
      );
      useChatStore.getState().setMessages(botId, filteredMessages);
      
      throw error;
    } finally {
      setSending(false);
    }
  }, [botId, userId, sending, showTypingIndicator, hideTypingIndicator]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);
  
  return {
    messages,
    isTyping,
    sending,
    sendMessage,
    showTypingIndicator,
    hideTypingIndicator
  };
};