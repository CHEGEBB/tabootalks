/* eslint-disable react-hooks/purity */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ChevronDown, Bell, CheckCircle, Crown } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/context/ThemeContext';
import personaService, { ParsedPersonaProfile, UserProfile } from '@/lib/services/personaService';

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
  currentUser?: UserProfile | null;
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
  position = 'top-center',
  currentUser = null
}) => {
  const { colors, isDark } = useTheme();
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

  // Fetch random profiles based on user preferences with STRICT gender filtering
  const fetchRandomProfiles = async () => {
    try {
      console.log('🔍 Fetching random profiles for notifications...');
      
      if (!currentUser) {
        console.log('⚠️ No current user found, fetching generic random profiles');
        const randomProfiles = await personaService.getRandomPersonas(20);
        const validProfiles = randomProfiles.filter(profile => 
          profile.profilePic && profile.username
        );
        console.log(`✅ Fetched ${validProfiles.length} valid profiles`);
        setProfiles(validProfiles);
        return validProfiles;
      }

      console.log('👤 Using user preferences for notifications:', {
        username: currentUser.username,
        genderPreference: currentUser.gender // "women", "men", or "both"
      });

      // 🔥 Use smartFetchPersonas - it already filters by gender preference
      const filteredProfiles = await personaService.smartFetchPersonas(currentUser, {
        limit: 50 // Get more to have variety
      });

      console.log(`📦 smartFetchPersonas returned ${filteredProfiles.length} profiles`);

      // Filter out profiles without required data
      let validProfiles = filteredProfiles.filter(profile => 
        profile.profilePic && 
        profile.username &&
        profile.$id !== currentUser.$id // Don't show current user
      );

      console.log(`✅ After validation: ${validProfiles.length} valid profiles`);

      // TRIPLE CHECK: Additional gender validation for absolute certainty
      const userPreference = currentUser.gender?.toLowerCase().trim();
      
      if (userPreference === 'women' || userPreference === 'woman') {
        // User wants WOMEN → keep only FEMALE personas
        validProfiles = validProfiles.filter(profile => {
          const profileGender = profile.gender?.toLowerCase().trim();
          const isFemale = profileGender === 'female' || profileGender === 'woman' || profileGender === 'women' || profileGender === 'f';
          
          if (!isFemale) {
            console.log(`🚫 BLOCKED ${profile.username} - Gender: ${profileGender}, User wants: women`);
          }
          
          return isFemale;
        });
        console.log(`💃 Final count: ${validProfiles.length} FEMALE profiles`);
        
      } else if (userPreference === 'men' || userPreference === 'man') {
        // User wants MEN → keep only MALE personas
        validProfiles = validProfiles.filter(profile => {
          const profileGender = profile.gender?.toLowerCase().trim();
          const isMale = profileGender === 'male' || profileGender === 'man' || profileGender === 'men' || profileGender === 'm';
          
          if (!isMale) {
            console.log(`🚫 BLOCKED ${profile.username} - Gender: ${profileGender}, User wants: men`);
          }
          
          return isMale;
        });
        console.log(`🕺 Final count: ${validProfiles.length} MALE profiles`);
        
      } else if (userPreference === 'both') {
        // User wants BOTH → keep all
        console.log(`🌈 User wants both genders - keeping all ${validProfiles.length} profiles`);
      }

      console.log(`✅ Final valid profiles for notifications: ${validProfiles.length}`);
      
      setProfiles(validProfiles);
      return validProfiles;
      
    } catch (error) {
      console.error('❌ Error fetching profiles for notifications:', error);
      
      // Fallback: try to use smartFetchPersonas even on error
      if (currentUser) {
        try {
          const fallbackProfiles = await personaService.smartFetchPersonas(currentUser, { limit: 20 });
          const validFallback = fallbackProfiles.filter(profile => 
            profile.profilePic && profile.username && profile.$id !== currentUser.$id
          );
          setProfiles(validFallback);
          return validFallback;
        } catch (fallbackError) {
          console.error('❌ Fallback also failed:', fallbackError);
        }
      }
      
      // Last resort: random profiles
      const randomProfiles = await personaService.getRandomPersonas(10);
      const validProfiles = randomProfiles.filter(profile => 
        profile.profilePic && profile.username
      );
      setProfiles(validProfiles);
      return validProfiles;
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
        return 'top-4 left-1/2 -translate-x-1/2 sm:top-6';
    }
  };

  const getRandomMessage = (): string => {
    return NOTIFICATION_MESSAGES[Math.floor(Math.random() * NOTIFICATION_MESSAGES.length)];
  };

  // Show notification with STRICT gender validation
  const showNotification = async () => {
    if (isVisibleRef.current || hasClickedRef.current || hasSeenRef.current) {
      scheduleNextNotification();
      return;
    }

    let profilesToUse = profiles;
    if (!profilesToUse || profilesToUse.length === 0) {
      profilesToUse = await fetchRandomProfiles();
    }
    
    if (!profilesToUse || profilesToUse.length === 0) {
      console.log('⚠️ No profiles available for notification');
      scheduleNextNotification();
      return;
    }

    // Pick a random profile
    const randomProfile = profilesToUse[Math.floor(Math.random() * profilesToUse.length)];
    
    // FINAL GENDER CHECK before showing
    if (currentUser && currentUser.gender && currentUser.gender !== 'all') {
      const profileGender = randomProfile.gender?.toLowerCase();
      const preferredGender = currentUser.gender.toLowerCase();
      
      if (profileGender !== preferredGender) {
        console.log(`🚫 BLOCKED notification - Gender mismatch: ${profileGender} !== ${preferredGender}`);
        scheduleNextNotification();
        return;
      }
    }
    
    if (!randomProfile.username || !randomProfile.profilePic) {
      console.log('⚠️ Selected profile missing required data');
      scheduleNextNotification();
      return;
    }

    const message = getRandomMessage();
    const isOnline = Math.random() > 0.3;
    
    console.log(`✅ Showing notification for ${randomProfile.username} (${randomProfile.gender})`);
    
    setCurrentNotification({
      profile: randomProfile,
      message,
      isOnline
    });
    
    setImageError(false);
    setIsVisible(true);
    setProgress(100);
    hasSeenRef.current = true;
    hasClickedRef.current = false;

    startProgressCountdown();
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
          hasSeenRef.current = false;
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

    const init = async () => {
      await fetchRandomProfiles();
      
      setTimeout(() => {
        showNotification();
      }, 3000);
    };

    init();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      if (nextNotificationRef.current) clearTimeout(nextNotificationRef.current);
    };
  }, [autoShow, currentUser]);

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
    
    hasClickedRef.current = true;
    hasSeenRef.current = false;
    
    if (nextNotificationRef.current) {
      clearTimeout(nextNotificationRef.current);
    }
    
    router.push(`/main/profile/${currentNotification.profile.$id}`);
    setIsVisible(false);
    setCurrentNotification(null);
    
    setTimeout(() => {
      hasClickedRef.current = false;
      scheduleNextNotification();
    }, 420000);
  };

  const handleClose = () => {
    setIsVisible(false);
    setCurrentNotification(null);
    hasSeenRef.current = false;
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
          initial={{ y: -120, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -120, opacity: 0, scale: 0.9 }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300,
            mass: 1
          }}
          className={`fixed ${getPositionClass()} z-[9999] w-[calc(100%-2rem)] max-w-md px-2 sm:px-0`}
          role="alert"
          aria-live="assertive"
          aria-label="New match notification"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Bounce indicator */}
          <motion.div 
            className="absolute -top-3 left-1/2 transform -translate-x-1/2"
            animate={{ 
              y: [0, 6, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.2,
              ease: "easeInOut"
            }}
          >
            <ChevronDown className="w-6 h-6" style={{ color: colors.secondary }} />
          </motion.div>

          <motion.div 
            className="rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl relative"
            style={{ 
              backgroundColor: isDark ? colors.cardBackground : colors.background,
              border: `2px solid ${colors.secondary}40`
            }}
            animate={{
              boxShadow: [
                `0 10px 40px ${colors.secondary}30`,
                `0 15px 50px ${colors.secondary}50`,
                `0 10px 40px ${colors.secondary}30`
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Header */}
            <div 
              className="px-4 py-3 flex items-center gap-2"
              style={{ 
                backgroundColor: isDark ? colors.panelBackground : colors.hoverBackground,
                borderBottom: `1px solid ${colors.border}`
              }}
            >
              <motion.div 
                className="p-2 rounded-full"
                style={{ 
                  backgroundColor: `${colors.secondary}20`
                }}
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Bell className="w-4 h-4" style={{ color: colors.secondary }} />
              </motion.div>
              
              <span 
                className="text-sm font-bold"
                style={{ color: colors.primaryText }}
              >
                New Match Alert! 🔥
              </span>
              
              <div className="ml-auto flex items-center gap-2">
                {isProfileVerified() && (
                  <motion.div 
                    className="p-1 rounded-full"
                    style={{ backgroundColor: '#3b82f620' }}
                    title="Verified"
                    whileHover={{ scale: 1.1 }}
                  >
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                  </motion.div>
                )}
                {isProfilePremium() && (
                  <motion.div 
                    className="p-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20"
                    title="Premium Member"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Crown className="w-4 h-4 text-yellow-500" />
                  </motion.div>
                )}
                {isHovering && (
                  <span 
                    className="text-xs animate-pulse font-medium"
                    style={{ color: colors.secondaryText }}
                  >
                    Paused
                  </span>
                )}
                <motion.button
                  onClick={handleClose}
                  className="p-1.5 rounded-full transition-all"
                  style={{ backgroundColor: colors.hoverBackground }}
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: colors.danger + '20'
                  }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Close notification"
                >
                  <X className="w-4 h-4" style={{ color: colors.iconColor }} />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex items-center gap-4">
              {/* Profile Image */}
              <motion.div 
                className="relative flex-shrink-0"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.2, 
                  type: "spring",
                  stiffness: 200
                }}
              >
                <motion.div 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden relative"
                  style={{ 
                    border: `3px solid ${colors.secondary}`,
                    boxShadow: `0 0 20px ${colors.secondary}50`
                  }}
                  animate={{
                    boxShadow: [
                      `0 0 20px ${colors.secondary}50`,
                      `0 0 30px ${colors.secondary}80`,
                      `0 0 20px ${colors.secondary}50`
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  <div 
                    className="relative w-full h-full"
                    style={{ backgroundColor: colors.hoverBackground }}
                  >
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
                </motion.div>
                
                {/* Online Badge */}
                {isOnline && (
                  <motion.div 
                    className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    style={{ 
                      border: `2px solid ${isDark ? colors.cardBackground : colors.background}`,
                      boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        '0 0 10px rgba(34, 197, 94, 0.5)',
                        '0 0 20px rgba(34, 197, 94, 0.8)',
                        '0 0 10px rgba(34, 197, 94, 0.5)'
                      ]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity
                    }}
                    aria-label="Online now"
                  >
                    <span className="text-[10px] font-bold text-white">●</span>
                  </motion.div>
                )}
                
                {/* Location Badge */}
                {profile.location && (
                  <div 
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 px-2 py-0.5 backdrop-blur-sm text-xs rounded-full max-w-[90px] truncate text-center"
                    style={{ 
                      backgroundColor: isDark ? colors.panelBackground + 'CC' : colors.cardBackground + 'CC',
                      color: colors.primaryText,
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    {profile.location.split(',')[0]}
                  </div>
                )}
              </motion.div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <motion.div 
                  className="flex items-center gap-2 mb-1 flex-wrap"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 
                    className="font-bold text-base sm:text-lg truncate"
                    style={{ color: colors.primaryText }}
                  >
                    {getProfileName()}
                  </h3>
                  {isOnline && (
                    <motion.div 
                      className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-500 text-xs rounded-full"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Online</span>
                    </motion.div>
                  )}
                </motion.div>
                
                <motion.p 
                  className="text-sm mb-3"
                  style={{ color: colors.secondaryText }}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <span className="font-semibold" style={{ color: colors.secondary }}>
                    {profile.username}
                  </span>{' '}
                  {getNotificationMessage()}
                </motion.p>
                
                {/* Interests */}
                {profile.interests && profile.interests.length > 0 && (
                  <motion.div 
                    className="flex flex-wrap gap-1 mb-3"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {profile.interests.slice(0, 2).map((interest, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-0.5 text-xs rounded-full font-medium"
                        style={{ 
                          backgroundColor: `${colors.secondary}20`,
                          color: colors.secondary,
                          border: `1px solid ${colors.secondary}30`
                        }}
                      >
                        {interest}
                      </span>
                    ))}
                    {profile.interests.length > 2 && (
                      <span 
                        className="px-2 py-0.5 text-xs rounded-full"
                        style={{ 
                          backgroundColor: colors.hoverBackground,
                          color: colors.tertiaryText
                        }}
                      >
                        +{profile.interests.length - 2}
                      </span>
                    )}
                  </motion.div>
                )}
                
                {/* Action Button */}
                <motion.button
                  onClick={handleViewProfile}
                  className="w-full font-bold py-2.5 sm:py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
                  style={{ 
                    backgroundColor: colors.secondary,
                    color: 'white'
                  }}
                  aria-label={`View ${profile.username}'s profile`}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: `0 10px 30px ${colors.secondary}50`
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="text-sm sm:text-base">View Profile Now</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </div>
            </div>

            {/* Progress Bar */}
            <div 
              className="h-2 relative overflow-hidden" 
              role="presentation"
              style={{ backgroundColor: colors.hoverBackground }}
            >
              <motion.div
                className="h-full relative"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: colors.secondary
                }}
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
              <div 
                className="absolute right-2 -top-6 text-xs font-medium"
                style={{ color: colors.tertiaryText }}
              >
                {Math.round((progress / 100) * (notificationDuration / 1000))}s
              </div>
            </div>
          </motion.div>

          {/* Glow Effect */}
          <div 
            className="absolute inset-0 -z-10 blur-2xl opacity-40"
            style={{ 
              background: `radial-gradient(circle, ${colors.secondary}40 0%, transparent 70%)`
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileNotification;