/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
// app/main/discover/page.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Filter, Users, Star, Flame, ChevronRight, MapPin, Heart, MessageCircle, Eye, UserPlus, CheckCircle, X, Grid, List, X as XIcon, Sparkles, MessageCircleCodeIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import LayoutController from '@/components/layout/LayoutController';
import personaService, { ParsedPersonaProfile, PersonaFilters } from '@/lib/services/personaService';
import { useTheme } from '@/lib/context/ThemeContext';
import './discover.scss';

// Available locations for filtering
const locations = ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Düsseldorf', 'Leipzig'];

// Common interests for quick filtering
const commonInterests = ['Travel', 'Music', 'Art', 'Sports', 'Food', 'Fashion', 'Technology', 'Photography', 'Fitness', 'Books'];

// Convert Appwrite persona to display profile format
const convertPersonaToDisplayProfile = (persona: ParsedPersonaProfile) => {
  // Calculate distance (for demo purposes)
  const distances = ['2 km', '3 km', '5 km', '8 km', '12 km', '15 km'];
  const randomDistance = distances[Math.floor(Math.random() * distances.length)];
  
  // Calculate compatibility score
  const compatibility = Math.floor(Math.random() * 30) + 70; // 70-100%
  
  // Determine if online (based on lastActive - if within last 15 minutes)
  const lastActive = new Date(persona.lastActive || persona.$createdAt);
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  const isOnline = lastActive > fifteenMinutesAgo;
  
  return {
    id: persona.$id,
    personaId: persona.$id,
    profileNumber: persona.profileNumber,
    username: persona.username,
    age: persona.age,
    location: persona.location,
    distance: randomDistance,
    isOnline,
    isVerified: persona.isVerified,
    isPremium: persona.isPremium,
    imageUrl: persona.profilePic || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&h=800&fit=crop',
    bio: persona.bio || `Looking for meaningful connections in ${persona.location}`,
    interests: persona.interests || [],
    compatibility,
    gender: persona.gender,
    followingCount: persona.followingCount || 0,
    lastActive: persona.lastActive,
    email: persona.email,
    fieldOfWork: persona.fieldOfWork,
    englishLevel: persona.englishLevel,
    languages: persona.languages || [],
    martialStatus: persona.martialStatus,
    personality: persona.personality,
    personalityTraits: persona.personalityTraits || []
  };
};

