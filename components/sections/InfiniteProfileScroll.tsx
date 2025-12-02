'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Real diverse profiles with actual Unsplash images
const profiles1 = [
  { id: 1, name: 'Emma', age: 24, size: 'large', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop' },
  { id: 2, name: 'Sophia', age: 27, size: 'small', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=400&fit=crop' },
  { id: 3, name: 'Olivia', age: 23, size: 'medium', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=350&h=450&fit=crop' },
  { id: 4, name: 'Ava', age: 26, size: 'small', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=400&fit=crop' },
  { id: 5, name: 'Isabella', age: 25, size: 'large', image: 'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=400&h=500&fit=crop' },
  { id: 6, name: 'Mia', age: 28, size: 'medium', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=350&h=450&fit=crop' },
  { id: 7, name: 'Charlotte', age: 24, size: 'small', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=400&fit=crop' },
  { id: 8, name: 'Amelia', age: 29, size: 'large', image: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=500&fit=crop' },
];

const profiles2 = [
  { id: 9, name: 'Harper', age: 22, size: 'medium', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=350&h=450&fit=crop' },
  { id: 10, name: 'Evelyn', age: 26, size: 'small', image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=300&h=400&fit=crop' },
  { id: 11, name: 'Abigail', age: 25, size: 'large', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop' },
  { id: 12, name: 'Emily', age: 27, size: 'medium', image: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=350&h=450&fit=crop' },
  { id: 13, name: 'Elizabeth', age: 23, size: 'small', image: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=300&h=400&fit=crop' },
  { id: 14, name: 'Sofia', age: 28, size: 'large', image: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=400&h=500&fit=crop' },
  { id: 15, name: 'Avery', age: 24, size: 'medium', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=350&h=450&fit=crop' },
  { id: 16, name: 'Ella', age: 26, size: 'small', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop' },
];

const profiles3 = [
  { id: 17, name: 'Scarlett', age: 25, size: 'large', image: 'https://images.unsplash.com/photo-1504439904031-93ded9f93e4e?w=400&h=500&fit=crop' },
  { id: 18, name: 'Luna', age: 22, size: 'small', image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=400&fit=crop' },
  { id: 19, name: 'Grace', age: 27, size: 'medium', image: 'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=350&h=450&fit=crop' },
  { id: 20, name: 'Chloe', age: 24, size: 'small', image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=400&fit=crop' },
  { id: 21, name: 'Aria', age: 23, size: 'large', image: 'https://images.unsplash.com/photo-1503104834685-7205e8607eb9?w=400&h=500&fit=crop' },
  { id: 22, name: 'Lily', age: 26, size: 'medium', image: 'https://images.unsplash.com/photo-1513721032312-6a18a42c8763?w=350&h=450&fit=crop' },
];

const getSizeClasses = (size: string) => {
  switch(size) {
    case 'small':
      return 'w-40 h-52';
    case 'large':
      return 'w-56 h-72';
    default:
      return 'w-48 h-64';
  }
};

const ProfileItem = ({ name, age, image, size }: { name: string, age: number, image: string, size: string }) => (
  <div className={`relative flex-shrink-0 mx-2 ${getSizeClasses(size)} rounded-2xl overflow-hidden group cursor-pointer`}>
    <div className="h-full w-full relative">
      <Image
        src={image}
        alt={name}
        fill
        style={{ objectFit: 'cover' }}
        className="transition-transform duration-500 group-hover:scale-110"
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300"></div>
      
      {/* Profile info */}
      <div className="absolute bottom-0 left-0 w-full p-4">
        <h3 className="text-white font-semibold text-xl mb-1">{name}, {age}</h3>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-green-400 text-xs font-medium">Online</span>
        </div>
      </div>
      
      {/* Online pulse indicator */}
      <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-green-500">
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-green-500 rounded-full"
        />
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  </div>
);

const InfiniteProfileScroll: React.FC = () => {
  return (
    <section id="profiles" className="py-24 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-4 px-4 py-2 bg-red-50 rounded-full">
            <span className="text-red-600 font-semibold text-sm uppercase tracking-wide">No Perfect Photo Needed</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Real conversations.<br />
            <span className="bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
              Zero judgment.
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Stop swiping through endless profiles looking for &ldquo;the one.&rdquo; Start meaningful conversations with interesting people who are actually here to talk. No ghosting. No filters. Just real connection.
          </p>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>250+ profiles online now</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <span>🔥</span>
              <span>Active conversations 24/7</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* First row - scrolling left to right */}
      <motion.div 
        className="flex py-3 mb-4"
        animate={{ x: [0, -2000] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 50,
          ease: "linear"
        }}
      >
        {[...profiles1, ...profiles1, ...profiles1].map((profile, index) => (
          <ProfileItem 
            key={`${profile.id}-${index}`} 
            name={profile.name} 
            age={profile.age}
            image={profile.image}
            size={profile.size}
          />
        ))}
      </motion.div>

      {/* Second row - scrolling right to left */}
      <motion.div 
        className="flex py-3 mb-4"
        animate={{ x: [-2000, 0] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 55,
          ease: "linear"
        }}
      >
        {[...profiles2, ...profiles2, ...profiles2].map((profile, index) => (
          <ProfileItem 
            key={`${profile.id}-${index}`} 
            name={profile.name} 
            age={profile.age}
            image={profile.image}
            size={profile.size}
          />
        ))}
      </motion.div>

      {/* Third row - scrolling left to right (slower) */}
      <motion.div 
        className="flex py-3"
        animate={{ x: [0, -2000] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 60,
          ease: "linear"
        }}
      >
        {[...profiles3, ...profiles3, ...profiles3].map((profile, index) => (
          <ProfileItem 
            key={`${profile.id}-${index}`} 
            name={profile.name} 
            age={profile.age}
            image={profile.image}
            size={profile.size}
          />
        ))}
      </motion.div>
    </section>
  );
};

export default InfiniteProfileScroll;