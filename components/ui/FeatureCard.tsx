// components/ui/FeatureCard.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: 'red' | 'purple' | 'blue' | 'green';
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  color = 'red',
  delay = 0
}) => {
  const gradients = {
    red: 'from-[#ff2e2e] to-[#ff6b6b]',
    purple: 'from-[#5e17eb] to-[#9170ff]',
    blue: 'from-[#2e95ff] to-[#6bb5ff]',
    green: 'from-[#10b981] to-[#4ade80]'
  };

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: delay,
        type: "spring",
        stiffness: 100
      }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.03 }}
      className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-300"
    >
      <div className={`w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br ${gradients[color]} flex items-center justify-center shadow-lg`}>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.5 }}
        >
          {icon}
        </motion.div>
      </div>
      
      <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
      
      <div className="mt-6 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full bg-gradient-to-r ${gradients[color]}`}
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          transition={{ duration: 1.5, delay: delay + 0.3 }}
          viewport={{ once: true }}
        />
      </div>
    </motion.div>
  );
};

export default FeatureCard;