/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Gift, Sparkles, MessageCircle, Users, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { account } from '@/lib/appwrite/config';
import { useRouter } from 'next/navigation';
import { OAuthProvider } from 'appwrite';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();

  // Check if user already has a session
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Try to get current user
        const user = await account.get();
        
        // If we get here, user has a valid session
        // Redirect directly to home page
        router.push('/main');
        
      } catch (err) {
        // No valid session, stay on login page
        console.log('No active session');
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [router]);
  const allImages = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&h=500&fit=crop',
  ];

  const floatingWords = ['Welcome Back', 'Chat', 'Connect', 'Flirt', 'Explore'];

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Appwrite OAuth
      account.createOAuth2Session(
        'google' as OAuthProvider,
        `${window.location.origin}/main`,
        `${window.location.origin}/login`
      );
    } catch (err: any) {
      setError(err.message || 'Google sign in failed');
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Real Appwrite login
      await account.createEmailPasswordSession(email, password);
      
      // Get user data to verify login was successful
      const user = await account.get();
      
      setLoginSuccess(true);
      setIsLoading(false);
      setShowWelcomeModal(true);
      
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle specific Appwrite errors
      if (err.code === 401) {
        setError('Invalid email or password');
      } else if (err.code === 400) {
        setError('Invalid credentials format');
      } else if (err.code === 429) {
        setError('Too many attempts. Please try again later.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
      
      setIsLoading(false);
      setLoginSuccess(false);
    }
  };

  const handleContinueToHome = () => {
    router.push('/main');
  };

  const handleForgotPassword = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    router.push('/forgot-password');
  };

  const handleSignUp = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    router.push('/signup');
  };

  const handleKeyPress = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Show loading while checking session
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff2e2e]"></div>
          <p className="mt-4 text-gray-600">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white relative overflow-hidden">
      <div className="lg:hidden relative h-64 overflow-hidden bg-gray-900">
        <div className="absolute inset-0 overflow-hidden" style={{ transform: 'rotate(-45deg) scale(3)', transformOrigin: 'center' }}>
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-6 left-0 flex"
          >
            {[...Array(4)].map((_, setIdx) => (
              <React.Fragment key={`mob-row1-${setIdx}`}>
                <div className="flex-shrink-0 w-[150px] h-[150px]">
                  <img src={allImages[(setIdx * 5) % allImages.length]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-shrink-0 w-[100px] h-[150px]">
                  <img src={allImages[(setIdx * 5 + 1) % allImages.length]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-shrink-0 flex flex-col w-[180px] h-[250px]">
                  <div className="w-full h-[125px]">
                    <img src={allImages[(setIdx * 5 + 2) % allImages.length]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full h-[125px]">
                    <img src={allImages[(setIdx * 5 + 3) % allImages.length]} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10" />

        <div className="relative z-20 flex flex-col justify-center items-center text-center h-full px-6">
          <div className="mb-4">
            <div className="h-10 mx-auto flex items-center justify-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb] bg-clip-text text-transparent">TabooTalks</h1>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 leading-tight">Welcome back to<br />amazing conversations</h2>
          <p className="text-sm text-white/90">Continue where you left off</p>
          
          <div className="flex gap-2 justify-center flex-wrap mt-3">
            {floatingWords.slice(0, 3).map((word, idx) => (
              <motion.div 
                key={word} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: [0.7, 1, 0.7], y: [0, -5, 0] }} 
                transition={{ duration: 3, repeat: Infinity, delay: idx * 0.3 }} 
                className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-semibold border border-white/30"
              >
                {word}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6 }} 
          className="w-full max-w-md"
        >
          <div className="mb-6 lg:mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600 text-sm lg:text-base">Sign in to continue your amazing conversations</p>
          </div>

          <button 
            onClick={handleGoogleSignIn} 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold py-3.5 rounded-xl hover:border-gray-300 hover:shadow-md transition-all mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-gray-200 w-full"></div>
            <span className="absolute bg-white px-4 text-gray-500 text-sm font-medium">OR</span>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
            >
              <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </motion.div>
          )}

          <div className="space-y-4 lg:space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }} 
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your email" 
                  className="w-full pl-12 pr-4 py-3 lg:py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5e17eb] focus:ring-2 focus:ring-[#5e17eb]/20 transition-all text-gray-900" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }} 
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password" 
                  className="w-full pl-12 pr-12 py-3 lg:py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5e17eb] focus:ring-2 focus:ring-[#5e17eb]/20 transition-all text-gray-900" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-[#5e17eb] cursor-pointer rounded" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                href="/forgot-password" 
                onClick={handleForgotPassword}
                className="text-sm text-[#5e17eb] font-semibold hover:underline cursor-pointer"
              >
                Forgot password?
              </Link>
            </div>

            <motion.button 
              onClick={handleSubmit}
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              disabled={isLoading}
              className="w-full bg-[#5e17eb] text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed relative"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : 'Sign In'}
            </motion.button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account? {' '}
              <Link 
                href="/signup" 
                onClick={handleSignUp}
                className="text-[#5e17eb] font-semibold hover:underline cursor-pointer"
              > Sign up here</Link>
            </p>
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900">
        <div className="absolute inset-0 overflow-hidden" style={{ transform: 'rotate(-45deg) scale(2.5)', transformOrigin: 'center' }}>
          
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-64 left-0 flex"
          >
            {[...Array(8)].map((_, setIdx) => (
              <React.Fragment key={`row1-${setIdx}`}>
                <div className="flex-shrink-0 w-[450px] h-[450px]">
                  <img src={allImages[(setIdx * 5) % allImages.length]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-shrink-0 w-[350px] h-[450px]">
                  <img src={allImages[(setIdx * 5 + 1) % allImages.length]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-shrink-0 flex flex-col w-[300px] h-[450px]">
                  <div className="w-full h-[225px]">
                    <img src={allImages[(setIdx * 5 + 2) % allImages.length]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full h-[225px]">
                    <img src={allImages[(setIdx * 5 + 3) % allImages.length]} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex-shrink-0 w-[400px] h-[450px]">
                  <img src={allImages[(setIdx * 5 + 4) % allImages.length]} alt="" className="w-full h-full object-cover" />
                </div>
              </React.Fragment>
            ))}
          </motion.div>

          <motion.div
            animate={{ x: ['-50%', '0%'] }}
            transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
            className="absolute top-[300px] left-0 flex"
          >
            {[...Array(8)].map((_, setIdx) => (
              <React.Fragment key={`row2-${setIdx}`}>
                <div className="flex-shrink-0 flex flex-row w-[500px] h-[400px]">
                  <div className="w-[250px] h-full">
                    <img src={allImages[(setIdx * 4) % allImages.length]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-[250px] h-full">
                    <img src={allImages[(setIdx * 4 + 1) % allImages.length]} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex-shrink-0 w-[420px] h-[400px]">
                  <img src={allImages[(setIdx * 4 + 2) % allImages.length]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-shrink-0 flex flex-col w-[280px] h-[400px]">
                  <div className="w-full h-[200px]">
                    <img src={allImages[(setIdx * 4 + 3) % allImages.length]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full h-[200px]">
                    <img src={allImages[(setIdx * 4 + 1) % allImages.length]} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
              </React.Fragment>
            ))}
          </motion.div>

          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            className="absolute top-[650px] left-0 flex"
          >
            {[...Array(8)].map((_, setIdx) => (
              <React.Fragment key={`row3-${setIdx}`}>
                <div className="flex-shrink-0 w-[380px] h-[500px]">
                  <img src={allImages[(setIdx * 3) % allImages.length]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-shrink-0 flex flex-col w-[320px] h-[500px]">
                  <div className="w-full h-[250px]">
                    <img src={allImages[(setIdx * 3 + 1) % allImages.length]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full h-[250px]">
                    <img src={allImages[(setIdx * 3 + 2) % allImages.length]} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex-shrink-0 w-[440px] h-[500px]">
                  <img src={allImages[(setIdx * 3 + 3) % allImages.length]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-shrink-0 flex flex-row w-[460px] h-[500px]">
                  <div className="w-[230px] h-full">
                    <img src={allImages[(setIdx * 3 + 4) % allImages.length]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-[230px] h-full">
                    <img src={allImages[(setIdx * 3 + 5) % allImages.length]} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
              </React.Fragment>
            ))}
          </motion.div>

        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 z-10" />

        <div className="relative z-20 flex flex-col justify-center items-center text-center px-16 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <div className="h-14 mx-auto flex items-center justify-center">
                <Image
                  src="/assets/logo.png" 
                  alt="TabooTalks Logo" 
                  width={220} 
                  height={90} 
                  className="object-contain"
                  />
              </div>
            </div>
            <h2 className="text-5xl font-bold text-white mb-4 leading-tight drop-shadow-2xl">Welcome back to<br />amazing conversations</h2>
            <p className="text-xl text-white/90 mb-8 drop-shadow-xl">Continue where you left off</p>
            <div className="flex gap-3 justify-center flex-wrap">
              {floatingWords.map((word, idx) => (
                <motion.div 
                  key={word} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: [0.7, 1, 0.7], y: [0, -10, 0] }} 
                  transition={{ duration: 3, repeat: Infinity, delay: idx * 0.5 }} 
                  className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold border border-white/30"
                >
                  {word}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="hidden lg:block absolute right-[42%] top-[1%] z-30">
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }} 
          transition={{ duration: 4, repeat: Infinity }} 
          className="bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 border-2 border-[#ff2e2e]/20"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-[#ff2e2e] to-[#ff2e2e]/80 rounded-full flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900">1000+</p>
            <p className="text-xs text-gray-600">Messages</p>
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:block absolute right-[1%] top-[0%] z-30">
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }} 
          transition={{ duration: 5, repeat: Infinity, delay: 1 }} 
          className="bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 border-2 border-[#5e17eb]/20"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-[#5e17eb] to-[#5e17eb]/80 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900">250+</p>
            <p className="text-xs text-gray-600">Profiles</p>
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:block absolute right-[1%] bottom-[0%] z-30">
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }} 
          transition={{ duration: 4.5, repeat: Infinity, delay: 2 }} 
          className="bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 border-2 border-[#10b981]/20"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-[#10b981] to-[#10b981]/80 rounded-full flex items-center justify-center">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900">10 FREE</p>
            <p className="text-xs text-gray-600">Credits</p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showWelcomeModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
            onClick={() => setShowWelcomeModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              transition={{ type: 'spring', duration: 0.5 }} 
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} 
                  transition={{ duration: 0.6 }} 
                  className="inline-flex items-center justify-center mb-6"
                >
                  <div className="rounded-2xl flex items-center justify-center p-4">
                    <Image 
                      src="/assets/logo2.png" 
                      alt="TabooTalks Logo" 
                      width={200} 
                      height={80} 
                      className="object-contain"
                    />
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4"
                >
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full mb-4">
                    <CheckCircle size={18} />
                    <span className="font-semibold text-sm">Successfully signed in!</span>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h3>
                  <p className="text-gray-600 mb-6">Ready to continue amazing conversations</p>
                </motion.div>
                
                <div className="mb-6">
                  <div className="flex justify-center -space-x-3 mb-4">
                    {allImages.slice(0, 5).map((img, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + (index * 0.1) }}
                        className="w-14 h-14 rounded-full border-3 border-white overflow-hidden shadow-lg"
                      >
                        <img 
                          src={img} 
                          alt={`User ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#ff2e2e]/5 to-[#5e17eb]/5 rounded-xl p-5 border border-gray-100">
                    <p className="text-xl font-bold text-gray-900 mb-2">
                      Join <span className="text-[#ff2e2e]">250+</span> other active users
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      Start amazing conversations now
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                      <Users size={14} />
                      <span>Live users online now</span>
                    </div>
                  </div>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  onClick={handleContinueToHome} 
                  className="w-full bg-red-500 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all shadow-md text-lg"
                >
                  Continue to Home
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;