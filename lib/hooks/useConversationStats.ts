/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/hooks/useConversationStats.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import conversationService, { ConversationStats } from '@/lib/services/conversationService';
import useAuth from '@/lib/hooks/useAuth';

export default function useConversationStats() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<ConversationStats>({
    totalConversations: 0,
    activeChats: 0,
    totalMessages: 0,
    unreadCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch conversation statistics
   */
  const fetchStats = useCallback(async () => {
    if (!profile?.$id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const conversationStats = await conversationService.getConversationStats(profile.$id);
      setStats(conversationStats);
    } catch (err: any) {
      console.error('❌ Error in useConversationStats:', err);
      setError(err.message || 'Failed to load conversation stats');
    } finally {
      setLoading(false);
    }
  }, [profile?.$id]);

  /**
   * Refresh stats (can be called manually)
   */
  const refreshStats = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  // Auto-fetch on mount and when user changes
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Optional: Auto-refresh every 30 seconds
  useEffect(() => {
    if (!profile?.$id) return;

    const interval = setInterval(() => {
      fetchStats();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [profile?.$id, fetchStats]);

  return {
    stats,
    loading,
    error,
    refreshStats
  };
}