// app/main/people/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, X, ChevronLeft, ChevronRight, MapPin, Camera, Users, Gift, Star, MoreVertical, CheckCircle, Mail, CreditCard, MessageSquare, Book, Coffee, Plane, Music, Dumbbell, Utensils, Trophy, Gamepad2, Palette, Bike, Mountain, Film, Pizza } from 'lucide-react';
import Image from 'next/image';
import LayoutController from '@/components/layout/LayoutController';

// Mock user data for browsing - ORIGINAL CONTENT
const mockUsers = [
  {
    id: 1,
    name: 'Isabella',
    age: 29,
    location: 'Medellín, Colombia',
    bio: 'Lawyer passionate about justice and human rights',
    mainImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1200&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1494790108755-2616b786d4d7?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=1200&fit=crop',
    ],
    interests: ['Reading', 'Law', 'Travel', 'Photography'],
    lookingFor: ['Finding a friend', 'Get attention', 'I am bored', 'People Aged: 18 - 90'],
    personalityType: 'Bookworm',
    about: ['Kind', 'Hard-working', 'Ambitious', 'Dedicated'],
    description: 'In a nutshell, I can say that I am a very hard-working person. I have dedicated a large part of my life to boosting my career with the firm dream of becoming the woman I have always imagined. My focus and dedication are reflected in every project I undertake...',
    isVerified: true,
    online: true,
    photosCount: 12,
    lastActive: 'Online now',
    country: 'Colombia',
    birthDate: '1994-10-16',
    maritalStatus: 'Not Married',
    profession: 'Lawyer'
  },
  {
    id: 2,
    name: 'Sofia',
    age: 26,
    location: 'Bogotá, Colombia',
    bio: 'Architect designing sustainable spaces',
    mainImage: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=800&h=1200&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1494790108755-2616b786d4d7?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1200&fit=crop',
    ],
    interests: ['Architecture', 'Art', 'Travel', 'Yoga'],
    lookingFor: ['Serious relationship', 'Travel partner', 'Cultural exchange'],
    personalityType: 'Creative Soul',
    about: ['Creative', 'Thoughtful', 'Passionate'],
    description: 'Designing buildings that tell stories and create meaningful spaces for people to connect.',
    isVerified: true,
    online: false,
    photosCount: 6,
    lastActive: '2 hours ago',
    country: 'Colombia',
    birthDate: '1997-05-22',
    maritalStatus: 'Single',
    profession: 'Architect'
  },
  {
    id: 3,
    name: 'Valentina',
    age: 31,
    location: 'Cali, Colombia',
    bio: 'Doctor making a difference in healthcare',
    mainImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1200&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop',
    ],
    interests: ['Medicine', 'Dancing', 'Cooking', 'Reading'],
    lookingFor: ['Meaningful connection', 'Someone caring', 'Long-term partner'],
    personalityType: 'Caregiver',
    about: ['Compassionate', 'Intelligent', 'Dedicated'],
    description: 'Passionate about helping others and making a positive impact in people\'s lives.',
    isVerified: true,
    online: true,
    photosCount: 5,
    lastActive: 'Online now',
    country: 'Colombia',
    birthDate: '1992-08-15',
    maritalStatus: 'Divorced',
    profession: 'Doctor'
  },
  {
    id: 4,
    name: 'Camila',
    age: 24,
    location: 'Cartagena, Colombia',
    bio: 'Fashion designer with a passion for colors',
    mainImage: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=800&h=1200&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1494790108755-2616b786d4d7?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1200&fit=crop',
    ],
    interests: ['Fashion', 'Art', 'Beach', 'Dancing'],
    lookingFor: ['Fun times', 'Beach dates', 'Creative partner'],
    personalityType: 'Free Spirit',
    about: ['Creative', 'Energetic', 'Optimistic'],
    description: 'Bringing colors and joy to the world through fashion design.',
    isVerified: false,
    online: true,
    photosCount: 7,
    lastActive: 'Online now',
    country: 'Colombia',
    birthDate: '1999-11-30',
    maritalStatus: 'Single',
    profession: 'Fashion Designer'
  },
  {
    id: 5,
    name: 'Daniela',
    age: 28,
    location: 'Barranquilla, Colombia',
    bio: 'Software engineer building the future',
    mainImage: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1200&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1494790108755-2616b786d4d7?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1200&fit=crop',
    ],
    interests: ['Technology', 'Gaming', 'Music', 'Travel'],
    lookingFor: ['Tech conversations', 'Gaming partner', 'Intellectual connection'],
    personalityType: 'Innovator',
    about: ['Intelligent', 'Analytical', 'Curious'],
    description: 'Creating innovative solutions through code and technology.',
    isVerified: true,
    online: false,
    photosCount: 6,
    lastActive: '1 day ago',
    country: 'Colombia',
    birthDate: '1995-03-18',
    maritalStatus: 'Not Married',
    profession: 'Software Engineer'
  },
];