export default function DiscoverPage() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'following'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobile, setIsMobile] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalProfiles, setTotalProfiles] = useState(0);
  
  const [icebreakerProfiles, setIcebreakerProfiles] = useState<any[]>([]);
  const [showIcebreakerModal, setShowIcebreakerModal] = useState(false);
  const [selectedIcebreakerProfile, setSelectedIcebreakerProfile] = useState<any>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    gender: '' as 'male' | 'female' | '',
    minAge: 18,
    maxAge: 40,
    location: [] as string[],
    maxDistance: 50,
    interests: [] as string[],
    verifiedOnly: false,
    premiumOnly: false
  });

  // Check for mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load initial data
  useEffect(() => {
    loadInitialProfiles();
    loadIcebreakerProfiles();
  }, []);

  const loadInitialProfiles = async () => {
    setIsLoading(true);
    try {
      // Get total count first
      const total = await personaService.getPersonaCount();
      setTotalProfiles(total);
      
      // Get initial batch of personas
      const queryFilters: PersonaFilters = {
        limit: 12,
        offset: 0
      };

      // Apply initial gender filter if set
      if (filters.gender) queryFilters.gender = filters.gender;

      const initialPersonas = await personaService.getAllPersonas(queryFilters);
      const displayProfiles = initialPersonas.map(convertPersonaToDisplayProfile);

      setProfiles(displayProfiles);
      setFilteredProfiles(displayProfiles);
      setHasMore(initialPersonas.length === 12);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadIcebreakerProfiles = async () => {
    try {
      // Get random profiles for icebreakers
      const randomPersonas = await personaService.getRandomPersonas(5);
      const icebreakerProfilesData = randomPersonas.map(convertPersonaToDisplayProfile);
      setIcebreakerProfiles(icebreakerProfilesData);
    } catch (error) {
      console.error('Error loading icebreaker profiles:', error);
    }
  };

  const loadMoreProfiles = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const offset = profiles.length;
      
      const queryFilters: PersonaFilters = {
        limit: 12,
        offset: 0
      };

      // Apply active filters
      if (filters.gender) queryFilters.gender = filters.gender;
      if (filters.minAge > 18) queryFilters.minAge = filters.minAge;
      if (filters.maxAge < 40) queryFilters.maxAge = filters.maxAge;
      if (filters.location.length > 0) {
        // For multiple locations, we need to handle differently
        // Since Appwrite query only supports exact match, we'll use the first location
        queryFilters.location = filters.location[0];
      }
      if (filters.verifiedOnly) queryFilters.isVerified = true;
      if (filters.premiumOnly) queryFilters.isPremium = true;

      const newPersonas = await personaService.getAllPersonas(queryFilters);

      if (newPersonas.length === 0) {
        setHasMore(false);
        return;
      }

      const newDisplayProfiles = newPersonas.map(convertPersonaToDisplayProfile);
      const updatedProfiles = [...profiles, ...newDisplayProfiles];
      
      setProfiles(updatedProfiles);
      
      // Apply current filters to the new combined list
      applyFiltersToProfiles(updatedProfiles);
      
      setHasMore(newPersonas.length === 12);

    } catch (error) {
      console.error('Error loading more profiles:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const applyFiltersToProfiles = useCallback((profilesToFilter: any[]) => {
    let result = [...profilesToFilter];
    
    // Apply tab filter
    if (activeTab === 'following') {
      result = result.filter(profile => profile.followingCount > 0);
    } else if (activeTab === 'online') {
      result = result.filter(profile => profile.isOnline);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(profile =>
        profile.username.toLowerCase().includes(query) ||
        profile.location.toLowerCase().includes(query) ||
        profile.bio.toLowerCase().includes(query) ||
        (profile.interests && profile.interests.some((interest: string) => 
          interest.toLowerCase().includes(query)
        ))
      );
    }
    
    // Apply advanced filters
    result = result.filter(profile => {
      // Age filter
      if (profile.age < filters.minAge || profile.age > filters.maxAge) return false;
      
      // Location filter
      if (filters.location.length > 0) {
        const hasLocation = filters.location.some(loc => 
          profile.location.toLowerCase().includes(loc.toLowerCase())
        );
        if (!hasLocation) return false;
      }
      
      // Distance filter (mock distance for demo)
      const distance = parseInt(profile.distance.replace(' km', ''));
      if (distance > filters.maxDistance) return false;
      
      // Interests filter
      if (filters.interests.length > 0) {
        const hasInterest = filters.interests.some(interest =>
          profile.interests && profile.interests.some((profileInterest: string) => 
            profileInterest.toLowerCase().includes(interest.toLowerCase())
          )
        );
        if (!hasInterest) return false;
      }
      
      // Verified filter
      if (filters.verifiedOnly && !profile.isVerified) return false;
      
      // Premium filter
      if (filters.premiumOnly && !profile.isPremium) return false;
      
      // Gender filter
      if (filters.gender && profile.gender !== filters.gender) return false;
      
      return true;
    });
    
    setFilteredProfiles(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [activeTab, searchQuery, filters]);

  // Apply filters when they change
  useEffect(() => {
    applyFiltersToProfiles(profiles);
  }, [applyFiltersToProfiles, profiles]);

  // Active filter count calculation
  const activeFilterCount = useMemo(() => {
    let count = 0;
    
    if (filters.gender) count += 1;
    if (filters.location.length > 0) count += 1;
    if (filters.interests.length > 0) count += 1;
    if (filters.verifiedOnly) count += 1;
    if (filters.premiumOnly) count += 1;
    if (filters.minAge > 18) count += 1;
    if (filters.maxAge < 40) count += 1;
    if (filters.maxDistance < 50) count += 1;
    
    return count;
  }, [filters]);

  // Pagination calculations
  const profilesPerPage = viewMode === 'grid' ? (isMobile ? 6 : 12) : (isMobile ? 4 : 8);
  const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);
  const startIndex = (currentPage - 1) * profilesPerPage;
  const endIndex = startIndex + profilesPerPage;
  const currentProfiles = filteredProfiles.slice(startIndex, endIndex);

  // Profile actions
  const handleFollow = async (profileId: string) => {
    try {
      // Update local state immediately for better UX
      setProfiles(prev => prev.map(profile => 
        profile.id === profileId 
          ? { ...profile, followingCount: profile.followingCount + 1 }
          : profile
      ));
      
      // Update in Appwrite
      const profile = profiles.find(p => p.id === profileId);
      if (profile) {
        await personaService.updatePersonaStats(profileId, {
          followingCount: profile.followingCount + 1,
          lastActive: new Date().toISOString()
        });
      }
      
      // Show success feedback
      console.log('Followed profile:', profileId);
    } catch (error) {
      console.error('Error following profile:', error);
      // Revert on error
      setProfiles(prev => prev.map(profile => 
        profile.id === profileId 
          ? { ...profile, followingCount: profile.followingCount - 1 }
          : profile
      ));
    }
  };

  const handleLike = async (profileId: string) => {
    try {
      // In a real app, you would update like count in database
      console.log('Liked profile:', profileId);
      
      // Update local state for immediate feedback
      setProfiles(prev => prev.map(profile => 
        profile.id === profileId 
          ? { ...profile, liked: true } // Add liked flag
          : profile
      ));
    } catch (error) {
      console.error('Error liking profile:', error);
    }
  };

  const handleChat = (personaId: string) => {
    // Use the correct route format
    router.push(`/main/chats/${personaId}`);
  };
  
  const handleViewProfile = (profileId: string) => {
    router.push(`/main/profile/${profileId}`);
  };

  const handleSendIcebreaker = (profile: any) => {
    setSelectedIcebreakerProfile(profile);
    setShowIcebreakerModal(true);
  };

  const updateFilter = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      gender: '',
      minAge: 18,
      maxAge: 40,
      location: [],
      maxDistance: 50,
      interests: [],
      verifiedOnly: false,
      premiumOnly: false
    });
    setSearchQuery('');
    setActiveTab('all');
  };

  const closeMobileSidebar = () => {
    setShowFilters(false);
  };

  // Icebreaker modal component
  const IcebreakerModal = () => {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [sent, setSent] = useState(false);

    const icebreakerMessages = [
      "Hey! I noticed we both love travel. What's your favorite destination?",
      "Your profile caught my eye! What's the best book you've read recently?",
      "Hello! I see we have similar taste in music. What are you listening to lately?",
      "Hi there! Your photography is amazing. Do you have a favorite subject to shoot?",
      "Hey! I'm also into fitness. What's your go-to workout routine?"
    ];

    const handleSend = async () => {
      if (!message.trim() || !selectedIcebreakerProfile) return;
      
      setIsSending(true);
      try {
        // In a real app, send the icebreaker message to the user
        console.log('Sending icebreaker to:', selectedIcebreakerProfile.username);
        console.log('Message:', message);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setSent(true);
        
        // Close modal after success
        setTimeout(() => {
          setShowIcebreakerModal(false);
          setSelectedIcebreakerProfile(null);
          setMessage('');
          setSent(false);
        }, 2000);
        
      } catch (error) {
        console.error('Error sending icebreaker:', error);
      } finally {
        setIsSending(false);
      }
    };

    const selectRandomMessage = () => {
      const randomIndex = Math.floor(Math.random() * icebreakerMessages.length);
      setMessage(icebreakerMessages[randomIndex]);
    };

    if (!selectedIcebreakerProfile) return null;

    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
        <div className="rounded-2xl max-w-md w-full overflow-hidden" style={{ backgroundColor: colors.cardBackground }}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold" style={{ color: colors.primaryText }}>Send Icebreaker</h3>
              <button
                onClick={() => setShowIcebreakerModal(false)}
                className="p-2 rounded-full transition-colors"
                style={{ backgroundColor: isDark ? colors.hoverBackground : 'transparent' }}
              >
                <XIcon className="w-5 h-5" style={{ color: colors.iconColor }} />
              </button>
            </div>
            
            <div className="flex items-center gap-3 mb-6 p-3 rounded-xl" style={{ backgroundColor: colors.hoverBackground }}>
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={selectedIcebreakerProfile.imageUrl}
                  alt={selectedIcebreakerProfile.username}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold" style={{ color: colors.primaryText }}>{selectedIcebreakerProfile.username}, {selectedIcebreakerProfile.age}</h4>
                <p className="text-sm" style={{ color: colors.secondaryText }}>{selectedIcebreakerProfile.location}</p>
              </div>
            </div>
            
            {sent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2" style={{ color: colors.primaryText }}>Icebreaker Sent!</h4>
                <p style={{ color: colors.secondaryText }}>Your message has been sent to {selectedIcebreakerProfile.username}</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.secondaryText }}>
                    Your Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Start a conversation with an interesting question or comment..."
                    className="w-full h-32 px-4 py-3 border placeholder:text-gray-400 rounded-xl focus:ring-2 outline-none resize-none"
                    style={{ 
                      backgroundColor: colors.inputBackground,
                      color: colors.primaryText,
                      borderColor: colors.border,
                      
                    }}
                  />
                </div>
                
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={selectRandomMessage}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors"
                    style={{ backgroundColor: colors.secondary, color: 'white' }}
                  >
                    <MessageCircleCodeIcon className="w-4 h-4" />
                    Suggest
                  </button>
                  <button
                    onClick={() => setMessage('')}
                    className="px-4 py-2 rounded-lg font-medium transition-colors"
                    style={{ backgroundColor: colors.danger, color: 'white' }}
                  >
                    Clear
                  </button>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowIcebreakerModal(false)}
                    className="flex-1 py-3 border rounded-lg font-medium transition-colors"
                    style={{ 
                      backgroundColor: colors.background, 
                      borderColor: colors.border,
                      color: colors.primaryText
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={!message.trim() || isSending}
                    className="flex-1 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: colors.secondary, color: 'white' }}
                  >
                    {isSending ? 'Sending...' : 'Send Icebreaker'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Skeleton loading component
  const ProfileSkeleton = () => (
    <div className="profile-card rounded-xl border overflow-hidden animate-pulse"
      style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
    >
      <div className="aspect-[4/5] rounded-t-xl" style={{ backgroundColor: colors.hoverBackground }}></div>
      <div className="p-4">
        <div className="h-6 rounded w-3/4 mb-2" style={{ backgroundColor: colors.hoverBackground }}></div>
        <div className="h-4 rounded w-1/2 mb-4" style={{ backgroundColor: colors.hoverBackground }}></div>
        <div className="h-10 rounded w-full mb-2" style={{ backgroundColor: colors.hoverBackground }}></div>
        <div className="h-10 rounded w-full" style={{ backgroundColor: colors.hoverBackground }}></div>
      </div>
    </div>
  );

  // Mobile grid/list view configuration
  const gridColumns = isMobile ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <div className="min-h-screen no-overflow discover-container" style={{ backgroundColor: colors.background }}>
      <LayoutController />

      {/* Icebreaker Modal */}
      {showIcebreakerModal && <IcebreakerModal />}

      {/* Mobile Sidebar Overlay */}
      {showFilters && isMobile && (
        <div 
          className="mobile-overlay lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header with Tabs and Actions */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="responsive-text">
              <h1 className="text-3xl font-bold" style={{ color: colors.primaryText }}>Discover</h1>
              <p style={{ color: colors.secondaryText }} className="mt-2">Find amazing people to connect with</p>
            </div>
            
            {/* Mobile Controls */}
            <div className="mobile-controls flex items-center gap-2 sm:hidden">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="search-toggle p-2"
              >
                <Search className="w-5 h-5" style={{ color: colors.iconColor }} />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="filters-toggle p-2 relative"
              >
                <Filter className="w-5 h-5" style={{ color: colors.iconColor }} />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ff2e2e] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2"
              >
                {viewMode === 'grid' ? 
                  <Grid className="w-5 h-5" style={{ color: colors.iconColor }} /> : 
                  <List className="w-5 h-5" style={{ color: colors.iconColor }} />
                }
              </button>
            </div>
            
            {/* Desktop Controls */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: colors.placeholderText }} />
                <input
                  type="text"
                  placeholder="Search profiles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 outline-none w-64"
                  style={{ 
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.border,
                    color: colors.primaryText,
                  }}
                />
              </div>
              <div className="flex items-center gap-2 p-1 rounded-lg" style={{ backgroundColor: colors.hoverBackground }}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'shadow-sm' : ''}`}
                  style={{ 
                    backgroundColor: viewMode === 'grid' ? colors.cardBackground : 'transparent', 
                    color: viewMode === 'grid' ? colors.secondary : colors.secondaryText
                  }}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'shadow-sm' : ''}`}
                  style={{ 
                    backgroundColor: viewMode === 'list' ? colors.cardBackground : 'transparent', 
                    color: viewMode === 'list' ? colors.secondary : colors.secondaryText
                  }}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {showSearch && (
            <div className="mt-4 sm:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: colors.placeholderText }} />
                <input
                  type="text"
                  placeholder="Search profiles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 outline-none"
                  style={{ 
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.border,
                    color: colors.primaryText
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex  flex-col lg:flex-row gap-8">
          {/* Sidebar with responsive classes */}
          <div className={`sidebar-container ${showFilters ? 'sidebar-open' : ''}`}>
            {showFilters && isMobile && (
              <button
                onClick={closeMobileSidebar}
                className="sidebar-close p-2 rounded-lg"
                style={{ backgroundColor: colors.hoverBackground }}
              >
                <XIcon className="w-5 h-5" style={{ color: colors.iconColor }} />
              </button>
            )}
            
            <div className="space-y-8">
              {/* Profile Tabs */}
              <div className="rounded-xl border p-6" 
                style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
                <h3 className="font-bold text-lg mb-4" style={{ color: colors.primaryText }}>Profiles</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-between`}
                    style={{ 
                      backgroundColor: activeTab === 'all' ? colors.secondary : colors.background,
                      color: activeTab === 'all' ? 'white' : colors.primaryText
                    }}
                  >
                    <span>All Profiles</span>
                    <span className="text-sm opacity-80 px-2 py-1 rounded" 
                      style={{ backgroundColor: activeTab === 'all' ? 'rgba(255, 255, 255, 0.2)' : colors.hoverBackground }}>
                      {totalProfiles}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('online')}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-between`}
                    style={{ 
                      backgroundColor: activeTab === 'online' ? colors.secondary : colors.background,
                      color: activeTab === 'online' ? 'white' : colors.primaryText
                    }}
                  >
                    <span>Online Now</span>
                    <span className="text-sm opacity-80 px-2 py-1 rounded" 
                      style={{ backgroundColor: activeTab === 'online' ? 'rgba(255, 255, 255, 0.2)' : colors.hoverBackground }}>
                      {profiles.filter(p => p.isOnline).length}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('following')}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-between`}
                    style={{ 
                      backgroundColor: activeTab === 'following' ? colors.secondary : colors.background,
                      color: activeTab === 'following' ? 'white' : colors.primaryText
                    }}
                  >
                    <span>Following</span>
                    <span className="text-sm opacity-80 px-2 py-1 rounded"
                      style={{ backgroundColor: activeTab === 'following' ? 'rgba(255, 255, 255, 0.2)' : colors.hoverBackground }}>
                      {profiles.filter(p => p.followingCount > 0).length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Enhanced Filters */}
              <div className="rounded-xl border p-6" 
                style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg" style={{ color: colors.primaryText }}>Filters</h3>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm font-medium"
                      style={{ color: colors.secondary }}
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Gender Selection */}
                  <div>
                    <h4 className="font-medium mb-3" style={{ color: colors.primaryText }}>Looking for</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => updateFilter('gender', 'female')}
                        className={`py-2 rounded-lg font-medium transition-all duration-200`}
                        style={{ 
                          backgroundColor: filters.gender === 'female' ? colors.secondary : colors.hoverBackground,
                          color: filters.gender === 'female' ? 'white' : colors.primaryText
                        }}
                      >
                        Women
                      </button>
                      <button
                        onClick={() => updateFilter('gender', 'male')}
                        className={`py-2 rounded-lg font-medium transition-all duration-200`}
                        style={{ 
                          backgroundColor: filters.gender === 'male' ? colors.secondary : colors.hoverBackground,
                          color: filters.gender === 'male' ? 'white' : colors.primaryText
                        }}
                      >
                        Men
                      </button>
                      <button
                        onClick={() => updateFilter('gender', '')}
                        className={`py-2 rounded-lg font-medium transition-all duration-200`}
                        style={{ 
                          backgroundColor: !filters.gender ? colors.secondary : colors.hoverBackground,
                          color: !filters.gender ? 'white' : colors.primaryText
                        }}
                      >
                        All
                      </button>
                    </div>
                  </div>

                  {/* Age Range */}
                  <div>
                    <h4 className="font-medium mb-3" style={{ color: colors.primaryText }}>
                      Age: {filters.minAge} - {filters.maxAge}
                    </h4>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <input
                            type="number"
                            min="18"
                            max="80"
                            value={filters.minAge}
                            onChange={(e) => updateFilter('minAge', parseInt(e.target.value) || 18)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none"
                            placeholder="Min"
                            style={{ 
                              backgroundColor: colors.inputBackground,
                              borderColor: colors.border,
                              color: colors.primaryText
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="number"
                            min="18"
                            max="80"
                            value={filters.maxAge}
                            onChange={(e) => updateFilter('maxAge', parseInt(e.target.value) || 40)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none"
                            placeholder="Max"
                            style={{ 
                              backgroundColor: colors.inputBackground,
                              borderColor: colors.border,
                              color: colors.primaryText
                            }}
                          />
                        </div>
                      </div>
                      <div className="relative pt-4">
                        <input
                          type="range"
                          min="18"
                          max="80"
                          value={filters.maxAge}
                          onChange={(e) => updateFilter('maxAge', parseInt(e.target.value))}
                          className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
                          style={{ backgroundColor: colors.hoverBackground }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Distance */}
                  <div>
                    <h4 className="font-medium mb-3" style={{ color: colors.primaryText }}>
                      Distance: Up to {filters.maxDistance} km
                    </h4>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={filters.maxDistance}
                      onChange={(e) => updateFilter('maxDistance', parseInt(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
                      style={{ backgroundColor: colors.hoverBackground }}
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <h4 className="font-medium mb-3" style={{ color: colors.primaryText }}>Location</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {locations.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => {
                            if (filters.location.includes(loc)) {
                              updateFilter('location', filters.location.filter(l => l !== loc));
                            } else {
                              updateFilter('location', [...filters.location, loc]);
                            }
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-3`}
                          style={{ 
                            backgroundColor: filters.location.includes(loc) ? colors.secondary : colors.hoverBackground,
                            color: filters.location.includes(loc) ? 'white' : colors.primaryText
                          }}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center`} 
                            style={{ borderColor: filters.location.includes(loc) ? 'white' : colors.border }}
                          >
                            {filters.location.includes(loc) && (
                              <div className="w-2 h-2 bg-white rounded-sm"></div>
                            )}
                          </div>
                          <span>{loc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <h4 className="font-medium mb-3" style={{ color: colors.primaryText }}>Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {commonInterests.map((interest) => (
                        <button
                          key={interest}
                          onClick={() => {
                            if (filters.interests.includes(interest)) {
                              updateFilter('interests', filters.interests.filter(i => i !== interest));
                            } else {
                              updateFilter('interests', [...filters.interests, interest]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200`}
                          style={{ 
                            backgroundColor: filters.interests.includes(interest) ? colors.secondary : colors.hoverBackground,
                            color: filters.interests.includes(interest) ? 'white' : colors.primaryText
                          }}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Additional Filters */}
                  <div className="space-y-3">
                    <button
                      onClick={() => updateFilter('verifiedOnly', !filters.verifiedOnly)}
                      className={`w-full px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-3`}
                      style={{ 
                        backgroundColor: filters.verifiedOnly ? colors.secondary : colors.hoverBackground,
                        color: filters.verifiedOnly ? 'white' : colors.primaryText
                      }}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center`}
                        style={{ borderColor: filters.verifiedOnly ? 'white' : colors.border }}
                      >
                        {filters.verifiedOnly && (
                          <div className="w-3 h-3 bg-white rounded-sm"></div>
                        )}
                      </div>
                      <span>Verified Only</span>
                    </button>
                    <button
                      onClick={() => updateFilter('premiumOnly', !filters.premiumOnly)}
                      className={`w-full px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-3`}
                      style={{ 
                        backgroundColor: filters.premiumOnly ? colors.secondary : colors.hoverBackground,
                        color: filters.premiumOnly ? 'white' : colors.primaryText
                      }}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center`}
                        style={{ borderColor: filters.premiumOnly ? 'white' : colors.border }}
                      >
                        {filters.premiumOnly && (
                          <div className="w-3 h-3 bg-white rounded-sm"></div>
                        )}
                      </div>
                      <span>Premium Only</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Spark New Chats */}
              <div className="bg-gradient-to-br from-[#5e17eb] to-[#ff2e2e] rounded-xl p-6 text-white">
                <h3 className="font-bold text-lg mb-4">Spark New Chats</h3>
                <p className="text-white/90 text-sm mb-4">
                  Break the ice with ready-to-send conversation starters
                </p>
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      if (icebreakerProfiles.length > 0) {
                        const randomProfile = icebreakerProfiles[Math.floor(Math.random() * icebreakerProfiles.length)];
                        handleSendIcebreaker(randomProfile);
                      }
                    }}
                    className="w-full flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Flame className="w-5 h-5" />
                      <div>
                        <span className="font-medium block">Send Icebreaker</span>
                        <span className="text-xs opacity-80">Start a conversation</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Get More with Credits */}
              <div className="rounded-xl border p-6" 
                style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
                <h3 className="font-bold text-lg mb-4" style={{ color: colors.primaryText }}>Get More with Credits</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: colors.hoverBackground }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
                    <span style={{ color: colors.primaryText }}>Chat with anyone you like</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: colors.hoverBackground }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                    <span style={{ color: colors.primaryText }}>Send Virtual Gifts</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: colors.hoverBackground }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.warning }}></div>
                    <span style={{ color: colors.primaryText }}>Get Premium Features</span>
                  </div>
                </div>
                <button 
                  onClick={() => router.push('/main/credits')}
                  className="w-full mt-6 py-3 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: colors.secondary, color: 'white' }}
                >
                  Get Credits
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="main-content-area flex-1 min-w-0">
            {/* Mobile Tabs */}
            <div className="lg:hidden mb-6">
              <div className="flex rounded-lg p-1" style={{ backgroundColor: colors.hoverBackground }}>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2`}
                  style={{ 
                    backgroundColor: activeTab === 'all' ? colors.cardBackground : 'transparent', 
                    color: activeTab === 'all' ? colors.secondary : colors.secondaryText 
                  }}
                >
                  All
                  <span className="text-xs rounded-full px-2 py-0.5" 
                    style={{ backgroundColor: colors.hoverBackground, color: colors.secondaryText }}>
                    {filteredProfiles.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('online')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2`}
                  style={{ 
                    backgroundColor: activeTab === 'online' ? colors.cardBackground : 'transparent', 
                    color: activeTab === 'online' ? colors.secondary : colors.secondaryText 
                  }}
                >
                  Online
                  <span className="text-xs rounded-full px-2 py-0.5" 
                    style={{ backgroundColor: colors.hoverBackground, color: colors.secondaryText }}>
                    {profiles.filter(p => p.isOnline).length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('following')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2`}
                  style={{ 
                    backgroundColor: activeTab === 'following' ? colors.cardBackground : 'transparent', 
                    color: activeTab === 'following' ? colors.secondary : colors.secondaryText 
                  }}
                >
                  Following
                  <span className="text-xs rounded-full px-2 py-0.5" 
                    style={{ backgroundColor: colors.hoverBackground, color: colors.secondaryText }}>
                    {profiles.filter(p => p.followingCount > 0).length}
                  </span>
                </button>
              </div>
            </div>

            {/* Results Info */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="responsive-text">
                <h2 className="text-xl font-bold" style={{ color: colors.primaryText }}>
                  {activeTab === 'all' && 'All Profiles'}
                  {activeTab === 'online' && 'Online Now'}
                  {activeTab === 'following' && 'Following'}
                  <span style={{ color: colors.secondary }} className="ml-2">({filteredProfiles.length})</span>
                </h2>
                {searchQuery && (
                  <p style={{ color: colors.secondaryText }} className="text-sm mt-1">
                    Results for &ldquo;{searchQuery}&rdquo;
                  </p>
                )}
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <div className="text-sm" style={{ color: colors.secondaryText }}>
                  Showing {Math.min(filteredProfiles.length, endIndex)} of {filteredProfiles.length}
                </div>
                <select 
                  onChange={(e) => {
                    // Sort functionality can be added here
                    console.log('Sort by:', e.target.value);
                  }}
                  className="bg-transparent border-none focus:ring-0 font-medium"
                  style={{ color: colors.primaryText }}
                >
                  <option>Sort: Newest</option>
                  <option>Sort: Distance</option>
                  <option>Sort: Compatibility</option>
                  <option>Sort: Age</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
              <div className="mb-6 filter-chips">
                {filters.gender && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm filter-chip"
                    style={{ backgroundColor: `${colors.secondary}10`, color: colors.secondary }}
                  >
                    {filters.gender === 'female' ? 'Women' : 'Men'}
                    <button onClick={() => updateFilter('gender', '')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.minAge > 18 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm filter-chip"
                    style={{ backgroundColor: `${colors.secondary}10`, color: colors.secondary }}
                  >
                    Age from {filters.minAge}
                    <button onClick={() => updateFilter('minAge', 18)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.maxAge < 40 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm filter-chip"
                    style={{ backgroundColor: `${colors.secondary}10`, color: colors.secondary }}
                  >
                    Age to {filters.maxAge}
                    <button onClick={() => updateFilter('maxAge', 40)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.maxDistance < 50 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm filter-chip"
                    style={{ backgroundColor: `${colors.secondary}10`, color: colors.secondary }}
                  >
                    Within {filters.maxDistance}km
                    <button onClick={() => updateFilter('maxDistance', 50)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.location.map(loc => (
                  <span key={loc} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm filter-chip"
                    style={{ backgroundColor: `${colors.secondary}10`, color: colors.secondary }}
                  >
                    {loc}
                    <button onClick={() => updateFilter('location', filters.location.filter(l => l !== loc))}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.interests.map(interest => (
                  <span key={interest} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm filter-chip"
                    style={{ backgroundColor: `${colors.secondary}10`, color: colors.secondary }}
                  >
                    {interest}
                    <button onClick={() => updateFilter('interests', filters.interests.filter(i => i !== interest))}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.verifiedOnly && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm filter-chip"
                    style={{ backgroundColor: `${colors.secondary}10`, color: colors.secondary }}
                  >
                    Verified Only
                    <button onClick={() => updateFilter('verifiedOnly', false)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.premiumOnly && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm filter-chip"
                    style={{ backgroundColor: `${colors.secondary}10`, color: colors.secondary }}
                  >
                    Premium Only
                    <button onClick={() => updateFilter('premiumOnly', false)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div className={`profiles-grid ${gridColumns} gap-4`}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <ProfileSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                {/* Profiles Grid/List */}
                {viewMode === 'grid' ? (
                  <div className={`profiles-grid ${gridColumns} gap-4`}>
                    {currentProfiles.map(profile => (
                      <div
                        key={profile.id}
                        className="profile-card rounded-xl border overflow-hidden transition-all duration-300 group"
                        style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
                      >
                        {/* Profile Image */}
                        <div className="relative aspect-[4/5] card-image">
                          <Image
                            src={profile.imageUrl}
                            alt={profile.username}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
                          />
                          
                          {/* Premium Badge */}
                          {profile.isPremium && (
                            <div className="absolute top-3 left-3">
                              <div className="bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                <Star className="w-3 h-3" />
                                PREMIUM
                              </div>
                            </div>
                          )}
                          
                          {/* Online Status */}
                          <div className="absolute top-3 right-3">
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full backdrop-blur-sm ${
                              profile.isOnline
                                ? 'bg-green-500/20 text-green-600'
                                : 'bg-gray-500/20 text-gray-600'
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                profile.isOnline ? 'bg-green-500' : 'bg-gray-500'
                              }`}></div>
                              <span className="text-xs font-medium">
                                {profile.isOnline ? 'Online' : 'Offline'}
                              </span>
                            </div>
                          </div>
                          
                          {/* Compatibility Score */}
                          <div className="absolute bottom-3 right-3">
                            <div className="bg-black/50 text-white px-3 py-2 rounded-full text-sm font-bold backdrop-blur-sm">
                              {profile.compatibility}%
                            </div>
                          </div>
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          
                          {/* Profile Info */}
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="profile-name text-white font-bold text-xl">
                                    {profile.username}, {profile.age}
                                  </h3>
                                  {profile.isVerified && (
                                    <CheckCircle className="w-5 h-5 text-blue-400" />
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-white/90 text-sm profile-info">
                                  <MapPin className="w-4 h-4" />
                                  <span>{profile.location}</span>
                                  <span className="text-white/70">•</span>
                                  <span>{profile.distance}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-white/90 text-sm mt-2 line-clamp-2">
                              {profile.bio}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {profile.interests?.slice(0, 2).map((interest: string, idx: number) => (
                                <span key={idx} className="px-2 py-1 bg-white/20 text-white text-xs rounded-full backdrop-blur-sm">
                                  {interest}
                                </span>
                              ))}
                              {profile.interests?.length > 2 && (
                                <span className="px-2 py-1 bg-white/20 text-white text-xs rounded-full backdrop-blur-sm">
                                  +{profile.interests.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-4">
                        <div className="action-buttons flex flex-col sm:flex-row gap-2 mb-3">
                            <button
                              onClick={() => handleLike(profile.id)}
                              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors duration-300"
                              style={{ backgroundColor: colors.hoverBackground, color: colors.primaryText }}
                            >
                              <Heart className="w-4 h-4" />
                              Like
                            </button>
                            <button
                              onClick={() => handleChat(profile.id)}
                              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors duration-300"
                              style={{ backgroundColor: colors.secondary, color: 'white' }}
                            >
                              <MessageCircle className="w-4 h-4" />
                              Chat
                            </button>
                          </div>
                          
                          <div className="action-buttons flex gap-2">
                            <button
                              onClick={() => handleViewProfile(profile.id)}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 border rounded-lg font-medium transition-colors duration-300"
                              style={{ 
                                backgroundColor: colors.background, 
                                borderColor: colors.border, 
                                color: colors.primaryText 
                              }}
                            >
                              <Eye className="w-4 h-4" />
                              View Profile
                            </button>
                            <button
                              onClick={() => handleFollow(profile.id)}
                              className="px-3 py-2.5 border rounded-lg transition-colors duration-300 flex items-center justify-center"
                              title="Follow"
                              style={{ 
                                backgroundColor: colors.background, 
                                borderColor: colors.border, 
                                color: colors.primaryText 
                              }}
                            >
                              <UserPlus className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* List View */
                  <div className="list-view space-y-4">
                    {currentProfiles.map(profile => (
                      <div
                        key={profile.id}
                        className="profile-item rounded-xl border p-4 transition-all duration-300 group"
                        style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
                      >
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Profile Image */}
                          <div className="relative w-full sm:w-24 h-48 sm:h-24 flex-shrink-0">
                            <Image
                              src={profile.imageUrl}
                              alt={profile.username}
                              fill
                              className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                            />
                            {profile.isOnline && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          
                          {/* Profile Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="profile-name font-bold text-lg" style={{ color: colors.primaryText }}>
                                    {profile.username}, {profile.age}
                                  </h3>
                                  {profile.isVerified && (
                                    <CheckCircle className="w-5 h-5 text-blue-500" />
                                  )}
                                  {profile.isPremium && (
                                    <div className="bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb] text-white px-2 py-1 rounded-full text-xs font-bold">
                                      PREMIUM
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-sm mt-1" style={{ color: colors.secondaryText }}>
                                  <MapPin className="w-4 h-4" />
                                  <span>{profile.location}</span>
                                  <span>•</span>
                                  <span>{profile.distance}</span>
                                  <span>•</span>
                                  <span className="font-bold" style={{ color: colors.secondary }}>{profile.compatibility}% match</span>
                                </div>
                              </div>
                            </div>
                            
                            <p className="mb-3 line-clamp-2" style={{ color: colors.primaryText }}>
                              {profile.bio}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              {profile.interests?.slice(0, 4).map((interest: string, idx: number) => (
                                <span key={idx} className="px-3 py-1 text-sm rounded-full" 
                                  style={{ backgroundColor: colors.hoverBackground, color: colors.primaryText }}>
                                  {interest}
                                </span>
                              ))}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="action-buttons flex flex-wrap gap-2">
                              <button
                                onClick={() => handleLike(profile.id)}
                                className="px-4 py-2 rounded-lg font-medium transition-colors duration-300"
                                style={{ backgroundColor: colors.hoverBackground, color: colors.primaryText }}
                              >
                                <Heart className="w-4 h-4 inline mr-2" />
                                Like
                              </button>
                              <button
                                onClick={() => handleChat(profile.id)}
                                className="w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-colors duration-300"
                                style={{ backgroundColor: colors.secondary, color: 'white' }}
                              >
                                <MessageCircle className="w-4 h-4 inline mr-2" />
                                Chat
                              </button>
                              <button
                                onClick={() => handleViewProfile(profile.id)}
                                className="px-4 py-2 border rounded-lg font-medium transition-colors duration-300"
                                style={{ 
                                  backgroundColor: colors.background, 
                                  borderColor: colors.border, 
                                  color: colors.primaryText 
                                }}
                              >
                                <Eye className="w-4 h-4 inline mr-2" />
                                View Profile
                              </button>
                              <button
                                onClick={() => handleFollow(profile.id)}
                                className="px-4 py-2 border rounded-lg transition-colors duration-300"
                                title="Follow"
                                style={{ 
                                  backgroundColor: colors.background, 
                                  borderColor: colors.border, 
                                  color: colors.primaryText 
                                }}
                              >
                                <UserPlus className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {filteredProfiles.length === 0 && !isLoading && (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" 
                      style={{ backgroundColor: colors.hoverBackground }}>
                      <Users className="w-12 h-12" style={{ color: colors.tertiaryText }} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: colors.primaryText }}>No profiles found</h3>
                    <p style={{ color: colors.secondaryText }} className="mb-6 max-w-md mx-auto">
                      {searchQuery
                        ? `No profiles match "${searchQuery}". Try different search terms or adjust your filters.`
                        : 'Try adjusting your filters to find more people.'}
                    </p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 rounded-lg font-medium transition-colors duration-300"
                      style={{ backgroundColor: colors.secondary, color: 'white' }}
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}

                {/* Load More Button */}
                {hasMore && !isLoading && filteredProfiles.length > 0 && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={loadMoreProfiles}
                      disabled={isLoadingMore}
                      className="px-8 py-3 rounded-lg font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: colors.secondary, color: 'white' }}
                    >
                      {isLoadingMore ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading...
                        </span>
                      ) : (
                        'Load More Profiles'
                      )}
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {filteredProfiles.length > 0 && totalPages > 1 && (
                  <div className="pagination-container flex items-center justify-between mt-8 pt-6 border-t" 
                    style={{ borderColor: colors.border }}>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="prev-button flex items-center gap-2 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ color: colors.secondaryText }}
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" />
                      Previous
                    </button>
                    
                    <div className="page-numbers flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-lg font-medium transition-all duration-200`}
                            style={{ 
                              backgroundColor: currentPage === pageNum ? colors.secondary : 'transparent',
                              color: currentPage === pageNum ? 'white' : colors.secondaryText
                            }}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span style={{ color: colors.tertiaryText }}>...</span>
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            className={`w-10 h-10 rounded-lg font-medium`}
                            style={{ 
                              backgroundColor: currentPage === totalPages ? colors.secondary : 'transparent',
                              color: currentPage === totalPages ? 'white' : colors.secondaryText
                            }}
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="next-button flex items-center gap-2 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ color: colors.secondaryText }}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}