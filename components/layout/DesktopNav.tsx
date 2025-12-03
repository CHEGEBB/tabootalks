import { Home, MessageCircle, Search, Users, CreditCard, Bell, User, Compass, PlusCircle } from 'lucide-react';
import Image from 'next/image';

interface DesktopNavProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  credits: number;
}

export default function DesktopNav({ activeTab, setActiveTab, credits }: DesktopNavProps) {
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
          </div>

          {/* Navigation Items - Circular icons with labels below */}
          <div className="flex items-center gap-10">
            {navItems.map(item => (
              <div key={item.id} className="flex flex-col items-center">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center gap-1 transition-all ${
                    activeTab === item.id ? 'text-[#5e17eb]' : 'text-gray-500 hover:text-[#5e17eb]'
                  }`}
                >
                  {/* Circular Icon Container */}
                  <div className={`relative p-4 rounded-full transition-all ${
                    activeTab === item.id 
                      ? 'bg-[#5e17eb]/80 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                    <item.icon size={24} />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-[#ff2e2e] text-xs font-bold flex items-center justify-center text-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {/* Label Below */}
                  <span className={`text-sm font-medium mt-2 ${
                    activeTab === item.id ? 'text-[#5e17eb]' : 'text-gray-600'
                  }`}>
                    {item.label}
                  </span>
                </button>
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-6">
            <button className="relative p-3 text-gray-600 hover:text-[#5e17eb] transition hover:bg-gray-100 rounded-full">
              <Bell size={24} />
              <span className="absolute top-3 right-3 h-3 w-3 rounded-full bg-[#ff2e2e]"></span>
            </button>
            
            <button className="p-3 text-gray-600 hover:text-[#5e17eb] transition hover:bg-gray-100 rounded-full">
              <Compass size={24} />
            </button>
            
            <button className="p-3 text-gray-600 hover:text-[#5e17eb] transition hover:bg-gray-100 rounded-full">
              <PlusCircle size={24} />
            </button>

            {/* Credits Display */}
            <div className="rounded-full bg-[#5e17eb] px-4 py-2">
              <span className="font-bold text-sm text-white">{credits}</span>
            </div>
            
            <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
              <div className="text-right">
                <p className="font-bold text-gray-900 text-lg">David</p>
                <p className="text-sm text-gray-500">Premium Member</p>
              </div>
              {/* Larger Profile Image */}
              <button className="relative w-14 h-14 rounded-full overflow-hidden border-3 border-[#5e17eb]">
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