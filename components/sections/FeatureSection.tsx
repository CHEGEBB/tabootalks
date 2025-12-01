'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Shield, Sparkles, Zap, Lock } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Deep Connections",
    description: "Move beyond small talk. Engage in meaningful conversations that actually matter and feel real.",
    iconSvg: <Heart className="w-8 h-8 text-red-500" />,
    delay: 0
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "24/7 Availability",
    description: "Never feel alone. Chat anytime, day or night. Someone is always ready to talk when you need them.",
    iconSvg: <MessageCircle className="w-8 h-8 text-purple-500" />,
    delay: 0.2
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "100% Private",
    description: "Your conversations are completely confidential. No judgment, no screenshots, no data sharing.",
    iconSvg: <Shield className="w-8 h-8 text-blue-500" />,
    delay: 0.4
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Smart Conversations",
    description: "Profiles that remember your preferences, interests, and conversation style for a personalized experience.",
    iconSvg: <Sparkles className="w-8 h-8 text-amber-500" />,
    delay: 0.6
  }
];

// Image paths for your custom illustrations (put SVGs in /public/assets/)
const illustrations = [
  '/assets/chat-illustration.svg',
  '/assets/heart-illustration.svg', 
  '/assets/profiles-illustration.svg',
    '/assets/privacy-illustration.svg'
];

const FeatureSection: React.FC = () => {
  const [currentIllustration, setCurrentIllustration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIllustration((prev) => (prev + 1) % illustrations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="features" className="py-24 px-4 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-red-600 to-purple-600 text-white rounded-full text-sm font-semibold mb-4 shadow-lg">
              WHY TABOO TALKS
            </span>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Chat without boundaries
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience conversations that feel natural, personal, and judgment-free
            </p>
          </motion.div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Full SVG Illustration */}
          <motion.div 
            className="relative order-2 lg:order-1 hidden lg:block"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Main Illustration - Full Space */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIllustration}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8 }}
                    className="w-full h-full"
                  >
                    <motion.div
                      animate={{ y: [0, -20, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Image
                        src={illustrations[currentIllustration]}
                        alt="Feature illustration"
                        width={500}
                        height={500}
                        className="w-full h-full object-contain drop-shadow-2xl"
                      />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Glow effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-purple-500/20 blur-3xl rounded-full -z-10"></div>
              
              {/* Decorative circles */}
              <motion.div
                className="absolute -top-4 -right-4 w-24 h-24 bg-red-500/10 rounded-full blur-xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
              />
            </div>
          </motion.div>
          
          {/* Right side - Staircase feature cards */}
          <div className="space-y-6 order-1 lg:order-2">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: feature.delay }}
                style={{ marginLeft: `${index * 30}px` }}
                className="relative"
              >
                <motion.div
                  whileHover={{ scale: 1.03, x: 10 }}
                  className="relative bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex items-start gap-4"
                >
                  {/* Chat bubble tail */}
                  <div className="absolute -left-3 top-8 w-6 h-6 bg-white transform rotate-45 border-l border-b border-gray-100"></div>
                  
                  {/* Icon bubble */}
                  <motion.div 
                    className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </motion.div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    
                    {/* Animated underline */}
                    <motion.div
                      className="mt-3 h-1 bg-gradient-to-r from-red-500 to-purple-600 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: '60%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: feature.delay + 0.3 }}
                    />
                  </div>
                  
                  {/* Feature icon on the right */}
                  <motion.div
                    className="flex-shrink-0"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {feature.iconSvg}
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;