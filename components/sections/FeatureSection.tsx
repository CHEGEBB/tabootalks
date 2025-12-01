// components/sections/FeatureSection.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Shield, Sparkles, Zap, Users } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "red" | "purple" | "blue" | "green";
}

interface FeatureSectionProps {
  features: Feature[];
}

const FeatureSection: React.FC<FeatureSectionProps> = ({ features }) => {
  const colorClasses = {
    red: {
      bg: "from-[#ff2e2e] to-[#ff6b6b]",
      light: "bg-[#ff2e2e]/10"
    },
    purple: {
      bg: "from-[#5e17eb] to-[#9170ff]",
      light: "bg-[#5e17eb]/10"
    },
    blue: {
      bg: "from-[#2e95ff] to-[#6bb5ff]",
      light: "bg-[#2e95ff]/10"
    },
    green: {
      bg: "from-[#10b981] to-[#4ade80]",
      light: "bg-[#10b981]/10"
    },
  };
  
  return (
    <section id="features" className="py-24 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1 bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb] text-white rounded-full text-sm font-medium mb-4">
              FEATURES
            </span>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What makes TabooTalks <span className="text-[#ff2e2e]">special</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience a new way to connect that prioritizes authentic conversations and meaningful interactions
            </p>
          </motion.div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br ${colorClasses[feature.color].bg}`}>
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {feature.icon}
                </motion.div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
              
              <div className="mt-8 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full bg-gradient-to-r ${colorClasses[feature.color].bg}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;