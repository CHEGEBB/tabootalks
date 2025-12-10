/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import creditService from '@/lib/services/creditService';

interface UseCreditsReturn {
  credits: number;
  isLoading: boolean;
  error: string | null;
  refreshCredits: () => Promise<void>;
  hasEnoughCredits: (requiredAmount: number) => Promise<boolean>;
  useCredits: (amount: number, description: string, metadata?: Record<string, any>) => Promise<boolean>;
}

export function useCredits(): UseCreditsReturn {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = useCallback(async () => {
    if (!user?.$id) {
      setCredits(0);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const currentBalance = await creditService.getCurrentBalance(user.$id);
      setCredits(currentBalance);
    } catch (err) {
      console.error('Failed to fetch credits:', err);
      setError('Failed to load credits');
      setCredits(0);
    } finally {
      setIsLoading(false);
    }
  }, [user?.$id]);

  const checkHasEnoughCredits = useCallback(async (requiredAmount: number): Promise<boolean> => {
    if (!user?.$id) return false;
    
    try {
      return await creditService.hasEnoughCredits(user.$id, requiredAmount);
    } catch (err) {
      console.error('Failed to check credits:', err);
      return false;
    }
  }, [user?.$id]);

  const handleUseCredits = useCallback(async (
    amount: number, 
    description: string, 
    metadata?: Record<string, any>
  ): Promise<boolean> => {
    if (!user?.$id) return false;
    
    try {
      const success = await creditService.useCredits(user.$id, amount, description, metadata);
      if (success) {
        await fetchCredits(); // Refresh credits after using them
      }
      return success;
    } catch (err) {
      console.error('Failed to use credits:', err);
      return false;
    }
  }, [user?.$id, fetchCredits]);

  useEffect(() => {
    fetchCredits();
    
    // Refresh credits every 30 seconds if user is authenticated
    let intervalId: NodeJS.Timeout;
    if (user?.$id) {
      intervalId = setInterval(fetchCredits, 30000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchCredits, user?.$id]);

  return {
    credits,
    isLoading,
    error,
    refreshCredits: fetchCredits,
    hasEnoughCredits: checkHasEnoughCredits,
    useCredits: handleUseCredits
  };
}