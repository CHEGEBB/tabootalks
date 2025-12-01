// components/sections/InfiniteProfileScroll.tsx
'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Sample profiles (replace with your actual data)
const profiles1 = [
  { id: 1, name: 'Emma', image: 'https://source.unsplash.com/random/300x400?woman=1' },
  { id: 2, name: 'Sophia', image: 'https://source.unsplash.com/random/300x400?woman=2' },
  { id: 3, name: 'Olivia', image: 'https://source.unsplash.com/random/300x400?woman=3' },
  { id: 4, name: 'Ava', image: 'https://source.unsplash.com/random/300x400?woman=4' },
  { id: 5, name: 'Isabella', image: 'https://source.unsplash.com/random/300x400?woman=5' },
  { id: 6, name: 'Mia', image: 'https://source.unsplash.com/random/300x400?woman=6' },
  { id: 7, name: 'Charlotte', image: 'https://source.unsplash.com/random/300x400?woman=7' },
  { id: 8, name: 'Amelia', image: 'https://source.unsplash.com/random/300x400?woman=8' },
];

const profiles2 = [
  { id: 9, name: 'Harper', image: 'https://source.unsplash.com/random/300x400?woman=9' },
  { id: 10, name: 'Evelyn', image: 'https://source.unsplash.com/random/300x400?woman=10' },
  { id: 11, name: 'Abigail', image: 'https://source.unsplash.com/random/300x400?woman=11' },
  { id: 12, name: 'Emily', image: 'https://source.unsplash.com/random/300x400?woman=12' },
  { id: 13, name: 'Elizabeth', image: 'https://source.unsplash.com/random/300x400?woman=13' },
  { id: 14, name: 'Sofia', image: 'https://source.unsplash.com/random/300x400?woman=14' },
  { id: 15, name: 'Avery', image: 'https://source.unsplash.com/random/300x400?woman=15' },
  { id: 16, name: 'Ella', image: 'https://source.unsplash.com/random/300x400?woman=16' },
];

const ProfileItem = ({ name, image }: { name: string, image: string }) => (
  <div className="relative flex-shrink-0 mx-3 w-48 h-64 rounded-xl overflow-hidden group">
    <div className="h-full w-full relative">
      <Image
        src={image}
        alt={name}
        fill
        style={{ objectFit: 'cover' }}
        className="transition-transform duration-300 group-hover:scale-110"
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60"></div>
      
      {/* Profile info */}
      <div className="absolute bottom-0 left-0 w-full p-3">
        <h3 className="text-white font-medium text-lg">{name}</h3>
      </div>
      
      {/* Online indicator */}
      <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-green-500">
        <motion.div
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-green-500 rounded-full opacity-60"
        />
      </div>
    </div>
  </div>
);

const InfiniteProfileScroll: React.FC = () => {
  return (
    <section id="community" className="py-20 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Meet our vibrant community
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Thousands of interesting people are waiting to connect with you
          </p>
        </motion.div>
      </div>

      {/* First row - scrolling left to right */}
      <motion.div 
        className="flex py-4"
        animate={{ x: [0, -1920] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 40,
          ease: "linear"
        }}
      >
        {[...profiles1, ...profiles1].map((profile, index) => (
          <ProfileItem key={`${profile.id}-${index}`} name={profile.name} image={profile.image} />
        ))}
      </motion.div>

      {/* Second row - scrolling right to left */}
      <motion.div 
        className="flex py-4"
        animate={{ x: [-1920, 0] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 40,
          ease: "linear"
        }}
      >
        {[...profiles2, ...profiles2].map((profile, index) => (
          <ProfileItem key={`${profile.id}-${index}`} name={profile.name} image={profile.image} />
        ))}
      </motion.div>
    </section>
  );
};

export default InfiniteProfileScroll;