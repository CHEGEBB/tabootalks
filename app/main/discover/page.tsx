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

  const handleChat = (profileId: string) => {
    // Navigate to chat with this user
    router.push(`/main/chats?user=${profileId}`);
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
        <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Send Icebreaker</h3>
              <button
                onClick={() => setShowIcebreakerModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-xl">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={selectedIcebreakerProfile.imageUrl}
                  alt={selectedIcebreakerProfile.username}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{selectedIcebreakerProfile.username}, {selectedIcebreakerProfile.age}</h4>
                <p className="text-sm text-gray-600">{selectedIcebreakerProfile.location}</p>
              </div>
            </div>
            
            {sent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Icebreaker Sent!</h4>
                <p className="text-gray-600">Your message has been sent to {selectedIcebreakerProfile.username}</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Start a conversation with an interesting question or comment..."
                    className="w-full h-32 px-4 py-3 border text-gray-500 placeholder:text-gray-500 border-gray-300 rounded-xl focus:border-[#5e17eb] focus:ring-2 focus:ring-[#5e17eb]/20 outline-none resize-none"
                  />
                </div>
                
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={selectRandomMessage}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-500 text-gray-100 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    <MessageCircleCodeIcon className="w-4 h-4" />
                    Suggest
                  </button>
                  <button
                    onClick={() => setMessage('')}
                    className="px-4 py-2 bg-red-500 text-gray-100 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowIcebreakerModal(false)}
                    className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={!message.trim() || isSending}
                    className="flex-1 py-3 bg-[#5e17eb] text-white rounded-lg font-medium hover:bg-[#4a13c4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    <div className="profile-card bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="aspect-[4/5] bg-gray-200 rounded-t-xl"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );

  // Mobile grid/list view configuration
  const gridColumns = isMobile ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <div className="min-h-screen bg-white no-overflow discover-container">
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
              <h1 className="text-3xl font-bold text-gray-900">Discover</h1>
              <p className="text-gray-600 mt-2">Find amazing people to connect with</p>
            </div>
            
            {/* Mobile Controls */}
            <div className="mobile-controls flex items-center gap-2 sm:hidden">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="search-toggle p-2"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="filters-toggle p-2 relative"
              >
                <Filter className="w-5 h-5 text-gray-600" />
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
                  <Grid className="w-5 h-5 text-gray-600" /> : 
                  <List className="w-5 h-5 text-gray-600" />
                }
              </button>
            </div>
            
            {/* Desktop Controls */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search profiles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg placeholder:text-gray-500 focus:border-[#5e17eb] focus:ring-2 focus:ring-[#5e17eb]/20 outline-none w-64"
                />
              </div>
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-white text-[#5e17eb] shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-white text-[#5e17eb] shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search profiles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-[#5e17eb] focus:ring-2 focus:ring-[#5e17eb]/20 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with responsive classes */}
          <div className={`sidebar-container ${showFilters ? 'sidebar-open' : ''}`}>
            {showFilters && isMobile && (
              <button
                onClick={closeMobileSidebar}
                className="sidebar-close p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <XIcon className="w-5 h-5 text-gray-600" />
              </button>
            )}
            
            <div className="space-y-8">
              {/* Profile Tabs */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Profiles</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-between ${
                      activeTab === 'all'
                        ? 'bg-[#5e17eb] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>All Profiles</span>
                    <span className="text-sm opacity-80 bg-white/20 px-2 py-1 rounded">
                      {totalProfiles}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('online')}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-between ${
                      activeTab === 'online'
                        ? 'bg-[#5e17eb] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>Online Now</span>
                    <span className="text-sm opacity-80 bg-white/20 px-2 py-1 rounded">
                      {profiles.filter(p => p.isOnline).length}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('following')}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-between ${
                      activeTab === 'following'
                        ? 'bg-[#5e17eb] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>Following</span>
                    <span className="text-sm opacity-80 bg-white/20 px-2 py-1 rounded">
                      {profiles.filter(p => p.followingCount > 0).length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Enhanced Filters */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-gray-900">Filters</h3>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-[#5e17eb] hover:text-[#4a13c4] font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Gender Selection */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Looking for</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => updateFilter('gender', 'female')}
                        className={`py-2 rounded-lg font-medium transition-all duration-200 ${
                          filters.gender === 'female'
                            ? 'bg-[#5e17eb] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Women
                      </button>
                      <button
                        onClick={() => updateFilter('gender', 'male')}
                        className={`py-2 rounded-lg font-medium transition-all duration-200 ${
                          filters.gender === 'male'
                            ? 'bg-[#5e17eb] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Men
                      </button>
                      <button
                        onClick={() => updateFilter('gender', '')}
                        className={`py-2 rounded-lg font-medium transition-all duration-200 ${
                          !filters.gender
                            ? 'bg-[#5e17eb] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        All
                      </button>
                    </div>
                  </div>

                  {/* Age Range */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
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
                            className="w-full px-3 text-gray-600 py-2 border border-gray-300 placeholder:text-gray-400 rounded-lg focus:border-[#5e17eb] focus:ring-2 focus:ring-[#5e17eb]/20 outline-none"
                            placeholder="Min"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="number"
                            min="18"
                            max="80"
                            value={filters.maxAge}
                            onChange={(e) => updateFilter('maxAge', parseInt(e.target.value) || 40)}
                            className="w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-lg focus:border-[#5e17eb] focus:ring-2 focus:ring-[#5e17eb]/20 outline-none"
                            placeholder="Max"
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
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Distance */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Distance: Up to {filters.maxDistance} km
                    </h4>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={filters.maxDistance}
                      onChange={(e) => updateFilter('maxDistance', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Location</h4>
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
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                            filters.location.includes(loc)
                              ? 'bg-[#5e17eb] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                            filters.location.includes(loc)
                              ? 'border-white'
                              : 'border-gray-300'
                          }`}>
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
                    <h4 className="font-medium text-gray-900 mb-3">Interests</h4>
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
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                            filters.interests.includes(interest)
                              ? 'bg-[#5e17eb] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
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
                      className={`w-full px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                        filters.verifiedOnly
                          ? 'bg-[#5e17eb] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                        filters.verifiedOnly
                          ? 'border-white'
                          : 'border-gray-300'
                      }`}>
                        {filters.verifiedOnly && (
                          <div className="w-3 h-3 bg-white rounded-sm"></div>
                        )}
                      </div>
                      <span>Verified Only</span>
                    </button>
                    <button
                      onClick={() => updateFilter('premiumOnly', !filters.premiumOnly)}
                      className={`w-full px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                        filters.premiumOnly
                          ? 'bg-[#5e17eb] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                        filters.premiumOnly
                          ? 'border-white'
                          : 'border-gray-300'
                      }`}>
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
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Get More with Credits</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-2 h-2 rounded-full bg-[#5e17eb]"></div>
                    <span className="text-gray-700">Chat with anyone you like</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-2 h-2 rounded-full bg-[#ff2e2e]"></div>
                    <span className="text-gray-700">Send Virtual Gifts</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-700">Get Premium Features</span>
                  </div>
                </div>
                <button 
                  onClick={() => router.push('/main/credits')}
                  className="w-full mt-6 py-3 bg-[#5e17eb] text-white rounded-lg font-medium hover:bg-[#4a13c4] transition-colors"
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
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    activeTab === 'all'
                      ? 'bg-white text-[#5e17eb] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All
                  <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-0.5">
                    {filteredProfiles.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('online')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    activeTab === 'online'
                      ? 'bg-white text-[#5e17eb] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Online
                  <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-0.5">
                    {profiles.filter(p => p.isOnline).length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('following')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    activeTab === 'following'
                      ? 'bg-white text-[#5e17eb] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Following
                  <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-0.5">
                    {profiles.filter(p => p.followingCount > 0).length}
                  </span>
                </button>
              </div>
            </div>

            {/* Results Info */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="responsive-text">
                <h2 className="text-xl font-bold text-gray-900">
                  {activeTab === 'all' && 'All Profiles'}
                  {activeTab === 'online' && 'Online Now'}
                  {activeTab === 'following' && 'Following'}
                  <span className="text-[#5e17eb] ml-2">({filteredProfiles.length})</span>
                </h2>
                {searchQuery && (
                  <p className="text-gray-600 text-sm mt-1">
                    Results for &ldquo;{searchQuery}&rdquo;
                  </p>
                )}
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing {Math.min(filteredProfiles.length, endIndex)} of {filteredProfiles.length}
                </div>
                <select 
                  onChange={(e) => {
                    // Sort functionality can be added here
                    console.log('Sort by:', e.target.value);
                  }}
                  className="bg-transparent border-none focus:ring-0 text-gray-900 font-medium"
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
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#5e17eb]/10 text-[#5e17eb] rounded-full text-sm filter-chip">
                    {filters.gender === 'female' ? 'Women' : 'Men'}
                    <button onClick={() => updateFilter('gender', '')} className="hover:text-[#4a13c4]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.minAge > 18 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#5e17eb]/10 text-[#5e17eb] rounded-full text-sm filter-chip">
                    Age from {filters.minAge}
                    <button onClick={() => updateFilter('minAge', 18)} className="hover:text-[#4a13c4]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.maxAge < 40 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#5e17eb]/10 text-[#5e17eb] rounded-full text-sm filter-chip">
                    Age to {filters.maxAge}
                    <button onClick={() => updateFilter('maxAge', 40)} className="hover:text-[#4a13c4]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.maxDistance < 50 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#5e17eb]/10 text-[#5e17eb] rounded-full text-sm filter-chip">
                    Within {filters.maxDistance}km
                    <button onClick={() => updateFilter('maxDistance', 50)} className="hover:text-[#4a13c4]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.location.map(loc => (
                  <span key={loc} className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#5e17eb]/10 text-[#5e17eb] rounded-full text-sm filter-chip">
                    {loc}
                    <button onClick={() => updateFilter('location', filters.location.filter(l => l !== loc))} className="hover:text-[#4a13c4]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.interests.map(interest => (
                  <span key={interest} className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#5e17eb]/10 text-[#5e17eb] rounded-full text-sm filter-chip">
                    {interest}
                    <button onClick={() => updateFilter('interests', filters.interests.filter(i => i !== interest))} className="hover:text-[#4a13c4]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.verifiedOnly && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#5e17eb]/10 text-[#5e17eb] rounded-full text-sm filter-chip">
                    Verified Only
                    <button onClick={() => updateFilter('verifiedOnly', false)} className="hover:text-[#4a13c4]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.premiumOnly && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#5e17eb]/10 text-[#5e17eb] rounded-full text-sm filter-chip">
                    Premium Only
                    <button onClick={() => updateFilter('premiumOnly', false)} className="hover:text-[#4a13c4]">
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
                        className="profile-card bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
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
                          <div className="action-buttons flex gap-2 mb-3">
                            <button
                              onClick={() => handleLike(profile.id)}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-300"
                            >
                              <Heart className="w-4 h-4" />
                              Like
                            </button>
                            <button
                              onClick={() => handleChat(profile.id)}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#5e17eb] text-white rounded-lg font-medium hover:bg-[#4a13c4] transition-colors duration-300"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Chat
                            </button>
                          </div>
                          
                          <div className="action-buttons flex gap-2">
                            <button
                              onClick={() => handleViewProfile(profile.id)}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors duration-300"
                            >
                              <Eye className="w-4 h-4" />
                              View Profile
                            </button>
                            <button
                              onClick={() => handleFollow(profile.id)}
                              className="px-3 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center"
                              title="Follow"
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
                        className="profile-item bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 group"
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
                                  <h3 className="profile-name font-bold text-lg text-gray-900">
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
                                <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{profile.location}</span>
                                  <span>•</span>
                                  <span>{profile.distance}</span>
                                  <span>•</span>
                                  <span className="font-bold text-[#5e17eb]">{profile.compatibility}% match</span>
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-gray-700 mb-3 line-clamp-2">
                              {profile.bio}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              {profile.interests?.slice(0, 4).map((interest: string, idx: number) => (
                                <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                  {interest}
                                </span>
                              ))}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="action-buttons flex flex-wrap gap-2">
                              <button
                                onClick={() => handleLike(profile.id)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-300"
                              >
                                <Heart className="w-4 h-4 inline mr-2" />
                                Like
                              </button>
                              <button
                                onClick={() => handleChat(profile.id)}
                                className="px-4 py-2 bg-[#5e17eb] text-white rounded-lg font-medium hover:bg-[#4a13c4] transition-colors duration-300"
                              >
                                <MessageCircle className="w-4 h-4 inline mr-2" />
                                Chat
                              </button>
                              <button
                                onClick={() => handleViewProfile(profile.id)}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors duration-300"
                              >
                                <Eye className="w-4 h-4 inline mr-2" />
                                View Profile
                              </button>
                              <button
                                onClick={() => handleFollow(profile.id)}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors duration-300"
                                title="Follow"
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
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No profiles found</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {searchQuery
                        ? `No profiles match "${searchQuery}". Try different search terms or adjust your filters.`
                        : 'Try adjusting your filters to find more people.'}
                    </p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 bg-[#5e17eb] text-white rounded-lg font-medium hover:bg-[#4a13c4] transition-colors duration-300"
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
                      className="px-8 py-3 bg-[#5e17eb] text-white rounded-lg font-medium hover:bg-[#4a13c4] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <div className="pagination-container flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="prev-button flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                              currentPage === pageNum
                                ? 'bg-[#5e17eb] text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span className="text-gray-400">...</span>
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            className={`w-10 h-10 rounded-lg font-medium ${
                              currentPage === totalPages
                                ? 'bg-[#5e17eb] text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="next-button flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
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