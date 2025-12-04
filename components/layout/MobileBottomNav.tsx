'use client';

import { Home, MessageCircle, Search, Users, CreditCard, Compass, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface MobileBottomNavProps {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
    credits?: number;
}

export default function MobileBottomNav({ activeTab, setActiveTab, credits = 150 }: MobileBottomNavProps) {
  const router = useRouter();

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
      {/* Top Bar for Mobile - IMPROVED VERSION */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Logo Section - Now with Image */}
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
              className="flex items-center gap-1.5 bg-[#5e17eb] px-3.5 py-2 rounded-full shadow-sm active:scale-95 transition-transform"
            >
              <span className="text-white text-sm font-bold">{credits.toLocaleString()}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg safe-area-bottom">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`flex flex-col items-center justify-center relative p-2 transition ${
                activeTab === item.id ? 'text-[#5e17eb]' : 'text-gray-600'
              }`}
            >
              <div className="relative">
                <item.icon size={26} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#ff2e2e] text-xs font-bold flex items-center justify-center text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
              {activeTab === item.id && (
                <div className="absolute top-0 h-1 w-full bg-[#5e17eb] rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Safe area spacer for content */}
      <div className="h-16"></div>
    </>
  );
}