// lib/appwrite/conversations.ts
import { databases, DATABASE_ID, COLLECTIONS } from './config';
import { ID, Query } from 'appwrite';

export interface Conversation {
  $id: string;
  conversationId: string;
  userId: string;
  botProfileId: string;
  lastMessage: string;
  lastMessageAt: string;
  messageCount: number;
  isActive: boolean;
  $createdAt: string;
  $updatedAt: string;
}

/**
 * Generate unique conversation ID
 */
export const generateConversationId = (userId: string, botProfileId: string): string => {
  return `${userId}_${botProfileId}`;
};

/**
 * Get or create a conversation between user and bot
 */
export const getOrCreateConversation = async (
  userId: string,
  botProfileId: string
): Promise<Conversation> => {
  const conversationId = generateConversationId(userId, botProfileId);

  try {
    // Try to find existing conversation
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CONVERSATIONS,
      [Query.equal('conversationId', conversationId), Query.limit(1)]
    );

    if (response.documents.length > 0) {
      return response.documents[0] as unknown as Conversation;
    }

    // Create new conversation if doesn't exist
    const newConversation = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.CONVERSATIONS,
      ID.unique(),
      {
        conversationId,
        userId,
        botProfileId,
        lastMessage: '',
        lastMessageAt: new Date().toISOString(),
        messageCount: 0,
        isActive: true,
      }
    );

    return newConversation as unknown as Conversation;
  } catch (error) {
    console.error('Error in getOrCreateConversation:', error);
    throw error;
  }
};

/**
 * Update conversation after new message
 */
export const updateConversation = async (
  conversationId: string,
  lastMessage: string
): Promise<void> => {
  try {
    // Find the conversation document
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CONVERSATIONS,
      [Query.equal('conversationId', conversationId), Query.limit(1)]
    );

    if (response.documents.length === 0) {
      throw new Error('Conversation not found');
    }

    const doc = response.documents[0];

    // Update it
    await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.CONVERSATIONS,
      doc.$id,
      {
        lastMessage,
        lastMessageAt: new Date().toISOString(),
        messageCount: (doc.messageCount || 0) + 1,
      }
    );
  } catch (error) {
    console.error('Error updating conversation:', error);
    throw error;
  }
};

/**
 * Get all conversations for a user
 */
export const getUserConversations = async (userId: string): Promise<Conversation[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CONVERSATIONS,
      [
        Query.equal('userId', userId),
        Query.equal('isActive', true),
        Query.orderDesc('lastMessageAt'),
        Query.limit(100),
      ]
    );

    return response.documents as unknown as Conversation[];
  } catch (error) {
    console.error('Error getting user conversations:', error);
    throw error;
  }
};