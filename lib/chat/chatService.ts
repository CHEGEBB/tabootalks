/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/chat/chatService.ts - UPDATED// lib/chat/chatService.ts - UPDATED WITH PROXY
import { FUNCTION_ENDPOINTS } from '@/lib/appwrite/config';
import { Message } from '@/types/message';

interface ChatResponse {
  success: boolean;
  response?: string;
  conversationId?: string;
  creditsUsed?: number;
}

/**
 * Send a message via Cloud Function (with streaming) - USING PROXY
 */
export const sendChatMessage = async (
  userId: string,
  botProfileId: string,
  message: string,
  conversationId?: string,
  onChunk?: (chunk: string, fullText: string) => void
): Promise<ChatResponse> => {
  try {
    console.log('Sending message via proxy...');
    
    // Use local proxy instead of direct function call
    const response = await fetch('/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        botProfileId,
        message,
        conversationId,
      }),
    });

    if (!response.ok) {
      console.error('Proxy response error:', response.status);
      
      if (response.status === 402) {
        return {
          success: false,
          response: 'Insufficient credits',
        };
      }
      
      const errorText = await response.text();
      return {
        success: false,
        response: `Proxy error: ${response.status} - ${errorText}`,
      };
    }

    // Check if this is a streaming response
    const contentType = response.headers.get('content-type');
    const isStreaming = contentType?.includes('text/event-stream');

    if (isStreaming) {
      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        return {
          success: false,
          response: 'No response body from function',
        };
      }

      const decoder = new TextDecoder();
      let fullResponse = '';
      let finalConversationId = conversationId;
      let creditsUsed = 1;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              
              if (data.chunk) {
                fullResponse += data.chunk;
                if (onChunk) {
                  onChunk(data.chunk, fullResponse);
                }
              }
              
              if (data.conversationId) {
                finalConversationId = data.conversationId;
              }
              
              if (data.creditsUsed) {
                creditsUsed = data.creditsUsed;
              }
              
              if (data.done) {
                console.log('Stream completed successfully');
                return {
                  success: true,
                  response: fullResponse,
                  conversationId: finalConversationId,
                  creditsUsed,
                };
              }
            } catch (e) {
              console.warn('Failed to parse SSE data:', e, 'Line:', line);
            }
          }
        }
      }

      return {
        success: true,
        response: fullResponse,
        conversationId: finalConversationId,
        creditsUsed,
      };
    } else {
      // Handle regular JSON response
      const data = await response.json();
      return data;
    }

  } catch (error: any) {
    console.error('Chat service error:', error);
    return {
      success: false,
      response: error.message || 'Network error',
    };
  }
};

/**
 * Convert Appwrite document to Message type
 */
export const documentToMessage = (doc: any): Message => ({
  $id: doc.$id,
  conversationId: doc.conversationId,
  userId: doc.userId,
  botProfileId: doc.botProfileId,
  role: doc.role,
  content: doc.content,
  timestamp: doc.timestamp || doc.$createdAt,
  creditsUsed: doc.creditsUsed || 0,
  $createdAt: doc.$createdAt,
  $updatedAt: doc.$updatedAt,
});

/**
 * Get user conversations (simplified - direct database call)
 */
export const getUserConversations = async (userId: string): Promise<any[]> => {
  try {
    // Dynamic import to avoid server-side issues
    const { databases, COLLECTIONS, DATABASE_ID } = await import('@/lib/appwrite/config');
    const { Query } = await import('appwrite');
    
    const conversations = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CONVERSATIONS,
      [
        Query.equal('userId', userId),
        Query.orderDesc('lastMessageAt'),
        Query.limit(50)
      ]
    );

    return conversations.documents;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
};

/**
 * Get conversation messages (simplified)
 */
export const getConversationMessages = async (
  conversationId: string, 
  limit = 100
): Promise<Message[]> => {
  try {
    const { databases, COLLECTIONS, DATABASE_ID } = await import('@/lib/appwrite/config');
    const { Query } = await import('appwrite');
    
    const messages = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.MESSAGES,
      [
        Query.equal('conversationId', conversationId),
        Query.orderAsc('timestamp'),
        Query.limit(limit)
      ]
    );

    return messages.documents.map(documentToMessage);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};