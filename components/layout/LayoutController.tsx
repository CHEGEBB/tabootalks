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
      // More accurate mobile detection
      const width = window.innerWidth;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Consider mobile if width < 1024 OR if it's a mobile device regardless of width
      setIsMobile(width < 1024 || isMobileDevice);
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Check on orientation change (for mobile devices)
    window.addEventListener('orientationchange', checkScreenSize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('orientationchange', checkScreenSize);
    };
  }, []);

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <>
      {isMobile ? (
        <>
          {/* Mobile navigation */}
          <MobileBottomNav 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          
          {/* REMOVE this extra spacing div - MobileBottomNav already handles its own spacing */}
        </>
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