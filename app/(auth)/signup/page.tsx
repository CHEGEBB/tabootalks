/* eslint-disable react-hooks/purity */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Sparkles, Camera, Heart, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';

interface FormData {
  gender: string;
  goals: string[];
  bio: string;
  profilePic: string | null;
  name: string;
  email: string;
  password: string;
}

interface Illustration {
  id: number;
  image: string;
  title: string;
  description: string;
  color: string;
}

interface ParticlePosition {
  x: number;
  y: number;
  scale: number;
}

const SignupWizard = () => {
  const [step, setStep] = useState<number>(0);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    gender: '',
    goals: [],
    bio: '',
    profilePic: null,
    name: '',
    email: '',
    password: ''
  });

  // Handle window resize for responsive adjustments
  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const allImages = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1507101105822-7472b28e22ac?w=500&h=500&fit=crop',
  ];

  // SVG illustration data
  const illustrationData = useMemo<Illustration[]>(() => [
    {
      id: 1,
      image: '/assets/illustrations/match.svg',
      title: "Find Your Match",
      description: "Discover meaningful connections",
      color: '#f87171'
    },
    {
      id: 2,
      image: '/assets/illustrations/connect.svg',
      title: "Instant Connect",
      description: "Meet like-minded people",
      color: '#f87171'
    },
    {
      id: 3,
      image: '/assets/illustrations/chat.svg',
      title: "Free Chat",
      description: "Start conversations easily",
      color: '#f87171'
    },
    {
      id: 4,
      image: '/assets/illustrations/heart.svg',
      title: "Build Bonds",
      description: "Create lasting relationships",
      color: '#f87171'
    },
    {
      id: 5,
      image: '/assets/illustrations/self.svg',
      title: "Be Yourself",
      description: "Show your true personality",
      color: '#f87171'
    },
    {
      id: 6,
      image: '/assets/illustrations/safe.svg',
      title: "Secure & Safe",
      description: "Your privacy is protected",
      color: '#f87171'
    },
    {
      id: 7,
      image: '/assets/illustrations/protect.svg',
      title: "Always Protected",
      description: "Secure your account",
      color: '#f87171'
    },
    {
      id: 8,
      image: '/assets/illustrations/start.svg',
      title: "Ready to Start",
      description: "Begin your journey now",
      color: '#f87171'
    }
  ], []);

  const currentIllustration = illustrationData[step] || illustrationData[0];
  const totalSteps = 8;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const toggleGoal = (goal: string) => {
    if (formData.goals.includes(goal)) {
      setFormData({ ...formData, goals: formData.goals.filter(g => g !== goal) });
    } else {
      if (formData.goals.length < 3) {
        setFormData({ ...formData, goals: [...formData.goals, goal] });
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Animation variants for steps
  const stepVariants: Variants = {
    hidden: { opacity: 0, scale: 0.92, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.92, 
      y: -30,
      transition: {
        duration: 0.2
      }
    }
  };

  // Safe random values for particles (FEWER PARTICLES)
  const particlePositions = useMemo<ParticlePosition[]>(() => 
    Array.from({ length: 5 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: Math.random() * 0.5 + 0.5
    }))
  , []);

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      {/* Background - NO CHANGES */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 left-0 flex"
        >
          {[...Array(6)].map((_, setIdx) => (
            <React.Fragment key={`row1-${setIdx}`}>
              {[...Array(4)].map((_, imgIdx) => (
                <div 
                  key={`row1-${setIdx}-${imgIdx}`} 
                  className={`flex-shrink-0 ${windowWidth < 768 ? 'w-[220px] h-[180px]' : 'w-[320px] h-[240px]'}`}
                >
                  <div className="w-full h-full p-1">
                    <Image 
                      src={allImages[(setIdx * 4 + imgIdx) % allImages.length]} 
                      alt="" 
                      width={320}
                      height={240}

                      className="w-full h-full object-cover rounded-lg opacity-80"
                    />
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </motion.div>

        <motion.div
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
          className={`absolute ${windowWidth < 768 ? 'top-[180px]' : 'top-[240px]'} left-0 flex`}
        >
          {[...Array(6)].map((_, setIdx) => (
            <React.Fragment key={`row2-${setIdx}`}>
              {[...Array(4)].map((_, imgIdx) => (
                <div 
                  key={`row2-${setIdx}-${imgIdx}`} 
                  className={`flex-shrink-0 ${windowWidth < 768 ? 'w-[240px] h-[180px]' : 'w-[340px] h-[240px]'}`}
                >
                  <div className="w-full h-full p-1">
                    <Image
                      src={allImages[(setIdx * 4 + imgIdx + 5) % allImages.length]} 
                      alt="" 
                      width={320}
                      height={240}
                      className="w-full h-full object-cover rounded-lg opacity-80"
                    />
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </motion.div>

        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className={`absolute ${windowWidth < 768 ? 'top-[360px]' : 'top-[480px]'} left-0 flex`}
        >
          {[...Array(6)].map((_, setIdx) => (
            <React.Fragment key={`row3-${setIdx}`}>
              {[...Array(4)].map((_, imgIdx) => (
                <div 
                  key={`row3-${setIdx}-${imgIdx}`} 
                  className={`flex-shrink-0 ${windowWidth < 768 ? 'w-[200px] h-[180px]' : 'w-[300px] h-[240px]'}`}
                >
                  <div className="w-full h-full p-1">
                    <Image
                      src={allImages[(setIdx * 4 + imgIdx + 10) % allImages.length]} 
                      alt="" 
                      width={320}
                      height={240}
                      className="w-full h-full object-cover rounded-lg opacity-80"
                    />
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </motion.div>

        <motion.div
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: 58, repeat: Infinity, ease: 'linear' }}
          className={`absolute ${windowWidth < 768 ? 'top-[540px]' : 'top-[720px]'} left-0 flex`}
        >
          {[...Array(6)].map((_, setIdx) => (
            <React.Fragment key={`row4-${setIdx}`}>
              {[...Array(4)].map((_, imgIdx) => (
                <div 
                  key={`row4-${setIdx}-${imgIdx}`} 
                  className={`flex-shrink-0 ${windowWidth < 768 ? 'w-[230px] h-[180px]' : 'w-[330px] h-[240px]'}`}
                >
                  <div className="w-full h-full p-1">
                    <Image
                      src={allImages[(setIdx * 4 + imgIdx + 15) % allImages.length]} 
                      alt="" 
                      width={320}
                      height={240}
                      className="w-full h-full object-cover rounded-lg opacity-80"
                    />
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 to-black/90 z-10" />

      {/* Animated Particles - FEWER PARTICLES */}
      {isMounted && (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {particlePositions.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-red-500 opacity-30"
              initial={{ 
                x: `${pos.x}%`, 
                y: `${pos.y}%`,
                scale: pos.scale
              }}
              animate={{ 
                x: [
                  `${pos.x}%`, 
                  `${(pos.x + 30) % 100}%`,
                  `${pos.x}%`
                ],
                y: [
                  `${pos.y}%`, 
                  `${(pos.y + 20) % 100}%`,
                  `${pos.y}%`
                ],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ 
                duration: 20 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}

      {/* Logo - Top Left - Desktop only */}
      <div className="absolute top-6 left-6 z-30 hidden md:flex items-center gap-2">
        <Image
          src="/assets/logo.png"
          alt="Taboo Talks Logo"
          width={240}
          height={60}
          className="object-contain"
          priority
        />
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-3 md:p-4">
        <div className="w-full max-w-4xl lg:max-w-5xl flex flex-col md:flex-row items-stretch">
          
          {/* MOBILE: SVG Display (Top) */}
          <div className="md:hidden w-full mb-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
              <div className="relative w-32 h-32 mx-auto mb-3">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-28 h-28">
                    <Image
                      src={currentIllustration.image}
                      alt={currentIllustration.title}
                      fill
                      className="object-contain"
                      sizes="112px"
                      priority
                    />
                  </div>
                </div>
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="absolute inset-0 rounded-full"
                  style={{ 
                    backgroundColor: `${currentIllustration.color}10`,
                    border: `2px dashed ${currentIllustration.color}30`
                  }}
                />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold mb-1" style={{ color: currentIllustration.color }}>
                  {currentIllustration.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {currentIllustration.description}
                </p>
              </div>
            </div>
          </div>

          {/* LEFT SIDE: FORM - Made smaller */}
          <div className="w-full  md:w-2/5 lg:w-5/12 ">
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm bg-white/95 border border-gray-200">
              <div className="relative z-10">
                {/* Logo - Mobile & Desktop */}
                <div className="flex items-center justify-center p-6 pb-4">
                  <Image
                    src="/assets/logo2.png"
                    alt="Taboo Talks Logo"
                    width={140} 
                    height={40}
                    className="object-contain"
                    priority
                  />
                </div>
                
                {/* Progress Bar */}
                <div className="px-6 pb-2">
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb]"
                      initial={{ width: 0 }}
                      animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 text-center mt-2 font-medium">
                    {step + 1}/{totalSteps} Questions
                  </p>
                </div>

                {/* Step Content - Adjusted height */}
                <div className="h-[58vh] md:h-[480px] overflow-y-auto px-6 pb-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={stepVariants}
                    >
                      {/* Step 0: Welcome */}
                  {step === 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-center"
                    >
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Welcome to Taboo Talks!</h3>
                      <p className="text-gray-600 mb-6 px-2 text-sm md:text-base">Your story begins here. Complete a quick quiz to discover connections that truly resonate with you.</p>
                      
                      {/* Active Users Display */}
                      <div className="bg-gray-50 rounded-2xl p-4 md:p-5 mb-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-center mb-3">
                          <div className="flex -space-x-3 md:-space-x-4">
                            {[0, 1, 2, 3, 4].map((idx) => (
                              <motion.div
                                key={idx}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3 + (idx * 0.1), type: "spring", damping: 15 }}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 md:border-3 border-white overflow-hidden shadow-md"
                                style={{ zIndex: 5 - idx }}
                              >
                                <Image
                                  src={allImages[idx]} 
                                  alt="" 
                                  width={320}
                                  height={240}
                                  className="w-full h-full object-cover"
                                />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                        >
                          <p className="text-base md:text-lg font-bold text-gray-900">50,000+ Active Users</p>
                          <p className="text-xs md:text-sm text-gray-600">Join the community today</p>
                        </motion.div>
                      </div>
                      
                      <motion.button
                        onClick={handleNext}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-[#ff2e2e] text-white font-bold py-3 md:py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 text-sm md:text-base"
                      >
                        <span>Let&apos;s go!</span>
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                      </motion.button>
                    </motion.div>
                  )}

                      {/* Step 1: Gender Preference */}
                      {step === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-2">
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 text-center">Who would you like to date?</h3>
                          <div className="space-y-2">
                            {['Men', 'Women', 'Both'].map((gender) => (
                              <motion.button
                                key={gender}
                                onClick={() => setFormData({ ...formData, gender: gender.toLowerCase() })}
                                className={`w-full border-red-300 border-2 py-3 rounded-full font-semibold transition-all flex items-center justify-center text-sm ${
                                  formData.gender === gender.toLowerCase()
                                    ? 'bg-[#5e17eb] border-2 border-red-400 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                whileHover={{ scale: formData.gender !== gender.toLowerCase() ? 1.02 : 1 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {gender}
                              </motion.button>
                            ))}
                          </div>
                          <motion.button
                            onClick={handleNext}
                            disabled={!formData.gender}
                            className="w-full mt-4 bg-[#ff2e2e] text-white font-bold py-3 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            whileHover={{ scale: formData.gender ? 1.02 : 1 }}
                            whileTap={{ scale: formData.gender ? 0.98 : 1 }}
                          >
                            Continue
                          </motion.button>
                        </motion.div>
                      )}

                      {/* Step 2: Goals */}
                      {step === 2 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-2">
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 text-center">What is your goal here?</h3>
                          <p className="text-xs text-gray-500 text-center mb-3">Up to 3 answers possible</p>
                          <div className="flex flex-wrap gap-2 justify-center mb-4">
                            {['Chat', 'Find friends', 'Have fun', "I'm bored", 'Get attention', 'Meet people'].map((goal) => (
                              <motion.button
                                key={goal}
                                onClick={() => toggleGoal(goal)}
                                className={`px-3 py-1.5 border-2 border-red-300 rounded-full font-medium transition-all text-xs ${
                                  formData.goals.includes(goal)
                                    ? 'bg-[#5e17eb] text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {goal}
                              </motion.button>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <motion.button
                              onClick={handleSkip}
                              className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-full hover:bg-gray-50 transition-all text-sm"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Skip
                            </motion.button>
                            <motion.button
                              onClick={handleNext}
                              disabled={formData.goals.length === 0}
                              className="flex-1 bg-[#ff2e2e] text-white font-bold py-3 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                              whileHover={{ scale: formData.goals.length > 0 ? 1.02 : 1 }}
                              whileTap={{ scale: formData.goals.length > 0 ? 0.98 : 1 }}
                            >
                              Continue
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Bio */}
                      {step === 3 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-2">
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 text-center">Tell others about yourself</h3>
                          <p className="text-xs text-gray-400 text-center mb-3">Ex: I love watching football with friends.</p>
                          <div className="relative">
                            <textarea
                              value={formData.bio}
                              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                              placeholder="Write here..."
                              className="w-full h-24 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e17eb]/20 resize-none text-gray-900 shadow-sm text-sm"
                              maxLength={500}
                            />
                            {formData.bio.length > 0 && (
                              <div className="absolute right-3 bottom-3 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                                {formData.bio.length}/500
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 mt-4">
                            <motion.button
                              onClick={handleSkip}
                              className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-full hover:bg-gray-50 transition-all text-sm"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Skip
                            </motion.button>
                            <motion.button
                              onClick={handleNext}
                              className="flex-1 bg-[#ff2e2e] text-white font-bold py-3 rounded-full shadow-lg transition-all text-sm"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Continue
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 4: Profile Picture */}
                      {step === 4 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-2">
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 text-center">Add a profile picture</h3>
                          <p className="text-xs text-gray-500 text-center mb-3">Pictures get more attention!</p>
                          
                          <div className="flex justify-center mb-4">
                            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gray-100 flex items-center justify-center shadow-lg cursor-pointer relative group">
                              <label htmlFor="profile-pic" className="absolute inset-0 cursor-pointer flex items-center justify-center">
                                <div className="text-center">
                                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                                  <p className="text-xs text-gray-500 font-medium">Upload Photo</p>
                                </div>
                              </label>
                            </div>
                          </div>

                          <input
                            type="file"
                            id="profile-pic"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          
                          <div className="flex gap-2 mt-4">
                            <motion.button
                              onClick={handleSkip}
                              className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-full hover:bg-gray-50 transition-all text-sm"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Skip
                            </motion.button>
                            <motion.button
                              onClick={handleNext}
                              className="flex-1 bg-[#ff2e2e] text-white font-bold py-3 rounded-full shadow-lg transition-all text-sm"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Continue
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 5: Name */}
                      {step === 5 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-2">
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 text-center">What should we call you?</h3>
                          <div className="relative mb-3">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="e.g. Alex"
                              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5e17eb]/20 text-gray-900 text-sm"
                            />
                          </div>
                          <p className="text-xs text-gray-400 text-center mb-4">Can be changed anytime</p>
                          <motion.button
                            onClick={handleNext}
                            disabled={!formData.name}
                            className="w-full bg-[#ff2e2e] text-white font-bold py-3 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            whileHover={{ scale: formData.name ? 1.02 : 1 }}
                            whileTap={{ scale: formData.name ? 0.98 : 1 }}
                          >
                            Continue
                          </motion.button>
                        </motion.div>
                      )}

                      {/* Step 6: Email */}
                      {step === 6 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-2">
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 text-center">Your email address?</h3>
                          <div className="relative mb-3">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="alex@example.com"
                              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5e17eb]/20 text-gray-900 text-sm"
                            />
                          </div>
                          <p className="text-xs text-gray-400 text-center mb-4">Email used for account security</p>
                          <motion.button
                            onClick={handleNext}
                            disabled={!formData.email}
                            className="w-full bg-[#ff2e2e] text-white font-bold py-3 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            whileHover={{ scale: formData.email ? 1.02 : 1 }}
                            whileTap={{ scale: formData.email ? 0.98 : 1 }}
                          >
                            Continue
                          </motion.button>
                        </motion.div>
                      )}

                      {/* Step 7: Password */}
                      {step === 7 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-2">
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 text-center">Create password</h3>
                          <div className="relative mb-3">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              placeholder="Enter a strong password"
                              className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5e17eb]/20 text-gray-900 text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          
                          {formData.password && (
                            <div className="mb-3">
                              <div className="flex gap-1 mb-1">
                                <div className={`h-1 flex-1 rounded-full ${formData.password.length >= 3 ? 'bg-red-400' : 'bg-gray-200'}`}></div>
                                <div className={`h-1 flex-1 rounded-full ${formData.password.length >= 6 ? 'bg-orange-400' : 'bg-gray-200'}`}></div>
                                <div className={`h-1 flex-1 rounded-full ${formData.password.length >= 8 ? 'bg-yellow-400' : 'bg-gray-200'}`}></div>
                                <div className={`h-1 flex-1 rounded-full ${formData.password.length >= 10 ? 'bg-green-400' : 'bg-gray-200'}`}></div>
                              </div>
                              <p className="text-xs text-gray-500 text-right">
                                {formData.password.length < 6 ? 'Weak' : 
                                 formData.password.length < 8 ? 'Fair' :
                                 formData.password.length < 10 ? 'Good' : 'Strong'}
                              </p>
                            </div>
                          )}
                          
                          <p className="text-xs text-gray-400 text-center mb-4">Reset password anytime</p>
                          <motion.button
                            onClick={handleNext}
                            disabled={!formData.password || formData.password.length < 6}
                            className="w-full bg-[#ff2e2e] text-white font-bold py-3 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            whileHover={{ scale: formData.password && formData.password.length >= 6 ? 1.02 : 1 }}
                            whileTap={{ scale: formData.password && formData.password.length >= 6 ? 0.98 : 1 }}
                          >
                            Continue
                          </motion.button>
                        </motion.div>
                      )}

                      {/* Step 8: Final */}
                      {step === 8 && (
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }}
                          className="py-2 text-center"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 12 }}
                            className="w-12 h-12 bg-[#ff2e2e] rounded-full flex items-center justify-center mx-auto mb-3"
                          >
                            <Sparkles className="w-6 h-6 text-white" />
                          </motion.div>
                          
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">You&apos;re all set!</h3>
                          <p className="text-gray-600 mb-4 text-sm">How our platform works:</p>
                          
                          <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left space-y-3 shadow-sm border border-gray-100">
                            <div className="flex items-start gap-2">
                              <div className="w-6 h-6 bg-[#ff2e2e] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">1</span>
                              </div>
                              <p className="text-xs text-gray-700">Free registration. Premium features require credits.</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-6 h-6 bg-[#5e17eb] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">2</span>
                              </div>
                              <p className="text-xs text-gray-700">Safe platform. We can&apos;t guarantee conversation outcomes.</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-6 h-6 bg-[#ff2e2e] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">3</span>
                              </div>
                              <p className="text-xs text-gray-700">Privacy first. Report inappropriate behavior.</p>
                            </div>
                          </div>

                          <motion.button
                            onClick={() => {
                              alert('Account created successfully! Welcome to TabooTalks!');
                            }}
                            className="w-full bg-[#ff2e2e] text-white font-bold py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Heart className="w-4 h-4" />
                            <span>Start Meeting People</span>
                          </motion.button>
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: SVG ILLUSTRATION - Desktop only, larger */}
          <div className="hidden md:flex md:w-3/5 lg:w-7/12 items-center justify-center p-6 lg:p-8 bg-white/80 rounded-3xl border-red-400 border-solid border-2 ml-4">
            <div className="relative w-full h-full max-w-xl">
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full flex flex-col items-center justify-center"
              >
                {/* Large SVG Illustration */}
                <div className="relative w-64 h-64 lg:w-80 lg:h-80 mb-6">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-56 h-56 lg:w-72 lg:h-72">
                      <Image
                        src={currentIllustration.image}
                        alt={currentIllustration.title}
                        fill
                        className="object-contain drop-shadow-2xl"
                        priority
                        sizes="(max-width: 1024px) 224px, 288px"
                      />
                    </div>
                  </div>
                  
                  {/* Animated background ring */}
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute inset-0 rounded-full"
                    style={{ 
                      backgroundColor: `${currentIllustration.color}08`,
                      border: `3px dashed ${currentIllustration.color}40`
                    }}
                  />
                </div>

                {/* Text Content */}
                <div className="text-center max-w-md">
                  <motion.h2
                    key={`title-${step}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl lg:text-4xl font-bold mb-3"
                    style={{ color: currentIllustration.color }}
                  >
                    {currentIllustration.title}
                  </motion.h2>
                  <motion.p
                    key={`desc-${step}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-600 text-lg lg:text-xl mb-6"
                  >
                    {currentIllustration.description}
                  </motion.p>

                  {/* Progress indicator */}
                  <div className="flex justify-center gap-2 mb-8">
                    {Array.from({ length: totalSteps }).map((_, idx) => (
                      <motion.div
                        key={idx}
                        animate={{ 
                          scale: idx === step ? 1.3 : 1,
                          backgroundColor: idx === step ? currentIllustration.color : '#e5e7eb'
                        }}
                        className="w-2.5 h-2.5 rounded-full transition-all"
                      />
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold" style={{ color: currentIllustration.color }}>50K+</div>
                      <div className="text-sm text-gray-500">Active Users</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold" style={{ color: currentIllustration.color }}>99%</div>
                      <div className="text-sm text-gray-500">Satisfied</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold" style={{ color: currentIllustration.color }}>24/7</div>
                      <div className="text-sm text-gray-500">Support</div>
                    </div>
                  </div>
                </div>

                {/* Step indicator */}
                <div className="absolute top-4 right-4">
                  <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
                    <span className="text-sm font-medium text-gray-700">Step {step + 1}/{totalSteps}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupWizard;