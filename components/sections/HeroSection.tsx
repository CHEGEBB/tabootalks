// components/sections/HeroSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Heart, MessageCircle, Sparkles, Star, Zap, Camera, User } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted?: () => void;
}

const profiles = [
  {
    name: "Sophia",
    age: 28,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=450",
    message: "Hey! I noticed you're new here. Welcome! 😊",
    interest: "Photography"
  },
  {
    name: "Emma",
    age: 25,
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=450",
    message: "Love your profile! Want to chat? ✨",
    interest: "Travel"
  },
  {
    name: "Isabella",
    age: 27,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=450",
    message: "What brings you here? 💭",
    interest: "Music"
  }
];

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const [currentProfile, setCurrentProfile] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProfile((prev) => (prev + 1) % profiles.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const profile = profiles[currentProfile];

  return (
    <section className="relative min-h-screen flex items-center py-20 overflow-hidden bg-gradient-to-br from-white via-pink-50/20 to-purple-50/30">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
        
        <svg className="absolute inset-0 h-full w-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white border border-pink-200 rounded-full px-4 py-2 mb-8 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">Welcome to TabooTalks</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Connect with
              <br />
              <span className="text-transparent bg-clip-text bg-[#5e17eb]">
                Real People
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-xl">
              Start meaningful conversations with interesting people from around the world. Get <span className="font-bold text-purple-600">10 free credits</span> to begin your journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.button
                onClick={onGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center justify-center gap-2 bg-[#5e17eb] text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={onGetStarted}
                className="inline-flex items-center justify-center gap-2 bg-[#ff2e2e] border-2 border-gray-200 text-white px-8 py-4 rounded-full font-bold text-lg shadow-md hover:shadow-lg transition-all"
              >
                Explore Profiles
              </motion.button>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div 
                    key={num} 
                    className="w-12 h-12 rounded-full border-4 border-white bg-gradient-to-br from-pink-200 to-purple-200 overflow-hidden shadow-lg"
                  >
                    <Image
                      src={`https://i.pravatar.cc/150?img=${num + 10}`}
                      alt="User"
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="font-bold text-gray-900">50,000+ Active Users</div>
                <div className="text-gray-600">Join the community today</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - 3D Device Mockup with Animated Profiles */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative lg:h-[700px] flex items-center justify-center"
          >
            {/* Phone mockup container with 3D effect */}
            <div className="relative" style={{ perspective: '2000px' }}>
              <motion.div
                animate={{ 
                  rotateY: [0, -5, 0],
                  rotateX: [0, 2, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ transformStyle: 'preserve-3d' }}
                className="relative"
              >
                {/* iPhone mockup */}
                <div className="relative w-[340px] h-[680px] bg-gray-900 rounded-[50px] shadow-2xl border-[14px] border-gray-900 overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-gray-900 rounded-b-3xl z-50"></div>
                  
                  {/* Screen content */}
                  <div className="relative w-full h-full bg-white rounded-[36px] overflow-hidden">
                    {/* App header */}
                    <div className="bg-[#5e17eb] px-6 py-4 pt-8">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-white text-xl font-bold">
                          <Image
                          src="/assets/logo.png"
                          alt='logo'
                          width={100}
                          height={50}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Animated profile cards stack */}
                    <div className="relative h-[580px] bg-gray-50 p-4">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentProfile}
                          initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
                          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                          exit={{ scale: 0.8, opacity: 0, rotateY: -90 }}
                          transition={{ duration: 0.6 }}
                          className="absolute inset-4"
                        >
                          {/* Profile Card */}
                          <div className="bg-white rounded-3xl shadow-xl overflow-hidden h-full flex flex-col">
                            {/* Profile Image */}
                            <div className="relative h-[380px]">
                              <Image
                                src={profile.image}
                                alt={profile.name}
                                fill
                                quality={100}
                                className="object-cover"
                              />
                              {/* Gradient overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                              
                              {/* Online badge */}
                              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-green-500 rounded-full px-3 py-1.5">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                <span className="text-white text-xs font-semibold">Online</span>
                              </div>

                              {/* Interest badge */}
                              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
                                <span className="text-gray-800 text-xs font-semibold">{profile.interest}</span>
                              </div>

                              {/* Profile info */}
                              <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-white text-2xl font-bold mb-1">
                                  {profile.name}, {profile.age}
                                </h3>
                                <div className="flex items-center gap-2 text-white/90 text-sm">
                                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                  <span>2 km away</span>
                                </div>
                              </div>
                            </div>

                            {/* Message preview */}
                            <div className="flex-1 p-4 flex flex-col">
                              <div className="bg-gray-50 rounded-2xl p-4 mb-3">
                                <p className="text-gray-800 text-sm">{profile.message}</p>
                              </div>

                              {/* Action buttons */}
                              <div className="flex gap-3 mt-auto">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="flex-1 bg-[#ff2e2e] rounded-2xl py-3 text-white font-bold flex items-center justify-center gap-2 shadow-lg"
                                >
                                  <Heart className="w-5 h-5" />
                                  Like
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="flex-1 bg-gray-100 rounded-2xl py-3 text-gray-700 font-bold flex items-center justify-center gap-2"
                                >
                                  <MessageCircle className="w-5 h-5" />
                                  Chat
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>

                      {/* Stacked cards behind effect */}
                      <div className="absolute inset-x-8 bottom-2 h-full bg-white rounded-3xl shadow-lg -z-10 opacity-50"></div>
                      <div className="absolute inset-x-12 bottom-0 h-full bg-white rounded-3xl shadow-md -z-20 opacity-30"></div>
                    </div>
                  </div>
                </div>

                {/* Floating badges around phone */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-8 bg-white rounded-2xl shadow-2xl px-4 py-3 border border-pink-100"
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-600 fill-pink-600" />
                    <span className="text-sm font-bold text-gray-800">250+ Profiles</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -bottom-6 -left-8 bg-white rounded-2xl shadow-2xl px-4 py-3 border border-purple-100"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-bold text-gray-800">10 Free Credits</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute top-1/2 -left-12 bg-white rounded-2xl shadow-2xl px-4 py-3 border border-blue-100"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-bold text-gray-800">Instant Match</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;