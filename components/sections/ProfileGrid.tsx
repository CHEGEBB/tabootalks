// components/sections/ProfileGrid.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Button from '../ui/Button';

interface ProfileGridProps {
  onGetStarted?: () => void;
}

const ProfileCard = ({ 
  image, 
  name, 
  age, 
  location, 
  index 
}: { 
  image: string; 
  name: string; 
  age: number; 
  location: string;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ y: -10 }}
    className="relative overflow-hidden rounded-xl shadow-lg group"
  >
    <div className="aspect-[3/4] relative">
      <Image
        src={image}
        alt={name}
        fill
        style={{ objectFit: 'cover' }}
        className="transition-transform duration-500 group-hover:scale-110"
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
      
      {/* Online indicator */}
      <motion.div 
        className="absolute top-3 right-3 w-3 h-3 rounded-full bg-green-500"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-green-500 rounded-full opacity-60"
        />
      </motion.div>
      
      {/* Profile info */}
      <div className="absolute bottom-0 left-0 w-full p-4 text-white">
        <div className="space-y-1">
          <h3 className="text-xl font-bold">{name}, {age}</h3>
          <p className="text-sm text-white/80">{location}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const ProfileGrid: React.FC<ProfileGridProps> = ({ onGetStarted }) => {
  // Sample profiles (replace with your actual data)
  const profiles = [
    { id: 1, name: "Sophia", age: 28, location: "New York", image: "https://source.unsplash.com/random/300x400?woman=1" },
    { id: 2, name: "Emma", age: 24, location: "Los Angeles", image: "https://source.unsplash.com/random/300x400?woman=2" },
    { id: 3, name: "Olivia", age: 26, location: "Chicago", image: "https://source.unsplash.com/random/300x400?woman=3" },
    { id: 4, name: "Ava", age: 25, location: "Miami", image: "https://source.unsplash.com/random/300x400?woman=4" },
    { id: 5, name: "Isabella", age: 27, location: "Seattle", image: "https://source.unsplash.com/random/300x400?woman=5" },
    { id: 6, name: "Mia", age: 23, location: "Austin", image: "https://source.unsplash.com/random/300x400?woman=6" },
    { id: 7, name: "Charlotte", age: 29, location: "Boston", image: "https://source.unsplash.com/random/300x400?woman=7" },
    { id: 8, name: "Amelia", age: 25, location: "San Francisco", image: "https://source.unsplash.com/random/300x400?woman=8" },
  ];
  
  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1 bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb] text-white rounded-full text-sm font-medium mb-4">
              DISCOVER
            </span>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Amazing people waiting to connect
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our diverse community of interesting individuals ready for meaningful conversations
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {profiles.map((profile, index) => (
            <ProfileCard 
              key={profile.id}
              image={profile.image}
              name={profile.name}
              age={profile.age}
              location={profile.location}
              index={index}
            />
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb] text-white px-8 py-3"
          >
            Join Now to Discover More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProfileGrid;