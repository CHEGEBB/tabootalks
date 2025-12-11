/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/store/chatStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
  isOptimistic?: boolean;
}

interface Conversation {
  [x: string]: any;
  id: string;
  botProfileId: string;
  userId: string;
  lastMessage: string;
  lastMessageAt: string;
  messageCount: number;
  isActive: boolean;
}

interface ChatStore {
  // State
  conversations: Conversation[];
  messagesByBot: Record<string, ChatMessage[]>;
  botProfiles: Record<string, any>;
  activeBotId: string | null;
  
  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setMessages: (botId: string, messages: ChatMessage[]) => void;
  addMessage: (botId: string, message: ChatMessage) => void;
  updateBotProfile: (botId: string, profile: any) => void;
  setActiveBotId: (botId: string) => void;
  clearOptimisticMessages: (botId: string) => void;
  
  // Derived state
  getActiveMessages: () => ChatMessage[];
  getActiveBot: () => any;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // Initial state
      conversations: [],
      messagesByBot: {},
      botProfiles: {},
      activeBotId: null,
      
      // Actions
      setConversations: (conversations) => set({ conversations }),
      
      setMessages: (botId, messages) => 
        set((state) => ({
          messagesByBot: { ...state.messagesByBot, [botId]: messages }
        })),
      
      addMessage: (botId, message) =>
        set((state) => {
          const currentMessages = state.messagesByBot[botId] || [];
          return {
            messagesByBot: {
              ...state.messagesByBot,
              [botId]: [...currentMessages, message]
            }
          };
        }),
      
      updateBotProfile: (botId, profile) =>
        set((state) => ({
          botProfiles: { ...state.botProfiles, [botId]: profile }
        })),
      
      setActiveBotId: (botId) => set({ activeBotId: botId }),
      
      clearOptimisticMessages: (botId) =>
        set((state) => {
          const currentMessages = state.messagesByBot[botId] || [];
          const filteredMessages = currentMessages.filter(m => !m.isOptimistic);
          return {
            messagesByBot: {
              ...state.messagesByBot,
              [botId]: filteredMessages
            }
          };
        }),
      
      // Derived state
      getActiveMessages: () => {
        const state = get();
        return state.activeBotId ? state.messagesByBot[state.activeBotId] || [] : [];
      },
      
      getActiveBot: () => {
        const state = get();
        return state.activeBotId ? state.botProfiles[state.activeBotId] : null;
      }
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        messagesByBot: state.messagesByBot,
        botProfiles: state.botProfiles
      })
    }
  )
);