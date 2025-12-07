// lib/hooks/useOffer.ts
'use client';

import { useState, useEffect } from 'react';

export const useOffer = () => {
  const [showOffer, setShowOffer] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if offer has been shown before
    const checkOfferStatus = () => {
      setIsChecking(true);
      
      try {
        // Check localStorage for offer status
        const offerShown = localStorage.getItem('offerShown');
        const offerTimestamp = localStorage.getItem('offerTimestamp');
        const now = Date.now();
        
        // If never shown or shown more than 24 hours ago, show again
        if (!offerShown || (offerTimestamp && (now - parseInt(offerTimestamp)) > 24 * 60 * 60 * 1000)) {
          setShowOffer(true);
        } else {
          setShowOffer(false);
        }
        
        setHasShown(!!offerShown);
      } catch (error) {
        console.error('Error checking offer status:', error);
        // Default to showing offer if error
        setShowOffer(true);
      } finally {
        setIsChecking(false);
      }
    };

    // Only check after a short delay to ensure auth state is loaded
    const timer = setTimeout(() => {
      checkOfferStatus();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseOffer = () => {
    setShowOffer(false);
    // Store in localStorage that offer has been shown
    localStorage.setItem('offerShown', 'true');
    localStorage.setItem('offerTimestamp', Date.now().toString());
    setHasShown(true);
  };

  const resetOffer = () => {
    // Reset offer status (for testing or after 24 hours)
    localStorage.removeItem('offerShown');
    localStorage.removeItem('offerTimestamp');
    setHasShown(false);
    setShowOffer(true);
  };

  return {
    showOffer,
    handleCloseOffer,
    hasShown,
    isChecking,
    resetOffer,
  };
};