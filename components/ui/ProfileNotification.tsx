/* eslint-disable react-hooks/purity */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ChevronDown, Bell, User, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import personaService, { ParsedPersonaProfile } from '@/lib/services/personaService';

// Placeholder image for fallback
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop';

// Notification messages - fixed array
const NOTIFICATION_MESSAGES = [
  'wants to discover your profile',
  'is interested in chatting with you',
  'wants to connect with you',
  'sent you a like',
  'is interested in your profile',
  'just viewed your profile',
  'wants to know you better',
  'is looking for someone like you',
  'found your profile interesting',
  'wants to start a conversation'
] as const;

interface ProfileNotificationProps {
  autoShow?: boolean;
  minInterval?: number;
  maxInterval?: number;
  notificationDuration?: number;
  position?: 'top-center' | 'top-right' | 'top-left';
}

interface CurrentNotification {
  profile: ParsedPersonaProfile;
  message: string;
  isOnline: boolean;
}

const ProfileNotification: React.FC<ProfileNotificationProps> = ({ 
  autoShow = true, 
  minInterval = 180000,
  maxInterval = 360000,
  notificationDuration = 10000,
  position = 'top-center'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<CurrentNotification | null>(null);
  const [progress, setProgress] = useState(100);
  const [imageError, setImageError] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [profiles, setProfiles] = useState<ParsedPersonaProfile[]>([]);
  const router = useRouter();
  
  const isVisibleRef = useRef(false);
  const hasClickedRef = useRef(false);
  const hasSeenRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const nextNotificationRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  // Fetch random profiles from Appwrite
  const fetchRandomProfiles = async () => {
    try {
      console.log('🔍 Fetching random profiles for notifications...');
      
      const randomProfiles = await personaService.getRandomPersonas(10);
      
      const validProfiles = randomProfiles.filter(profile => 
        profile.profilePic && profile.username
      );
      
      console.log(`✅ Fetched ${validProfiles.length} valid profiles for notifications`);
      setProfiles(validProfiles);
      
      return validProfiles;
      
    } catch (error) {
      console.error('❌ Error fetching profiles for notifications:', error);
      return [];
    }
  };

  const getRandomInterval = () => {
    return Math.floor(Math.random() * (maxInterval - minInterval)) + minInterval;
  };

  const getPositionClass = () => {
    switch(position) {
      case 'top-right':
        return 'top-4 right-4 sm:top-6 sm:right-6';
      case 'top-left':
        return 'top-4 left-4 sm:top-6 sm:left-6';
      case 'top-center':
      default:
        return 'top-4 left-1/2 -translate-x-1/2';
    }
  };

  const getRandomMessage = (): string => {
    return NOTIFICATION_MESSAGES[Math.floor(Math.random() * NOTIFICATION_MESSAGES.length)];
  };

  // Show notification
  const showNotification = async () => {
    if (isVisibleRef.current || hasClickedRef.current || hasSeenRef.current) {
      // If already visible or user engaged recently, reschedule
      scheduleNextNotification();
      return;
    }

    // Get profiles (fetch if we don't have any)
    let profilesToUse = profiles;
    if (!profilesToUse || profilesToUse.length === 0) {
      profilesToUse = await fetchRandomProfiles();
    }
    
    if (!profilesToUse || profilesToUse.length === 0) {
      console.log('⚠️ No profiles available for notification');
      scheduleNextNotification();
      return;
    }

    // Pick random profile
    const randomProfile = profilesToUse[Math.floor(Math.random() * profilesToUse.length)];
    
    if (!randomProfile.username || !randomProfile.profilePic) {
      console.log('⚠️ Selected profile missing required data');
      scheduleNextNotification();
      return;
    }

    const message = getRandomMessage();
    const isOnline = Math.random() > 0.3;
    
    setCurrentNotification({
      profile: randomProfile,
      message,
      isOnline
    });
    
    setImageError(false);
    setIsVisible(true);
    setProgress(100);
    hasSeenRef.current = true; // Mark as seen
    hasClickedRef.current = false; // Reset click tracking

    // Start progress bar countdown
    startProgressCountdown();

    // Schedule next notification after current one disappears
    scheduleNextNotification();
  };

  // Start progress bar countdown
  const startProgressCountdown = () => {
    if (progressRef.current) clearInterval(progressRef.current);

    const duration = notificationDuration;
    const updateInterval = 50;
    const decrement = (updateInterval / duration) * 100;

    progressRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          setIsVisible(false);
          setCurrentNotification(null);
          hasSeenRef.current = false; // Reset seen flag
          return 100;
        }
        return prev - decrement;
      });
    }, updateInterval);
  };

  // Schedule next notification
  const scheduleNextNotification = () => {
    if (nextNotificationRef.current) {
      clearTimeout(nextNotificationRef.current);
    }

    const interval = getRandomInterval();
    console.log(`⏰ Next notification in ${Math.round(interval/1000)} seconds`);
    
    nextNotificationRef.current = setTimeout(() => {
      showNotification();
    }, interval);
  };

  // Initialize notifications
  useEffect(() => {
    if (!autoShow) return;

    // Fetch profiles and show first notification after 3 seconds
    const init = async () => {
      await fetchRandomProfiles();
      
      setTimeout(() => {
        showNotification();
      }, 3000);
    };

    init();

    // Cleanup function
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      if (nextNotificationRef.current) clearTimeout(nextNotificationRef.current);
    };
  }, [autoShow]);

  // Pause progress bar on hover
  useEffect(() => {
    if (isHovering && progressRef.current) {
      clearInterval(progressRef.current);
    } else if (isVisible && !isHovering && progressRef.current === null) {
      startProgressCountdown();
    }
  }, [isHovering, isVisible]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
      if (nextNotificationRef.current) clearTimeout(nextNotificationRef.current);
    };
  }, []);

  const handleViewProfile = () => {
    if (!currentNotification) return;
    
    // Mark that user clicked
    hasClickedRef.current = true;
    hasSeenRef.current = false;
    
    // Clear any scheduled notifications
    if (nextNotificationRef.current) {
      clearTimeout(nextNotificationRef.current);
    }
    
    // Navigate to actual profile page with persona ID
    router.push(`/main/profile/${currentNotification.profile.$id}`);
    setIsVisible(false);
    setCurrentNotification(null);
    
    // Don't show another notification for at least 7 minutes after click
    setTimeout(() => {
      hasClickedRef.current = false;
      scheduleNextNotification();
    }, 420000); // 7 minutes
  };

  const handleClose = () => {
    setIsVisible(false);
    setCurrentNotification(null);
    hasSeenRef.current = false;
    // When manually closed, wait before next notification
    scheduleNextNotification();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getProfileImage = () => {
    if (!currentNotification) return PLACEHOLDER_IMAGE;
    return imageError ? PLACEHOLDER_IMAGE : currentNotification.profile.profilePic;
  };

  const getProfileName = () => {
    if (!currentNotification) return 'New User';
    return `${currentNotification.profile.username}, ${currentNotification.profile.age}`;
  };

  const getNotificationMessage = () => {
    if (!currentNotification) return '';
    return currentNotification.message;
  };

  const isProfileVerified = () => {
    return currentNotification?.profile.isVerified || false;
  };

  const isProfilePremium = () => {
    return currentNotification?.profile.isPremium || false;
  };

  if (!currentNotification) {
    return null;
  }

  const { profile, isOnline } = currentNotification;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.95 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 400,
            mass: 1.2
          }}
          className={`fixed ${getPositionClass()} z-50 w-[calc(100%-2rem)] max-w-md`}
          role="alert"
          aria-live="assertive"
          aria-label="New match notification"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <motion.div 
            className="absolute -top-2 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown className="w-5 h-5 text-purple-400" />
          </motion.div>

          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden border-2 border-purple-500/30 backdrop-blur-xl bg-opacity-95">
            <div className="px-4 pt-3 pb-2 border-b border-gray-700 flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-white">New Match Alert!</span>
              <div className="ml-auto flex items-center gap-1">
                {isProfileVerified() && (
                  <div className="p-1 rounded-full bg-blue-500/20" title="Verified">
                    <User className="w-3 h-3 text-blue-400" />
                  </div>
                )}
                {isProfilePremium() && (
                  <div className="p-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20" title="Premium">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                  </div>
                )}
                {isHovering && (
                  <span className="text-xs text-gray-400 animate-pulse">Paused</span>
                )}
                <button
                  onClick={handleClose}
                  className="p-1 rounded-full hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                  aria-label="Close notification"
                >
                  <X className="w-4 h-4 text-gray-300" />
                </button>
              </div>
            </div>

            <div className="p-4 flex items-center gap-4">
              <motion.div 
                className="relative flex-shrink-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-2 ring-white/20 ring-offset-2 ring-offset-purple-900/30">
                  <div className="relative w-full h-full bg-gradient-to-br from-purple-900/30 to-pink-900/30">
                    <Image
                      src={getProfileImage()}
                      alt={`Profile picture of ${profile.username}`}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                      unoptimized={true}
                    />
                  </div>
                </div>
                {isOnline && (
                  <div 
                    className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full border-2 border-gray-900 flex items-center justify-center"
                    aria-label="Online now"
                  >
                    <span className="text-[10px] font-bold text-white">●</span>
                  </div>
                )}
                {profile.location && (
                  <div className="absolute -bottom-1 -left-1 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-xs rounded-full border border-gray-700 max-w-[80px] truncate">
                    {profile.location.split(',')[0]}
                  </div>
                )}
              </motion.div>

              <div className="flex-1 min-w-0">
                <motion.div 
                  className="flex items-center gap-2 mb-1"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-white font-bold text-lg truncate bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    {getProfileName()}
                  </h3>
                  {isOnline && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Online</span>
                    </div>
                  )}
                </motion.div>
                <motion.p 
                  className="text-gray-300 text-sm mb-3"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <span className="font-medium text-purple-300">{profile.username}</span>{' '}
                  {getNotificationMessage()}
                </motion.p>
                
                {profile.interests && profile.interests.length > 0 && (
                  <motion.div 
                    className="flex flex-wrap gap-1 mb-3"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {profile.interests.slice(0, 2).map((interest, index) => (
                      <span key={index} className="px-2 py-0.5 bg-purple-900/30 text-purple-300 text-xs rounded-full border border-purple-700/30">
                        {interest}
                      </span>
                    ))}
                    {profile.interests.length > 2 && (
                      <span className="px-2 py-0.5 bg-gray-800/50 text-gray-400 text-xs rounded-full">
                        +{profile.interests.length - 2}
                      </span>
                    )}
                  </motion.div>
                )}
                
                <motion.button
                  onClick={handleViewProfile}
                  className="w-full bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9] hover:from-[#7c3aed] hover:to-[#5b21b6] text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg hover:shadow-purple-500/30"
                  aria-label={`View ${profile.username}'s profile`}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="font-bold">View Profile Now</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            <div className="h-2 bg-gray-800/50 relative overflow-hidden" role="presentation">
              <motion.div
                className="h-full bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9] relative"
                style={{ width: `${progress}%` }}
                initial={{ width: '100%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              >
                <motion.div
                  className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['0%', '300%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              </motion.div>
              <div className="absolute right-2 -top-6 text-xs text-gray-400">
                {Math.round((progress / 100) * (notificationDuration / 1000))}s
              </div>
            </div>
          </div>

          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-purple-500/20 to-transparent blur-xl opacity-50" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileNotification;