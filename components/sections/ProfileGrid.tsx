// components/sections/ProfileGrid.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, MapPin, Sparkles, Star, Camera, MessageCircle } from 'lucide-react';

interface ProfileGridProps {
  onGetStarted?: () => void;
}

const ProfileCard = ({ 
  image, 
  name, 
  age, 
  location, 
  index,
  interest,
  height
}: { 
  image: string; 
  name: string; 
  age: number; 
  location: string;
  index: number;
  interest: string;
  height: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.05 }}
    whileHover={{ y: -8, scale: 1.02 }}
    className={`relative overflow-hidden rounded-2xl shadow-xl group cursor-pointer ${height}`}
  >
    <div className="relative w-full h-full">
      <Image
        src={image}
        alt={name}
        fill
        style={{ objectFit: 'cover' }}
        className="transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Modern gradient overlay - darker at bottom, subtle at top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300"></div>
      
      {/* Top badges */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        {/* Online indicator */}
        <motion.div 
          className="flex items-center gap-1.5 bg-green-500/90 backdrop-blur-sm rounded-full px-3 py-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: index * 0.05 + 0.3 }}
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-white rounded-full"
          />
          <span className="text-white text-xs font-semibold">Online</span>
        </motion.div>

        {/* Interest badge */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 + 0.4 }}
          className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5"
        >
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-white text-xs font-medium">{interest}</span>
        </motion.div>
      </div>
      
      {/* Profile info - bottom section */}
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.05 + 0.5 }}
          className="space-y-3"
        >
          <div>
            <h3 className="text-2xl font-bold mb-1">{name}, {age}</h3>
            <div className="flex items-center gap-1.5 text-white/90">
              <MapPin className="w-4 h-4" />
              <p className="text-sm">{location}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl py-2.5 flex items-center justify-center gap-2 font-semibold text-sm shadow-lg"
            >
              <Heart className="w-4 h-4" />
              Like
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}

              className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5 flex items-center justify-center"
            >
              <MessageCircle className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-pink-500/0 via-purple-500/0 to-pink-500/0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
    </div>
  </motion.div>
);
const handleGetStarted = () => {
  window.location.href = '/signup';
};

const ProfileGrid: React.FC<ProfileGridProps> = ({ onGetStarted }) => {
  // Masonry layout profiles with varied heights and diverse images
  const profiles = [
    { id: 1, name: "Sophia", age: 28, location: "New York", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400", interest: "Art Lover", height: "h-[400px]" },
    { id: 2, name: "James", age: 32, location: "Los Angeles", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", interest: "Fitness", height: "h-[500px]" },
    { id: 3, name: "Emma", age: 24, location: "Chicago", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400", interest: "Traveler", height: "h-[450px]" },
    { id: 4, name: "Michael", age: 29, location: "Miami", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", interest: "Foodie", height: "h-[380px]" },
    { id: 5, name: "Olivia", age: 26, location: "Seattle", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400", interest: "Musician", height: "h-[520px]" },
    { id: 6, name: "David", age: 31, location: "Austin", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400", interest: "Tech Geek", height: "h-[420px]" },
    { id: 7, name: "Ava", age: 25, location: "Boston", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400", interest: "Dancer", height: "h-[480px]" },
    { id: 8, name: "Daniel", age: 27, location: "Denver", image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400", interest: "Adventurer", height: "h-[440px]" },
    { id: 9, name: "Isabella", age: 23, location: "Portland", image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400", interest: "Bookworm", height: "h-[390px]" },
    { id: 10, name: "Alex", age: 30, location: "Phoenix", image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400", interest: "Gamer", height: "h-[460px]" },
    { id: 11, name: "Mia", age: 27, location: "Nashville", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400", interest: "Singer", height: "h-[500px]" },
    { id: 12, name: "Ryan", age: 28, location: "San Diego", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400", interest: "Surfer", height: "h-[430px]" },
  ];
  
  return (
    <section className="relative py-24 px-4 bg-gradient-to-b from-purple-50/30 via-white to-pink-50/30 overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            y: [0, 40, 0],
            x: [0, -25, 0],
            rotate: [0, -15, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 right-16 w-96 h-96 bg-gradient-to-br from-purple-300/20 to-blue-300/20 rounded-full blur-3xl"
        />
        
        {/* Floating hearts */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -120],
              opacity: [0, 1, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeOut"
            }}
            className="absolute"
            style={{
              left: `${10 + i * 8}%`,
              bottom: '5%',
            }}
          >
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400/50" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.span 
              className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4" />
              DISCOVER AMAZING PEOPLE
            </motion.span>
            
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect with <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">Real People</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our diverse community of interesting individuals from around the world, all ready for meaningful conversations
            </p>
          </motion.div>
        </div>
        
        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {profiles.map((profile, index) => (
            <div key={profile.id} className="break-inside-avoid">
              <ProfileCard 
                image={profile.image}
                name={profile.name}
                age={profile.age}
                location={profile.location}
                interest={profile.interest}
                height={profile.height}
                index={index}
              />
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="inline-block">
            <motion.div
              className="mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Camera className="w-12 h-12 mx-auto text-pink-600" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to Meet Someone Special?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Join now and get 10 free credits to start chatting!
            </p>
            <motion.button
              onClick={onGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 mx-auto"
            >
              <Heart className="w-5 h-5" />
              Join Now & Start Chatting
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProfileGrid;