/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import DesktopNav from '@/components/layout/DesktopNav';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

export default function LayoutController() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('discover');
  const [mounted, setMounted] = useState(false);
  
  // Mock user data
  const [user] = useState({
    credits: 150,
    name: 'David',
    membership: 'Premium Member'
  });

  useEffect(() => {
    setMounted(true);
    
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(width < 1024 || isMobileDevice);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    window.addEventListener('orientationchange', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('orientationchange', checkScreenSize);
    };
  }, []);

  if (!mounted) {
    return null;
  }

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
        />
      )}
    </>
  );
}