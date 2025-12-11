// lib/appwrite/messages.ts
import { databases, DATABASE_ID, COLLECTIONS } from './config';
import { ID, Query } from 'appwrite';

export interface Message {
  $id: string;
  conversationId: string;
  userId: string;
  botProfileId: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
  creditsUsed: number;
  $createdAt: string;
  $updatedAt: string;
}

/**
 * Save a message to the database
 */
export const saveMessage = async (
  conversationId: string,
  userId: string,
  botProfileId: string,
  role: 'user' | 'bot',
  content: string,
  creditsUsed: number = 0
): Promise<Message> => {
  try {
    const message = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.MESSAGES,
      ID.unique(),
      {
        conversationId,
        userId,
        botProfileId,
        role,
        content,
        timestamp: new Date().toISOString(),
        creditsUsed,
      }
    );

    return message as unknown as Message;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

/**
 * Get recent messages for context (last N messages)
 */
export const getRecentMessages = async (
  conversationId: string,
  limit: number = 15
): Promise<Message[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.MESSAGES,
      [
        Query.equal('conversationId', conversationId),
        Query.orderDesc('timestamp'),
        Query.limit(limit),
      ]
    );

    // Reverse to get chronological order (oldest first)
    return (response.documents as unknown as Message[]).reverse();
  } catch (error) {
    console.error('Error getting recent messages:', error);
    throw error;
  }
};

/**
 * Get all messages in a conversation (for chat history display)
 */
export const getConversationMessages = async (
  conversationId: string,
  limit: number = 100
): Promise<Message[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.MESSAGES,
      [
        Query.equal('conversationId', conversationId),
        Query.orderAsc('timestamp'),
        Query.limit(limit),
      ]
    );

    return response.documents as unknown as Message[];
  } catch (error) {
    console.error('Error getting conversation messages:', error);
    throw error;
  }
};

/**
 * Get message count for a conversation
 */
export const getMessageCount = async (conversationId: string): Promise<number> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.MESSAGES,
      [Query.equal('conversationId', conversationId), Query.limit(1)]
    );

    return response.total;
  } catch (error) {
    console.error('Error getting message count:', error);
    return 0;
  }
};