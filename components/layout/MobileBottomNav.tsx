'use client';

import { Home, MessageCircle, Search, Users, CreditCard, Compass, Bell } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useEffect } from 'react';

interface MobileBottomNavProps {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
    credits?: number;
}

export default function MobileBottomNav({ activeTab, setActiveTab, credits = 150 }: MobileBottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();

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

  const handleNavigation = (id: string) => {
    setActiveTab(id);
    
    // Define navigation paths based on tab id
    switch (id) {
      case 'home':
        router.push('/main');
        break;
      case 'chats':
        router.push('/main/chats');
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

  // Correct order: Home, Chats, Discover, People, Credits
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chats', label: 'Chats', icon: MessageCircle, badge: 3 },
    { id: 'discover', label: 'Discover', icon: Search },
    { id: 'people', label: 'People', icon: Users },
    { id: 'credits', label: 'Credits', icon: CreditCard },
  ];

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
      default:
        break;
    }
  };

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
              onClick={() => handleTopBarAction('explore')}
              className="p-2 text-gray-600 hover:text-[#5e17eb] transition-colors rounded-full hover:bg-gray-100"
              aria-label="Explore"
            >
              <Compass size={22} />
            </button>
            
            {/* Notifications Button */}
            <button 
              onClick={() => handleTopBarAction('notifications')}
              className="relative p-2 text-gray-600 hover:text-[#5e17eb] transition-colors rounded-full hover:bg-gray-100"
              aria-label="Notifications"
            >
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-[#ff2e2e] border-2 border-white"></span>
            </button>
            
            {/* Credits Display */}
            <button 
              onClick={() => handleTopBarAction('credits')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full shadow-sm active:scale-95 transition-transform ${
                activeTab === 'credits' 
                  ? 'bg-[#5e17eb]/10 border border-[#5e17eb]/20' 
                  : 'bg-[#5e17eb]'
              }`}
            >
              <span className={`text-sm font-bold ${
                activeTab === 'credits' ? 'text-[#5e17eb]' : 'text-white'
              }`}>
                {credits.toLocaleString()}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - FIXED at bottom */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg h-16">
        <div className="flex justify-around items-center h-full px-2">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
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
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#ff2e2e] text-xs font-bold flex items-center justify-center text-white">
                      {item.badge}
                    </span>
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

      {/* ONLY ONE safe area spacer - This adds padding to content */}
      <div className="pt-16 pb-16"></div>
    </>
  );
}