// People you might like - separate from main browsing
const suggestedPeople = [
  {
    id: 101,
    name: 'Ekaterina',
    age: 35,
    location: 'Rime, Ukraine',
    photos: 31,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop',
    online: true
  },
  {
    id: 102,
    name: 'Chao Xiaofei',
    age: 35,
    location: 'Guangzhou, China',
    photos: 12,
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop',
    online: true
  },
  {
    id: 103,
    name: 'Iryna',
    age: 28,
    location: 'Mydolayn, Ukraine',
    photos: 15,
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop',
    online: true
  },
  {
    id: 104,
    name: 'Natalia',
    age: 29,
    location: 'Chicago, United States',
    photos: 26,
    image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=500&fit=crop',
    online: false
  },
  {
    id: 105,
    name: 'Ruzzle',
    age: 29,
    location: 'Pasig, Philippines',
    photos: 12,
    image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005-128?w=400&h=500&fit=crop',
    online: true
  },
];

// Get icon for interest
const getInterestIcon = (interest: string) => {
  switch(interest.toLowerCase()) {
    case 'reading': return <Book className="w-4 h-4" />;
    case 'law': return <Scale className="w-4 h-4" />;
    case 'travel': return <Plane className="w-4 h-4" />;
    case 'photography': return <Camera className="w-4 h-4" />;
    case 'architecture': return <Building className="w-4 h-4" />;
    case 'art': return <Palette className="w-4 h-4" />;
    case 'yoga': return <Wind className="w-4 h-4" />;
    case 'medicine': return <Heart className="w-4 h-4" />;
    case 'dancing': return <Music className="w-4 h-4" />;
    case 'cooking': return <Utensils className="w-4 h-4" />;
    case 'fashion': return <Shirt className="w-4 h-4" />;
    case 'beach': return <Sun className="w-4 h-4" />;
    case 'technology': return <Cpu className="w-4 h-4" />;
    case 'gaming': return <Gamepad2 className="w-4 h-4" />;
    case 'music': return <Music className="w-4 h-4" />;
    case 'fitness': return <Dumbbell className="w-4 h-4" />;
    case 'sports': return <Trophy className="w-4 h-4" />;
    case 'cycling': return <Bike className="w-4 h-4" />;
    case 'hiking': return <Mountain className="w-4 h-4" />;
    case 'movies': return <Film className="w-4 h-4" />;
    case 'food': return <Pizza className="w-4 h-4" />;
    default: return <Star className="w-4 h-4" />;
  }
};

// Custom icons
const Scale = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>
);

const Building = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const Wind = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" />
  </svg>
);

const Sun = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const Cpu = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

const Shirt = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);

