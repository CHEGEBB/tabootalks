// components/sections/SignUpInterestSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, User, Users } from 'lucide-react';
import Image from 'next/image';

interface SignUpInterestSectionProps {
  onGetStarted?: () => void;
}

const illustrations = [
  {
    id: 1,
    src: '/assets/chat.svg',
    alt: 'People chatting',
  },
  {
    id: 2,
    src: '/assets/connect.svg',
    alt: 'Making connections',
  },
  {
    id: 3,
    src: '/assets/date.svg',
    alt: 'Dating scene',
  },
  {
    id: 4,
    src: '/assets/messages.svg',
    alt: 'Messaging',
  }
];

const SignUpInterestSection: React.FC<SignUpInterestSectionProps> = ({ onGetStarted }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'man' | 'woman' | null>(null);
  const [looking, setLooking] = useState<'man' | 'woman' | 'both' | null>(null);
  const [currentIllustration, setCurrentIllustration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIllustration((prev) => (prev + 1) % illustrations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleContinue = () => {
    if (name && gender && looking && onGetStarted) {
      onGetStarted();
    }
  };

  const isFormValid = name.trim() && gender && looking;

  return (
    <section className="relative py-16 md:py-24 px-4 overflow-hidden bg-white">
      {/* Subtle background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#ff2e2e]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#5e17eb]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-5 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Column - Interest Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            {/* Header */}
            <div className="mb-8 md:mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
                Let&apos;s get you{' '}
                <span className="text-[#ff2e2e]">started</span>
              </h2>
              <p className="text-base md:text-lg text-gray-600">
                Tell us a bit about yourself to find your perfect matches
              </p>
            </div>

            {/* Name Input */}
            <div className="mb-6 md:mb-8">
              <label className="text-gray-900 font-semibold text-base md:text-lg mb-2 md:mb-3 block">
                What&apos;s your name?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 md:px-6 py-3 md:py-4 rounded-2xl text-base md:text-lg border-2 border-gray-200 focus:border-[#ff2e2e] focus:outline-none transition-colors bg-white placeholder:text-gray-500 text-gray-500"
              />
            </div>

            {/* I am a */}
            <div className="mb-6 md:mb-8">
              <label className="text-gray-900 font-semibold text-base md:text-lg mb-2 md:mb-3 block">
                I am a
              </label>
              <div className="flex gap-3 md:gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setGender('man')}
                  className={`flex-1 px-4 md:px-8 py-3 md:py-4 rounded-2xl font-semibold text-base md:text-lg transition-all ${
                    gender === 'man'
                      ? 'bg-[#ff2e2e] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <User className="w-4 h-4 md:w-5 md:h-5 inline-block mr-1 md:mr-2" />
                  Man
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setGender('woman')}
                  className={`flex-1 px-4 md:px-8 py-3 md:py-4 rounded-2xl font-semibold text-base md:text-lg transition-all ${
                    gender === 'woman'
                      ? 'bg-[#ff2e2e] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <User className="w-4 h-4 md:w-5 md:h-5 inline-block mr-1 md:mr-2" />
                  Woman
                </motion.button>
              </div>
            </div>

            {/* I am looking for */}
            <div className="mb-8 md:mb-10">
              <label className="text-gray-900 font-semibold text-base md:text-lg mb-2 md:mb-3 block">
                I&apos;m interested in
              </label>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setLooking('man')}
                  className={`px-4 md:px-8 py-3 md:py-4 rounded-2xl font-semibold text-base md:text-lg transition-all ${
                    looking === 'man'
                      ? 'bg-[#5e17eb] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <User className="w-4 h-4 md:w-5 md:h-5 inline-block mr-1 md:mr-2" />
                  Men
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setLooking('woman')}
                  className={`px-4 md:px-8 py-3 md:py-4 rounded-2xl font-semibold text-base md:text-lg transition-all ${
                    looking === 'woman'
                      ? 'bg-[#5e17eb] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <User className="w-4 h-4 md:w-5 md:h-5 inline-block mr-1 md:mr-2" />
                  Women
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setLooking('both')}
                  className={`px-4 md:px-8 py-3 md:py-4 rounded-2xl font-semibold text-base md:text-lg transition-all ${
                    looking === 'both'
                      ? 'bg-[#5e17eb] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Users className="w-4 h-4 md:w-5 md:h-5 inline-block mr-1 md:mr-2" />
                  Everyone
                </motion.button>
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={handleContinue}
              whileHover={isFormValid ? { scale: 1.03 } : {}}
              whileTap={isFormValid ? { scale: 0.98 } : {}}
              disabled={!isFormValid}
              className={`group w-full px-6 md:px-10 py-4 md:py-5 rounded-full font-bold text-lg md:text-xl transition-all flex items-center justify-center gap-2 md:gap-3 ${
                isFormValid
                  ? 'bg-[#ff2e2e] text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue to Sign Up
              <ArrowRight className={`w-5 h-5 md:w-6 md:h-6 transition-transform ${isFormValid ? 'group-hover:translate-x-1' : ''}`} />
            </motion.button>

            <div className="mt-4 md:mt-6 flex flex-wrap items-center justify-center gap-2 text-gray-600 text-sm md:text-base">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                <span className="text-sm">Free to join</span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#5e17eb]"></div>
                <span className="text-sm font-semibold">10 free credits included</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - SVG Illustrations - BIGGER */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[400px] md:h-[500px] lg:h-[700px] flex items-center justify-center lg:col-span-3"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIllustration}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
                    <Image 
                      src={illustrations[currentIllustration].src} 
                      alt={illustrations[currentIllustration].alt}
                      width={700}
                      height={700}
                      className="w-full h-full object-contain"
                      priority={currentIllustration === 0}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Progress dots */}
              <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {illustrations.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIllustration(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIllustration
                        ? 'bg-[#ff2e2e] w-8'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SignUpInterestSection;