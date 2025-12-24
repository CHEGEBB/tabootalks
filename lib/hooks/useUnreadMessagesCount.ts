// src/hooks/useUnreadMessagesCount.ts
import { useState, useEffect } from 'react';
import { unreadMessagesService } from '@/lib/services/unreadMessagesService';

export function useUnreadMessagesCount(pollInterval = 30000) {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchCount = async () => {
    setLoading(true);
    const count = await unreadMessagesService.getTotalUnreadCount();
    setUnreadCount(count);
    setLoading(false);
  };

  useEffect(() => {
    unreadMessagesService.init().then(() => {
      fetchCount();

      // Optional: Real-time subscription
      const unsubscribe = unreadMessagesService.subscribe((count) => {
        setUnreadCount(count);
      });

      // Optional: Polling fallback
      const interval = setInterval(fetchCount, pollInterval);

      return () => {
        unsubscribe();
        clearInterval(interval);
      };
    });
  }, [pollInterval]);

  return { unreadCount, loading, refetch: fetchCount };
}