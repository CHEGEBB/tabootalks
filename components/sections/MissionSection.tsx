'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Users } from 'lucide-react';
import Image from 'next/image';

const MissionSection: React.FC = () => {
  return (
    <section id="mission" className="relative py-32 px-4 overflow-hidden bg-gray-100">

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Intro text before mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-5 py-2 bg-gradient-to-r from-red-600 to-purple-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
            ABOUT US
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why We Built TabooTalks
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            In a world full of superficial connections, we wanted to create something real
          </p>
        </motion.div>

        {/* Mission content - Text on left, floating person on right */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Mission text (no card) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            {/* Mission heading */}
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Our Mission
              </h3>
              <div className="w-24 h-1.5 bg-gradient-to-r from-red-500 to-purple-600 rounded-full"></div>
            </div>

            {/* Mission paragraphs */}
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p className="text-xl text-gray-900 font-medium">
                Bringing back the art of meaningful connection
              </p>
              
              <p>
                We created TabooTalks because we believe that connecting with others shouldn&apos;t 
                feel like a chore or a gamble. In today&apos;s digital world, genuine conversations 
                have become rare, replaced by endless swiping and superficial interactions.
              </p>
              
              <p>
                Our mission is simple: create a space where meaningful conversations can flourish 
                without pressure or pretense. A place where you can be yourself and connect with 
                others who appreciate authentic interaction.
              </p>
              
              <p>
                We&apos;ve stripped away the noise and built a platform where the focus is on what 
                truly matters – the connection between two people who want to talk, share, and 
                possibly create something special together.
              </p>
            </div>

            {/* Mission values/icons */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-2xl flex items-center justify-center mb-3">
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-gray-900 font-semibold text-sm">Authentic</p>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-2xl flex items-center justify-center mb-3">
                  <MessageCircle className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-gray-900 font-semibold text-sm">Engaging</p>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-2xl flex items-center justify-center mb-3">
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-gray-900 font-semibold text-sm">Inclusive</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Floating person image pointing left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            {/* Decorative glow effects behind person */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-96 h-96 bg-gradient-to-br from-red-500/30 to-purple-600/30 rounded-full blur-3xl"
              />
            </div>

            {/* Floating person PNG - pointing to the left */}
            <motion.div
              animate={{ 
                y: [0, -20, 0],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10"
            >
              <Image
                src="/assets/mission.png" 
                alt="Person pointing to mission"
                width={500}
                height={600}
                className="w-full h-auto drop-shadow-2xl"
                style={{ transform: 'scaleX(1)' }} 
              />
            </motion.div>

            {/* Optional: Decorative circles/dots around the person */}
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute top-20 right-20 w-20 h-20 bg-red-500/20 rounded-full blur-xl"
            />
            
            <motion.div
              animate={{ 
                y: [0, 20, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-32 left-10 w-16 h-16 bg-purple-500/20 rounded-full blur-xl"
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default MissionSection;