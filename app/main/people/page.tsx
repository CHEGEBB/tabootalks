/* eslint-disable @typescript-eslint/no-explicit-any */
// app/main/people/page.tsx
'use client';

import { useState, useEffect, useRef, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import { Heart, MessageCircle, X, ChevronLeft, ChevronRight, MapPin, Camera, Users, Gift, Star, MoreVertical, CheckCircle, Mail, CreditCard, MessageSquare, Book, Coffee, Plane, Music, Dumbbell, Utensils, Trophy, Gamepad2, Palette, Bike, Mountain, Film, Pizza, Globe, Calendar, User, Briefcase } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import LayoutController from '@/components/layout/LayoutController';
import personaService, { ParsedPersonaProfile } from '@/lib/services/personaService';
import { useAuth } from '@/lib/hooks/useAuth';
import router from 'next/router';
import { useTheme } from '@/lib/context/ThemeContext';

// Get icon for interest
const getInterestIcon = (interest: string) => {
  switch (interest.toLowerCase()) {
    case 'reading': return <Book className="w-4 h-4" />;
    case 'books': return <Book className="w-4 h-4" />;
    case 'travel': return <Plane className="w-4 h-4" />;
    case 'photography': return <Camera className="w-4 h-4" />;
    case 'art': return <Palette className="w-4 h-4" />;
    case 'music': return <Music className="w-4 h-4" />;
    case 'dance': return <Music className="w-4 h-4" />;
    case 'fitness': return <Dumbbell className="w-4 h-4" />;
    case 'sports': return <Trophy className="w-4 h-4" />;
    case 'cooking': return <Utensils className="w-4 h-4" />;
    case 'food': return <Pizza className="w-4 h-4" />;
    default: return <Star className="w-4 h-4" />;
  }
};

// Format date to show only date, not time
const formatBirthday = (birthday: string) => {
  if (!birthday) return 'Not specified';

  try {
    const date = new Date(birthday);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return birthday;
  }
};



// Extract location (city/region) from full location string
const getLocationDisplay = (location: string) => {
  if (!location) return 'Unknown';

  // Split by comma and take first part (city/region)
  const parts = location.split(',');
  return parts[0]?.trim() || location;
};

// Convert Appwrite persona to display user format
const convertPersonaToDisplayUser = (persona: ParsedPersonaProfile) => {
  // Determine online status based on lastActive (within last 15 minutes)
  const lastActive = new Date(persona.lastActive || persona.$createdAt);
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  const isOnline = lastActive > fifteenMinutesAgo;

  // Get all photos
  const allPhotos = [
    persona.profilePic,
    ...(persona.additionalPhotos || [])
  ].filter(Boolean);

  // Common looking for items
  const commonLookingFor = [
    'Finding a friend',
    'Get attention',
    'I am bored',
    `People Aged: ${persona.preferences?.ageRange?.[0] || 18} - ${persona.preferences?.ageRange?.[1] || 90}`
  ];

  // Determine personality type based on traits
  const personalityType = persona.personalityTraits?.[0] || 'Adventurer';

  // About me traits
  const aboutTraits = persona.personalityTraits?.slice(0, 4) || ['Kind', 'Friendly', 'Adventurous', 'Creative'];

  // Description/bio
  const description = persona.bio || `Looking for meaningful connections. I enjoy ${persona.interests?.slice(0, 2).join(' and ')} in my free time.`;

  // Get location display (city/region only)
  const locationDisplay = getLocationDisplay(persona.location);

  return {
    id: persona.$id,
    name: persona.username,
    age: persona.age,
    location: locationDisplay,
    country: locationDisplay,
    bio: persona.bio || `Professional ${persona.fieldOfWork || 'individual'}`,
    mainImage: persona.profilePic || '/default-avatar.png',
    photos: allPhotos.length > 0 ? allPhotos : ['/default-avatar.png'],
    interests: persona.interests || ['Travel', 'Music', 'Art', 'Food'],
    lookingFor: commonLookingFor,
    personalityType,
    about: aboutTraits,
    description,
    isVerified: persona.isVerified,
    online: isOnline,
    photosCount: allPhotos.length || 1,
    lastActive: isOnline ? 'Online now' : 'Recently active',
    birthDate: formatBirthday(persona.birthday),
    maritalStatus: persona.martialStatus || 'Not specified',
    profession: persona.fieldOfWork || 'Not specified',
    fullLocation: persona.location,
    englishLevel: persona.englishLevel || 'Not specified',
    languages: persona.languages || [],
    personalityTraits: persona.personalityTraits || []
  };
};

// Convert persona to suggested person format
const convertPersonaToSuggestedPerson = (persona: ParsedPersonaProfile, index: number) => {
  const lastActive = new Date(persona.lastActive || persona.$createdAt);
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  const isOnline = lastActive > fifteenMinutesAgo;

  const locationDisplay = getLocationDisplay(persona.location);

  return {
    id: persona.$id,
    name: persona.username,
    age: persona.age,
    location: locationDisplay,
    photos: (persona.additionalPhotos?.length || 0) + 1,
    image: persona.profilePic || '/default-avatar.png',
    online: isOnline,
    interests: persona.interests?.slice(0, 2) || ['Travel', 'Music']
  };
};

// Swipe-to-reject component
interface SwipeRejectProps {
  onReject: () => void;
  onLike?: () => void; // Add this
  onHold: (isHolding: boolean) => void;
  children: React.ReactNode;
}
const SwipeReject: React.FC<SwipeRejectProps> = ({ onReject, onLike, onHold, children }) => {
  const [isHolding, setIsHolding] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartPos({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);

    holdTimeoutRef.current = setTimeout(() => {
      setIsHolding(true);
      onHold(true);
    }, 500);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.x;
    const deltaY = touch.clientY - startPos.y;

    setPosition({
      x: deltaX * 0.8,
      y: deltaY * 0.3
    });

    if (deltaX < -50) {
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
      }
      setIsHolding(false);
      onHold(false);
    }
  };

  const handleTouchEnd = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
    }
    setIsDragging(false);
    setIsHolding(false);
    onHold(false);

    if (position.x < -100) {
      setPosition({ x: -window.innerWidth, y: 0 });
      setTimeout(() => {
        onReject();
        setPosition({ x: 0, y: 0 });
      }, 300);
    } else if (position.x > 100) {
      setPosition({ x: window.innerWidth, y: 0 });
      setTimeout(() => {
        if (onLike) onLike(); // Call the like function
        setPosition({ x: 0, y: 0 });
      }, 300);
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setStartPos({ x: e.clientX, y: e.clientY });
    setIsDragging(true);

    holdTimeoutRef.current = setTimeout(() => {
      setIsHolding(true);
      onHold(true);
    }, 500);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;

    setPosition({
      x: deltaX * 0.8,
      y: deltaY * 0.3
    });

    if (deltaX < -50) {
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
      }
      setIsHolding(false);
      onHold(false);
    }
  };

  const handleMouseUp = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
    }
    setIsDragging(false);
    setIsHolding(false);
    onHold(false);

    if (position.x < -100) {
      setPosition({ x: -window.innerWidth, y: 0 });
      setTimeout(() => {
        onReject();
        setPosition({ x: 0, y: 0 });
      }, 300);
    } else if (position.x > 100) {
      setPosition({ x: window.innerWidth, y: 0 });
      setTimeout(() => {
        if (onLike) onLike(); // Call the like function
        setPosition({ x: 0, y: 0 });
      }, 300);
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMouseMove(e as any);
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mousemove', handleGlobalMouseMove);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
      }
    };
  }, [isDragging, position.x]);

  const transform = `translate3d(${position.x}px, ${position.y}px, 0) rotate(${position.x * 0.1}deg)`;
  const opacity = 1 - Math.min(Math.abs(position.x) / 500, 0.5);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing"
      style={{
        transform,
        opacity,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {children}

      {isHolding && (
        <div className="absolute top-4 right-4 z-50">
          <div className="bg-red-500 text-white px-6 py-3 rounded-full font-bold text-xl md:text-2xl shadow-lg animate-pulse border-2 border-white">
            NOPE
          </div>
        </div>
      )}
      {/* LIKE overlay when swiping RIGHT */}
      {isDragging && position.x > 30 && (
        <div className="absolute top-4 left-4 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-xl md:text-2xl shadow-lg animate-pulse border-2 border-white">
            LIKE ❤️
          </div>
        </div>
      )}

      {isDragging && position.x > 30 && (
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-40">
          <div className="text-green-500 font-bold text-xl md:text-2xl opacity-70">
            Swipe to like →
          </div>
        </div>
      )}

      {isDragging && position.x < -30 && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-40">
          <div className="text-red-500 font-bold text-xl md:text-2xl opacity-70">
            ← Swipe to reject
          </div>
        </div>
      )}

      {isHolding && (
        <div className="absolute inset-0 bg-black/20 z-30 rounded-lg md:rounded-xl" />
      )}
    </div>
  );
};

