// components/sections/CTASection.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

interface CTASectionProps {
  onGetStarted?: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onGetStarted }) => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-white">
        {/* Dot pattern */}
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.1)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
        
        {/* Decorative shapes */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-red-500 opacity-10 rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500 opacity-10 rounded-full"></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-600 mb-6">
            Ready to start meaningful conversations?
          </h2>
          
          <p className="text-xl text-gray-500/90 mb-10">
            Join thousands who've already discovered the joy of authentic connection.
            Get started with 10 free credits today!
          </p>
          
          <Button 
            onClick={onGetStarted}
            className="bg-white text-[#5e17eb] hover:bg-white/90 text-lg px-10 py-4 shadow-xl"
          >
            Get Started Now
          </Button>
          
          <p className="mt-6 text-white/80 text-sm">
            No commitment required. Try it risk-free.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;