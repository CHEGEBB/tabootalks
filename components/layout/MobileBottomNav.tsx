import { Home, MessageCircle, Search, Users, CreditCard, Plus, Compass } from 'lucide-react';
import { JSX } from 'react/jsx-dev-runtime';

interface MobileBottomNavProps {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export default function MobileBottomNav({ activeTab, setActiveTab }: MobileBottomNavProps): JSX.Element {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Search },
    { id: 'create', label: 'Create', icon: Plus },
    { id: 'chats', label: 'Chats', icon: MessageCircle, badge: 3 },
    { id: 'people', label: 'People', icon: Users },
  ];

  return (
    <>
      {/* Top Bar for Mobile */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb] flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="text-xl font-bold text-gray-900">TabooTalks</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-600 hover:text-[#5e17eb]">
              <Compass size={22} />
            </button>
            <div className="rounded-full bg-[#5e17eb] px-3 py-1.5">
              <span className="font-bold text-sm text-white">150</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg safe-area-bottom">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
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