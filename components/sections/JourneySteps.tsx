'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Heart, MessageCircle, Camera, Sparkles, Zap, Gift, Star, ChevronRight } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: <UserPlus className="w-6 h-6" />,
    title: "Sign Up & Get 10 Free Credits",
    description: "Join in seconds and start chatting immediately with your welcome bonus!",
    color: "from-pink-500 to-rose-500",
    side: "left"
  },
  {
    number: 2,
    icon: <Heart className="w-6 h-6" />,
    title: "Swipe & Match Your Vibe",
    description: "Browse through 250+ profiles and find someone who catches your eye.",
    color: "from-purple-500 to-indigo-500",
    side: "right"
  },
  {
    number: 3,
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Start the Conversation",
    description: "Break the ice with a message. Every chat is a new adventure waiting to happen!",
    color: "from-blue-500 to-cyan-500",
    side: "left"
  },
  {
    number: 4,
    icon: <Camera className="w-6 h-6" />,
    title: "Share Photos & Get Closer",
    description: "Spice things up! Exchange photos and make the conversation more personal.",
    color: "from-orange-500 to-red-500",
    side: "right"
  },
  {
    number: 5,
    icon: <Sparkles className="w-6 h-6" />,
    title: "Build Real Connections",
    description: "Keep the conversation flowing and create something special together.",
    color: "from-violet-500 to-purple-500",
    side: "left"
  }
];

const floatingCards = [
  { icon: <Zap className="w-5 h-5 text-yellow-500" />, text: "Instant Match", position: "top-10 left-8", delay: 0 },
  { icon: <Gift className="w-5 h-5 text-pink-500" />, text: "10 Free Credits", position: "top-24 right-12", delay: 0.5 },
  { icon: <Star className="w-5 h-5 text-purple-500" />, text: "250+ Profiles", position: "bottom-20 left-12", delay: 1 }
];

const JourneySteps: React.FC = () => {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-white via-pink-50/30 to-purple-50/30 overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated circles */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            x: [0, 15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[10%] w-48 h-48 bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            y: [0, 30, 0],
            x: [0, -20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 right-[15%] w-64 h-64 bg-gradient-to-br from-purple-300/20 to-blue-300/20 rounded-full blur-3xl"
        />
        
        {/* Floating small cards */}
        {floatingCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: [0, -10, 0],
            }}
            transition={{ 
              opacity: { delay: card.delay },
              y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: card.delay }
            }}
            className={`absolute ${card.position} bg-white rounded-xl shadow-lg p-3 flex items-center gap-2 border border-pink-100 hidden md:flex`}
          >
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-2">
              {card.icon}
            </div>
            <span className="text-xs font-semibold text-gray-800">{card.text}</span>
          </motion.div>
        ))}

        {/* Decorative hearts */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -80],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeOut"
            }}
            className="absolute hidden md:block"
            style={{
              left: `${15 + i * 14}%`,
              bottom: '10%',
            }}
          >
            <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full text-sm font-semibold mb-4 shadow-lg">
              YOUR JOURNEY
            </span>
            
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              5 Steps to <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">Amazing Chats</span>
            </h2>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your adventure starts here! Follow the path to exciting conversations
            </p>
          </motion.div>
        </div>

        {/* Vertical path with alternating steps */}
        <div className="relative pb-16">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 w-0.5 bg-gradient-to-b from-pink-300 via-purple-300 to-blue-300 rounded-full transform -translate-x-1/2 hidden md:block" style={{ height: 'calc(100% - 120px)' }}>
            <motion.div
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500 rounded-full"
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-12 md:space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: step.side === 'left' ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className={`relative flex items-center ${
                  step.side === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-col gap-6`}
              >
                {/* Branch line connecting to center */}
                <div className={`hidden md:block absolute top-1/2 ${
                  step.side === 'left' ? 'left-1/2' : 'right-1/2'
                } w-12 h-0.5 bg-gradient-to-r ${
                  step.side === 'left' ? 'from-purple-300 to-transparent' : 'from-transparent to-purple-300'
                }`} />

                {/* Central dot on the line */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  className={`hidden md:block absolute left-1/2 top-1/2 w-5 h-5 rounded-full bg-gradient-to-r ${step.color} transform -translate-x-1/2 -translate-y-1/2 border-4 border-white shadow-lg z-10`}
                />

                {/* Content card */}
                <div className="md:w-5/12 w-full">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className={`relative bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:border-pink-200 transition-all group`}
                  >
                    {/* Gradient background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />
                    
                    {/* Number badge */}
                    <div className={`absolute -top-3 ${step.side === 'left' ? '-right-3' : '-left-3'} w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white text-lg font-bold shadow-lg border-4 border-white`}>
                      {step.number}
                    </div>

                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r ${step.color} text-white flex items-center justify-center shadow-md`}>
                        {step.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pr-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>

                      {/* Chevron icon */}
                      <div className={`flex-shrink-0 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Empty space for the other side */}
                <div className="hidden md:block md:w-5/12" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex flex-col items-center text-center"
        >
          <div className="mb-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-2"
            >
              🎉
            </motion.div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Ready to Start Chatting?
          </h3>
          <p className="text-gray-600 text-base mb-6 max-w-md">
            Join thousands already having amazing conversations!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-bold text-base shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
          >
            Get Started Now
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default JourneySteps;