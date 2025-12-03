'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Gift, Sparkles, Camera, Upload, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const SignupWizard = () => {
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [formData, setFormData] = useState({
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
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize(); // Set initial value
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

  const toggleGoal = (goal) => {
    if (formData.goals.includes(goal)) {
      setFormData({ ...formData, goals: formData.goals.filter(g => g !== goal) });
    } else {
      if (formData.goals.length < 3) {
        setFormData({ ...formData, goals: [...formData.goals, goal] });
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const modalVariants = {
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

  // Different row configurations based on screen size
  const getRowCount = () => windowWidth < 768 ? 3 : 4;

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      {/* Animated Masonry Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Row 1 - Moving Left */}
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
                    <img 
                      src={allImages[(setIdx * 4 + imgIdx) % allImages.length]} 
                      alt="" 
                      className="w-full h-full object-cover rounded-lg opacity-80"
                    />
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Row 2 - Moving Right */}
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
                    <img 
                      src={allImages[(setIdx * 4 + imgIdx + 5) % allImages.length]} 
                      alt="" 
                      className="w-full h-full object-cover rounded-lg opacity-80"
                    />
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Row 3 - Moving Left */}
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
                    <img 
                      src={allImages[(setIdx * 4 + imgIdx + 10) % allImages.length]} 
                      alt="" 
                      className="w-full h-full object-cover rounded-lg opacity-80"
                    />
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Row 4 - Moving Right */}
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
                    <img 
                      src={allImages[(setIdx * 4 + imgIdx + 15) % allImages.length]} 
                      alt="" 
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

      {/* Animated Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-red-500 opacity-30"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              x: [
                Math.random() * 100 + "%", 
                Math.random() * 100 + "%",
                Math.random() * 100 + "%"
              ],
              y: [
                Math.random() * 100 + "%", 
                Math.random() * 100 + "%",
                Math.random() * 100 + "%"
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

      {/* Logo - Top Left - Only visible on desktop */}
      <div className="absolute top-6 left-6 z-30 hidden md:flex items-center gap-2">
        <Image
          src="/assets/logo.png"
          alt="Taboo Talks Logo"
          width={240}
          height={60}
          className="object-contain"
        />
      </div>

      {/* Wizard Modal */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden backdrop-blur-sm bg-white/95"
          >
            {/* Modal Header with Progress */}
            <div className="p-6 pb-4">
              {/* Logo - Centered - Visible on all devices */}
              <div className="flex items-center justify-center mb-4">
                <Image
                  src="/assets/logo2.png"
                  alt="Taboo Talks Logo"
                  width={200}
                  height={60}
                  className="object-contain"
                />
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb]"
                  initial={{ width: 0 }}
                  animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-sm text-gray-500 text-center mt-2 font-medium">{step + 1}/{totalSteps} Questions</p>
            </div>

            {/* Step Content */}
            <div className="px-6 pb-6">
              {/* Step 0: Welcome */}
              {step === 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center py-8"
                >
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">Welcome to Taboo Talks!</h3>
                  <p className="text-gray-600 mb-8 px-2">Your story begins here. Complete a quick quiz to discover connections that truly resonate with you.</p>
                  
                  {/* Active Users Display */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-8 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-center mb-3">
                      <div className="flex -space-x-4">
                        {[0, 1, 2, 3, 4].map((idx) => (
                          <motion.div
                            key={idx}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 + (idx * 0.1), type: "spring", damping: 15 }}
                            className="w-14 h-14 rounded-full border-4 border-white overflow-hidden shadow-md"
                            style={{ zIndex: 5 - idx }}
                          >
                            <img 
                              src={allImages[idx]} 
                              alt="" 
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
                      <p className="text-lg font-bold text-gray-900">50,000+ Active Users</p>
                      <p className="text-sm text-gray-600">Join the community today</p>
                    </motion.div>
                  </div>
                  
                  <motion.button
                    onClick={handleNext}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#ff2e2e] text-white font-bold py-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Let's go!</span>
                    <motion.svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </motion.svg>
                  </motion.button>
                </motion.div>
              )}

              {/* Step 1: Gender Preference */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Who would you like to date?</h3>
                  <div className="space-y-3">
                    <motion.button
                      onClick={() => setFormData({ ...formData, gender: 'men' })}
                      className={`w-full py-4 rounded-full font-semibold transition-all flex items-center justify-center ${
                        formData.gender === 'men'
                          ? 'bg-[#5e17eb] text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: formData.gender !== 'men' ? 1.02 : 1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Men
                    </motion.button>
                    <motion.button
                      onClick={() => setFormData({ ...formData, gender: 'women' })}
                      className={`w-full py-4 rounded-full font-semibold transition-all flex items-center justify-center ${
                        formData.gender === 'women'
                          ? 'bg-[#5e17eb] text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: formData.gender !== 'women' ? 1.02 : 1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Women
                    </motion.button>
                    <motion.button
                      onClick={() => setFormData({ ...formData, gender: 'both' })}
                      className={`w-full py-4 rounded-full font-semibold transition-all flex items-center justify-center ${
                        formData.gender === 'both'
                          ? 'bg-[#5e17eb] text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: formData.gender !== 'both' ? 1.02 : 1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Both
                    </motion.button>
                  </div>
                  <motion.button
                    onClick={handleNext}
                    disabled={!formData.gender}
                    className="w-full mt-6 bg-[#ff2e2e] text-white font-bold py-4 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: formData.gender ? 1.02 : 1 }}
                    whileTap={{ scale: formData.gender ? 0.98 : 1 }}
                  >
                    Continue
                  </motion.button>
                </motion.div>
              )}

              {/* Step 2: Goals */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">What is your goal here?</h3>
                  <p className="text-sm text-gray-500 text-center mb-6">Up to 3 answers possible</p>
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {['Chat', 'Find friends', 'Have fun', "I'm bored", 'Get attention', 'Meet people'].map((goal) => (
                      <motion.button
                        key={goal}
                        onClick={() => toggleGoal(goal)}
                        className={`px-4 py-2 rounded-full font-medium transition-all ${
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
                  <div className="flex gap-3">
                    <motion.button
                      onClick={handleSkip}
                      className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-4 rounded-full hover:bg-gray-50 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Skip
                    </motion.button>
                    <motion.button
                      onClick={handleNext}
                      disabled={formData.goals.length === 0}
                      className="flex-1 bg-[#ff2e2e] text-white font-bold py-4 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Tell others a bit about yourself</h3>
                  <p className="text-sm text-gray-400 text-center mb-6">Ex: I love my job, but for me there is nothing better than watching football with friends.</p>
                  <div className="relative">
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Write here..."
                      className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5e17eb]/20 resize-none text-gray-900 shadow-sm"
                    />
                    <motion.div 
                      className="absolute right-3 bottom-3 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: formData.bio.length > 0 ? 1 : 0 }}
                    >
                      {formData.bio.length}/500
                    </motion.div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <motion.button
                      onClick={handleSkip}
                      className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-4 rounded-full hover:bg-gray-50 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Skip
                    </motion.button>
                    <motion.button
                      onClick={handleNext}
                      className="flex-1 bg-[#ff2e2e] text-white font-bold py-4 rounded-full shadow-lg transition-all"
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Add a profile picture</h3>
                  <p className="text-sm text-gray-500 text-center mb-6">Profiles with pictures get significantly more attention!</p>
                  
                  <div className="flex justify-center mb-6">
                    {formData.profilePic ? (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#5e17eb] shadow-xl relative group"
                      >
                        <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                        <label
                          htmlFor="profile-pic"
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                        >
                          <Camera className="w-8 h-8 text-white" />
                        </label>
                      </motion.div>
                    ) : (
                      <motion.div 
                        className="w-40 h-40 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-lg cursor-pointer relative group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <label htmlFor="profile-pic" className="absolute inset-0 cursor-pointer flex items-center justify-center">
                          <div className="text-center">
                            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500 font-medium">Upload Photo</p>
                          </div>
                        </label>
                      </motion.div>
                    )}
                  </div>

                  <input
                    type="file"
                    id="profile-pic"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  <div className="flex gap-3 mt-6">
                    <motion.button
                      onClick={handleSkip}
                      className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-4 rounded-full hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Skip</span>
                    </motion.button>
                    <motion.button
                      onClick={handleNext}
                      className="flex-1 bg-[#ff2e2e] text-white font-bold py-4 rounded-full shadow-lg transition-all flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Continue</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Name */}
              {step === 5 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">What would you like to be called?</h3>
                  <div className="relative mb-3">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5e17eb]/20 text-gray-900"
                    />
                  </div>
                  <p className="text-xs text-gray-400 text-center mb-6">Can be changed at any time. We keep your data safe at all times!</p>
                  <motion.button
                    onClick={handleNext}
                    disabled={!formData.name}
                    className="w-full bg-[#ff2e2e] text-white font-bold py-4 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: formData.name ? 1.02 : 1 }}
                    whileTap={{ scale: formData.name ? 0.98 : 1 }}
                  >
                    Continue
                  </motion.button>
                </motion.div>
              )}

              {/* Step 6: Email */}
              {step === 6 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">What is your email address?</h3>
                  <div className="relative mb-3">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. alex@example.com"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5e17eb]/20 text-gray-900"
                    />
                  </div>
                  <p className="text-xs text-gray-400 text-center mb-6">We keep your information safe! Your email is only used for account creation and recovery.</p>
                  <motion.button
                    onClick={handleNext}
                    disabled={!formData.email}
                    className="w-full bg-[#ff2e2e] text-white font-bold py-4 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: formData.email ? 1.02 : 1 }}
                    whileTap={{ scale: formData.email ? 0.98 : 1 }}
                  >
                    Continue
                  </motion.button>
                </motion.div>
              )}

              {/* Step 7: Password */}
              {step === 7 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Create your password</h3>
                  <div className="relative mb-3">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter a strong password"
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5e17eb]/20 text-gray-900"
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </motion.button>
                  </div>
                  
                  {/* Password strength indicator */}
                  {formData.password && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-3"
                    >
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
                    </motion.div>
                  )}
                  
                  <p className="text-xs text-gray-400 text-center mb-6">You can reset your password with your email anytime</p>
                  <motion.button
                    onClick={handleNext}
                    disabled={!formData.password || formData.password.length < 6}
                    className="w-full bg-[#ff2e2e] text-white font-bold py-4 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: formData.password && formData.password.length >= 6 ? 1.02 : 1 }}
                    whileTap={{ scale: formData.password && formData.password.length >= 6 ? 0.98 : 1 }}
                  >
                    Continue
                  </motion.button>
                </motion.div>
              )}

              {/* Step 8: Final Info */}
              {step === 8 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="py-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="w-16 h-16 bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb] rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Sparkles className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">You're all set!</h3>
                  <p className="text-gray-600 mb-6">Before you continue, please briefly read how our platform works:</p>
                  
                  <motion.div 
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 text-left space-y-4 shadow-sm border border-gray-100"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      <p className="text-sm text-gray-700">Registration and browsing are free. Premium features like unlimited messaging require credits or a subscription.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm font-bold">2</span>
                      </div>
                      <p className="text-sm text-gray-700">We provide a safe communication platform but cannot guarantee the outcome of your conversations.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm font-bold">3</span>
                      </div>
                      <p className="text-sm text-gray-700">Your privacy and safety are our priority. Report any inappropriate behavior immediately.</p>
                    </div>
                  </motion.div>

                  <motion.button
                    onClick={() => {
                      alert('Account created successfully! Welcome to TabooTalks!');
                    }}
                    className="w-full bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb] text-white font-bold py-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Heart className="w-5 h-5" />
                    <span>Start Meeting People</span>
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignupWizard;