/* eslint-disable react-hooks/purity */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ChevronDown, Bell } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Placeholder image for fallback
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop';

// Mock profile data with backup images
const mockProfiles = [
  {
    id: 1,
    name: 'Sophie',
    age: 28,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    message: 'wants to discover your profile',
    isOnline: true
  },
  {
    id: 2,
    name: 'Emma',
    age: 25,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    message: 'is interested in chatting with you',
    isOnline: true
  },
  {
    id: 3,
    name: 'Lily',
    age: 30,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
    message: 'wants to connect with you',
    isOnline: false
  },
  {
    id: 4,
    name: 'Chloe',
    age: 27,
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop',
    message: 'sent you a like',
    isOnline: true
  },
  {
    id: 5,
    name: 'Grace',
    age: 29,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    message: 'is interested in your profile',
    isOnline: true
  }
];

interface ProfileNotificationProps {
  autoShow?: boolean;
  minInterval?: number; // Minimum time between notifications in ms
  maxInterval?: number; // Maximum time between notifications in ms
  notificationDuration?: number; // How long notification stays visible in ms
  position?: 'top-center' | 'top-right' | 'top-left'; // Position options
}

const ProfileNotification: React.FC<ProfileNotificationProps> = ({ 
  autoShow = true, 
  minInterval = 180000, // 3 minutes minimum between notifications
  maxInterval = 360000, // 6 minutes maximum between notifications
  notificationDuration = 10000, // 10 seconds visible (longer for top position)
  position = 'top-center' // Default position
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(mockProfiles[0]);
  const [progress, setProgress] = useState(100);
  const [imageError, setImageError] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const router = useRouter();
  
  // Refs to track state without triggering re-renders
  const isVisibleRef = useRef(false);
  const hasClickedRef = useRef(false);
  const hasSeenRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const nextNotificationRef = useRef<NodeJS.Timeout | null>(null);

  // Update ref when state changes
  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  // Get random interval between min and max
  const getRandomInterval = () => {
    return Math.floor(Math.random() * (maxInterval - minInterval)) + minInterval;
  };

  // Position classes based on prop
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

  // Show notification
  const showNotification = () => {
    if (isVisibleRef.current || hasClickedRef.current || hasSeenRef.current) {
      // If already visible or user engaged recently, reschedule
      scheduleNextNotification();
      return;
    }

    // Pick random profile
    const randomProfile = mockProfiles[Math.floor(Math.random() * mockProfiles.length)];
    setCurrentProfile(randomProfile);
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
    console.log(`Next notification in ${Math.round(interval/1000)} seconds`);
    
    nextNotificationRef.current = setTimeout(() => {
      showNotification();
    }, interval);
  };

  // Initialize notifications
  useEffect(() => {
    if (!autoShow) return;

    // Show first notification after 3 seconds (immediate attention)
    const initialTimeout = setTimeout(() => {
      showNotification();
    }, 3000);

    // Cleanup function
    return () => {
      if (initialTimeout) clearTimeout(initialTimeout);
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
    // Mark that user clicked
    hasClickedRef.current = true;
    hasSeenRef.current = false;
    
    // Clear any scheduled notifications
    if (nextNotificationRef.current) {
      clearTimeout(nextNotificationRef.current);
    }
    
    // Navigate and hide
    router.push(`/main/profile/${currentProfile.id}`);
    setIsVisible(false);
    
    // Don't show another notification for at least 7 minutes after click
    setTimeout(() => {
      hasClickedRef.current = false;
      scheduleNextNotification();
    }, 420000); // 7 minutes
  };

  const handleClose = () => {
    setIsVisible(false);
    hasSeenRef.current = false;
    // When manually closed, wait before next notification
    scheduleNextNotification();
  };

  const handleImageError = () => {
    setImageError(true);
  };

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
          aria-live="assertive" // More assertive for top notifications
          aria-label="New match notification"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Animated drop indicator */}
          <motion.div 
            className="absolute -top-2 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown className="w-5 h-5 text-purple-400" />
          </motion.div>

          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden border-2 border-purple-500/30 backdrop-blur-xl bg-opacity-95">
            {/* Header with icon */}
            <div className="px-4 pt-3 pb-2 border-b border-gray-700 flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-white">New Match Alert!</span>
              <div className="ml-auto flex items-center gap-1">
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
              {/* Profile Image */}
              <motion.div 
                className="relative flex-shrink-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden ring-2 ring-white/20 ring-offset-2 ring-offset-purple-900/30">
                  <div className="relative w-full h-full bg-gradient-to-br from-purple-900/30 to-pink-900/30">
                    <Image
                      src={imageError ? PLACEHOLDER_IMAGE : currentProfile.image}
                      alt={`Profile picture of ${currentProfile.name}`}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                      unoptimized={true}
                    />
                  </div>
                </div>
                {/* Floating online indicator */}
                {currentProfile.isOnline && (
                  <motion.div 
                    className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full border-2 border-gray-900 flex items-center justify-center"
                    aria-label="Online now"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <span className="text-[10px] font-bold text-white">●</span>
                  </motion.div>
                )}
              </motion.div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <motion.div 
                  className="flex items-center gap-2 mb-1"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-white font-bold text-lg truncate bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    {currentProfile.name}, {currentProfile.age}
                  </h3>
                </motion.div>
                <motion.p 
                  className="text-gray-300 text-sm mb-3"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <span className="font-medium text-purple-300">{currentProfile.name}</span> {currentProfile.message}
                </motion.p>
                <motion.button
                  onClick={handleViewProfile}
                  className="w-full bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9] hover:from-[#7c3aed] hover:to-[#5b21b6] text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg hover:shadow-purple-500/30"
                  aria-label={`View ${currentProfile.name}'s profile`}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
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

            {/* Progress bar with glow effect */}
            <div className="h-2 bg-gray-800/50 relative overflow-hidden" role="presentation">
              <motion.div
                className="h-full bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9] relative"
                style={{ width: `${progress}%` }}
                initial={{ width: '100%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              >
                {/* Shimmer effect on progress bar */}
                <motion.div
                  className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['0%', '300%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              </motion.div>
              {/* Time indicator */}
              <div className="absolute right-2 -top-6 text-xs text-gray-400">
                {Math.round((progress / 100) * (notificationDuration / 1000))}s
              </div>
            </div>
          </div>

          {/* Drop shadow for depth */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-purple-500/20 to-transparent blur-xl opacity-50" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileNotification;