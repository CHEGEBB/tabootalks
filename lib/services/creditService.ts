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
  timestamp: string;
}

class CreditService {
  async getCurrentBalance(userId: string): Promise<number> {
    try {
      // FIRST TRY: Get by document ID (since that's how you fetch in chat page)
      try {
        const userDoc = await databases.getDocument(
          DATABASE_ID,
          COLLECTIONS.USERS,
          userId  // userId should be the document ID
        );
        return userDoc.credits || 0;
      } catch (getError: any) {
        // If getDocument fails, try listDocuments with $id field
        if (getError.code === 404 || getError.message?.includes('not found')) {
          const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.USERS,
            [
              Query.equal('$id', userId),
              Query.limit(1)
            ]
          );

          if (response.documents.length === 0) {
            // Last try: maybe there's a userId field
            const response2 = await databases.listDocuments(
              DATABASE_ID,
              COLLECTIONS.USERS,
              [
                Query.equal('userId', userId),
                Query.limit(1)
              ]
            );
            
            if (response2.documents.length > 0) {
              return response2.documents[0].credits || 0;
            }
            return 0;
          }

          const userDoc = response.documents[0];
          return userDoc.credits || 0;
        }
        throw getError;
      }

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
      // 1. Get current balance
      const currentBalance = await this.getCurrentBalance(userId);
      const newBalance = Math.max(0, currentBalance + amount); // Ensure never negative

      // 2. Try multiple ways to find and update user document
      let userDocId = userId; // Default to using userId as document ID
      
      // First try to get the document directly
      try {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.USERS,
          userId, // Try userId as document ID
          {
            credits: newBalance,
            lastActive: new Date().toISOString()
          }
        );
      } catch (updateError: any) {
        // If that fails, try to find document by userId field
        if (updateError.code === 404 || updateError.message?.includes('not found')) {
          console.log('Document not found with ID, searching by userId field...');
          
          const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.USERS,
            [Query.equal('userId', userId), Query.limit(1)]
          );
          
          if (response.documents.length > 0) {
            userDocId = response.documents[0].$id;
            await databases.updateDocument(
              DATABASE_ID,
              COLLECTIONS.USERS,
              userDocId,
              {
                credits: newBalance,
                lastActive: new Date().toISOString()
              }
            );
          } else {
            // Last try: find by $id field
            const response2 = await databases.listDocuments(
              DATABASE_ID,
              COLLECTIONS.USERS,
              [Query.equal('$id', userId), Query.limit(1)]
            );
            
            if (response2.documents.length > 0) {
              userDocId = response2.documents[0].$id;
              await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.USERS,
                userDocId,
                {
                  credits: newBalance,
                  lastActive: new Date().toISOString()
                }
              );
            } else {
              throw new Error(`User document not found for userId: ${userId}`);
            }
          }
        } else {
          throw updateError;
        }
      }

      // 3. Add transaction record
      await this.addTransaction({
        userId: userId,
        type,
        amount,
        description,
        balanceBefore: currentBalance,
        balanceAfter: newBalance,
        timestamp: new Date().toISOString()
      });

      // Log for debugging
      console.log('Credits updated:', {
        userId,
        amount,
        type,
        description,
        oldBalance: currentBalance,
        newBalance,
        metadata
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
      console.log('useCredits check:', { userId, amount, currentBalance });
      
      if (currentBalance < amount) {
        console.warn('Insufficient credits:', { currentBalance, required: amount });
        return false;
      }

      // Use negative amount to deduct
      await this.updateCredits(
        userId,
        -amount, // Negative amount for deduction
        'CREDIT_USAGE',
        description,
        metadata
      );

      // Verify deduction worked
      const updatedBalance = await this.getCurrentBalance(userId);
      console.log('After deduction:', { updatedBalance, expected: currentBalance - amount });
      
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
          userId: transactionData.userId,
          type: transactionData.type,
          amount: transactionData.amount,
          description: transactionData.description,
          balanceBefore: transactionData.balanceBefore,
          balanceAfter: transactionData.balanceAfter,
          timestamp: transactionData.timestamp,
          transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }
      );
      return result;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  async getUserCredits(userId: string): Promise<{
    currentBalance: number;
    totalPurchased: number;
    totalUsed: number;
    lastTransaction: CreditTransaction | null;
  }> {
    try {
      const currentBalance = await this.getCurrentBalance(userId);
      
      // Try to get transactions for this user
      let transactions: CreditTransaction[] = [];
      try {
        const collectionId = COLLECTIONS.CREDIT_TRANSACTIONS || COLLECTIONS.TRANSACTIONS || 'transactions';
        
        const response = await databases.listDocuments(
          DATABASE_ID,
          collectionId,
          [
            Query.equal('userId', userId),
            Query.orderDesc('timestamp'),
            Query.limit(100)
          ]
        );
        transactions = response.documents as unknown as CreditTransaction[];
      } catch (txError) {
        console.warn('Could not fetch transactions:', txError);
      }
      
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
    console.log('hasEnoughCredits check:', { userId, requiredAmount, currentBalance });
    return currentBalance >= requiredAmount;
  }

  // Add a method to force refresh user data in chat
  async forceRefreshUser(userId: string): Promise<number> {
    return this.getCurrentBalance(userId);
  }
}

export default new CreditService();