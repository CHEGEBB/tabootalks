'use client';

import { Home, MessageCircle, Search, Users, CreditCard, Bell, Compass, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface DesktopNavProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  credits: number;
}

export default function DesktopNav({ activeTab, setActiveTab, credits }: DesktopNavProps) {
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
        router.push('/main/profile');
        break;
      default:
        break;
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chats', label: 'Chats', icon: MessageCircle, badge: 3 },
    { id: 'discover', label: 'Discover', icon: Search },
    { id: 'people', label: 'People', icon: Users },
    { id: 'credits', label: 'Credits', icon: CreditCard },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          {/* Logo - Larger size */}
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

          {/* Navigation Items - Circular icons with labels below */}
          <div className="flex items-center gap-10">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <div key={item.id} className="flex flex-col items-center">
                  <button
                    onClick={() => handleNavigation(item.id)}
                    className={`flex flex-col items-center gap-1 transition-all ${
                      isActive ? 'text-[#5e17eb]' : 'text-gray-500 hover:text-[#5e17eb]'
                    }`}
                  >
                    {/* Circular Icon Container with opacity for active state */}
                    <div className={`relative p-4 rounded-full transition-all ${
                      isActive 
                        ? 'bg-[#5e17eb]/10 border border-[#5e17eb]/20' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                      <item.icon size={24} className={isActive ? 'text-[#5e17eb]' : ''} />
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-[#ff2e2e] text-xs font-bold flex items-center justify-center text-white">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {/* Label Below */}
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
            <button 
              onClick={() => handleRightSideAction('notifications')}
              className="relative p-3 text-gray-600 hover:text-[#5e17eb] transition hover:bg-gray-100 rounded-full"
            >
              <Bell size={24} />
              <span className="absolute top-3 right-3 h-3 w-3 rounded-full bg-[#ff2e2e]"></span>
            </button>
            
            <button 
              onClick={() => handleRightSideAction('explore')}
              className="p-3 text-gray-600 hover:text-[#5e17eb] transition hover:bg-gray-100 rounded-full"
            >
              <Compass size={24} />
            </button>
            
            <button 
              onClick={() => handleRightSideAction('create')}
              className="p-3 text-gray-600 hover:text-[#5e17eb] transition hover:bg-gray-100 rounded-full"
            >
              <PlusCircle size={24} />
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
                {credits}
              </span>
            </button>
            
            <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
              <div className="text-right">
                <p className="font-bold text-gray-900 text-lg">David</p>
                <p className="text-sm text-gray-500">Premium Member</p>
              </div>
              {/* Larger Profile Image */}
              <button 
                onClick={() => handleRightSideAction('profile')}
                className="relative w-14 h-14 rounded-full overflow-hidden border-3 border-[#5e17eb] hover:border-[#4a13c2] transition"
              >
                <div className="h-full w-full bg-gradient-to-br from-[#5e17eb] to-[#ff2e2e] flex items-center justify-center">
                  <Image
                    src="https://images.unsplash.com/photo-1739590441594-8e4e35a8a813?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Profile Image"
                    width={56}
                    height={56}
                    className="object-cover"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}