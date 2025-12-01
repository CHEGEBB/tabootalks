// components/ui/ProfileCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ProfileCardProps {
  imageSrc: string;
  name: string;
  age?: number;
  location?: string;
  delay?: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  imageSrc, 
  name, 
  age, 
  location,
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group relative overflow-hidden rounded-xl"
    >
      <div className="aspect-[3/4] relative overflow-hidden rounded-xl">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
        
        {/* Profile info */}
        <div className="absolute bottom-0 left-0 w-full p-4 text-white">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-1">{name}{age && `, ${age}`}</h3>
            {location && (
              <p className="text-white/80 text-sm">{location}</p>
            )}
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        className="absolute top-3 right-3 w-3 h-3 rounded-full bg-green-500"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ 
          duration: 0.4, 
          delay: delay + 0.3,
          type: "spring",
          stiffness: 300
        }}
        viewport={{ once: true }}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
          className="absolute inset-0 bg-green-500 rounded-full opacity-60"
        />
      </motion.div>
    </motion.div>
  );
};

export default ProfileCard;