/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/hooks/useAuth.ts
'use client';

import { useState, useEffect } from 'react';
import authService from '@/lib/services/authService';

interface UserProfile {
  userId: string;
  username: string;
  email: string;
  gender?: string;
  goals?: string;
  bio?: string;
  profilePic?: string | null;
  credits: number;
  createdAt: string;
  lastActive: string;
  preferences: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const result = await authService.getCurrentUser();
        
        if (result) {
          setUser(result.user);
          setProfile(result.profile);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err: any) {
        console.error('Failed to fetch user:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setProfile(null);
      window.location.href = '/login';
    } catch (err: any) {
      console.error('Logout failed:', err);
      throw err;
    }
  };

  return {
    user,
    profile,
    loading,
    error,
    logout,
    isAuthenticated: !!user,
  };
};

export default useAuth;