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

// Credit handler function URL
const CREDIT_HANDLER_URL = process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_CREDIT_HANDLER || 'https://693bd2ed00102f4a9a90.fra.appwrite.run';

class CreditService {
  
  // ==========================================
  // STRIPE PAYMENT METHODS
  // ==========================================

  /**
   * Create a Stripe Checkout session for purchasing credits
   */
  async createStripeCheckout(userId: string, credits: number): Promise<{
    success: boolean;
    sessionId?: string;
    checkoutUrl?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(CREDIT_HANDLER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_checkout',
          userId: userId,
          credits: credits,
          successUrl: `${window.location.origin}/main/credits?success=true`,
          cancelUrl: `${window.location.origin}/main/credits?canceled=true`
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        console.error('Failed to create checkout:', data.error);
        return {
          success: false,
          error: data.error || 'Failed to create checkout session'
        };
      }

      return {
        success: true,
        sessionId: data.sessionId,
        checkoutUrl: data.checkoutUrl || data.url
      };

    } catch (error: any) {
      console.error('Error creating Stripe checkout:', error);
      return {
        success: false,
        error: error.message || 'Network error'
      };
    }
  }

  /**
   * Verify Stripe payment and add credits to user account
   */
  async verifyStripePayment(sessionId: string): Promise<{
    success: boolean;
    creditsAdded?: number;
    newBalance?: number;
    error?: string;
  }> {
    try {
      const response = await fetch(CREDIT_HANDLER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'verify_payment',
          sessionId: sessionId
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        console.error('Payment verification failed:', data.error);
        return {
          success: false,
          error: data.error || 'Payment verification failed'
        };
      }

      return {
        success: true,
        creditsAdded: data.creditsAdded,
        newBalance: data.newBalance
      };

    } catch (error: any) {
      console.error('Error verifying payment:', error);
      return {
        success: false,
        error: error.message || 'Network error'
      };
    }
  }

  /**
   * Redirect user to Stripe Checkout
   */
  async purchaseCreditsWithStripe(userId: string, credits: number): Promise<void> {
    const result = await this.createStripeCheckout(userId, credits);
    
    if (result.success && result.checkoutUrl) {
      // Redirect to Stripe Checkout
      window.location.href = result.checkoutUrl;
    } else {
      throw new Error(result.error || 'Failed to create checkout');
    }
  }

  // ==========================================
  // EXISTING CREDIT METHODS
  // ==========================================

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
      // Call credit handler function
      const response = await fetch(CREDIT_HANDLER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: amount > 0 ? 'add' : 'deduct',
          userId: userId,
          amount: Math.abs(amount),
          description: description,
          referenceId: metadata?.referenceId || ''
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update credits');
      }

      console.log('Credits updated via function:', {
        userId,
        amount,
        type,
        description,
        oldBalance: data.previousCredits,
        newBalance: data.newCredits,
        metadata
      });

      return data.newCredits;
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

      // Call credit handler to deduct
      const response = await fetch(CREDIT_HANDLER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deduct',
          userId: userId,
          amount: amount,
          description: description,
          referenceId: metadata?.referenceId || ''
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        console.error('Failed to deduct credits:', data.error);
        return false;
      }

      console.log('Credits deducted:', {
        userId,
        amount,
        oldBalance: data.previousCredits,
        newBalance: data.newCredits
      });
      
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

  /**
   * Check credit balance via API call
   */
  async checkBalance(userId: string): Promise<number> {
    try {
      const response = await fetch(CREDIT_HANDLER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'check',
          userId: userId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        return data.credits || 0;
      }
      
      return 0;
    } catch (error) {
      console.error('Error checking balance:', error);
      return 0;
    }
  }
}

export default new CreditService();