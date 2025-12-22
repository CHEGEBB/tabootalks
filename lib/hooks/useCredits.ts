/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const fetchingRef = useRef(false);

  const fetchCredits = useCallback(async () => {
    if (!user?.$id) {
      setCredits(0);
      setIsLoading(false);
      return;
    }

    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      setIsLoading(true);
      setError(null);
      
      const currentBalance = await creditService.getCurrentBalance(user.$id);
      console.log('useCredits: Fetched balance:', currentBalance);
      setCredits(currentBalance);
      
      // Dispatch event for other components to refresh
      window.dispatchEvent(new CustomEvent('credits-updated', { detail: currentBalance }));
    } catch (err) {
      console.error('Failed to fetch credits:', err);
      setError('Failed to load credits');
      setCredits(0);
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  }, [user?.$id]);

  const checkHasEnoughCredits = useCallback(async (requiredAmount: number): Promise<boolean> => {
    if (!user?.$id) return false;
    
    try {
      const result = await creditService.hasEnoughCredits(user.$id, requiredAmount);
      console.log('useCredits: hasEnoughCredits result:', { 
        userId: user.$id, 
        required: requiredAmount, 
        result 
      });
      return result;
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
      console.log('useCredits: Using credits:', { 
        userId: user.$id, 
        amount, 
        description 
      });
      
      const success = await creditService.useCredits(user.$id, amount, description, metadata);
      
      // Always refresh after using credits
      if (success) {
        console.log('useCredits: Success, refreshing...');
        setTimeout(() => {
          fetchCredits();
        }, 100); // Small delay to ensure DB update
      } else {
        console.warn('useCredits: Failed to use credits');
      }
      
      return success;
    } catch (err) {
      console.error('Failed to use credits:', err);
      return false;
    }
  }, [user?.$id, fetchCredits]);

  // Fetch credits on mount/user change
  useEffect(() => {
    fetchCredits();
  }, [user?.$id]);

  // Add event listener for credit updates from other components
  useEffect(() => {
    const handleCreditsUpdated = (event: CustomEvent) => {
      if (event.detail !== undefined) {
        setCredits(event.detail);
      } else {
        fetchCredits();
      }
    };

    window.addEventListener('credits-updated', handleCreditsUpdated as EventListener);
    return () => {
      window.removeEventListener('credits-updated', handleCreditsUpdated as EventListener);
    };
  }, [fetchCredits]);

  return {
    credits,
    isLoading,
    error,
    refreshCredits: fetchCredits,
    hasEnoughCredits: checkHasEnoughCredits,
    useCredits: handleUseCredits
  };
}