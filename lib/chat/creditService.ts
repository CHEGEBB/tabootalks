// lib/chat/creditService.ts - SIMPLIFIED
import { FUNCTION_ENDPOINTS } from '@/lib/appwrite/config';

/**
 * Check user credits
 */
export const checkUserCredits = async (userId: string) => {
    try {
      console.log('💰 Checking credits for user:', userId);
      
      const response = await fetch('/api/credits/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check',
          userId,
        }),
      });
  
      if (!response.ok) {
        console.error('Credit check failed:', response.status);
        return { success: false, credits: 0, error: `HTTP ${response.status}` };
      }
  
      const data = await response.json();
      console.log('💰 Credit response:', data);
      return data;
      
    } catch (error) {
      console.error('Credit check error:', error);
      return { success: false, credits: 0, error: 'Network error' };
    }
  };
  
  /**
   * Add credits to user
   */
  export const addUserCredits = async (userId: string, amount: number, description?: string) => {
    try {
      const response = await fetch('/api/credits/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          userId,
          amount,
          description,
        }),
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Add credits error:', error);
      return { success: false };
    }
  };
  
  /**
   * Deduct credits from user
   */
  export const deductUserCredits = async (userId: string, amount: number, description?: string) => {
    try {
      const response = await fetch('/api/credits/deduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deduct',
          userId,
          amount,
          description,
        }),
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Deduct credits error:', error);
      return { success: false };
    }
  };