export default function PeoplePage() {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [likedUsers, setLikedUsers] = useState<number[]>([]);
  const [showCreditsPopup, setShowCreditsPopup] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showActionButtons, setShowActionButtons] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentUser = mockUsers[currentUserIndex];
  
  const nextProfile = () => {
    setCurrentPhotoIndex(0);
    setCurrentUserIndex((prev) => (prev + 1) % mockUsers.length);
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const prevProfile = () => {
    setCurrentPhotoIndex(0);
    setCurrentUserIndex((prev) => (prev - 1 + mockUsers.length) % mockUsers.length);
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleLike = () => {
    if (!likedUsers.includes(currentUser.id)) {
      setLikedUsers([...likedUsers, currentUser.id]);
    }
    nextProfile();
  };
  
  const handleSkip = () => {
    nextProfile();
  };
  
  const handleChat = () => {
    alert(`Starting chat with ${currentUser.name}`);
  };

  // Handle scroll to hide/show action buttons on mobile
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768) {
        // On mobile, hide buttons when scrolling down, show when scrolling up
        setShowActionButtons(false);
        setTimeout(() => setShowActionButtons(true), 1000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <LayoutController />
      
      {/* Clean Top Navigation - Less obtrusive */}
      <div className="fixed top-24 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-2 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-gray-900 text-sm md:text-base">People</span>
            </div>
            <div className="text-xs text-gray-500">
              {currentUserIndex + 1} of {mockUsers.length}
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

      {/* Main Content Container with ref for scrolling */}
      <div 
        ref={containerRef}
        className="max-w-7xl mx-auto px-3 md:px-4 pt-14 md:pt-20 pb-24 md:pb-8 overflow-y-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          
          {/* LEFT COLUMN: Image Container - TALL AND SEPARATE */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* MAIN IMAGE CONTAINER - VERY TALL */}
            <div className="bg-gray-100 rounded-lg md:rounded-xl overflow-hidden shadow">
              <div className="relative h-[500px] md:h-[650px]">
                <Image
                  src={currentUser.photos[currentPhotoIndex]}
                  alt={`${currentUser.name}'s photo`}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Photo Navigation */}
                {currentUser.photos.length > 1 && (
                  <>
                    <button 
                      onClick={() => setCurrentPhotoIndex(prev => (prev - 1 + currentUser.photos.length) % currentUser.photos.length)}
                      className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black/80 text-white w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-black"
                    >
                      <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                    </button>
                    <button 
                      onClick={() => setCurrentPhotoIndex(prev => (prev + 1) % currentUser.photos.length)}
                      className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black/80 text-white w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-black"
                    >
                      <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
                    </button>
                  </>
                )}
                
                {/* Photo Counter */}
                <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-black/80 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium">
                  {currentPhotoIndex + 1} / {currentUser.photos.length}
                </div>
                
                {/* Quick Action Buttons */}
                <div className="absolute top-2 md:top-4 left-2 md:left-4 flex gap-1 md:gap-2">
                  <button 
                    onClick={handleSkip}
                    className="bg-black/80 hover:bg-black text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300"
                    title="Skip profile"
                  >
                    <X className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                  <button 
                    onClick={handleLike}
                    className="bg-black/80 hover:bg-black text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300"
                    title="Like profile"
                  >
                    <Heart className={`w-3 h-3 md:w-4 md:h-4 ${likedUsers.includes(currentUser.id) ? 'text-red-400 fill-red-400' : ''}`} />
                  </button>
                </div>
                
                {/* User Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 md:p-6">
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

            {/* PROFILE DETAILS CONTAINER - SEPARATE AND SLEEK */}
            <div className="bg-white rounded-lg md:rounded-xl shadow border border-gray-200 p-4 md:p-6">
              {/* Basic Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
                <div className="bg-blue-50 border border-blue-100 rounded-lg md:rounded-xl p-3 md:p-4">
                  <div className="text-xs md:text-sm text-blue-600 font-medium mb-0.5 md:mb-1">Country</div>
                  <div className="text-base md:text-xl font-bold text-gray-900">{currentUser.country}</div>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg md:rounded-xl p-3 md:p-4">
                  <div className="text-xs md:text-sm text-purple-600 font-medium mb-0.5 md:mb-1">Birth Date</div>
                  <div className="text-base md:text-xl font-bold text-gray-900">{currentUser.birthDate}</div>
                </div>
                <div className="bg-pink-50 border border-pink-100 rounded-lg md:rounded-xl p-3 md:p-4">
                  <div className="text-xs md:text-sm text-pink-600 font-medium mb-0.5 md:mb-1">Status</div>
                  <div className="text-base md:text-xl font-bold text-gray-900">{currentUser.maritalStatus}</div>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg md:rounded-xl p-3 md:p-4">
                  <div className="text-xs md:text-sm text-indigo-600 font-medium mb-0.5 md:mb-1">Profession</div>
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
                  {currentUser.interests.map((interest, index) => (
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
                  {currentUser.lookingFor.map((item, index) => (
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
                  {currentUser.about.map((trait, index) => (
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

            {/* PHOTOS CONTAINER - SEPARATE AND LARGE WITH MANY PHOTOS */}
            <div className="bg-white rounded-lg md:rounded-xl shadow border border-gray-200 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-2xl font-bold text-gray-900">Public Photos ({currentUser.photosCount})</h2>
                <button className="text-purple-600 font-bold hover:underline text-sm md:text-lg">
                  View All
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {currentUser.photos.map((photo, index) => (
                  <div 
                    key={index}
                    className="aspect-[3/4] rounded-lg md:rounded-xl overflow-hidden cursor-pointer group shadow hover:shadow-md transition-all duration-300"
                    onClick={() => setCurrentPhotoIndex(index)}
                  >
                    <Image
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      width={300}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: People You Might Like + Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* People You Might Like */}
            <div className="bg-white rounded-lg md:rounded-xl shadow border border-gray-200 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                People You Might Like
              </h3>
              
              <div className="space-y-3 md:space-y-4">
                {suggestedPeople.map((person) => (
                  <div 
                    key={person.id}
                    className="p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-lg md:rounded-xl hover:bg-gray-100 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                    onClick={() => alert(`Viewing ${person.name}'s profile`)}
                  >
                    <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                      <div className="relative">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white shadow">
                          <Image
                            src={person.image}
                            alt={person.name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                        {person.online && (
                          <div className="absolute bottom-0 right-0 w-2 h-2 md:w-2.5 md:h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-sm md:text-base">
                          {person.name}, {person.age}
                        </div>
                        <div className="text-gray-600 text-xs md:text-sm flex items-center gap-1">
                          <MapPin className="w-2 h-2 md:w-3 md:h-3" />
                          {person.location}
                        </div>
                      </div>
                      <div className="text-gray-500 text-xs flex items-center gap-1">
                        <Camera className="w-2 h-2 md:w-3 md:h-3" />
                        <span className="font-medium">{person.photos}</span>
                      </div>
                    </div>
                    <button className="w-full py-2 md:py-2.5 bg-purple-600 text-white rounded-lg font-medium md:font-bold hover:bg-purple-700 transition-all duration-300 flex items-center justify-center gap-1 md:gap-2 text-sm">
                      <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
                      Start Chat
                    </button>
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
                <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                  <span className="text-gray-700 text-sm md:text-base">Respond in Mail</span>
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
                  <div className="text-lg md:text-2xl font-bold text-purple-600">156</div>
                </div>
                <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-700 text-sm md:text-base">Mail</div>
                  <div className="text-lg md:text-2xl font-bold text-purple-600">42</div>
                </div>
                <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-900 text-sm md:text-base">Following</div>
                  <div className="text-lg md:text-2xl font-bold text-purple-600">89</div>
                </div>
              </div>
            </div>

            {/* Online Now */}
            <div className="bg-white rounded-lg md:rounded-xl shadow border border-gray-200 p-4 md:p-6">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Online now:
                </h3>
              </div>
              
              <div className="space-y-2 md:space-y-3">
                {suggestedPeople.slice(0, 3).map((person) => (
                  <div key={person.id} className="p-2 md:p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="relative">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden">
                          <Image
                            src={person.image}
                            alt={person.name}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full border border-white"></div>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-sm md:text-base">
                          {person.name}, {person.age}
                        </div>
                        <div className="text-gray-600 text-xs md:text-sm">{person.location}</div>
                      </div>
                      <div className="text-gray-500 text-xs md:text-sm">
                        {person.photos}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons for Mobile - Clean and non-obstructive */}
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

      {/* Desktop Floating Action Buttons - Clean and non-obstructive */}
      <div className="fixed bottom-8 right-8 z-30 hidden md:block">
        <div className="flex gap-4">
          <button 
            onClick={handleSkip}
            className="bg-white text-gray-800 border border-gray-300 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all duration-300 hover:scale-110"
            title="Skip"
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
            title="Like"
          >
            <Heart className={`w-5 h-5 ${likedUsers.includes(currentUser.id) ? 'fill-white' : ''}`} />
          </button>
        </div>
      </div>

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