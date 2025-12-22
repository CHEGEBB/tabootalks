/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';
import giftService from '@/lib/services/giftService';
import { GiftItem, AppwriteGiftDocument } from '@/lib/services/giftService';

interface UseGiftsReturn {
  // Gift data
  allGifts: GiftItem[];
  featuredGifts: GiftItem[];
  giftsByCategory: Record<string, GiftItem[]>;
  isLoading: boolean;
  error: string | null;
  
  // Gift history
  giftHistory: {
    sent: AppwriteGiftDocument[];
    received: AppwriteGiftDocument[];
  };
  giftStats: {
    totalSent: number;
    totalReceived: number;
    totalSpent: number;
    favoriteGift?: { giftId: number; giftName: string; count: number };
  };
  
  // Gift actions
  sendGift: (
    recipientId: string, 
    giftId: number, 
    message?: string
  ) => Promise<{ success: boolean; newBalance: number; giftTransactionId?: string; error?: string }>;
  
  canAffordGift: (
    giftId: number
  ) => Promise<{
    canAfford: boolean;
    giftPrice: number;
    userBalance: number;
    missingCredits?: number;
  }>;
  
  // Refresh
  refreshGifts: () => Promise<void>;
  refreshGiftHistory: () => Promise<void>;
  
  // Filter
  getGiftsByCategory: (category: string) => Promise<GiftItem[]>;
}

export function useGifts(): UseGiftsReturn {
  const { user } = useAuth();
  const [allGifts, setAllGifts] = useState<GiftItem[]>([]);
  const [featuredGifts, setFeaturedGifts] = useState<GiftItem[]>([]);
  const [giftsByCategory, setGiftsByCategory] = useState<Record<string, GiftItem[]>>({});
  const [giftHistory, setGiftHistory] = useState<{
    sent: AppwriteGiftDocument[];
    received: AppwriteGiftDocument[];
  }>({ sent: [], received: [] });
  const [giftStats, setGiftStats] = useState({
    totalSent: 0,
    totalReceived: 0,
    totalSpent: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all gifts
  const loadGifts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [all, featured, grouped] = await Promise.all([
        giftService.loadAllGifts(),
        giftService.getFeaturedGifts(),
        giftService.getGiftsGroupedByCategory()
      ]);
      
      setAllGifts(all);
      setFeaturedGifts(featured);
      setGiftsByCategory(grouped);
    } catch (err: any) {
      console.error('Error loading gifts:', err);
      setError('Failed to load gifts');
      setAllGifts([]);
      setFeaturedGifts([]);
      setGiftsByCategory({});
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load gift history
  const loadGiftHistory = useCallback(async () => {
    if (!user?.$id) return;

    try {
      const [history, stats] = await Promise.all([
        giftService.getRecentGifts(user.$id, 20),
        giftService.getGiftStats(user.$id)
      ]);
      
      setGiftHistory(history);
      setGiftStats(stats);
    } catch (err) {
      console.error('Error loading gift history:', err);
    }
  }, [user?.$id]);

  // Send gift
  const sendGift = useCallback(async (
    recipientId: string,
    giftId: number,
    message?: string
  ) => {
    if (!user?.$id) {
      return { 
        success: false, 
        newBalance: 0, 
        error: 'User not authenticated' 
      };
    }

    try {
      const result = await giftService.sendGift(
        user.$id,
        recipientId,
        giftId,
        message
      );

      // Refresh history after sending
      if (result.success) {
        await loadGiftHistory();
      }

      return result;
    } catch (err: any) {
      console.error('Error sending gift:', err);
      return { 
        success: false, 
        newBalance: 0, 
        error: err.message || 'Failed to send gift' 
      };
    }
  }, [user?.$id, loadGiftHistory]);

  // Check if can afford gift
  const canAffordGift = useCallback(async (giftId: number) => {
    if (!user?.$id) {
      return { 
        canAfford: false, 
        giftPrice: 0, 
        userBalance: 0, 
        missingCredits: 0 
      };
    }

    return await giftService.canAffordGift(user.$id, giftId);
  }, [user?.$id]);

  // Get gifts by category
  const getGiftsByCategory = useCallback(async (category: string) => {
    return await giftService.getGiftsByCategory(category);
  }, []);

  // Initial load
  const initialLoad = useCallback(async () => {
    await loadGifts();
    await loadGiftHistory();
  }, [loadGifts, loadGiftHistory]);

  // Effect for initial load
  useEffect(() => {
    initialLoad();
  }, [initialLoad]);

  return {
    // Gift data
    allGifts,
    featuredGifts,
    giftsByCategory,
    isLoading,
    error,
    
    // Gift history
    giftHistory,
    giftStats,
    
    // Actions
    sendGift,
    canAffordGift,
    
    // Refresh
    refreshGifts: loadGifts,
    refreshGiftHistory: loadGiftHistory,
    
    // Filter
    getGiftsByCategory
  };
}