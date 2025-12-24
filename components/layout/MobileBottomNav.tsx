'use client';

import { Home, MessageCircle, Search, Users, CreditCard, Compass, Bell, User, Settings, LogOut, GiftIcon } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import useAuth from '@/lib/hooks/useAuth';
import useConversationStats from '@/lib/hooks/useConversationStats';

interface MobileBottomNavProps {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export default function MobileBottomNav({ activeTab, setActiveTab }: MobileBottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Fetch current user data and conversation stats
  const { profile, loading: authLoading, logout } = useAuth();
  const { stats, loading: statsLoading, refreshStats } = useConversationStats();

  // Sync activeTab with current pathname
  useEffect(() => {
    if (pathname.includes('/chats')) {
      setActiveTab('chats');
    } else if (pathname.includes('/discover')) {
      setActiveTab('discover');
    } else if (pathname.includes('/people')) {
      setActiveTab('people');
    } else if (pathname.includes('/credits')) {
      setActiveTab('credits');
    } else if (pathname === '/main') {
      setActiveTab('home');
    }
  }, [pathname, setActiveTab]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Refresh stats when navigating to chats
  useEffect(() => {
    if (pathname.includes('/chats')) {
      refreshStats();
    }
  }, [pathname, refreshStats]);

  const handleGift = () => {
    router.push(`/main/virtual-gifts`);
  };

  const handleDiscover = () => {
    router.push("/main/discover");
  };

  const handleNavigation = (id: string) => {
    setActiveTab(id);
    
    // Define navigation paths based on tab id
    switch (id) {
      case 'home':
        router.push('/main');
        break;
      case 'chats':
        router.push('/main/chats');
        // Refresh stats when navigating to chats
        refreshStats();
        break;
      case 'discover':
        router.push('/main/discover');
        break;
      case 'people':
        router.push('/main/people');
        break;
      case 'credits':
        router.push('/main/credits');
        break;
      default:
        router.push('/main');
    }
  };

  const handleTopBarAction = (action: string) => {
    switch (action) {
      case 'logo':
        setActiveTab('home');
        router.push('/main');
        break;
      case 'explore':
        router.push('/main/explore');
        break;
      case 'notifications':
        router.push('/main/notifications');
        break;
      case 'credits':
        setActiveTab('credits');
        router.push('/main/credits');
        break;
      case 'profile':
        setIsDropdownOpen(!isDropdownOpen);
        break;
      default:
        break;
    }
  };

  const handleProfileDropdown = async (option: string) => {
    setIsDropdownOpen(false);
    
    switch (option) {
      case 'my-account':
        router.push('/main/userprofile');
        break;
      case 'settings':
        router.push('/main/settings');
        break;
      case 'logout':
        await logout();
        break;
      default:
        break;
    }
  };

  // Correct order: Home, Chats, Discover, People, Credits
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { 
      id: 'chats', 
      label: 'Chats', 
      icon: MessageCircle, 
      badge: stats.activeChats // Dynamic badge from conversation stats
    },
    { id: 'discover', label: 'Discover', icon: Search },
    { id: 'people', label: 'People', icon: Users },
    { id: 'credits', label: 'Credits', icon: CreditCard },
  ];

  // Show loading skeleton while fetching user
  if (authLoading) {
    return (
      <>
        {/* Top Bar Loading Skeleton */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 shadow-sm h-16">
          <div className="flex items-center justify-between h-full">
            <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
            <div className="flex items-center gap-3">
              <div className="animate-pulse bg-gray-200 h-10 w-10 rounded-full"></div>
              <div className="animate-pulse bg-gray-200 h-10 w-10 rounded-full"></div>
              <div className="animate-pulse bg-gray-200 h-10 w-10 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Bottom Nav Loading Skeleton */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg h-16">
          <div className="flex justify-around items-center h-full px-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="animate-pulse bg-gray-200 h-10 w-10 rounded-full"></div>
            ))}
          </div>
        </nav>
      </>
    );
  }

  return (
    <>
      {/* Top Bar for Mobile - FIXED position */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 shadow-sm h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <button 
            onClick={() => handleTopBarAction('logo')}
            className="flex items-center gap-2 active:opacity-70 transition"
          >
            <div className="relative w-32 h-8">
              <Image
                src="/assets/logo2.png"
                alt="TabooTalks Logo"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 128px, 192px"
              />
            </div>
          </button>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Explore Button */}
            <button 
              onClick={handleDiscover}
              className="p-2 text-gray-600 hover:text-[#5e17eb] transition-colors rounded-full hover:bg-gray-100"
              aria-label="Explore"
            >
              <Compass size={30} />
            </button>
            
            {/* Notifications/Gift Button */}
            <button 
              onClick={handleGift}
              className="relative p-2 text-gray-600 hover:text-[#5e17eb] transition-colors rounded-full hover:bg-gray-100"
              aria-label="Notifications"
            >
              <GiftIcon size={30} />
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-[#ff2e2e] border-2 border-white"></span>
            </button>
            
            {/* Profile Image with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => handleTopBarAction('profile')}
                className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#5e17eb] hover:border-[#4a13c2] transition"
              >
                {profile?.profilePic ? (
                  <Image
                    src={profile.profilePic}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover"
                    unoptimized={profile.profilePic.startsWith('http')}
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-[#5e17eb] to-[#ff2e2e] flex items-center justify-center text-white font-bold text-sm">
                    {profile?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="py-2">
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900 text-sm">{profile?.username || 'User'}</p>
                      <p className="text-xs text-gray-500">{profile?.email || 'Premium Member'}</p>
                    </div>
                    
                    {/* Conversation Stats in Dropdown */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600">Active Chats</span>
                        {statsLoading ? (
                          <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                        ) : (
                          <span className="text-sm font-bold text-[#5e17eb]">{stats.activeChats}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Total Messages</span>
                        {statsLoading ? (
                          <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                        ) : (
                          <span className="text-sm font-bold text-gray-900">{stats.totalMessages}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <button 
                      onClick={() => handleProfileDropdown('my-account')}
                      className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition text-sm"
                    >
                      <User size={16} className="mr-3 text-gray-500" />
                      <span>My Account</span>
                    </button>
                    
                    <button 
                      onClick={() => handleProfileDropdown('settings')}
                      className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition text-sm"
                    >
                      <Settings size={16} className="mr-3 text-gray-500" />
                      <span>Settings</span>
                    </button>
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <button 
                      onClick={() => handleProfileDropdown('logout')}
                      className="flex items-center w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition text-sm"
                    >
                      <LogOut size={16} className="mr-3" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - FIXED at bottom */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg h-16">
        <div className="flex justify-around items-center h-full px-2">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            const showBadge = item.badge && item.badge > 0;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex flex-col items-center justify-center relative p-2 transition-all duration-200 ${
                  isActive ? 'text-[#5e17eb]' : 'text-gray-600'
                }`}
              >
                {/* Circular Container - SAME SIZE for all tabs */}
                <div className={`relative rounded-full p-2 transition-all ${
                  isActive 
                    ? 'bg-[#5e17eb]/10 border border-[#5e17eb]/20' 
                    : ''
                }`}>
                  <item.icon size={22} className={isActive ? 'text-[#5e17eb]' : ''} />
                  
                  {/* Dynamic Badge - ALWAYS show for chats, even when 0 */}
                  {item.id === 'chats' && !statsLoading && (
                    <span className={`absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs font-bold flex items-center justify-center text-white ${
                      item.badge && item.badge > 0 ? 'bg-[#ff2e2e] animate-pulse' : 'bg-gray-400'
                    }`}>
                      {item.badge || 0}
                    </span>
                  )}
                  
                  {/* Show badge for other items only if > 0 */}
                  {item.id !== 'chats' && showBadge && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#ff2e2e] text-xs font-bold flex items-center justify-center text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  
                  {/* Loading indicator for stats */}
                  {item.id === 'chats' && statsLoading && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gray-300 flex items-center justify-center">
                      <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                
                {/* Label - Fixed positioning */}
                <span className={`text-xs mt-1 font-medium ${
                  isActive ? 'text-[#5e17eb] font-semibold' : ''
                }`}>
                  {item.label}
                </span>
                
                {/* Active indicator line - ABOVE the tab, not affecting layout */}
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 h-1 w-8 bg-[#5e17eb]/70 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* REDUCED safe area spacer - Only bottom padding for bottom nav */}
      <div className="pb-16"></div>
    </>
  );
}