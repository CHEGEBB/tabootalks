// components/sections/HeroSection.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Image from 'next/image';
import { ChevronsRight } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 right-[10%] w-96 h-96 bg-[#ff2e2e]/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 left-[10%] w-80 h-80 bg-[#5e17eb]/5 rounded-full filter blur-3xl"></div>
        
        {/* Background gradient overlay for image */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white opacity-60"></div>
        
        {/* Background image - partially visible through gradient */}
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="/assets/bg-pattern.jpg" 
            alt="Background pattern"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Where <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb]">authentic connections</span> begin
              </h1>
              
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                TabooTalks brings people together through engaging, meaningful conversations. 
                Discover the joy of connection in a space that's designed for authentic interaction.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb] text-white px-8 py-4 text-lg shadow-xl"
                >
                  Get Started Now
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/explore'}
                  className="group"
                >
                  Explore Profiles
                  <ChevronsRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              <div className="mt-8 flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                      <Image
                        src={`/assets/profiles/avatar${num}.jpg`}
                        alt="User"
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-[#ff2e2e]">2,500+</span> people joined this week
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - SVG Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[600px]">
              {/* Chat Interface Illustration */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[320px] h-[580px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-4 border-gray-100 z-20">
                <div className="bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb] h-16 flex items-center px-4 text-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="font-semibold">S</span>
                    </div>
                    <div>
                      <p className="font-medium">Sophia</p>
                      <div className="flex items-center text-xs">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                        <span>Online now</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Chat Messages */}
                <div className="px-4 py-3 h-[calc(100%-10rem)] overflow-y-auto bg-gray-50">
                  {/* Incoming Message */}
                  <div className="mb-4 flex">
                    <div className="max-w-[75%] bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                      <p className="text-gray-800">Hey there! I noticed you're new here. How's your day going so far? 😊</p>
                    </div>
                  </div>
                  
                  {/* Outgoing Message */}
                  <div className="mb-4 flex justify-end">
                    <div className="max-w-[75%] bg-gradient-to-r from-[#5e17eb] to-[#4e44e5] rounded-2xl rounded-tr-none px-4 py-3 text-white">
                      <p>Hi Sophia! Yes, I just joined. My day's been pretty good, thanks for asking!</p>
                    </div>
                  </div>
                  
                  {/* Incoming Message */}
                  <div className="mb-4 flex">
                    <div className="max-w-[75%] bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                      <p className="text-gray-800">That's great to hear! What brought you to TabooTalks? Looking for interesting conversations?</p>
                    </div>
                  </div>
                  
                  {/* Typing Indicator */}
                  <div className="flex">
                    <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                      <div className="flex space-x-2">
                        <motion.div 
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                        />
                        <motion.div 
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.2, ease: "easeInOut" }}
                        />
                        <motion.div 
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.4, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Input Area */}
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-white border-t border-gray-100">
                  <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent border-none outline-none text-sm"
                    />
                    <button className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb] rounded-full text-white">
                      <ChevronsRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                className="absolute top-20 -right-4 w-40 h-40 bg-[#5e17eb]/10 rounded-full z-10"
                animate={{ y: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              />
              
              <motion.div
                className="absolute bottom-20 -left-4 w-60 h-60 bg-[#ff2e2e]/10 rounded-full z-10"
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;