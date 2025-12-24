'use client';

import { Home, MessageCircle, Search, Users, CreditCard, GiftIcon, User, Settings, LogOut } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import useAuth from '@/lib/hooks/useAuth';
import useConversationStats from '@/lib/hooks/useConversationStats';

interface DesktopNavProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export default function DesktopNav({ activeTab, setActiveTab }: DesktopNavProps) {
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

  const handleNavigation = (id: string) => {
    setActiveTab(id);
    
    switch (id) {
      case 'home':
        router.push('/main');
        break;
      case 'chats':
        router.push('/main/chats/');
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

  const handleRightSideAction = (action: string) => {
    switch (action) {
      case 'notifications':
        router.push('/main/notifications');
        break;
      case 'explore':
        router.push('/main/explore');
        break;
      case 'create':
        router.push('/main/create');
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
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-24">
            <div className="animate-pulse bg-gray-200 h-12 w-48 rounded"></div>
            <div className="flex gap-10">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="animate-pulse bg-gray-200 h-12 w-12 rounded-full"></div>
              ))}
            </div>
            <div className="animate-pulse bg-gray-200 h-12 w-32 rounded-full"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => {
                setActiveTab('home');
                router.push('/main');
              }}
              className="flex items-center"
            >
              <div className="relative" style={{ width: '240px', height: '70px' }}>
                <Image
                  src="/assets/logo2.png"
                  alt="TabooTalks Logo"
                  width={240}
                  height={70}
                  className="object-contain"
                  priority
                />
              </div>
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-10">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              const showBadge = item.badge && item.badge > 0;
              
              return (
                <div key={item.id} className="flex flex-col items-center">
                  <button
                    onClick={() => handleNavigation(item.id)}
                    className={`flex flex-col items-center gap-1 transition-all ${
                      isActive ? 'text-[#5e17eb]' : 'text-gray-500 hover:text-[#5e17eb]'
                    }`}
                  >
                    <div className={`relative p-4 rounded-full transition-all ${
                      isActive 
                        ? 'bg-[#5e17eb]/10 border border-[#5e17eb]/20' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                      <item.icon size={24} className={isActive ? 'text-[#5e17eb]' : ''} />
                      
                      {/* Dynamic Badge - ALWAYS show for chats, even when 0 */}
                      {item.id === 'chats' && !statsLoading && (
                        <span className={`absolute -top-1 -right-1 h-6 w-6 rounded-full text-xs font-bold flex items-center justify-center text-white ${
                          item.badge && item.badge > 0 ? 'bg-[#ff2e2e] animate-pulse' : 'bg-gray-400'
                        }`}>
                          {item.badge || 0}
                        </span>
                      )}
                      
                      {/* Show badge for other items only if > 0 */}
                      {item.id !== 'chats' && showBadge && (
                        <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-[#ff2e2e] text-xs font-bold flex items-center justify-center text-white animate-pulse">
                          {item.badge}
                        </span>
                      )}
                      
                      {/* Loading indicator for stats */}
                      {item.id === 'chats' && statsLoading && (
                        <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center">
                          <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <span className={`text-sm font-medium mt-2 ${
                      isActive ? 'text-[#5e17eb] font-semibold' : 'text-gray-600'
                    }`}>
                      {item.label}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-6">
            {/* Gift Icon */}
            <button 
              onClick={handleGift}
              className="relative p-3 text-gray-600 hover:text-[#5e17eb] transition hover:bg-gray-100 rounded-full"
            >
              <GiftIcon size={34} />
              <span className="absolute top-3 right-3 h-3 w-3 rounded-full bg-[#ff2e2e]"></span>
            </button>

            {/* Credits Display */}
            <button 
              onClick={() => handleNavigation('credits')}
              className={`rounded-full px-4 py-2 transition ${
                activeTab === 'credits' 
                  ? 'bg-[#5e17eb]/10 border border-[#5e17eb]/20' 
                  : 'bg-[#5e17eb] hover:bg-[#4a13c2]'
              }`}
            >
              <span className={`font-bold text-sm ${
                activeTab === 'credits' ? 'text-[#5e17eb]' : 'text-white'
              }`}>
                {profile?.credits || 0}
              </span>
            </button>
            
            {/* Profile Section */}
            <div className="flex items-center gap-4 pl-6 border-l border-gray-200 relative" ref={dropdownRef}>
              <div className="text-right">
                <p className="font-bold text-gray-900 text-lg">{profile?.username || 'User'}</p>
                <p className="text-sm text-gray-500">Premium Member</p>
              </div>
              
              {/* Profile Image */}
              <div className="relative">
                <button 
                  onClick={() => handleRightSideAction('profile')}
                  className="relative w-14 h-14 rounded-full overflow-hidden border-3 border-[#5e17eb] hover:border-[#4a13c2] transition"
                >
                  {profile?.profilePic ? (
                    <Image
                      src={profile.profilePic}
                      alt="Profile"
                      width={56}
                      height={56}
                      className="object-cover"
                      unoptimized={profile.profilePic.startsWith('http')}
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#5e17eb] to-[#ff2e2e] flex items-center justify-center text-white font-bold text-xl">
                      {profile?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="py-2">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">{profile?.username || 'User'}</p>
                        <p className="text-sm text-gray-500">{profile?.email || ''}</p>
                      </div>
                      
                      {/* Conversation Stats in Dropdown */}
                      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600">Active Chats</span>
                          <span className="text-sm font-bold text-[#5e17eb]">{stats.activeChats}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Total Messages</span>
                          <span className="text-sm font-bold text-gray-900">{stats.totalMessages}</span>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <button 
                        onClick={() => handleProfileDropdown('my-account')}
                        className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition"
                      >
                        <User size={18} className="mr-3 text-gray-500" />
                        <span>My Account</span>
                      </button>
                      
                      <button 
                        onClick={() => handleProfileDropdown('settings')}
                        className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition"
                      >
                        <Settings size={18} className="mr-3 text-gray-500" />
                        <span>Settings</span>
                      </button>
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <button 
                        onClick={() => handleProfileDropdown('logout')}
                        className="flex items-center w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut size={18} className="mr-3" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}