// Enhanced Image Modal Component with Navigation
interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  alt: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, images, currentIndex, onIndexChange, alt }) => {
  const { colors } = useTheme();
  
  if (!isOpen || !images || images.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onIndexChange((currentIndex - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onIndexChange((currentIndex + 1) % images.length);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative w-full max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Previous button */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Image container */}
        <div className="relative w-full h-full min-h-[400px]">
          {images[currentIndex] && (
            <Image
              src={images[currentIndex]}
              alt={`${alt} photo ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          )}
        </div>

        {/* Next button */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

// Default avatar image
const DEFAULT_AVATAR = '/default-avatar.png';

export default function PeoplePage() {
  const router = useRouter();
  const { profile } = useAuth();
  const { colors, isDark } = useTheme();
  
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [likedUsers, setLikedUsers] = useState<string[]>([]);
  const [showCreditsPopup, setShowCreditsPopup] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showActionButtons, setShowActionButtons] = useState(true);
  const [isHoldingImage, setIsHoldingImage] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [nextUserIndex, setNextUserIndex] = useState(1);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // NEW STATE: For showing animated Chat Now button
  const [showChatNowButton, setShowChatNowButton] = useState(false);

  // State for dynamic data
  const [users, setUsers] = useState<any[]>([]);
  const [suggestedPeople, setSuggestedPeople] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userActivity, setUserActivity] = useState({
    chats: 156,
    likes: 42,
    following: 89
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Load users from Appwrite
  useEffect(() => {
    if (profile) {
      loadUsers();
      loadSuggestedPeople();
    }
  }, [profile]);

  const loadUsers = async () => {
    if (!profile) {
      console.log('⚠️ No user profile available yet');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🎯 Loading users for:', profile.username, 'Gender pref:', profile.gender);

      // ✅ Use smartFetchPersonas with user profile
      const personas = await personaService.smartFetchPersonas(profile, {
        limit: 255,
        offset: 0
      });

      const displayUsers = personas.map(convertPersonaToDisplayUser);
      setUsers(displayUsers);

      if (displayUsers.length > 1) {
        setNextUserIndex(1);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSuggestedPeople = async () => {
    if (!profile) return;

    try {
      console.log('🔍 Loading suggested people for:', profile.username);

      // ✅ Use smartFetchWithVariety with user profile
      const randomPersonas = await personaService.smartFetchWithVariety(profile, [], { limit: 6 });
      const suggestedData = randomPersonas.map(convertPersonaToSuggestedPerson);
      setSuggestedPeople(suggestedData);
    } catch (error) {
      console.error('Error loading suggested people:', error);
    }
  };

  const currentUser = users[currentUserIndex];
  const nextUser = users[nextUserIndex];

  const nextProfile = () => {
    if (users.length === 0) return;

    setIsAnimatingOut(true);
    setCurrentPhotoIndex(0);
    setIsHoldingImage(false);

    setTimeout(() => {
      const newIndex = (currentUserIndex + 1) % users.length;
      setCurrentUserIndex(newIndex);

      // Calculate next user index correctly
      const nextIndex = (newIndex + 1) % users.length;
      setNextUserIndex(nextIndex);

      setIsAnimatingOut(false);

      if (containerRef.current) {
        containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 300);
  };

  const prevProfile = () => {
    if (users.length === 0) return;

    setCurrentPhotoIndex(0);
    setIsHoldingImage(false);

    // Calculate previous index correctly
    const newIndex = (currentUserIndex - 1 + users.length) % users.length;
    setCurrentUserIndex(newIndex);

    // Calculate next user index correctly (should be the one after the new current index)
    const nextIndex = (newIndex + 1) % users.length;
    setNextUserIndex(nextIndex);

    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLike = async () => {
    if (!currentUser) return;

    if (!likedUsers.includes(currentUser.id)) {
      setLikedUsers([...likedUsers, currentUser.id]);

      // Update like count in Appwrite
      try {
        await personaService.updatePersonaStats(currentUser.id, {
          followingCount: 1,
          lastActive: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error updating like count:', error);
      }
    }

    // NEW: Show animated Chat Now button
    setShowChatNowButton(true);

    // Hide the button after 3 seconds (TikTok-like behavior)
    setTimeout(() => {
      setShowChatNowButton(false);
    }, 3000);
  };

  const handleReject = () => {
    nextProfile();
  };

  const handleSkip = () => {
    nextProfile();
  };

  const handleChat = () => {
    if (currentUser) {
      router.push(`/main/chats/${currentUser.id}`);
    }
  };

  const handleHold = (isHolding: boolean) => {
    setIsHoldingImage(isHolding);
  };

  const handleGalleryImageClick = (index: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setModalImageIndex(index);
    setIsImageModalOpen(true);
  };

  // Handle scroll to hide/show action buttons on mobile
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768) {
        setShowActionButtons(false);
        setTimeout(() => setShowActionButtons(true), 1000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Preload next user image
  useEffect(() => {
    if (nextUser?.photos?.[0]) {
      const img = new window.Image();
      img.src = nextUser.photos[0];
    }
  }, [nextUserIndex, nextUser]);

  // Loading skeleton
  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
        <LayoutController />
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="rounded-xl h-[700px] animate-pulse" style={{ backgroundColor: colors.hoverBackground }}></div>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl h-64 animate-pulse" style={{ backgroundColor: colors.hoverBackground }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <LayoutController />

      {/* Clean Top Navigation */}
      <div className="fixed top-18 lg:top-24 left-0 right-0 z-40 backdrop-blur-sm border-b px-4 py-2 shadow-sm" 
           style={{ backgroundColor: `${colors.background}95`, borderColor: colors.border }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: colors.secondary }} />
              <span className="font-semibold text-sm md:text-base" style={{ color: colors.primaryText }}>People</span>
            </div>
            <div className="text-xs" style={{ color: colors.tertiaryText }}>
              {currentUserIndex + 1} of {users.length}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={prevProfile}
              className="button p-1.5 md:p-2 rounded-lg transition-colors"
              title="Previous profile"
              style={{ color: colors.iconColor, backgroundColor: 'transparent'
                     }}
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            <button
              onClick={nextProfile}
              className="button not-[]:p-1.5 md:p-2 rounded-lg transition-colors"
              title="Next profile"
              style={{ color: colors.iconColor, backgroundColor: 'transparent'
                      }}
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto px-3 md:px-4 pt-14 md:pt-20 pb-24 md:pb-8 overflow-y-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

          {/* LEFT COLUMN: Image Container */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6 relative">
            {/* MAIN IMAGE CONTAINER WITH SWIPE FUNCTIONALITY - TALLER RECTANGLE */}
            <div className={`relative z-10 rounded-lg md:rounded-xl overflow-hidden shadow transition-all duration-300 ${isAnimatingOut ? 'opacity-0 translate-x-full' : 'opacity-100'}`} 
                 style={{ backgroundColor: colors.inputBackground }}>
              <div className="relative h-[600px] md:h-[750px]">
                <SwipeReject onReject={handleReject} onLike={handleLike} onHold={handleHold}>
                  <div className="relative w-full h-full">
                    {currentUser.photos[currentPhotoIndex] && (
                      <Image
                        src={currentUser.photos[currentPhotoIndex]}
                        alt={`${currentUser.name}'s photo`}
                        fill
                        className="object-cover"
                        priority
                      />
                    )}
                  </div>
                </SwipeReject>

                {/* ANIMATED CHAT NOW BUTTON - Appears when you click like */}
                {showChatNowButton && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce-slow">
                    <button
                      onClick={handleChat}
                      className="text-white px-8 py-4 rounded-full font-bold text-xl md:text-2xl shadow-2xl transition-all duration-300 animate-pulse flex items-center gap-3 border-4 border-white"
                      style={{ 
                        background: `linear-gradient(to right, ${colors.secondary}, ${colors.primary})`, 
                        borderColor: colors.background 
                      }}
                    >
                      <MessageCircle className="w-6 h-6 md:w-8 md:h-8" />
                      Chat Now
                    </button>
                  </div>
                )}

                {/* Photo Navigation */}
                {currentUser.photos.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentPhotoIndex(prev => (prev - 1 + currentUser.photos.length) % currentUser.photos.length);
                      }}
                      className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 text-white w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 z-20"
                      style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
                    >
                      <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentPhotoIndex(prev => (prev + 1) % currentUser.photos.length);
                      }}
                      className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 text-white w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 z-20"
                      style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
                    >
                      <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
                    </button>
                  </>
                )}

                {/* Photo Counter */}
                <div className="absolute top-2 md:top-4 right-2 md:right-4 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium z-20"
                     style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                  {currentPhotoIndex + 1} / {currentUser.photos.length}
                </div>

                {/* Quick Action Buttons */}
                <div className="absolute top-2 md:top-4 left-2 md:left-4 flex gap-1 md:gap-2 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSkip();
                    }}
                    className="text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
                    title="Skip profile"
                  >
                    <X className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike();
                    }}
                    className="text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
                    title="Like profile"
                  >
                    <Heart className={`w-3 h-3 md:w-4 md:h-4 ${likedUsers.includes(currentUser.id) ? 'text-red-400 fill-red-400' : ''}`} />
                  </button>
                </div>

                {/* User Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20"
                     style={{ background: 'linear-gradient(to top, black, rgba(0,0,0,0.9), transparent)' }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl md:text-3xl font-bold text-white">
                          {currentUser.name}, {currentUser.age}
                        </h1>
                        {currentUser.isVerified && (
                          <CheckCircle className="w-4 h-4 md:w-6 md:h-6 text-blue-400 fill-white" />
                        )}
                      </div>
                      <div className="flex items-center text-white/90 mt-1 md:mt-2">
                        <MapPin className="w-3 h-3 md:w-5 md:h-5 mr-1 md:mr-2" />
                        <span className="text-sm md:text-lg">{currentUser.location}</span>
                      </div>
                      <p className="mt-2 md:mt-3 text-white/80 text-sm md:text-lg md:max-w-2xl">{currentUser.bio}</p>
                    </div>

                    <div className="flex items-center gap-1 md:gap-2 text-white/80">
                      <Camera className="w-3 h-3 md:w-5 md:h-5" />
                      <span className="text-sm md:text-lg">{currentUser.photosCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PROFILE DETAILS CONTAINER */}
            <div className="rounded-lg md:rounded-xl shadow border p-4 md:p-6" 
                 style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
              {/* Basic Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
                <div className="border rounded-lg md:rounded-xl p-3 md:p-4" 
                     style={{ backgroundColor: isDark ? colors.panelBackground : '#EBF8FF', borderColor: isDark ? colors.borderLight : '#BEE3F8' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4" style={{ color: colors.secondary }} />
                    <div className="text-xs md:text-sm font-medium" style={{ color: colors.secondary }}>Location</div>
                  </div>
                  <div className="text-base md:text-xl font-bold" style={{ color: colors.primaryText }}>{currentUser.location}</div>
                </div>
                <div className="border rounded-lg md:rounded-xl p-3 md:p-4" 
                     style={{ backgroundColor: isDark ? colors.panelBackground : '#F5F3FF', borderColor: isDark ? colors.borderLight : '#DDD6FE' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" style={{ color: colors.secondary }} />
                    <div className="text-xs md:text-sm font-medium" style={{ color: colors.secondary }}>Birth Date</div>
                  </div>
                  <div className="text-base md:text-xl font-bold" style={{ color: colors.primaryText }}>{currentUser.birthDate}</div>
                </div>
                <div className="border rounded-lg md:rounded-xl p-3 md:p-4" 
                     style={{ backgroundColor: isDark ? colors.panelBackground : '#FDF2F8', borderColor: isDark ? colors.borderLight : '#FBCFE8' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" style={{ color: colors.primary }} />
                    <div className="text-xs md:text-sm font-medium" style={{ color: colors.primary }}>Status</div>
                  </div>
                  <div className="text-base md:text-xl font-bold" style={{ color: colors.primaryText }}>{currentUser.maritalStatus}</div>
                </div>
                <div className="border rounded-lg md:rounded-xl p-3 md:p-4" 
                     style={{ backgroundColor: isDark ? colors.panelBackground : '#EEF2FF', borderColor: isDark ? colors.borderLight : '#C7D2FE' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4" style={{ color: colors.secondary }} />
                    <div className="text-xs md:text-sm font-medium" style={{ color: colors.secondary }}>Profession</div>
                  </div>
                  <div className="text-base md:text-xl font-bold" style={{ color: colors.primaryText }}>{currentUser.profession}</div>
                </div>
              </div>

              {/* Interests */}
              <div className="mb-4 md:mb-6">
                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                  <h2 className="text-lg md:text-xl font-bold" style={{ color: colors.primaryText }}>Interests</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentUser.interests.map((interest: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 border rounded-lg md:rounded-xl text-sm md:text-base font-medium transition-colors"
                      style={{ 
                        backgroundColor: colors.panelBackground, 
                        borderColor: colors.borderLight, 
                        color: colors.secondaryText 
                      }}
                    >
                      {getInterestIcon(interest)}
                      <span>{interest}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Looking For */}
              <div className="mb-4 md:mb-6">
                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                  <h2 className="text-lg md:text-xl font-bold" style={{ color: colors.primaryText }}>Looking For</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-3 md:mb-4">
                  {currentUser.lookingFor.map((item: string, index: number) => (
                    <div
                      key={index}
                      className="p-2 md:p-3 border rounded-lg md:rounded-xl transition-colors cursor-pointer text-center"
                      style={{ 
                        backgroundColor: colors.panelBackground, 
                        borderColor: colors.borderLight,
                        color: colors.secondaryText
                      }}
                    >
                      <div className="font-medium text-sm md:text-base" style={{ color: colors.primaryText }}>{item}</div>
                    </div>
                  ))}
                </div>
                <div className="p-3 md:p-4 border rounded-lg md:rounded-xl"
                     style={{ 
                       backgroundColor: isDark ? colors.activeBackground : '#F5F3FF', 
                       borderColor: isDark ? colors.secondary : '#DDD6FE' 
                     }}>
                  <div className="text-base md:text-lg font-bold">
                    Personality Type: <span style={{ color: colors.secondary }}>{currentUser.personalityType}</span>
                  </div>
                </div>
              </div>

              {/* About Me */}
              <div>
                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  <X className="w-4 h-4 md:w-5 md:h-5" style={{ color: colors.danger }} />
                  <h2 className="text-lg md:text-xl font-bold" style={{ color: colors.primaryText }}>About Me</h2>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3 mb-3 md:mb-4">
                  {currentUser.about.map((trait: string, index: number) => (
                    <div
                      key={index}
                      className="px-3 md:px-4 py-1.5 md:py-2.5 text-white rounded-lg md:rounded-xl font-bold text-sm md:text-lg shadow-sm"
                      style={{ backgroundColor: colors.secondary }}
                    >
                      {trait}
                    </div>
                  ))}
                </div>
                <div className="text-sm md:text-lg leading-relaxed" style={{ color: colors.secondaryText }}>
                  <p className={showFullDescription ? '' : 'line-clamp-3'}>
                    {currentUser.description}
                  </p>
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="font-bold hover:underline mt-2 text-sm md:text-lg"
                    style={{ color: colors.secondary }}
                  >
                    {showFullDescription ? 'See Less' : 'See More'}
                  </button>
                </div>
              </div>
            </div>

            {/* SEND MESSAGE BUTTON - Below Main Image */}
            <div className="rounded-lg md:rounded-xl shadow border p-3 md:p-4" 
                 style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
              <button
                onClick={handleChat}
                className="w-full py-3 md:py-4 text-white rounded-lg md:rounded-xl font-bold text-base md:text-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg"
                style={{ background: `linear-gradient(to right, ${colors.secondary}, ${colors.primary})` }}
              >
                <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
                Send Message to {currentUser.name}
              </button>
            </div>
            {/* SEND GIFT SECTION */}
            <div className="rounded-lg md:rounded-xl shadow border p-4 md:p-6" 
                 style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                <div>
                  <h2 className="text-lg md:text-xl font-bold flex items-center gap-2" style={{ color: colors.primaryText }}>
                    <Gift className="w-5 h-5 md:w-6 md:h-6" style={{ color: colors.secondary }} />
                    Virtual Gifts for Special Ones
                  </h2>
                  <p className="text-sm md:text-base mt-1" style={{ color: colors.secondaryText }}>
                    Liven up your chat with {currentUser.name}
                  </p>
                </div>
                <button
                  onClick={() => router.push(`/main/virtual-gifts/${currentUser.id}`)}
                  className="text-sm font-medium text-white px-4 py-2 rounded-full transition-colors w-fit"
                  style={{ backgroundColor: colors.secondary }}
                >
                  Choose Virtual Gift
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                {/* Gift 1 - Just image, no click */}
                <div className="flex flex-col items-center p-3 md:p-4">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 mb-2">
                    <Image
                      src="/magical/roseinglass.png"
                      alt="Gift 1"
                      width={96}
                      height={96}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium" style={{ color: colors.primaryText }}>Rose</span>
                </div>

                {/* Gift 2 - Just image, no click */}
                <div className="flex flex-col items-center p-3 md:p-4">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 mb-2">
                    <Image
                      src="/magical/wishwell.png"
                      alt="Gift 2"
                      width={96}
                      height={96}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium" style={{ color: colors.primaryText }}>Wishwell</span>
                </div>

                {/* Gift 3 - Just image, no click */}
                <div className="flex flex-col items-center p-3 md:p-4">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 mb-2">
                    <Image
                      src="/gifts/flower5.png"
                      alt="Gift 3"
                      width={96}
                      height={96}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium" style={{ color: colors.primaryText }}>flowers</span>
                </div>

                {/* Gift 4 - Just image, no click */}
                <div className="flex flex-col items-center p-3 md:p-4">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 mb-2">
                    <Image
                      src="/gifts/love_potion.png"
                      alt="Gift 4"
                      width={96}
                      height={96}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium" style={{ color: colors.primaryText }}>Love potion</span>
                </div>
              </div>
            </div>


            {/* PHOTOS CONTAINER - MODAL ONLY FOR THESE IMAGES */}
            {currentUser.photosCount > 0 && (
              <div className="rounded-lg md:rounded-xl shadow border p-4 md:p-6" 
                   style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h2 className="text-lg md:text-2xl font-bold" style={{ color: colors.primaryText }}>Photos ({currentUser.photosCount})</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {currentUser.photos.map((photo: string, index: number) => (
                    <div
                      key={index}
                      className="aspect-[3/4] rounded-lg md:rounded-xl overflow-hidden cursor-pointer group shadow hover:shadow-md transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGalleryImageClick(index, e);
                      }}
                    >
                      <Image
                        src={photo}
                        alt={`${currentUser.name}'s photo ${index + 1}`}
                        width={300}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: People You Might Like + Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* ENHANCED: People You Might Like - SHOW 5 RANDOM PEOPLE */}
            <div className="rounded-lg md:rounded-xl shadow border p-4 md:p-6" 
                 style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="text-base md:text-lg font-bold flex items-center gap-2" style={{ color: colors.primaryText }}>
                  <Users className="w-4 h-4 md:w-5 md:h-5" style={{ color: colors.secondary }} />
                  People You Might Like
                </h3>
                <button
                  className="text-xs md:text-sm font-medium transition-colors"
                  onClick={() => loadSuggestedPeople()}
                  style={{ color: colors.secondary }}
                >
                  Refresh
                </button>
              </div>

              <div className="space-y-3 md:space-y-4">
                {suggestedPeople.slice(0, 5).map((person) => (
                  <div
                    key={person.id}
                    className="p-3 md:p-4 border rounded-lg md:rounded-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] group"
                    style={{ 
                      backgroundColor: colors.panelBackground, 
                      borderColor: colors.border 
                    }}
                    onClick={() => {
                      const userIndex = users.findIndex(u => u.id === person.id);
                      if (userIndex !== -1) {
                        setCurrentUserIndex(userIndex);
                        setNextUserIndex((userIndex + 1) % users.length);
                        setCurrentPhotoIndex(0);
                        if (containerRef.current) {
                          containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 shadow relative group-hover:border-purple-300 transition-colors"
                             style={{ borderColor: isDark ? colors.borderLight : colors.background }}>
                          <Image
                            src={person.image}
                            alt={person.name}
                            fill
                            className="object-cover rounded-full"
                            sizes="(max-width: 768px) 48px, 56px"
                          />
                        </div>
                        {person.online && (
                          <div className="absolute bottom-0 right-0 w-2 h-2 md:w-2.5 md:h-2.5 bg-green-500 rounded-full border-2" 
                               style={{ borderColor: isDark ? colors.border : colors.background }}></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 md:gap-2">
                          <div className="font-bold text-sm md:text-base truncate" style={{ color: colors.primaryText }}>
                            {person.name}, {person.age}
                          </div>
                          {Math.random() > 0.5 && (
                            <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-blue-400 flex-shrink-0" />
                          )}
                        </div>
                        <div className="text-xs md:text-sm flex items-center gap-1 truncate mt-0.5" style={{ color: colors.secondaryText }}>
                          <MapPin className="w-2 h-2 md:w-3 md:h-3 flex-shrink-0" />
                          <span className="truncate">{person.location}</span>
                        </div>
                        {person.interests && (
                          <div className="flex items-center gap-1 mt-1">
                            {person.interests.slice(0, 2).map((interest: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, idx: Key | null | undefined) => (
                              <span key={idx} className="text-xs px-1.5 py-0.5 rounded"
                                    style={{ backgroundColor: colors.hoverBackground, color: colors.tertiaryText }}>
                                {interest}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-xs flex items-center gap-1 flex-shrink-0" style={{ color: colors.tertiaryText }}>
                        <Camera className="w-2 h-2 md:w-3 md:h-3" />
                        <span className="font-medium">{person.photos}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/main/chats/${person.id}`);
                        }}
                        className="flex-1 py-2 md:py-2.5 text-white rounded-lg font-medium md:font-bold transition-all duration-300 flex items-center justify-center gap-1 md:gap-2 text-sm"
                        style={{ backgroundColor: colors.secondary }}
                      >
                        <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
                        Chat
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!likedUsers.includes(person.id)) {
                            setLikedUsers([...likedUsers, person.id]);
                          }
                        }}
                        className="px-3 md:px-4 py-2 md:py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center"
                        style={{ 
                          backgroundColor: colors.hoverBackground, 
                          color: colors.secondaryText 
                        }}
                      >
                        <Heart className={`w-3 h-3 md:w-4 md:h-4 ${likedUsers.includes(person.id) ? 'text-red-500 fill-red-500' : ''}`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* SHOW MORE button if there are more suggestions */}
              {suggestedPeople.length > 5 && (
                <button
                  onClick={() => {
                    // Load more suggestions or navigate to a browse page
                    console.log('Show more people');
                  }}
                  className="w-full mt-3 py-2 rounded-lg font-medium transition-colors border"
                  style={{ 
                    backgroundColor: colors.hoverBackground, 
                    color: colors.secondaryText,
                    borderColor: colors.border
                  }}
                >
                  Show More
                </button>
              )}
            </div>

            {/* Get More with Credits */}
            <div className="rounded-lg md:rounded-xl shadow border p-4 md:p-6" 
                 style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
              <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center gap-2" style={{ color: colors.primaryText }}>
                <CreditCard className="w-4 h-4 md:w-5 md:h-5" style={{ color: colors.secondary }} />
                Get More with Credits
              </h3>
              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 border rounded-lg transition-colors"
                     style={{ 
                       backgroundColor: colors.panelBackground, 
                       borderColor: colors.border,
                       color: colors.secondaryText
                     }}>
                  <MessageSquare className="w-4 h-4 md:w-5 md:h-5" style={{ color: colors.secondary }} />
                  <span className="text-sm md:text-base">Chat with anyone you like</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 border rounded-lg transition-colors"
                     style={{ 
                       backgroundColor: colors.panelBackground, 
                       borderColor: colors.border,
                       color: colors.secondaryText
                     }}>
                  <Gift className="w-4 h-4 md:w-5 md:h-5" style={{ color: colors.secondary }} />
                  <span className="text-sm md:text-base">Send Virtual Gifts</span>
                </div>
              </div>
              <button
                onClick={() => setShowCreditsPopup(true)}
                className="w-full py-2.5 md:py-3.5 text-white rounded-lg font-bold text-sm md:text-lg transition-all duration-300 hover:scale-[1.02]"
                style={{ backgroundColor: colors.secondary }}
              >
                Get Credits
              </button>
            </div>

            {/* My Activity */}
            <div className="rounded-lg md:rounded-xl shadow border p-4 md:p-6" 
                 style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
              <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center gap-2" style={{ color: colors.primaryText }}>
                <Users className="w-4 h-4 md:w-5 md:h-5" style={{ color: colors.secondary }} />
                My Activity
              </h3>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center justify-between p-2 md:p-3 border rounded-lg transition-colors"
                     style={{ 
                       backgroundColor: colors.panelBackground, 
                       borderColor: colors.border
                     }}>
                  <div className="font-medium text-sm md:text-base" style={{ color: colors.secondaryText }}>Chats</div>
                  <div className="text-lg md:text-2xl font-bold" style={{ color: colors.secondary }}>{userActivity.chats}</div>
                </div>
                <div className="flex items-center justify-between p-2 md:p-3 border rounded-lg transition-colors"
                     style={{ 
                       backgroundColor: colors.panelBackground, 
                       borderColor: colors.border
                     }}>
                  <div className="font-medium text-sm md:text-base" style={{ color: colors.primaryText }}>Likes</div>
                  <div className="text-lg md:text-2xl font-bold" style={{ color: colors.secondary }}>{userActivity.likes}</div>
                </div>
                <div className="flex items-center justify-between p-2 md:p-3 border rounded-lg transition-colors"
                     style={{ 
                       backgroundColor: colors.panelBackground, 
                       borderColor: colors.border
                     }}>
                  <div className="font-medium text-sm md:text-base" style={{ color: colors.primaryText }}>Following</div>
                  <div className="text-lg md:text-2xl font-bold" style={{ color: colors.secondary }}>{userActivity.following}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons for Mobile */}
      {showActionButtons && (
        <div className="fixed bottom-20 right-4 z-30 md:hidden">
          <div className="flex flex-col gap-3">
            <button
              onClick={handleChat}
              className="text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
              style={{ backgroundColor: colors.secondary }}
              title="Start Chat"
            >
              <MessageCircle className="w-6 h-6" />
            </button>

            <button
              onClick={handleLike}
              className="text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
              style={{ backgroundColor: colors.danger }}
              title="Like"
            >
              <Heart className={`w-6 h-6 ${likedUsers.includes(currentUser.id) ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={handleSkip}
              className="text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
              style={{ backgroundColor: isDark ? colors.border : '#333' }}
              title="Skip"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Desktop Floating Action Buttons - LOVE BUTTON FIXED */}
      <div className="fixed bottom-8 right-8 z-30 hidden md:block">
        <div className="flex gap-4">
          <button
            onClick={handleSkip}
            className="text-gray-800 border w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
            style={{ 
              backgroundColor: colors.background, 
              borderColor: colors.border,
              color: colors.primaryText
            }}
            title="Skip (changes profile)"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            onClick={handleChat}
            className="text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
            style={{ backgroundColor: colors.secondary }}
            title="Start Chat"
          >
            <MessageCircle className="w-5 h-5" />
          </button>

          <button
            onClick={handleLike}
            className="text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
            style={{ backgroundColor: colors.danger }}
            title="Like (does NOT change profile)"
          >
            <Heart className={`w-5 h-5 ${likedUsers.includes(currentUser.id) ? 'fill-white' : ''}`} />
          </button>
        </div>
      </div>

      {/* Enhanced Image Modal with Navigation */}
      {currentUser && (
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          images={currentUser.photos}
          currentIndex={modalImageIndex}
          onIndexChange={setModalImageIndex}
          alt={currentUser.name}
        />
      )}

      {/* Credits Popup */}
      {showCreditsPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="rounded-lg md:rounded-xl max-w-md w-full p-4 md:p-6 shadow-2xl" 
               style={{ backgroundColor: colors.cardBackground }}>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-lg md:text-2xl font-bold" style={{ color: colors.primaryText }}>Get Credits</h3>
              <button
                onClick={() => setShowCreditsPopup(false)}
                className="p-1.5 md:p-2 rounded-lg transition-colors"
                style={{ color: colors.iconColor }}
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
              <div className="p-3 md:p-4 border rounded-lg transition-colors cursor-pointer"
                   style={{ borderColor: colors.borderLight }}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-base md:text-lg" style={{ color: colors.primaryText }}>30 Credits</div>
                    <div className="text-xs md:text-sm" style={{ color: colors.secondaryText }}>30 messages</div>
                  </div>
                  <div className="text-lg md:text-xl font-bold" style={{ color: colors.secondary }}>$9.99</div>
                </div>
              </div>

              <div className="p-3 md:p-4 border-2 rounded-lg"
                   style={{ 
                     borderColor: colors.secondary, 
                     backgroundColor: isDark ? colors.activeBackground : '#F5F3FF'
                   }}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-base md:text-lg" style={{ color: colors.primaryText }}>100 Credits</div>
                    <div className="text-xs md:text-sm" style={{ color: colors.secondaryText }}>100 messages</div>
                  </div>
                  <div className="text-lg md:text-xl font-bold" style={{ color: colors.secondary }}>$19.99</div>
                </div>
              </div>

              <div className="p-3 md:p-4 border rounded-lg transition-colors cursor-pointer"
                   style={{ borderColor: colors.borderLight }}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-base md:text-lg" style={{ color: colors.primaryText }}>350 Credits</div>
                    <div className="text-xs md:text-sm" style={{ color: colors.secondaryText }}>350 messages</div>
                  </div>
                  <div className="text-lg md:text-xl font-bold" style={{ color: colors.secondary }}>$39.99</div>
                </div>
              </div>
            </div>

            <button 
              className="w-full py-2.5 md:py-3.5 text-white rounded-lg font-bold text-sm md:text-lg transition-all duration-300 hover:scale-[1.02]"
              style={{ backgroundColor: colors.secondary }}
            >
              Continue to Payment
            </button>
          </div>
        </div>
      )}

      {/* Add custom styles for animation */}
      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
      `}</style>
    </div>
  );
}