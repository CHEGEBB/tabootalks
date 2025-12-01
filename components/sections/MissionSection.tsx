// components/sections/MissionSection.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

const MissionSection: React.FC = () => {
  return (
    <section id="mission" className="py-24 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-3xl overflow-hidden shadow-xl relative"
        >
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#ff2e2e]/10 rounded-full filter blur-xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#5e17eb]/10 rounded-full filter blur-xl"></div>
          
          <div className="p-12 md:p-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="inline-block px-4 py-1 bg-[#ff2e2e] text-white rounded-full text-sm font-medium mb-6">
                OUR MISSION
              </span>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                Bringing back the art of meaningful connection
              </h2>
              
              <div className="text-lg text-gray-200 space-y-6 leading-relaxed">
                <p>
                  We created TabooTalks because we believe that connecting with others shouldn't 
                  feel like a chore or a gamble. In today's digital world, genuine conversations 
                  have become rare, replaced by endless swiping and superficial interactions.
                </p>
                
                <p>
                  Our mission is simple: create a space where meaningful conversations can flourish 
                  without pressure or pretense. A place where you can be yourself and connect with 
                  others who appreciate authentic interaction.
                </p>
                
                <p>
                  We've stripped away the noise and built a platform where the focus is on what 
                  truly matters – the connection between two people who want to talk, share, and 
                  possibly create something special together.
                </p>
              </div>
              
              <div className="mt-10">
                <Button 
                  variant="secondary" 
                  className="bg-white text-[#1a1a1a] hover:bg-white/90"
                >
                  Learn more about our story
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionSection;