'use client';

import { Home, MessageCircle, Search, Users, CreditCard, Compass, Bell, User, Settings, LogOut, GiftIcon } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import useAuth from '@/lib/hooks/useAuth';
import useConversationStats from '@/lib/hooks/useConversationStats';
import { useTheme } from '@/lib/context/ThemeContext';

interface MobileBottomNavProps {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export default function MobileBottomNav({ activeTab, setActiveTab }: MobileBottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isDark, colors } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { profile, loading: authLoading, logout } = useAuth();
  const { stats, loading: statsLoading, refreshStats } = useConversationStats();

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
    
    switch (id) {
      case 'home':
        router.push('/main');
        break;
      case 'chats':
        router.push('/main/chats');
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

  if (authLoading) {
    return (
      <>
        {/* Top Bar Loading */}
        <div className="fixed top-0 left-0 right-0 z-50 border-b px-4 py-3 shadow-sm h-16"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.border
          }}>
          <div className="flex items-center justify-between h-full">
            <div className="animate-pulse h-8 w-32 rounded"
              style={{ backgroundColor: colors.inputBackground }}></div>
            <div className="flex items-center gap-3">
              <div className="animate-pulse h-10 w-10 rounded-full"
                style={{ backgroundColor: colors.inputBackground }}></div>
              <div className="animate-pulse h-10 w-10 rounded-full"
                style={{ backgroundColor: colors.inputBackground }}></div>
              <div className="animate-pulse h-10 w-10 rounded-full"
                style={{ backgroundColor: colors.inputBackground }}></div>
            </div>
          </div>
        </div>
        
        {/* Bottom Nav Loading */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-lg border-t shadow-lg h-16"
          style={{
            backgroundColor: `${colors.background}99`,
            borderColor: colors.border
          }}>
          <div className="flex justify-around items-center h-full px-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="animate-pulse h-10 w-10 rounded-full"
                style={{ backgroundColor: colors.inputBackground }}></div>
            ))}
          </div>
        </nav>
      </>
    );
  }

  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b px-4 py-3 shadow-sm h-16 transition-colors"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border
        }}>
        <div className="flex items-center justify-between h-full">
          <button 
            onClick={() => handleTopBarAction('logo')}
            className="flex items-center gap-2 active:opacity-70 transition"
          >
            <div className="relative w-32 h-8">
              <Image
                src={isDark ? "/assets/logo.png" : "/assets/logo2.png"}
                alt="TabooTalks Logo"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 128px, 192px"
              />
            </div>
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleDiscover}
              className="p-2 transition-colors rounded-full"
              style={{
                color: colors.secondaryText
              }}
              aria-label="Explore"
            >
              <Compass size={30} />
            </button>
            
            <button 
              onClick={handleGift}
              className="relative p-2 transition-colors rounded-full"
              style={{
                color: colors.secondaryText
              }}
              aria-label="Notifications"
            >
              <GiftIcon size={30} />
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-[#ff2e2e] border-2 border-white"></span>
            </button>
            
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => handleTopBarAction('profile')}
                className="relative w-10 h-10 rounded-full overflow-hidden border-2 transition hover:opacity-90"
                style={{ 
                  borderColor: colors.secondary
                }}
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
                  <div className="h-full w-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.secondary} 0%, #ff2e2e 100%)`
                    }}>
                    {profile?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </button>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl border z-50"
                  style={{
                    backgroundColor: colors.panelBackground,
                    borderColor: colors.border
                  }}>
                  <div className="py-2">
                    <div className="px-4 py-3 border-b"
                      style={{ borderColor: colors.border }}>
                      <p className="font-semibold text-sm"
                        style={{ color: colors.primaryText }}>
                        {profile?.username || 'User'}
                      </p>
                      <p className="text-xs"
                        style={{ color: colors.secondaryText }}>
                        {profile?.email || 'Premium Member'}
                      </p>
                    </div>
                    
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
                        {statsLoading ? (
                          <div className="h-4 w-8 rounded animate-pulse"
                            style={{ backgroundColor: colors.inputBackground }}></div>
                        ) : (
                          <span className="text-sm font-bold"
                            style={{ color: colors.secondary }}>
                            {stats.activeChats}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs"
                          style={{ color: colors.secondaryText }}>
                          Total Messages
                        </span>
                        {statsLoading ? (
                          <div className="h-4 w-8 rounded animate-pulse"
                            style={{ backgroundColor: colors.inputBackground }}></div>
                        ) : (
                          <span className="text-sm font-bold"
                            style={{ color: colors.primaryText }}>
                            {stats.totalMessages}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleProfileDropdown('my-account')}
                      className="flex items-center w-full px-4 py-3 text-left text-sm transition hover:bg-opacity-50"
                      style={{
                        color: colors.primaryText,
                        backgroundColor: colors.hoverBackground
                      }}
                    >
                      <User size={16} className="mr-3"
                        style={{ color: colors.secondaryText }} />
                      <span>My Account</span>
                    </button>
                    
                    <button 
                      onClick={() => handleProfileDropdown('settings')}
                      className="flex items-center w-full px-4 py-3 text-left text-sm transition hover:bg-opacity-50"
                      style={{
                        color: colors.primaryText,
                        backgroundColor: colors.hoverBackground
                      }}
                    >
                      <Settings size={16} className="mr-3"
                        style={{ color: colors.secondaryText }} />
                      <span>Settings</span>
                    </button>
                    
                    <div className="border-t my-1"
                      style={{ borderColor: colors.borderLight }}></div>
                    
                    <button 
                      onClick={() => handleProfileDropdown('logout')}
                      className="flex items-center w-full px-4 py-3 text-left text-sm transition hover:bg-opacity-50"
                      style={{
                        color: '#ff2e2e',
                        backgroundColor: `${colors.hoverBackground}`
                      }}
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-lg border-t shadow-lg h-16 transition-colors"
        style={{
          backgroundColor: `${colors.background}99`,
          borderColor: colors.border
        }}>
        <div className="flex justify-around items-center h-full px-2">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            const showBadge = item.badge && item.badge > 0;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className="flex flex-col items-center justify-center relative p-2 transition-all duration-200"
                style={{
                  color: isActive ? colors.secondary : colors.secondaryText
                }}
              >
                <div className="relative rounded-full p-2 transition-all"
                  style={{
                    backgroundColor: isActive 
                      ? `${colors.secondary}10` 
                      : 'transparent',
                    border: isActive 
                      ? `1px solid ${colors.secondary}33` 
                      : 'none'
                  }}>
                  <item.icon size={22} 
                    style={{ color: isActive ? colors.secondary : colors.iconColor }} />
                  
                  {item.id === 'chats' && !statsLoading && item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#ff2e2e] text-xs font-bold flex items-center justify-center text-white">
                      {item.badge}
                    </span>
                  )}
                  
                  {item.id !== 'chats' && showBadge && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#ff2e2e] text-xs font-bold flex items-center justify-center text-white">
                      {item.badge}
                    </span>
                  )}
                  
                  {item.id === 'chats' && statsLoading && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gray-300 flex items-center justify-center">
                      <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                
                <span className="text-xs mt-1 font-medium"
                  style={{
                    color: isActive ? colors.secondary : colors.secondaryText,
                    fontWeight: isActive ? '600' : '500'
                  }}>
                  {item.label}
                </span>
                
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 h-1 w-8 rounded-full"
                    style={{
                      backgroundColor: `${colors.secondary}B3`
                    }}></div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="pb-16"></div>
    </>
  );
}