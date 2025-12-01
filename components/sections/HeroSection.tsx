// components/sections/HeroSection.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Heart, MessageCircle, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="relative min-h-screen flex items-center py-20 overflow-hidden bg-gradient-to-br from-white via-pink-50/20 to-purple-50/30">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Soft gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
        
        {/* Minimal grid pattern */}
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
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white border border-pink-200 rounded-full px-4 py-2 mb-8 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">Welcome to TabooTalks</span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Connect with
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                Real People
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-xl">
              Start meaningful conversations with interesting people from around the world. Get <span className="font-bold text-purple-600">10 free credits</span> to begin your journey.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.button
                onClick={onGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-full font-bold text-lg shadow-md hover:shadow-lg transition-all"
              >
                Explore Profiles
              </motion.button>
            </div>

            {/* Social Proof */}
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

          {/* Right Column - Chat Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            {/* Main chat card */}
            <div className="relative">
              {/* Chat interface mockup */}
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-w-md mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white overflow-hidden">
                        <Image
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                          alt="Profile"
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 text-white">
                      <div className="font-bold">Sophia, 28</div>
                      <div className="text-sm text-white/90">Online now</div>
                    </div>
                    <Heart className="w-6 h-6 text-white/80" />
                  </div>
                </div>

                {/* Messages */}
                <div className="p-6 space-y-4 bg-gray-50 min-h-[400px]">
                  {/* Received message */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex gap-2"
                  >
                    <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[80%]">
                      <p className="text-gray-800 text-sm">Hey! I noticed you're new here. Welcome! 😊</p>
                    </div>
                  </motion.div>

                  {/* Sent message */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex gap-2 justify-end"
                  >
                    <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl rounded-tr-sm px-4 py-3 text-white shadow-sm max-w-[80%]">
                      <p className="text-sm">Hi Sophia! Thanks, excited to be here!</p>
                    </div>
                  </motion.div>

                  {/* Received message */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.6 }}
                    className="flex gap-2"
                  >
                    <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[80%]">
                      <p className="text-gray-800 text-sm">What brings you to TabooTalks?</p>
                    </div>
                  </motion.div>

                  {/* Typing indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="flex gap-2"
                  >
                    <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                      <div className="flex gap-1.5">
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Input */}
                <div className="px-6 py-4 bg-white border-t border-gray-100">
                  <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-3">
                    <MessageCircle className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent border-none outline-none text-sm text-gray-600 placeholder-gray-400"
                      disabled
                    />
                    <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-pink-600 to-purple-600 rounded-full">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements around chat */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl px-4 py-3 border border-pink-100"
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600 fill-pink-600" />
                  <span className="text-sm font-bold text-gray-800">250+ Profiles</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl px-4 py-3 border border-purple-100"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-bold text-gray-800">10 Free Credits</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;