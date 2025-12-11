/* eslint-disable @typescript-eslint/no-explicit-any */
import { databases } from '@/lib/appwrite/config';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/config';
import { Query, type Models } from 'appwrite';

interface CreditTransaction extends Models.Document {
  userId: string;
  type: 'CREDIT_PURCHASE' | 'CREDIT_USAGE' | 'CREDIT_BONUS' | 'CREDIT_REFUND' | 'PURCHASE' | 'USAGE' | 'REFUND' | 'BONUS';
  amount: number;
  description: string;
  balanceBefore: number;
  balanceAfter: number;
  metadata?: Record<string, any>;
  timestamp: string;
}

class CreditService {
  async getCurrentBalance(userId: string): Promise<number> {
    try {
      // FIXED: Fetch from USER DOCUMENT, not transactions
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS, // CHANGE THIS to USERS
        [
          Query.equal('userId', userId),
          Query.limit(1)
        ]
      );

      if (response.documents.length === 0) {
        return 0;
      }

      const userDoc = response.documents[0];
      return userDoc.credits || 0;

    } catch (error) {
      console.error('Error fetching current balance:', error);
      return 0;
    }
  }

  async updateCredits(
    userId: string, 
    amount: number, 
    type: CreditTransaction['type'],
    description: string,
    metadata?: Record<string, any>
  ): Promise<number> {
    try {
      // 1. Get current balance from USER DOCUMENT
      const currentBalance = await this.getCurrentBalance(userId);
      const newBalance = currentBalance + amount;

      // 2. UPDATE USER DOCUMENT
      const userResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.equal('userId', userId), Query.limit(1)]
      );
      
      if (userResponse.documents.length > 0) {
        const userDoc = userResponse.documents[0];
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.USERS,
          userDoc.$id,
          {
            credits: newBalance,
            lastActive: new Date().toISOString()
          }
        );
      }

      // 3. Add transaction record (for history)
      await this.addTransaction({
        userId,
        type,
        amount,
        description,
        balanceBefore: currentBalance,
        balanceAfter: newBalance,
        metadata: metadata || {},
        timestamp: new Date().toISOString()
      });

      return newBalance;
    } catch (error) {
      console.error('Error updating credits:', error);
      throw error;
    }
  }

  async useCredits(userId: string, amount: number, description: string, metadata?: Record<string, any>): Promise<boolean> {
    try {
      // Check if user has enough credits
      const currentBalance = await this.getCurrentBalance(userId);
      if (currentBalance < amount) {
        return false;
      }

      // Use updateCredits which updates BOTH user doc and transaction
      await this.updateCredits(
        userId,
        -amount,
        'CREDIT_USAGE',
        description,
        metadata
      );

      return true;
    } catch (error) {
      console.error('Error using credits:', error);
      return false;
    }
  }

  async addTransaction(transactionData: any): Promise<any> {
    try {
      const collectionId = COLLECTIONS.CREDIT_TRANSACTIONS || COLLECTIONS.TRANSACTIONS || 'transactions';
      
      const result = await databases.createDocument(
        DATABASE_ID,
        collectionId,
        'unique()',
        {
          ...transactionData,
          transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }
      );
      return result;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  // Keep other methods but they should reference USER DOCUMENT, not transactions
  async getUserCredits(userId: string): Promise<{
    currentBalance: number;
    totalPurchased: number;
    totalUsed: number;
    lastTransaction: CreditTransaction | null;
  }> {
    try {
      // Get current from user doc
      const currentBalance = await this.getCurrentBalance(userId);
      
      // Get history from transactions
      const transactions = await this.getRecentTransactions(userId, 100);
      
      let totalPurchased = 0;
      let totalUsed = 0;
      
      transactions.forEach(tx => {
        if (tx.amount > 0) totalPurchased += tx.amount;
        if (tx.amount < 0) totalUsed += Math.abs(tx.amount);
      });
      
      return {
        currentBalance,
        totalPurchased,
        totalUsed,
        lastTransaction: transactions[0] || null
      };
    } catch (error) {
      console.error('Error getting user credits:', error);
      return {
        currentBalance: 0,
        totalPurchased: 0,
        totalUsed: 0,
        lastTransaction: null
      };
    }
  }

  async getRecentTransactions(userId: string, limit: number = 10): Promise<CreditTransaction[]> {
    try {
      const collectionId = COLLECTIONS.CREDIT_TRANSACTIONS || COLLECTIONS.TRANSACTIONS || 'transactions';
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        collectionId,
        [
          Query.equal('userId', userId),
          Query.orderDesc('timestamp'),
          Query.limit(limit)
        ]
      );

      return response.documents as unknown as CreditTransaction[];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  async hasEnoughCredits(userId: string, requiredAmount: number): Promise<boolean> {
    const currentBalance = await this.getCurrentBalance(userId);
    return currentBalance >= requiredAmount;
  }
}

export default new CreditService();