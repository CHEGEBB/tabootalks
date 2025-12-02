// app/page.tsx
'use client';

import React, { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import FeatureSection from '@/components/sections/FeatureSection';
import InfiniteProfileScroll from '@/components/sections/InfiniteProfileScroll';
import MissionSection from '@/components/sections/MissionSection';
import JourneySteps from '@/components/sections/JourneySteps';
import ProfileGrid from '@/components/sections/ProfileGrid';
import CTASection from '@/components/sections/CTASection';
import PreferenceModal from '@/components/ui/PreferenceModal';
import SignUpInterestSection from '@/components/sections/SignUpInterestSection';

export default function LandingPage() {
  const [showPreferenceModal, setShowPreferenceModal] = useState(false);
  
  const handleGetStarted = () => {
    setShowPreferenceModal(true);
  };

  const handlePreferenceSubmit = (data: { gender: string; lookingFor: string; name: string; birthday: string }) => {
    console.log('User data:', data);
    // Handle signup process - redirect to registration or next step
    window.location.href = '/signup';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation onGetStarted={handleGetStarted} />

      {/* Hero Section */}
      <HeroSection onGetStarted={handleGetStarted} />

      {/* Features Section */}
      <FeatureSection />
      
      {/* Sign Up Interest Section */}
      <SignUpInterestSection onGetStarted={handleGetStarted} />
      
      {/* Community Showcase - Infinite Scroll */}
      <InfiniteProfileScroll />
      
      {/* Our Mission Section */}
      <MissionSection />
      
      {/* Three-Step Journey */}
      <JourneySteps />
      
      {/* Featured Profiles Grid */}
      <ProfileGrid onGetStarted={handleGetStarted} />
      
      {/* CTA Section */}
      <CTASection onGetStarted={handleGetStarted} />
      
      {/* Footer */}
      <Footer />
      
      {/* Preference Selection Modal */}
      <PreferenceModal
        isOpen={showPreferenceModal}
        onClose={() => setShowPreferenceModal(false)}
        onSubmit={handlePreferenceSubmit}
      />
    </div>
  );
}