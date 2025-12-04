
    /* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
// app/main/discover/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Users, Star, Flame, ChevronRight, MapPin, Heart, MessageCircle, Eye, UserPlus, CheckCircle, X, Sliders, Grid, List, Menu, X as XIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import LayoutController from '@/components/layout/LayoutController';
import './discover.scss';

const mockProfiles = [
  {
    id: 1,
    username: 'Anastasiya',
    age: 29,
    location: 'Berlin, Germany',
    distance: '3 km',
    isOnline: true,
    isVerified: true,
    isPremium: true,
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop',
    bio: 'Adventure seeker and coffee lover',
    interests: ['Travel', 'Music', 'Photography'],
    compatibility: 92
  },
  {
    id: 2,
    username: 'Emily',
    age: 24,
    location: 'Munich, Germany',
    distance: '12 km',
    isOnline: true,
    isVerified: true,
    isPremium: true,
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop',
    bio: 'Yoga instructor and wellness enthusiast',
    interests: ['Yoga', 'Meditation', 'Nature'],
    compatibility: 87
  },
  {
    id: 3,
    username: 'Dewi',
    age: 27,
    location: 'Hamburg, Germany',
    distance: '8 km',
    isOnline: false,
    isVerified: false,
    isPremium: false,
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop',
    bio: 'Beach lover and surf enthusiast',
    interests: ['Surfing', 'Beach', 'Travel'],
    compatibility: 78
  },
  {
    id: 4,
    username: 'Adriana',
    age: 31,
    location: 'Frankfurt, Germany',
    distance: '5 km',
    isOnline: true,
    isVerified: true,
    isPremium: true,
    imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop',
    bio: 'Professional chef and food blogger',
    interests: ['Cooking', 'Wine', 'Travel'],
    compatibility: 95
  },
  {
    id: 5,
    username: 'Iryna',
    age: 26,
    location: 'Cologne, Germany',
    distance: '15 km',
    isOnline: true,
    isVerified: true,
    isPremium: true,
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop',
    bio: 'Fashion designer and model',
    interests: ['Fashion', 'Design', 'Art'],
    compatibility: 84
  },
  {
    id: 6,
    username: 'Sophia',
    age: 28,
    location: 'Berlin, Germany',
    distance: '4 km',
    isOnline: false,
    isVerified: true,
    isPremium: false,
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop',
    bio: 'Software engineer and tech enthusiast',
    interests: ['Technology', 'Hiking', 'Games'],
    compatibility: 91
  },
  {
    id: 7,
    username: 'Laura',
    age: 30,
    location: 'Munich, Germany',
    distance: '10 km',
    isOnline: true,
    isVerified: true,
    isPremium: true,
    imageUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=500&fit=crop',
    bio: 'Musician and composer',
    interests: ['Music', 'Piano', 'Concerts'],
    compatibility: 89
  },
  {
    id: 8,
    username: 'Mia',
    age: 25,
    location: 'Hamburg, Germany',
    distance: '7 km',
    isOnline: false,
    isVerified: false,
    isPremium: false,
    imageUrl: 'https://images.unsplash.com/photo-1605515223642-fd67abd879ab?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'Photographer capturing beautiful moments',
    interests: ['Photography', 'Art', 'Travel'],
    compatibility: 76
  },
  {
    id: 9,
    username: 'Chloe',
    age: 27,
    location: 'Frankfurt, Germany',
    distance: '6 km',
    isOnline: true,
    isVerified: true,
    isPremium: true,
    imageUrl: 'https://images.unsplash.com/photo-1599842057482-a4aaf242f54e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'Marketing specialist and travel blogger',
    interests: ['Travel', 'Food', 'Photography'],
    compatibility: 88
  },
  {
    id: 10,
    username: 'Grace',
    age: 32,
    location: 'Cologne, Germany',
    distance: '18 km',
    isOnline: false,
    isVerified: false,
    isPremium: false,
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop',
    bio: 'Architect and interior designer',
    interests: ['Design', 'Art', 'Architecture'],
    compatibility: 82
  },
  {
    id: 11,
    username: 'Natalie',
    age: 29,
    location: 'Berlin, Germany',
    distance: '2 km',
    isOnline: true,
    isVerified: true,
    isPremium: true,
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop',
    bio: 'Fitness trainer and nutritionist',
    interests: ['Fitness', 'Health', 'Sports'],
    compatibility: 93
  },
  {
    id: 12,
    username: 'Isabella',
    age: 26,
    location: 'Munich, Germany',
    distance: '14 km',
    isOnline: true,
    isVerified: false,
    isPremium: false,
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop',
    bio: 'Student and part-time model',
    interests: ['Fashion', 'Photography', 'Dancing'],
    compatibility: 79
  },
  {
    id: 13,
    username: 'Emma',
    age: 33,
    location: 'Hamburg, Germany',
    distance: '9 km',
    isOnline: true,
    isVerified: true,
    isPremium: true,
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop',
    bio: 'Business consultant and entrepreneur',
    interests: ['Business', 'Travel', 'Wine'],
    compatibility: 90
  },
  {
    id: 14,
    username: 'Olivia',
    age: 28,
    location: 'Frankfurt, Germany',
    distance: '5 km',
    isOnline: false,
    isVerified: true,
    isPremium: false,
    imageUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=500&fit=crop',
    bio: 'Graphic designer and illustrator',
    interests: ['Art', 'Design', 'Technology'],
    compatibility: 85
  },
  {
    id: 15,
    username: 'Charlotte',
    age: 31,
    location: 'Cologne, Germany',
    distance: '16 km',
    isOnline: true,
    isVerified: false,
    isPremium: false,
    imageUrl: 'https://images.unsplash.com/photo-1713145869354-0bbea969cc8c?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'Teacher and book lover',
    interests: ['Reading', 'Education', 'Travel'],
    compatibility: 81
  },
];

// Available locations for filtering
const locations = ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Düsseldorf', 'Leipzig'];
const interests = ['Travel', 'Music', 'Photography', 'Sports', 'Art', 'Food', 'Fashion', 'Technology', 'Fitness', 'Books'];

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState(mockProfiles);
  const [filteredProfiles, setFilteredProfiles] = useState(mockProfiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'following'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobile, setIsMobile] = useState(false);
  
  const profilesPerPage = viewMode === 'grid' ? (isMobile ? 6 : 12) : (isMobile ? 4 : 6);

  // Filter states
  const [filters, setFilters] = useState({
    gender: 'women',
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

  // Fixed: Proper active filter count calculation
  const activeFilterCount = (() => {
    let count = 0;
    
    if (Array.isArray(filters.location)) count += filters.location.length;
    if (Array.isArray(filters.interests)) count += filters.interests.length;
    
    if (filters.verifiedOnly) count += 1;
    if (filters.premiumOnly) count += 1;
    
    if (filters.minAge > 18) count += 1;
    if (filters.maxAge < 40) count += 1;
    if (filters.maxDistance < 50) count += 1;
    
    return count;
  })();

  // Filter profiles based on active tab and filters
  useEffect(() => {
    setIsLoading(true);
    
    let result = [...profiles];
    
    // Apply tab filter
    if (activeTab === 'following') {
      result = result.slice(0, 6); // Mock following
    } else if (activeTab === 'online') {
      result = result.filter(profile => profile.isOnline);
    }
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(profile =>
        profile.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.bio.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply advanced filters
    result = result.filter(profile => {
      if (profile.age < filters.minAge || profile.age > filters.maxAge) return false;
      
      if (filters.location.length > 0) {
        const hasLocation = filters.location.some(loc => 
          profile.location.toLowerCase().includes(loc.toLowerCase())
        );
        if (!hasLocation) return false;
      }
      
      const distance = parseInt(profile.distance.replace(' km', ''));
      if (distance > filters.maxDistance) return false;
      
      if (filters.interests.length > 0) {
        const hasInterest = filters.interests.some(interest =>
          profile.interests.some(profileInterest => 
            profileInterest.toLowerCase().includes(interest.toLowerCase())
          )
        );
        if (!hasInterest) return false;
      }
      
      if (filters.verifiedOnly && !profile.isVerified) return false;
      if (filters.premiumOnly && !profile.isPremium) return false;
      
      return true;
    });
    
    setTimeout(() => {
      setFilteredProfiles(result);
      setIsLoading(false);
      setCurrentPage(1);
    }, 300);
  }, [activeTab, searchQuery, filters, profiles]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);
  const startIndex = (currentPage - 1) * profilesPerPage;
  const endIndex = startIndex + profilesPerPage;
  const currentProfiles = filteredProfiles.slice(startIndex, endIndex);

  const handleFollow = (profileId: number) => {
    console.log('Follow profile:', profileId);
  };

  const handleLike = (profileId: number) => {
    console.log('Like profile:', profileId);
  };

  const handleChat = (profileId: number) => {
    console.log('Start chat with profile:', profileId);
  };

  const updateFilter = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      gender: 'women',
      minAge: 18,
      maxAge: 40,
      location: [],
      maxDistance: 50,
      interests: [],
      verifiedOnly: false,
      premiumOnly: false
    });
    setSearchQuery('');
  };

  const closeMobileSidebar = () => {
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-white no-overflow discover-container">
      <LayoutController />

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
                      {profiles.length}
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
                    <span className="text-sm opacity-80 bg-white/20 px-2 py-1 rounded">6</span>
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateFilter('gender', 'women')}
                        className={`flex-1 py-2 rounded-lg font-medium transition-all duration-200 ${
                          filters.gender === 'women'
                            ? 'bg-[#5e17eb] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Women
                      </button>
                      <button
                        onClick={() => updateFilter('gender', 'men')}
                        className={`flex-1 py-2 rounded-lg font-medium transition-all duration-200 ${
                          filters.gender === 'men'
                            ? 'bg-[#5e17eb] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Men
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
                          <label className="text-sm text-gray-600 mb-1 block">From</label>
                          <input
                            type="number"
                            min="18"
                            max="80"
                            value={filters.minAge}
                            onChange={(e) => updateFilter('minAge', parseInt(e.target.value) || 18)}
                            className="w-full px-3 text-gray-600 py-2 border border-gray-300 placeholder:text-gray-400 rounded-lg focus:border-[#5e17eb] focus:ring-2 focus:ring-[#5e17eb]/20 outline-none"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-sm text-gray-600 mb-1 block">To</label>
                          <input
                            type="number"
                            min="18"
                            max="80"
                            value={filters.maxAge}
                            onChange={(e) => updateFilter('maxAge', parseInt(e.target.value) || 40)}
                            className="w-full px-3 py-2 border text-gray-600  border-gray-300 rounded-lg focus:border-[#5e17eb] focus:ring-2 focus:ring-[#5e17eb]/20 outline-none"
                          />
                        </div>
                      </div>
                      <input
                        type="range"
                        min="18"
                        max="80"
                        value={filters.maxAge}
                        onChange={(e) => updateFilter('maxAge', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#5e17eb]"
                      />
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
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#5e17eb]"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Location</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {locations.map((loc) => (
                        <label key={loc} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.location.includes(loc)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                updateFilter('location', [...filters.location, loc]);
                              } else {
                                updateFilter('location', filters.location.filter(l => l !== loc));
                              }
                            }}
                            className="rounded border-gray-300 text-[#5e17eb] focus:ring-[#5e17eb]"
                          />
                          <span className="text-gray-700">{loc}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest) => (
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
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.verifiedOnly}
                        onChange={(e) => updateFilter('verifiedOnly', e.target.checked)}
                        className="rounded border-gray-300 text-[#5e17eb] focus:ring-[#5e17eb]"
                      />
                      <span className="text-gray-700">Verified Only</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.premiumOnly}
                        onChange={(e) => updateFilter('premiumOnly', e.target.checked)}
                        className="rounded border-gray-300 text-[#5e17eb] focus:ring-[#5e17eb]"
                      />
                      <span className="text-gray-700">Premium Only</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Spark New Chats */}
              <div className="bg-gradient-to-br from-[#5e17eb] to-[#ff2e2e] rounded-xl p-6 text-white">
                <h3 className="font-bold text-lg mb-4">Spark New Chats with Icebreakers</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer">
                    <span className="font-medium">Get Started</span>
                    <Flame className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Get More with Credits */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Get More with Credits</h3>
                <div className="space-y-3">
                  {['Chat with anyone you like', 'Send Virtual Gifts', 'Get Credits'].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        index === 0 ? 'bg-[#5e17eb]' :
                        index === 1 ? 'bg-[#ff2e2e]' :
                        'bg-yellow-500'
                      }`}></div>
                      <span className="text-gray-700 group-hover:text-gray-900">{item}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-3 bg-[#5e17eb] text-white rounded-lg font-medium hover:bg-[#4a13c4] transition-colors">
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
                    {profiles.length}
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
                    6
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
                  Page {currentPage} of {totalPages}
                </div>
                <select className="bg-transparent border-none focus:ring-0 text-gray-900 font-medium">
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
              <div className="profiles-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="profile-card bg-gray-100 rounded-xl animate-pulse">
                    <div className="aspect-[4/5] bg-gray-200 rounded-t-xl"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-10 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Profiles Grid/List */}
                {viewMode === 'grid' ? (
                  <div className="profiles-grid">
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
                              {profile.interests.slice(0, 2).map((interest, idx) => (
                                <span key={idx} className="px-2 py-1 bg-white/20 text-white text-xs rounded-full backdrop-blur-sm">
                                  {interest}
                                </span>
                              ))}
                              {profile.interests.length > 2 && (
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
                            <Link
                              href={`/main/profile/${profile.id}`}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors duration-300"
                            >
                              <Eye className="w-4 h-4" />
                              View Profile
                            </Link>
                            <button
                              onClick={() => handleFollow(profile.id)}
                              className="px-3 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors duration-300"
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
                              {profile.interests.map((interest, idx) => (
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
                              <Link
                                href={`/main/profile/${profile.id}`}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors duration-300"
                              >
                                <Eye className="w-4 h-4 inline mr-2" />
                                View Profile
                              </Link>
                              <button
                                onClick={() => handleFollow(profile.id)}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors duration-300"
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
                {filteredProfiles.length === 0 && (
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