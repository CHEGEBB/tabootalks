'use client';

import { useState, useEffect } from 'react';
import DesktopNav from '@/components/layout/DesktopNav';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

export default function LayoutController() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  
  // Mock user data - replace with actual user data from your auth/context
  const [user] = useState({
    credits: 150,
    name: 'David',
    membership: 'Premium Member'
  });

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <>
      {isMobile ? (
        <MobileBottomNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      ) : (
        <DesktopNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          credits={user.credits}
        />
      )}
    </>
  );
}