/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { databases } from '@/lib/appwrite/config';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/config';
import { Query, ID } from 'appwrite';
import giftService, { GiftItem } from './giftService';
import personaService from './personaService';

export interface ChatGiftMessage {
  type: 'gift';
  giftId: number;
  giftName: string;
  giftImage?: string;
  message?: string;
  isAnimated: boolean;
  animationUrl?: string;
  price: number;
  category?: string;
  timestamp: string;
}

export interface GiftNotification {
  senderId: string;
  senderName: string;
  recipientId: string;
  giftId: number;
  giftName: string;
  giftImage?: string;
  message?: string;
  timestamp: string;
  isAnimated: boolean;
  animationUrl?: string;
  conversationId?: string;
}

export interface AppwriteGiftDocument {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  senderId: string;
  recipientId: string;
  recipientName: string;
  giftId: string;
  giftName: string;
  giftPrice: number;
  giftImage?: string;
  message?: string;
  sentAt: string;
  isAnimated: boolean;
  animationUrl?: string;
  category?: string;
  status: 'sent' | 'received' | 'viewed';
  conversationId?: string;
}

class GiftHandlerService {
  
  async sendGiftToChat(
    senderId: string,
    recipientId: string,
    giftId: number,
    message?: string,
    conversationId?: string
  ): Promise<{ 
    success: boolean; 
    chatMessageId?: string;
    giftMessage?: ChatGiftMessage;
    error?: string;
    shouldTriggerAIResponse?: boolean;
  }> {
    try {
      console.log('🎁 sendGiftToChat called with:', {
        senderId,
        recipientId,
        giftId,
        message,
        conversationId
      });
  
      // 1. Get gift details from JSON
      const gift = await giftService.getGiftById(giftId);
      if (!gift) {
        console.error('❌ Gift not found with ID:', giftId);
        return { success: false, error: 'Gift not found' };
      }
  
      console.log('✅ Gift found:', { name: gift.name, price: gift.price });
  
      // 2. Send gift and deduct credits
      console.log('💰 Calling giftService.sendGift...');
      const giftSendResult = await giftService.sendGift(
        senderId,
        recipientId,
        giftId,
        message,
        conversationId
      );
  
      console.log('💰 giftService.sendGift result:', giftSendResult);
  
      if (!giftSendResult.success) {
        return { 
          success: false, 
          error: giftSendResult.error || 'Failed to process gift payment' 
        };
      }
  
      // 3. Get sender name
      let senderName = 'You';
      try {
        console.log('👤 Fetching sender details with ID:', senderId);
        if (senderId && senderId.toString().length > 15) {
          console.warn('⚠️ senderId looks like a gift ID, not a user ID:', senderId);
          senderName = 'Anonymous';
        } else {
          const sender = await personaService.getPersonaById(senderId);
          senderName = sender.username;
          console.log('✅ Sender found:', senderName);
        }
      } catch (error: any) {
        console.warn('⚠️ Could not fetch sender details:', error.message);
        senderName = 'Anonymous';
      }
  
      // 4. Get recipient name
      let recipientName = 'Someone';
      try {
        console.log('👤 Fetching recipient details with ID:', recipientId);
        const recipient = await personaService.getPersonaById(recipientId);
        recipientName = recipient.username;
        console.log('✅ Recipient found:', recipientName);
      } catch (error: any) {
        console.warn('⚠️ Could not fetch recipient details:', error.message);
        recipientName = 'Someone';
      }
  
      // 5. Create gift message object for chat
      const giftMessage: ChatGiftMessage = {
        type: 'gift',
        giftId: gift.id,
        giftName: gift.name,
        giftImage: gift.imageUrl,
        message: message,
        isAnimated: gift.isAnimated,
        animationUrl: gift.animationUrl,
        price: gift.price,
        category: gift.category,
        timestamp: new Date().toISOString()
      };
  
      console.log('📝 Gift message created:', giftMessage);
  
      // 6. Update conversation if it exists
      let chatMessageId: string | undefined = giftSendResult.giftTransactionId;
      if (conversationId) {
        try {
          await this.updateConversationWithGift(conversationId, giftMessage, message);
          console.log('✅ Conversation updated with gift');
        } catch (error: any) {
          console.error('❌ Error updating conversation:', error);
        }
      }
  
      console.log('✅ Gift transaction ID from giftService:', chatMessageId);
  
      // 7. Signal that AI should respond to this gift
      return {
        success: true,
        chatMessageId: chatMessageId || undefined,
        giftMessage,
        shouldTriggerAIResponse: true
      };
  
    } catch (error: any) {
      console.error('❌ Error sending gift to chat:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send gift to chat' 
      };
    }
  }

  private async updateConversationWithGift(
    conversationId: string,
    giftMessage: ChatGiftMessage,
    personalMessage?: string
  ): Promise<void> {
    try {
      const giftText = personalMessage 
        ? `🎁 Sent ${giftMessage.giftName} with message`
        : `🎁 Sent ${giftMessage.giftName}`;
      
      try {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.CONVERSATIONS,
          conversationId,
          {
            lastMessage: giftText,
            lastMessageAt: new Date().toISOString(),
            hasGifts: true
          }
        );
      } catch (error: any) {
        if (error.message?.includes('Attribute not found')) {
          await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.CONVERSATIONS,
            conversationId,
            {
              lastMessage: giftText,
              lastMessageAt: new Date().toISOString()
            }
          );
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error updating conversation:', error);
    }
  }

  private async createGiftNotification(notification: GiftNotification): Promise<void> {
    console.log('ℹ️ Skipping notification creation - notifications collection not found');
    return;
  }

