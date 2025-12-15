/* eslint-disable @typescript-eslint/no-explicit-any */
// app/main/people/page.tsx
'use client';

import { useState, useEffect, useRef, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import { Heart, MessageCircle, X, ChevronLeft, ChevronRight, MapPin, Camera, Users, Gift, Star, MoreVertical, CheckCircle, Mail, CreditCard, MessageSquare, Book, Coffee, Plane, Music, Dumbbell, Utensils, Trophy, Gamepad2, Palette, Bike, Mountain, Film, Pizza, Globe, Calendar, User, Briefcase } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import LayoutController from '@/components/layout/LayoutController';
import personaService, { ParsedPersonaProfile } from '@/lib/services/personaService';

// Get icon for interest
const getInterestIcon = (interest: string) => {
  switch(interest.toLowerCase()) {
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
  onHold: (isHolding: boolean) => void;
  children: React.ReactNode;
}

const SwipeReject: React.FC<SwipeRejectProps> = ({ onReject, onHold, children }) => {
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
    loadUsers();
    loadSuggestedPeople();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch personas from Appwrite
      const personas = await personaService.getAllPersonas({
        limit: 55,
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
    try {
      const randomPersonas = await personaService.getRandomPersonas(6);
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
    // DO NOT change profile on like - only on X/skip
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
      <div className="min-h-screen bg-white">
        <LayoutController />
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gray-200 rounded-xl h-[700px] animate-pulse"></div>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-64 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <LayoutController />
      
      {/* Clean Top Navigation */}
      <div className="fixed top-18 lg:top-24 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-2 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-gray-900 text-sm md:text-base">People</span>
            </div>
            <div className="text-xs text-gray-500">
              {currentUserIndex + 1} of {users.length}
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={prevProfile}
              className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Previous profile"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            </button>
            
            <button 
              onClick={nextProfile}
              className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Next profile"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
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
            <div className={`relative z-10 bg-gray-100 rounded-lg md:rounded-xl overflow-hidden shadow transition-all duration-300 ${isAnimatingOut ? 'opacity-0 translate-x-full' : 'opacity-100'}`}>
              <div className="relative h-[600px] md:h-[750px]"> {/* Increased height */}
                <SwipeReject onReject={handleReject} onHold={handleHold}>
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
                
                {/* Photo Navigation */}
                {currentUser.photos.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentPhotoIndex(prev => (prev - 1 + currentUser.photos.length) % currentUser.photos.length);
                      }}
                      className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black/80 text-white w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-black z-20"
                    >
                      <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentPhotoIndex(prev => (prev + 1) % currentUser.photos.length);
                      }}
                      className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black/80 text-white w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-black z-20"
                    >
                      <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
                    </button>
                  </>
                )}
                
                {/* Photo Counter */}
                <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-black/80 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium z-20">
                  {currentPhotoIndex + 1} / {currentUser.photos.length}
                </div>
                
                {/* Quick Action Buttons */}
                <div className="absolute top-2 md:top-4 left-2 md:left-4 flex gap-1 md:gap-2 z-20">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSkip();
                    }}
                    className="bg-black/80 hover:bg-black text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300"
                    title="Skip profile"
                  >
                    <X className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike();
                    }}
                    className="bg-black/80 hover:bg-black text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300"
                    title="Like profile"
                  >
                    <Heart className={`w-3 h-3 md:w-4 md:h-4 ${likedUsers.includes(currentUser.id) ? 'text-red-400 fill-red-400' : ''}`} />
                  </button>
                </div>
                
                {/* User Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-4 md:p-6 z-20">
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
            <div className="bg-white rounded-lg md:rounded-xl shadow border border-gray-200 p-4 md:p-6">
              {/* Basic Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
                <div className="bg-blue-50 border border-blue-100 rounded-lg md:rounded-xl p-3 md:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <div className="text-xs md:text-sm text-blue-600 font-medium">Location</div>
                  </div>
                  <div className="text-base md:text-xl font-bold text-gray-900">{currentUser.location}</div>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg md:rounded-xl p-3 md:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <div className="text-xs md:text-sm text-purple-600 font-medium">Birth Date</div>
                  </div>
                  <div className="text-base md:text-xl font-bold text-gray-900">{currentUser.birthDate}</div>
                </div>
                <div className="bg-pink-50 border border-pink-100 rounded-lg md:rounded-xl p-3 md:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-pink-600" />
                    <div className="text-xs md:text-sm text-pink-600 font-medium">Status</div>
                  </div>
                  <div className="text-base md:text-xl font-bold text-gray-900">{currentUser.maritalStatus}</div>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg md:rounded-xl p-3 md:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    <div className="text-xs md:text-sm text-indigo-600 font-medium">Profession</div>
                  </div>
                  <div className="text-base md:text-xl font-bold text-gray-900">{currentUser.profession}</div>
                </div>
              </div>

              {/* Interests */}
              <div className="mb-4 md:mb-6">
                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                  <h2 className="text-lg md:text-xl font-bold text-gray-900">Interests</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentUser.interests.map((interest: string, index: number) => (
                    <div 
                      key={index}
                      className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-gray-50 border border-gray-200 rounded-lg md:rounded-xl text-gray-700 text-sm md:text-base font-medium hover:bg-gray-100 transition-colors"
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
                  <h2 className="text-lg md:text-xl font-bold text-gray-900">Looking For</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-3 md:mb-4">
                  {currentUser.lookingFor.map((item: string, index: number) => (
                    <div 
                      key={index}
                      className="p-2 md:p-3 bg-gray-50 border border-gray-200 rounded-lg md:rounded-xl hover:bg-gray-100 transition-colors cursor-pointer text-center"
                    >
                      <div className="font-medium text-gray-900 text-sm md:text-base">{item}</div>
                    </div>
                  ))}
                </div>
                <div className="p-3 md:p-4 bg-purple-50 border border-purple-200 rounded-lg md:rounded-xl">
                  <div className="text-base md:text-lg font-bold text-gray-900">
                    Personality Type: <span className="text-purple-600">{currentUser.personalityType}</span>
                  </div>
                </div>
              </div>

              {/* About Me */}
              <div>
                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  <X className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                  <h2 className="text-lg md:text-xl font-bold text-gray-900">About Me</h2>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3 mb-3 md:mb-4">
                  {currentUser.about.map((trait: string, index: number) => (
                    <div 
                      key={index}
                      className="px-3 md:px-4 py-1.5 md:py-2.5 bg-purple-600 text-white rounded-lg md:rounded-xl font-bold text-sm md:text-lg shadow-sm"
                    >
                      {trait}
                    </div>
                  ))}
                </div>
                <div className="text-gray-700 text-sm md:text-lg leading-relaxed">
                  <p className={showFullDescription ? '' : 'line-clamp-3'}>
                    {currentUser.description}
                  </p>
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-purple-600 font-bold hover:underline mt-2 text-sm md:text-lg"
                  >
                    {showFullDescription ? 'See Less' : 'See More'}
                  </button>
                </div>
              </div>
            </div>
            {/* SEND MESSAGE BUTTON - Below Main Image */}
<div className="bg-white rounded-lg md:rounded-xl shadow border border-gray-200 p-3 md:p-4">
  <button 
    onClick={handleChat}
    className="w-full py-3 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg md:rounded-xl font-bold text-base md:text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg"
  >
    <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
    Send Message to {currentUser.name}
  </button>
</div>

            {/* PHOTOS CONTAINER - MODAL ONLY FOR THESE IMAGES */}
            {currentUser.photosCount > 0 && (
              <div className="bg-white rounded-lg md:rounded-xl shadow border border-gray-200 p-4 md:p-6">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h2 className="text-lg md:text-2xl font-bold text-gray-900">Photos ({currentUser.photosCount})</h2>
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
            {/* ENHANCED: People You Might Like */}
            <div className="bg-white rounded-lg md:rounded-xl shadow border border-gray-200 p-4 md:p-6">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                  People You Might Like
                </h3>
                <button 
                  className="text-purple-600 text-xs md:text-sm font-medium hover:text-purple-700 transition-colors"
                  onClick={() => loadSuggestedPeople()}
                >
                  Refresh
                </button>
              </div>
              
              <div className="space-y-3 md:space-y-4">
                {suggestedPeople.map((person) => (
                  <div 
                    key={person.id}
                    className="p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-lg md:rounded-xl hover:bg-gray-100 transition-all duration-300 cursor-pointer hover:scale-[1.02] group"
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
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white shadow relative group-hover:border-purple-300 transition-colors">
                          <Image
                            src={person.image}
                            alt={person.name}
                            fill
                            className="object-cover rounded-full"
                            sizes="(max-width: 768px) 48px, 56px"
                          />
                        </div>
                        {person.online && (
                          <div className="absolute bottom-0 right-0 w-2 h-2 md:w-2.5 md:h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 md:gap-2">
                          <div className="font-bold text-gray-900 text-sm md:text-base truncate">
                            {person.name}, {person.age}
                          </div>
                          {Math.random() > 0.5 && (
                            <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-blue-400 flex-shrink-0" />
                          )}
                        </div>
                        <div className="text-gray-600 text-xs md:text-sm flex items-center gap-1 truncate mt-0.5">
                          <MapPin className="w-2 h-2 md:w-3 md:h-3 flex-shrink-0" />
                          <span className="truncate">{person.location}</span>
                        </div>
                        {person.interests && (
                          <div className="flex items-center gap-1 mt-1">
                            {person.interests.slice(0, 2).map((interest: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, idx: Key | null | undefined) => (
                              <span key={idx} className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                {interest}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-gray-500 text-xs flex items-center gap-1 flex-shrink-0">
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
                        className="flex-1 py-2 md:py-2.5 bg-purple-600 text-white rounded-lg font-medium md:font-bold hover:bg-purple-700 transition-all duration-300 flex items-center justify-center gap-1 md:gap-2 text-sm"
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
                        className="px-3 md:px-4 py-2 md:py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 flex items-center justify-center"
                      >
                        <Heart className={`w-3 h-3 md:w-4 md:h-4 ${likedUsers.includes(person.id) ? 'text-red-500 fill-red-500' : ''}`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Get More with Credits */}
            <div className="bg-white rounded-lg md:rounded-xl shadow border border-gray-200 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                Get More with Credits
              </h3>
              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                  <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                  <span className="text-gray-700 text-sm md:text-base">Chat with anyone you like</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                  <Gift className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                  <span className="text-gray-700 text-sm md:text-base">Send Virtual Gifts</span>
                </div>
              </div>
              <button 
                onClick={() => setShowCreditsPopup(true)}
                className="w-full py-2.5 md:py-3.5 bg-purple-600 text-white rounded-lg font-bold text-sm md:text-lg hover:bg-purple-700 transition-all duration-300 hover:scale-[1.02]"
              >
                Get Credits
              </button>
            </div>

            {/* My Activity */}
            <div className="bg-white rounded-lg md:rounded-xl shadow border border-gray-200 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                My Activity
              </h3>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-700 text-sm md:text-base">Chats</div>
                  <div className="text-lg md:text-2xl font-bold text-purple-600">{userActivity.chats}</div>
                </div>
                <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-900 text-sm md:text-base">Likes</div>
                  <div className="text-lg md:text-2xl font-bold text-purple-600">{userActivity.likes}</div>
                </div>
                <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-900 text-sm md:text-base">Following</div>
                  <div className="text-lg md:text-2xl font-bold text-purple-600">{userActivity.following}</div>
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
              className="bg-purple-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-all duration-300 hover:scale-110"
              title="Start Chat"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
            
            <button 
              onClick={handleLike}
              className="bg-red-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-all duration-300 hover:scale-110"
              title="Like"
            >
              <Heart className={`w-6 h-6 ${likedUsers.includes(currentUser.id) ? 'fill-white' : ''}`} />
            </button>
            
            <button 
              onClick={handleSkip}
              className="bg-gray-800 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-900 transition-all duration-300 hover:scale-110"
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
            className="bg-white text-gray-800 border border-gray-300 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all duration-300 hover:scale-110"
            title="Skip (changes profile)"
          >
            <X className="w-5 h-5" />
          </button>
          
          <button 
            onClick={handleChat}
            className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-all duration-300 hover:scale-110"
            title="Start Chat"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
          
          <button 
            onClick={handleLike}
            className="bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-all duration-300 hover:scale-110"
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
          <div className="bg-white rounded-lg md:rounded-xl max-w-md w-full p-4 md:p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-lg md:text-2xl font-bold text-gray-900">Get Credits</h3>
              <button
                onClick={() => setShowCreditsPopup(false)}
                className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
            
            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
              <div className="p-3 md:p-4 border border-gray-300 rounded-lg hover:border-purple-400 transition-colors cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-base md:text-lg">30 Credits</div>
                    <div className="text-gray-600 text-xs md:text-sm">30 messages</div>
                  </div>
                  <div className="text-lg md:text-xl font-bold text-purple-600">$9.99</div>
                </div>
              </div>
              
              <div className="p-3 md:p-4 border-2 border-purple-600 rounded-lg bg-purple-50">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-base md:text-lg">100 Credits</div>
                    <div className="text-gray-600 text-xs md:text-sm">100 messages</div>
                  </div>
                  <div className="text-lg md:text-xl font-bold text-purple-600">$19.99</div>
                </div>
              </div>
              
              <div className="p-3 md:p-4 border border-gray-300 rounded-lg hover:border-purple-400 transition-colors cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-base md:text-lg">350 Credits</div>
                    <div className="text-gray-600 text-xs md:text-sm">350 messages</div>
                  </div>
                  <div className="text-lg md:text-xl font-bold text-purple-600">$39.99</div>
                </div>
              </div>
            </div>
            
            <button className="w-full py-2.5 md:py-3.5 bg-purple-600 text-white rounded-lg font-bold text-sm md:text-lg hover:bg-purple-700 transition-all duration-300 hover:scale-[1.02]">
              Continue to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}