/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/hooks/useAuth.ts - FIXED VERSION
'use client';

import { useState, useEffect } from 'react';
import authService from '@/lib/services/authService';

interface UserProfile {
  $id: string; // ✅ Changed from userId to $id
  userId?: string; // Keep for compatibility
  username: string;
  email: string;
  age?: number;
  gender?: string;
  goals?: string;
  bio?: string;
  profilePic?: string | null;
  credits: number;
  location?: string;
  createdAt: string;
  lastActive: string;
  preferences: string;
  birthday?: string;
  martialStatus?: string;
  fieldOfWork?: string;
  englishLevel?: string;
  languages?: string[];
  interests?: string[];
  personalityTraits?: string[];
  totalChats?: number;
  totalMatches?: number;
  followingCount?: number;
  isVerified?: boolean;
  isPremium?: boolean;
}

interface AuthResult {
  user: any;
  profile: UserProfile | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const result = await authService.getCurrentUser();
      
      if (result && result.profile) {
        // ✅ Ensure profile has $id (Appwrite ID)
        const profileWithId = {
          ...result.profile,
          $id: result.profile.$id || result.profile.userId || ''
        };
        
        setUser(result.user);
        setProfile(profileWithId);
        console.log('✅ Auth: User loaded:', profileWithId.username, 'ID:', profileWithId.$id);
      } else {
        setUser(null);
        setProfile(null);
        console.log('⚠️ Auth: No user found');
      }
    } catch (err: any) {
      console.error('❌ Auth error:', err);
      setError(err.message);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      fetchCurrentUser();
    };
    
    // Refresh auth on focus
    window.addEventListener('focus', handleAuthChange);
    
    return () => {
      window.removeEventListener('focus', handleAuthChange);
    };
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

  const refresh = () => {
    fetchCurrentUser();
  };

  return {
    user,
    profile,
    loading,
    error,
    logout,
    refresh,
    isAuthenticated: !!profile?.$id,
  };
};

export default useAuth;