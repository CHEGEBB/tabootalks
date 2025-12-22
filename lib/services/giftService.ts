/* eslint-disable @typescript-eslint/no-explicit-any */
import { databases } from '@/lib/appwrite/config';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/config';
import { Query, ID } from 'appwrite';
import creditService from './creditService';
import personaService, { ParsedPersonaProfile } from './personaService';

export interface GiftItem {
  id: number;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  isAnimated: boolean;
  imageUrl: string;
  animationUrl?: string;
  popularityScore: number;
  tags?: string[];
}

export interface GiftTransaction {
  senderId: string;
  recipientId: string;
  recipientName: string;
  giftId: number;
  giftName: string;
  giftPrice: number;
  giftImage?: string;
  message?: string;
  sentAt: string;
  isAnimated?: boolean;
  animationUrl?: string;
  category?: string;
  status?: 'sent' | 'received' | 'viewed';
}

export interface AppwriteGiftDocument {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  senderId: string;
  recipientId: string;
  recipientName: string;
  giftId: number;
  giftName: string;
  giftPrice: number;
  giftImage?: string;
  message?: string;
  sentAt: string;
  isAnimated: boolean;
  animationUrl?: string;
  category?: string;
  status: 'sent' | 'received' | 'viewed';
}

class GiftService {
  private giftsCache: GiftItem[] | null = null;

  async loadAllGifts(): Promise<GiftItem[]> {
    if (this.giftsCache) return this.giftsCache;

    try {
      const [staticResponse, animatedResponse] = await Promise.all([
        fetch('/data/gifts.json'),
        fetch('/data/animated-gifts.json')
      ]);
      
      const staticGifts = await staticResponse.json();
      const animatedGifts = await animatedResponse.json();
      
      this.giftsCache = [...staticGifts, ...animatedGifts];
      return this.giftsCache;
    } catch (error) {
      console.error('Error loading gifts:', error);
      return [];
    }
  }

  async getGiftById(giftId: number): Promise<GiftItem | null> {
    const gifts = await this.loadAllGifts();
    return gifts.find(g => g.id === giftId) || null;
  }

  async getGiftsByCategory(category: string): Promise<GiftItem[]> {
    const gifts = await this.loadAllGifts();
    if (category === 'all') return gifts;
    if (category === 'popular') {
      return gifts.filter(g => g.popularityScore > 200)
                 .sort((a, b) => b.popularityScore - a.popularityScore);
    }
    return gifts.filter(g => g.category === category);
  }

