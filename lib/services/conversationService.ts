// lib/services/conversationService.ts
'use client';

import { Client, Databases, Query } from 'appwrite';

export interface ConversationStats {
  totalConversations: number;
  activeChats: number;
  totalMessages: number;
  unreadCount: number;
}

class ConversationService {
  private client: Client;
  private databases: Databases;
  private DATABASE_ID: string;

  constructor() {
    this.client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

    this.databases = new Databases(this.client);
    this.DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  }

  /**
   * Get conversation statistics for a user
   */
  async getConversationStats(userId: string): Promise<ConversationStats> {
    try {
      // Fetch all conversations for the user
      const response = await this.databases.listDocuments(
        this.DATABASE_ID,
        'conversations',
        [
          Query.equal('userId', userId),
          Query.limit(100) // Adjust based on your needs
        ]
      );

      const conversations = response.documents;

      // Calculate stats
      const stats: ConversationStats = {
        totalConversations: conversations.length,
        activeChats: conversations.filter(conv => conv.isActive === true).length,
        totalMessages: conversations.reduce((sum, conv) => sum + (conv.messageCount || 0), 0),
        unreadCount: conversations.filter(conv => conv.hasUnread === true).length // If you add this field
      };

      return stats;
    } catch (error) {
      console.error('❌ Error fetching conversation stats:', error);
      return {
        totalConversations: 0,
        activeChats: 0,
        totalMessages: 0,
        unreadCount: 0
      };
    }
  }

  /**
   * Get count of active conversations (for badge)
   */
  async getActiveConversationsCount(userId: string): Promise<number> {
    try {
      const response = await this.databases.listDocuments(
        this.DATABASE_ID,
        'conversations',
        [
          Query.equal('userId', userId),
          Query.equal('isActive', true),
          Query.limit(100)
        ]
      );

      return response.documents.length;
    } catch (error) {
      console.error('❌ Error fetching active conversations count:', error);
      return 0;
    }
  }

  /**
   * Get unread messages count (if you want to add this feature)
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const response = await this.databases.listDocuments(
        this.DATABASE_ID,
        'conversations',
        [
          Query.equal('userId', userId),
          Query.equal('hasUnread', true), // Add this field to your schema
          Query.limit(100)
        ]
      );

      return response.documents.length;
    } catch (error) {
      console.error('❌ Error fetching unread count:', error);
      return 0;
    }
  }
}

// Export singleton instance
const conversationService = new ConversationService();
export default conversationService;