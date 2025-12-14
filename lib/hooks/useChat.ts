// lib/hooks/useChat.ts - FIXED VERSION
import { useState, useCallback, useRef } from 'react';
import { sendChatMessage } from '@/lib/chat/chatService';
import { Message } from '@/types/message';

interface UseChatProps {
  userId: string;
  botProfileId: string;
  conversationId?: string;
  onNewMessage?: (message: Message) => void;
  onStreamingChunk?: (chunk: string, fullText: string) => void;
}

export const useChat = (props: UseChatProps) => {
  const { userId, botProfileId, conversationId, onNewMessage, onStreamingChunk } = props;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamText, setCurrentStreamText] = useState('');
  
  // For aborting streaming
  const abortControllerRef = useRef<AbortController | null>(null);

  // Send message with streaming
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setIsStreaming(true);
    setCurrentStreamText('');
    
    // Create abort controller for cancelling
    abortControllerRef.current = new AbortController();
    
    // Generate a temporary conversation ID if none exists
    const tempConversationId = conversationId || `temp_conv_${Date.now()}`;
    
    // 1. Add user message optimistically
    const userMessage: Message = {
      $id: `temp_user_${Date.now()}`,
      conversationId: tempConversationId,
      userId,
      botProfileId,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    onNewMessage?.(userMessage);
    
    // 2. Add placeholder for bot response
    const botPlaceholder: Message = {
      $id: `temp_bot_${Date.now()}`,
      conversationId: tempConversationId,
      userId,
      botProfileId,
      role: 'bot',
      content: '',
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, botPlaceholder]);
    
    // 3. Stream the response
    const result = await sendChatMessage(
      userId,
      botProfileId,
      content.trim(),
      conversationId,
      (chunk, fullText) => {
        // Update streaming text
        setCurrentStreamText(fullText);
        
        // Update the placeholder message with streaming text
        setMessages(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (updated[lastIndex]?.role === 'bot') {
            updated[lastIndex] = {
              ...updated[lastIndex],
              content: fullText,
            };
          }
          return updated;
        });
        
        // Call chunk callback
        onStreamingChunk?.(chunk, fullText);
      }
    );
    
    setIsLoading(false);
    setIsStreaming(false);
    
    if (result.success) {
      // Replace placeholder with final message
      setMessages(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex]?.role === 'bot') {
          updated[lastIndex] = {
            ...updated[lastIndex],
            $id: `msg_${Date.now()}`,
            content: result.response || '',
          };
        }
        return updated;
      });
      
      // Return the new conversation ID if created
      return {
        success: true,
        conversationId: result.conversationId,
        creditsUsed: result.creditsUsed,
      };
    } else {
      setError(result.response || 'Failed to send message');
      // Remove the failed bot placeholder
      setMessages(prev => prev.slice(0, -1));
      return { success: false, error: result.response };
    }
  }, [userId, botProfileId, conversationId, onNewMessage, onStreamingChunk]);

  // Cancel streaming
  const cancelStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      setIsLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => setError(null), []);

  // Add message to chat (for loading existing messages)
  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    sendMessage,
    addMessage,
    clearMessages,
    isLoading,
    isStreaming,
    currentStreamText,
    error,
    clearError,
    cancelStreaming,
  };
};