  async getGiftsInConversation(conversationId: string): Promise<ChatGiftMessage[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.MESSAGES,
        [
          Query.equal('conversationId', conversationId),
          Query.orderAsc('timestamp'),
          Query.limit(100)
        ]
      );

      const giftMessages: ChatGiftMessage[] = [];

      for (const doc of response.documents) {
        if (doc.isGift === true && doc.giftData) {
          try {
            const giftData = JSON.parse(doc.giftData);
            giftMessages.push(giftData);
          } catch (error) {
            console.error('Error parsing gift data:', error);
            if (doc.giftId || doc.giftName) {
              giftMessages.push({
                type: 'gift',
                giftId: parseInt(doc.giftId || '0'),
                giftName: doc.giftName || 'Gift',
                giftImage: doc.giftImage,
                message: doc.content?.includes('Message:') 
                  ? doc.content.split('Message:')[1]?.trim() 
                  : doc.message,
                isAnimated: false,
                animationUrl: '',
                price: doc.giftPrice || 0,
                category: '',
                timestamp: doc.timestamp || doc.$createdAt
              });
            }
          }
        } 
        else if (doc.content && (doc.content.includes('🎁') || doc.content.includes('Gift:'))) {
          const isGift = doc.content.includes('🎁') || doc.content.includes('Gift:');
          if (isGift) {
            const giftMatch = doc.content.match(/🎁 Gift: (.+?)(?:\n|$)/) || 
                             doc.content.match(/🎁 Sent (.+?)(?:\n|$)/);
            const messageMatch = doc.content.match(/Message: (.+?)(?:\n|$)/);
            
            if (giftMatch) {
              giftMessages.push({
                type: 'gift',
                giftId: 0,
                giftName: giftMatch[1],
                giftImage: '',
                message: messageMatch ? messageMatch[1] : '',
                isAnimated: false,
                animationUrl: '',
                price: 0,
                category: '',
                timestamp: doc.timestamp || doc.$createdAt
              });
            }
          }
        }
      }

      return giftMessages;
    } catch (error) {
      console.error('Error fetching gifts in conversation:', error);
      return [];
    }
  }

  async getGiftNotifications(userId: string, limit: number = 10): Promise<GiftNotification[]> {
    return [];
  }

  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    return true;
  }

  async getEnrichedGiftMessages(conversationId: string): Promise<Array<ChatGiftMessage & { giftDetails?: GiftItem }>> {
    try {
      const giftMessages = await this.getGiftsInConversation(conversationId);
      
      const enriched = await Promise.all(
        giftMessages.map(async (giftMsg) => {
          try {
            const giftDetails = await giftService.getGiftById(giftMsg.giftId);
            return {
              ...giftMsg,
              giftDetails: giftDetails || undefined
            };
          } catch (error) {
            return giftMsg;
          }
        })
      );
      
      return enriched;
    } catch (error) {
      console.error('Error enriching gift messages:', error);
      return [];
    }
  }

  isGiftMessage(message: any): boolean {
    return message?.isGift === true || 
           message?.type === 'gift' || 
           (message?.content && (message.content.includes('🎁') || message.content.includes('Gift:')));
  }

  parseGiftMessage(message: any): ChatGiftMessage | null {
    if (this.isGiftMessage(message)) {
      try {
        if (message.giftData) {
          return JSON.parse(message.giftData);
        }
        
        if (message.giftId || message.giftName) {
          return {
            type: 'gift',
            giftId: message.giftId || 0,
            giftName: message.giftName || 'Gift',
            giftImage: message.giftImage,
            message: message.message || '',
            isAnimated: message.isAnimated || false,
            animationUrl: message.animationUrl || '',
            price: message.giftPrice || 0,
            category: message.category || '',
            timestamp: message.timestamp || message.$createdAt
          };
        }
        
        if (message.content) {
          const giftMatch = message.content.match(/🎁 Gift: (.+?)(?:\n|$)/) || 
                           message.content.match(/🎁 Sent (.+?)(?:\n|$)/);
          const messageMatch = message.content.match(/Message: (.+?)(?:\n|$)/);
          
          if (giftMatch) {
            return {
              type: 'gift',
              giftId: 0,
              giftName: giftMatch[1],
              giftImage: '',
              message: messageMatch ? messageMatch[1] : '',
              isAnimated: false,
              animationUrl: '',
              price: 0,
              category: '',
              timestamp: message.timestamp || message.$createdAt
            };
          }
        }
      } catch (error) {
        console.error('Error parsing gift message:', error);
        return null;
      }
    }
    return null;
  }

  async getTotalGiftsInConversation(conversationId: string): Promise<number> {
    try {
      const gifts = await this.getGiftsInConversation(conversationId);
      return gifts.length;
    } catch (error) {
      console.error('Error getting total gifts:', error);
      return 0;
    }
  }

  async getGiftStatsForConversation(conversationId: string): Promise<{
    totalGifts: number;
    totalCreditsSpent: number;
    mostExpensiveGift?: ChatGiftMessage;
  }> {
    try {
      const gifts = await this.getGiftsInConversation(conversationId);
      const totalGifts = gifts.length;
      const totalCreditsSpent = gifts.reduce((sum, gift) => sum + gift.price, 0);
      const mostExpensiveGift = gifts.length > 0 
        ? gifts.reduce((max, gift) => gift.price > max.price ? gift : max)
        : undefined;
      
      return {
        totalGifts,
        totalCreditsSpent,
        mostExpensiveGift
      };
    } catch (error) {
      console.error('Error getting gift stats:', error);
      return {
        totalGifts: 0,
        totalCreditsSpent: 0
      };
    }
  }
}

export default new GiftHandlerService();