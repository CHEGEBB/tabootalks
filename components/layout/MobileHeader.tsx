import React from 'react';
import { Heart, Coins, User } from 'lucide-react';
import Image from 'next/image';

interface MobileHeaderProps {
  credits: number;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ credits }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-[#0a0a0a] border-b border-[#1a1a1a] z-40">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center space-x-2">
         <Image
            src="/assets/logo2.png"
            alt="TabooTalks Logo"
            width={120}
            height={35}
            className="object-contain"
            priority
          />
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-[#1a1a1a] px-3 py-1.5 rounded-full">
            <Coins className="w-4 h-4 text-[#ff2e2e]" />
            <span className="text-white text-sm font-semibold">{credits}</span>
          </div>
          <button className="w-8 h-8 bg-[#5e17eb] rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
};