  async getFeaturedGifts(): Promise<GiftItem[]> {
    const gifts = await this.loadAllGifts();
    return gifts
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, 8);
  }

  async getGiftsGroupedByCategory(): Promise<Record<string, GiftItem[]>> {
    const gifts = await this.loadAllGifts();
    const grouped: Record<string, GiftItem[]> = {};
    
    const featuredGifts = gifts
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, 8);
    grouped['featured'] = featuredGifts;
    
    gifts.forEach(gift => {
      if (!featuredGifts.find(f => f.id === gift.id)) {
        if (!grouped[gift.category]) {
          grouped[gift.category] = [];
        }
        grouped[gift.category].push(gift);
      }
    });
    
    return grouped;
  }

  async sendGift(
    senderId: string,
    recipientId: string,
    giftId: number,
    message?: string,
    conversationId?: string
  ): Promise<{ success: boolean; newBalance: number; giftTransactionId?: string; error?: string }> {
    try {
      console.log('🔵 GIFT_SERVICE: Starting sendGift', {
        senderId,
        recipientId,
        giftId,
        message,
        conversationId
      });

      const gift = await this.getGiftById(giftId);
      if (!gift) {
        console.error('🔴 GIFT_SERVICE: Gift not found', giftId);
        return { success: false, newBalance: 0, error: 'Gift not found' };
      }

      console.log('🔵 GIFT_SERVICE: Gift found', {
        name: gift.name,
        price: gift.price,
        id: gift.id,
        isAnimated: gift.isAnimated,
        animationUrl: gift.animationUrl,
        imageUrl: gift.imageUrl
      });

      const hasEnoughCredits = await creditService.hasEnoughCredits(senderId, gift.price);
      console.log('🔵 GIFT_SERVICE: Has enough credits?', hasEnoughCredits);
      
      if (!hasEnoughCredits) {
        const currentBalance = await creditService.getCurrentBalance(senderId);
        console.error('🔴 GIFT_SERVICE: Insufficient credits', {
          currentBalance,
          required: gift.price,
          missing: gift.price - currentBalance
        });
        return { 
          success: false, 
          newBalance: currentBalance,
          error: 'Insufficient credits' 
        };
      }

      let recipientName = 'Unknown';
      try {
        const recipient = await personaService.getPersonaById(recipientId);
        recipientName = recipient.username;
        console.log('🔵 GIFT_SERVICE: Recipient found', recipientName);
      } catch (error) {
        console.warn('⚠️ GIFT_SERVICE: Could not fetch recipient details:', error);
      }

      const success = await creditService.useCredits(
        senderId,
        gift.price,
        `Sent ${gift.name} to ${recipientName}`,
        {
          giftId: gift.id,
          giftName: gift.name,
          recipientId: recipientId,
          recipientName: recipientName,
          message: message
        }
      );

      console.log('🔵 GIFT_SERVICE: Credit deduction result:', success);

      if (!success) {
        const currentBalance = await creditService.getCurrentBalance(senderId);
        console.error('🔴 GIFT_SERVICE: Failed to process payment');
        return { 
          success: false, 
          newBalance: currentBalance,
          error: 'Failed to process payment' 
        };
      }

      const giftTransactionData: GiftTransaction = {
        senderId,
        recipientId,
        recipientName,
        giftId: gift.id,
        giftName: gift.name,
        giftPrice: gift.price,
        giftImage: gift.imageUrl,
        message,
        sentAt: new Date().toISOString(),
        isAnimated: gift.isAnimated,
        animationUrl: gift.animationUrl,
        category: gift.category,
        status: 'sent'
      };

      console.log('🔵 GIFT_SERVICE: Saving gift transaction with animationUrl:', gift.animationUrl);
      const savedTransaction = await this.saveGiftTransaction(giftTransactionData);

      if (conversationId && savedTransaction && savedTransaction.$id) {
        try {
          console.log('🔵 GIFT_SERVICE: Updating gift with conversationId', conversationId);
          await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.GIFTS,
            savedTransaction.$id,
            { conversationId: conversationId }
          );
          console.log('✅ GIFT_SERVICE: Updated gift with conversationId');
        } catch (updateError) {
          console.warn('⚠️ GIFT_SERVICE: Could not update gift with conversationId:', updateError);
        }
      }

      const newBalance = await creditService.getCurrentBalance(senderId);
      console.log('✅ GIFT_SERVICE: Gift sent successfully!', {
        newBalance,
        giftTransactionId: savedTransaction?.$id,
        isAnimated: gift.isAnimated,
        hasAnimationUrl: !!gift.animationUrl
      });

      return { 
        success: true, 
        newBalance,
        giftTransactionId: savedTransaction?.$id 
      };
        
    } catch (error: any) {
      console.error('🔴 GIFT_SERVICE: Error sending gift:', error);
      const currentBalance = await creditService.getCurrentBalance(senderId);
      return { 
        success: false, 
        newBalance: currentBalance,
        error: error.message || 'Failed to send gift' 
      };
    }
  }

  private async saveGiftTransaction(transaction: GiftTransaction): Promise<AppwriteGiftDocument | null> {
    try {
      console.log('💾 GIFT_SERVICE: Creating gift transaction for giftId:', transaction.giftId, {
        isAnimated: transaction.isAnimated,
        animationUrl: transaction.animationUrl,
        giftImage: transaction.giftImage
      });
      
      const result = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.GIFTS,
        ID.unique(),
        {
          senderId: transaction.senderId,
          recipientId: transaction.recipientId,
          recipientName: transaction.recipientName,
          giftId: transaction.giftId.toString(), // Store as string
          giftName: transaction.giftName,
          giftPrice: transaction.giftPrice,
          giftImage: transaction.giftImage || '',
          message: transaction.message || '',
          sentAt: transaction.sentAt,
          isAnimated: transaction.isAnimated || false,
          animationUrl: transaction.animationUrl || '',
          category: transaction.category || '',
          status: transaction.status || 'sent',
          conversationId: ''
        }
      );

      console.log('✅ GIFT_SERVICE: Transaction created with ID:', result.$id, {
        isAnimated: transaction.isAnimated,
        animationUrl: transaction.animationUrl
      });
      
      return {
        $id: result.$id,
        $createdAt: result.$createdAt,
        $updatedAt: result.$updatedAt,
        senderId: transaction.senderId,
        recipientId: transaction.recipientId,
        recipientName: transaction.recipientName,
        giftId: transaction.giftId,
        giftName: transaction.giftName,
        giftPrice: transaction.giftPrice,
        giftImage: transaction.giftImage || '',
        message: transaction.message || '',
        sentAt: transaction.sentAt,
        isAnimated: transaction.isAnimated || false,
        animationUrl: transaction.animationUrl || '',
        category: transaction.category || '',
        status: transaction.status || 'sent'
      };
    } catch (error: any) {
      console.error('🔴 GIFT_SERVICE: Error saving gift transaction:', error);
      console.error('🔴 GIFT_SERVICE: Error details:', error.message);
      console.error('🔴 GIFT_SERVICE: Data that caused error:', {
        senderId: transaction.senderId,
        recipientId: transaction.recipientId,
        giftId: transaction.giftId,
        giftIdAsString: transaction.giftId.toString(),
        giftName: transaction.giftName,
        giftPrice: transaction.giftPrice,
        isAnimated: transaction.isAnimated,
        animationUrl: transaction.animationUrl
      });
      return null;
    }
  }

  async getGiftHistory(
    userId: string, 
    type: 'sent' | 'received' = 'sent',
    limit: number = 20
  ): Promise<AppwriteGiftDocument[]> {
    try {
      const field = type === 'sent' ? 'senderId' : 'recipientId';
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.GIFTS,
        [
          Query.equal(field, userId),
          Query.orderDesc('sentAt'),
          Query.limit(limit)
        ]
      );

      return response.documents as unknown as AppwriteGiftDocument[];
    } catch (error) {
      console.error('Error fetching gift history:', error);
      return [];
    }
  }

  async getRecentGifts(userId: string, limit: number = 10): Promise<{
    sent: AppwriteGiftDocument[];
    received: AppwriteGiftDocument[];
  }> {
    try {
      const [sentGifts, receivedGifts] = await Promise.all([
        this.getGiftHistory(userId, 'sent', limit),
        this.getGiftHistory(userId, 'received', limit)
      ]);

      return { sent: sentGifts, received: receivedGifts };
    } catch (error) {
      console.error('Error fetching recent gifts:', error);
      return { sent: [], received: [] };
    }
  }

  async getGiftStats(userId: string): Promise<{
    totalSent: number;
    totalReceived: number;
    totalSpent: number;
    favoriteGift?: { giftId: number; giftName: string; count: number };
  }> {
    try {
      const [sentGifts, receivedGifts] = await Promise.all([
        this.getGiftHistory(userId, 'sent', 1000),
        this.getGiftHistory(userId, 'received', 1000)
      ]);

      const totalSent = sentGifts.length;
      const totalReceived = receivedGifts.length;
      const totalSpent = sentGifts.reduce((sum, gift) => sum + gift.giftPrice, 0);

      const giftCounts: Record<number, { count: number; name: string }> = {};
      sentGifts.forEach(gift => {
        if (!giftCounts[gift.giftId]) {
          giftCounts[gift.giftId] = { count: 0, name: gift.giftName };
        }
        giftCounts[gift.giftId].count++;
      });

      let favoriteGift: { giftId: number; giftName: string; count: number } | undefined;
      Object.entries(giftCounts).forEach(([giftId, data]) => {
        if (!favoriteGift || data.count > favoriteGift.count) {
          favoriteGift = {
            giftId: parseInt(giftId),
            giftName: data.name,
            count: data.count
          };
        }
      });

      return {
        totalSent,
        totalReceived,
        totalSpent,
        favoriteGift
      };
    } catch (error) {
      console.error('Error calculating gift stats:', error);
      return {
        totalSent: 0,
        totalReceived: 0,
        totalSpent: 0
      };
    }
  }

  async canAffordGift(userId: string, giftId: number): Promise<{
    canAfford: boolean;
    giftPrice: number;
    userBalance: number;
    missingCredits?: number;
  }> {
    try {
      const gift = await this.getGiftById(giftId);
      if (!gift) {
        return { canAfford: false, giftPrice: 0, userBalance: 0, missingCredits: 0 };
      }

      const userBalance = await creditService.getCurrentBalance(userId);
      const canAfford = userBalance >= gift.price;
      
      return {
        canAfford,
        giftPrice: gift.price,
        userBalance,
        missingCredits: canAfford ? 0 : gift.price - userBalance
      };
    } catch (error) {
      console.error('Error checking gift affordability:', error);
      return { canAfford: false, giftPrice: 0, userBalance: 0, missingCredits: 0 };
    }
  }

  async markAsViewed(giftId: string): Promise<boolean> {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.GIFTS,
        giftId,
        { status: 'viewed' }
      );
      return true;
    } catch (error) {
      console.error('Error marking gift as viewed:', error);
      return false;
    }
  }

  async getGiftDocumentById(documentId: string): Promise<AppwriteGiftDocument | null> {
    try {
      const document = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.GIFTS,
        documentId
      );
      return document as unknown as AppwriteGiftDocument;
    } catch (error) {
      console.error('Error fetching gift document:', error);
      return null;
    }
  }

  async getEnrichedGiftDocument(documentId: string): Promise<(AppwriteGiftDocument & { giftDetails?: GiftItem }) | null> {
    try {
      const giftDoc = await this.getGiftDocumentById(documentId);
      if (!giftDoc) return null;

      const giftDetails = await this.getGiftById(giftDoc.giftId);
      
      return {
        ...giftDoc,
        giftDetails: giftDetails || undefined
      };
    } catch (error) {
      console.error('Error fetching enriched gift document:', error);
      return null;
    }
  }

  async getEnrichedGiftHistory(
    userId: string, 
    type: 'sent' | 'received' = 'sent',
    limit: number = 20
  ): Promise<Array<AppwriteGiftDocument & { giftDetails?: GiftItem }>> {
    try {
      const giftDocs = await this.getGiftHistory(userId, type, limit);
      
      const enrichedGifts = await Promise.all(
        giftDocs.map(async (doc) => {
          const giftDetails = await this.getGiftById(doc.giftId);
          return {
            ...doc,
            giftDetails: giftDetails || undefined
          };
        })
      );
      
      return enrichedGifts;
    } catch (error) {
      console.error('Error fetching enriched gift history:', error);
      return [];
    }
  }
}

export default new GiftService();