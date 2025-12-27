'use client';

import { Home, MessageCircle, Search, Users, CreditCard, GiftIcon, User, Settings, LogOut, Sun, Moon } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import useAuth from '@/lib/hooks/useAuth';
import useConversationStats from '@/lib/hooks/useConversationStats';
import { useTheme } from '@/lib/context/ThemeContext';

interface DesktopNavProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export default function DesktopNav({ activeTab, setActiveTab }: DesktopNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isDark, colors, toggleTheme, theme } = useTheme();
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
      badge: stats.activeChats
    },
    { id: 'discover', label: 'Discover', icon: Search },
    { id: 'people', label: 'People', icon: Users },
    { id: 'credits', label: 'Credits', icon: CreditCard },
  ];

  // Show loading skeleton while fetching user
  if (authLoading) {
    return (
      <nav className="sticky top-0 z-40 border-b transition-colors"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border
        }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-24">
            <div className="animate-pulse h-12 w-48 rounded"
              style={{ backgroundColor: colors.inputBackground }}></div>
            <div className="flex gap-10">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="animate-pulse h-12 w-12 rounded-full"
                  style={{ backgroundColor: colors.inputBackground }}></div>
              ))}
            </div>
            <div className="animate-pulse h-12 w-32 rounded-full"
              style={{ backgroundColor: colors.inputBackground }}></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-40 border-b transition-colors"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border
      }}>
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
                  src={isDark ? "/assets/logo.png" : "/assets/logo2.png"}
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
                    className="flex flex-col items-center gap-1 transition-all"
                    style={{
                      color: isActive ? colors.secondary : colors.secondaryText
                    }}
                  >
                    <div className="relative p-4 rounded-full transition-all"
                      style={{
                        backgroundColor: isActive 
                          ? `${colors.secondary}10` 
                          : colors.cardBackground,
                        border: isActive 
                          ? `1px solid ${colors.secondary}33` 
                          : 'none'
                      }}>
                      <item.icon size={24} style={{ 
                        color: isActive ? colors.secondary : colors.iconColor 
                      }} />
                      
                      {item.id === 'chats' && !statsLoading && item.badge && item.badge > 0 && (
                        <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-[#ff2e2e] text-xs font-bold flex items-center justify-center text-white">
                          {item.badge}
                        </span>
                      )}
                      
                      {item.id !== 'chats' && showBadge && (
                        <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-[#ff2e2e] text-xs font-bold flex items-center justify-center text-white">
                          {item.badge}
                        </span>
                      )}
                      
                      {item.id === 'chats' && statsLoading && (
                        <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center">
                          <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium mt-2"
                      style={{
                        color: isActive ? colors.secondary : colors.secondaryText,
                        fontWeight: isActive ? '600' : '500'
                      }}>
                      {item.label}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-6">
            {/* Theme Toggle Switcher */}
            <button
              onClick={toggleTheme}
              className="relative w-14 h-8 rounded-full p-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: isDark ? colors.secondary : colors.border,
                border: `2px solid ${isDark ? colors.secondary : colors.border}`,
                boxShadow: `0 0 10px ${isDark ? `${colors.secondary}40` : 'rgba(0,0,0,0.1)'}`
              }}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              <div className="relative w-full h-full">
                {/* Sun Icon (Light Mode) */}
                <div className={`absolute left-1 top-1/2 -translate-y-1/2 transition-all duration-300 ${isDark ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}>
                  <Sun size={16} className="text-yellow-500" />
                </div>
                
                {/* Moon Icon (Dark Mode) */}
                <div className={`absolute right-1 top-1/2 -translate-y-1/2 transition-all duration-300 ${isDark ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                  <Moon size={16} className="text-blue-200" />
                </div>
                
                {/* Toggle Circle */}
                <div
                  className={`absolute top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-white shadow-lg transition-all duration-300 flex items-center justify-center ${
                    isDark ? 'translate-x-6' : 'translate-x-0'
                  }`}
                >
                  {isDark ? (
                    <Moon size={12} className="text-gray-800" />
                  ) : (
                    <Sun size={12} className="text-yellow-500" />
                  )}
                </div>
              </div>
            </button>

            {/* Gift Icon */}
            <button 
              onClick={handleGift}
              className="relative p-3 transition rounded-full"
              style={{
                color: colors.secondaryText
              }}
            >
              <GiftIcon size={34} />
              <span className="absolute top-3 right-3 h-3 w-3 rounded-full bg-[#ff2e2e] border-2 border-white"></span>
            </button>

            {/* Credits Display */}
            <button 
              onClick={() => handleNavigation('credits')}
              className="rounded-full px-4 py-2 transition"
              style={{
                backgroundColor: activeTab === 'credits' 
                  ? `${colors.secondary}10` 
                  : colors.secondary,
                border: activeTab === 'credits' 
                  ? `1px solid ${colors.secondary}33` 
                  : 'none'
              }}
            >
              <span className="font-bold text-sm"
                style={{
                  color: activeTab === 'credits' ? colors.secondary : 'white'
                }}>
                {profile?.credits || 0}
              </span>
            </button>
            
            {/* Profile Section */}
            <div className="flex items-center gap-4 pl-6 border-l relative"
              style={{ borderColor: colors.border }}
              ref={dropdownRef}>
              <div className="text-right">
                <p className="font-bold text-lg"
                  style={{ color: colors.primaryText }}>
                  {profile?.username || 'User'}
                </p>
                <p className="text-sm"
                  style={{ color: colors.secondaryText }}>
                  Premium Member
                </p>
              </div>
              
              {/* Profile Image */}
              <div className="relative">
                <button 
                  onClick={() => handleRightSideAction('profile')}
                  className="relative w-14 h-14 rounded-full overflow-hidden border-3 transition hover:opacity-90"
                  style={{ 
                    borderColor: colors.secondary
                  }}
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
                    <div className="h-full w-full flex items-center justify-center text-white font-bold text-xl"
                      style={{ 
                        background: `linear-gradient(135deg, ${colors.secondary} 0%, #ff2e2e 100%)`
                      }}>
                      {profile?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-xl border z-50"
                    style={{
                      backgroundColor: colors.panelBackground,
                      borderColor: colors.border
                    }}>
                    <div className="py-2">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b"
                        style={{ borderColor: colors.border }}>
                        <p className="font-semibold"
                          style={{ color: colors.primaryText }}>
                          {profile?.username || 'User'}
                        </p>
                        <p className="text-sm"
                          style={{ color: colors.secondaryText }}>
                          {profile?.email || ''}
                        </p>
                      </div>
                      
                      {/* Stats */}
                      <div className="px-4 py-3 border-b"
                        style={{
                          borderColor: colors.border,
                          background: `linear-gradient(90deg, ${colors.secondary}10 0%, #ff2e2e10 100%)`
                        }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs"
                            style={{ color: colors.secondaryText }}>
                            Active Chats
                          </span>
                          <span className="text-sm font-bold"
                            style={{ color: colors.secondary }}>
                            {stats.activeChats}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs"
                            style={{ color: colors.secondaryText }}>
                            Total Messages
                          </span>
                          <span className="text-sm font-bold"
                            style={{ color: colors.primaryText }}>
                            {stats.totalMessages}
                          </span>
                        </div>
                      </div>
                      
                      {/* Theme Toggle in Dropdown */}
                      <button 
                        onClick={toggleTheme}
                        className="flex items-center w-full px-4 py-3 text-left transition hover:bg-opacity-50"
                        style={{
                          color: colors.primaryText,
                          backgroundColor: colors.hoverBackground
                        }}
                      >
                        <div className="mr-3">
                          {isDark ? (
                            <Sun size={18} className="text-yellow-500" />
                          ) : (
                            <Moon size={18} className="text-indigo-600" />
                          )}
                        </div>
                        <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                      </button>
                      
                      <button 
                        onClick={() => handleProfileDropdown('my-account')}
                        className="flex items-center w-full px-4 py-3 text-left transition hover:bg-opacity-50"
                        style={{
                          color: colors.primaryText,
                          backgroundColor: colors.hoverBackground
                        }}
                      >
                        <User size={18} className="mr-3"
                          style={{ color: colors.secondaryText }} />
                        <span>My Account</span>
                      </button>
                      
                      <button 
                        onClick={() => handleProfileDropdown('settings')}
                        className="flex items-center w-full px-4 py-3 text-left transition hover:bg-opacity-50"
                        style={{
                          color: colors.primaryText,
                          backgroundColor: colors.hoverBackground
                        }}
                      >
                        <Settings size={18} className="mr-3"
                          style={{ color: colors.secondaryText }} />
                        <span>Settings</span>
                      </button>
                      
                      <div className="border-t my-1"
                        style={{ borderColor: colors.borderLight }}></div>
                      
                      <button 
                        onClick={() => handleProfileDropdown('logout')}
                        className="flex items-center w-full px-4 py-3 text-left transition hover:bg-opacity-50"
                        style={{
                          color: '#ff2e2e',
                          backgroundColor: `${colors.hoverBackground}`
                        }}
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