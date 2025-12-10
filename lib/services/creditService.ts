/* eslint-disable @typescript-eslint/no-explicit-any */
import { databases } from '@/lib/appwrite/config';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/config';
import { Query, type Models } from 'appwrite';

// Extend Models.Document to include all required AppWrite document properties
interface CreditTransaction extends Models.Document {
  transactionId: string;
  userId: string;
  type: 'CREDIT_PURCHASE' | 'CREDIT_USAGE' | 'CREDIT_BONUS' | 'CREDIT_REFUND' | 'PURCHASE' | 'USAGE' | 'REFUND' | 'BONUS';
  amount: number;
  description: string;
  balanceBefore: number;
  balanceAfter: number;
  metadata?: Record<string, any>;
  timestamp: string;
}

interface UserCreditSummary {
  currentBalance: number;
  totalPurchased: number;
  totalUsed: number;
  lastTransaction: CreditTransaction | null;
}

interface TransactionInput {
  userId: string;
  type: CreditTransaction['type'];
  amount: number;
  description: string;
  balanceBefore: number;
  balanceAfter: number;
  metadata?: Record<string, any>;
  timestamp?: string;
  transactionId?: string;
}

class CreditService {
  private getCreditCollectionId(): string {
    // First check if we have a dedicated credit transactions collection
    if (COLLECTIONS.CREDIT_TRANSACTIONS) {
      return COLLECTIONS.CREDIT_TRANSACTIONS;
    }
    
    // Fallback to TRANSACTIONS collection
    return COLLECTIONS.TRANSACTIONS;
  }

  async getUserCredits(userId: string): Promise<UserCreditSummary> {
    try {
      const collectionId = this.getCreditCollectionId();
      
      // Get all transactions for the user
      const transactions = await databases.listDocuments(
        DATABASE_ID,
        collectionId,
        [
          Query.equal('userId', userId),
          Query.orderDesc('timestamp')
        ]
      );

      const documents = transactions.documents as unknown as CreditTransaction[];
      
      if (documents.length === 0) {
        return {
          currentBalance: 0,
          totalPurchased: 0,
          totalUsed: 0,
          lastTransaction: null
        };
      }

      // Filter only credit transactions
      const creditTransactions = documents.filter(
        transaction => transaction.type?.includes('CREDIT') || 
                      ['PURCHASE', 'USAGE', 'REFUND', 'BONUS'].includes(transaction.type)
      );

      if (creditTransactions.length === 0) {
        return {
          currentBalance: 0,
          totalPurchased: 0,
          totalUsed: 0,
          lastTransaction: null
        };
      }

      // Calculate current balance from the latest transaction
      const currentBalance = creditTransactions[0].balanceAfter || 0;

      // Calculate totals
      let totalPurchased = 0;
      let totalUsed = 0;

      creditTransactions.forEach(transaction => {
        if (transaction.amount > 0) {
          // Positive amounts are purchases, bonuses, or refunds
          if (['CREDIT_PURCHASE', 'PURCHASE', 'CREDIT_BONUS', 'BONUS', 'CREDIT_REFUND', 'REFUND'].includes(transaction.type)) {
            totalPurchased += transaction.amount;
          }
        } else if (transaction.amount < 0) {
          // Negative amounts are usage
          if (['CREDIT_USAGE', 'USAGE'].includes(transaction.type)) {
            totalUsed += Math.abs(transaction.amount);
          }
        }
      });

      return {
        currentBalance,
        totalPurchased,
        totalUsed,
        lastTransaction: creditTransactions[0] || null
      };

    } catch (error) {
      console.error('Error fetching user credits:', error);
      // Return default values instead of throwing
      return {
        currentBalance: 0,
        totalPurchased: 0,
        totalUsed: 0,
        lastTransaction: null
      };
    }
  }

  async getCurrentBalance(userId: string): Promise<number> {
    try {
      const collectionId = this.getCreditCollectionId();
      
      const transactions = await databases.listDocuments(
        DATABASE_ID,
        collectionId,
        [
          Query.equal('userId', userId),
          Query.orderDesc('timestamp'),
          Query.limit(1)
        ]
      );

      if (transactions.documents.length === 0) {
        return 0;
      }

      const latestTransaction = transactions.documents[0] as unknown as CreditTransaction;
      
      // Return balanceAfter if it exists, otherwise 0
      return latestTransaction.balanceAfter || 0;

    } catch (error) {
      console.error('Error fetching current balance:', error);
      return 0;
    }
  }

  async addTransaction(transactionData: TransactionInput): Promise<CreditTransaction> {
    try {
      const collectionId = this.getCreditCollectionId();
      
      // Prepare the transaction data
      const finalTransactionData = {
        ...transactionData,
        transactionId: transactionData.transactionId || `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: transactionData.timestamp || new Date().toISOString(),
        metadata: transactionData.metadata || {},
      };

      const result = await databases.createDocument(
        DATABASE_ID,
        collectionId,
        'unique()',
        finalTransactionData
      );

      return result as unknown as CreditTransaction;
    } catch (error) {
      console.error('Error adding credit transaction:', error);
      throw error;
    }
  }

  // Get recent credit transactions
  async getRecentTransactions(userId: string, limit: number = 10): Promise<CreditTransaction[]> {
    try {
      const collectionId = this.getCreditCollectionId();
      
      const transactions = await databases.listDocuments(
        DATABASE_ID,
        collectionId,
        [
          Query.equal('userId', userId),
          Query.orderDesc('timestamp'),
          Query.limit(limit)
        ]
      );

      // Filter only credit-related transactions
      const creditTransactions = transactions.documents.filter(
        (doc: any) => {
          const transaction = doc as unknown as CreditTransaction;
          return transaction.type?.includes('CREDIT') || 
                 ['PURCHASE', 'USAGE', 'REFUND', 'BONUS'].includes(transaction.type);
        }
      );

      return creditTransactions as unknown as CreditTransaction[];
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      return [];
    }
  }

  // Update user credits (purchase or usage)
  async updateCredits(
    userId: string, 
    amount: number, 
    type: CreditTransaction['type'],
    description: string,
    metadata?: Record<string, any>
  ): Promise<number> {
    try {
      // Get current balance
      const currentBalance = await this.getCurrentBalance(userId);
      const newBalance = currentBalance + amount;

      // Add transaction record
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

  // Helper method to check if user has enough credits
  async hasEnoughCredits(userId: string, requiredAmount: number): Promise<boolean> {
    const currentBalance = await this.getCurrentBalance(userId);
    return currentBalance >= requiredAmount;
  }

  // Helper method to use credits
  async useCredits(userId: string, amount: number, description: string, metadata?: Record<string, any>): Promise<boolean> {
    try {
      // Check if user has enough credits
      const hasEnough = await this.hasEnoughCredits(userId, amount);
      if (!hasEnough) {
        return false;
      }

      // Deduct credits
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
}

export default new CreditService();