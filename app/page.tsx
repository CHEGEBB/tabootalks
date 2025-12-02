// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
import { Heart, MessageCircle, Shield, Sparkles, Zap, Users } from 'lucide-react';
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
      <FeatureSection 
        features={[
          {
            icon: <Heart className="w-6 h-6 text-white" />,
            title: "Deep Connections",
            description: "Experience conversations that go beyond small talk, creating meaningful bonds with people who match your energy.",
            color: "red",
          },
          {
            icon: <MessageCircle className="w-6 h-6 text-white" />,
            title: "Flirty Exchanges",
            description: "Enjoy playful, flirtatious conversations that bring excitement and anticipation to your day.",
            color: "purple",
          },
          {
            icon: <Sparkles className="w-6 h-6 text-white" />,
            title: "Intriguing Chats",
            description: "Dive into fascinating discussions that stimulate your mind and keep you coming back for more.",
            color: "blue",
          },
          {
            icon: <Shield className="w-6 h-6 text-white" />,
            title: "Private & Secure",
            description: "Chat in a protected environment where your privacy is our priority and you control your experience.",
            color: "green",
          },
          {
            icon: <Zap className="w-6 h-6 text-white" />,
            title: "Instant Matches",
            description: "Find that spark with people who share your interests from the very first message.",
            color: "red",
          },
          {
            icon: <Users className="w-6 h-6 text-white" />,
            title: "Diverse Profiles",
            description: "Connect with a wide variety of fascinating personalities, each with unique stories to share.",
            color: "purple",
          },
        ]}
      />
            <SignUpInterestSection/>

      
      {/* Community Showcase - Infinite Scroll */}
      <InfiniteProfileScroll />
      
      {/* Our Mission Section */}
      <MissionSection />
      
      {/* Three-Step Journey */}
      <JourneySteps 
        steps={[
          {
            number: 1,
            title: "Choose Your Preferences",
            description: "Tell us who you are and what you're looking for to help us find your perfect matches.",
            progress: 100,
            color: "#ff2e2e",
            fromLabel: "Uncertainty",
            toLabel: "Direction",
          },
          {
            number: 2,
            title: "Browse Exciting Profiles",
            description: "Discover intriguing people who match your preferences and spark your curiosity.",
            progress: 80,
            color: "#5e17eb",
            fromLabel: "Searching",
            toLabel: "Discovery",
          },
          {
            number: 3,
            title: "Start Meaningful Conversations",
            description: "Connect through engaging messages that can lead to something special.",
            progress: 90,
            color: "#00c7be",
            fromLabel: "Hesitation",
            toLabel: "Connection",
          },
        ]}
      />
      
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