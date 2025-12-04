// app/main/people/page.tsx
'use client';

import { useState } from 'react';
import { Heart, MessageCircle, MoreVertical, MapPin, Camera, Gift, Star, ChevronLeft, ChevronRight, Share2, Flag, X, CheckCircle, User, Music, Book, ChefHat, Users, Mail, CreditCard, MessageSquare, ImageIcon, Bookmark, Share, ThumbsUp, Send, Users as UsersIcon, ChevronDown, ChevronUp, Menu, MessageSquareText } from 'lucide-react';
import Image from 'next/image';
import LayoutController from '@/components/layout/LayoutController';

// Profile Data
const profile = {
  id: 1,
  name: 'Moana',
  age: 18,
  location: 'Newrived',
  bio: 'Looking for meaningful connections and interesting conversations.',
  mainImage: 'https://images.unsplash.com/photo-1605434700731-331ca2458a77?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  photos: [
    'https://images.unsplash.com/photo-1605434700731-331ca2458a77?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1513551539666-4a67f09dc9ec?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=800&fit=crop',
  ],
  stats: {
    photos: 34,
    chats: 156,
    following: 89,
    posts: 3
  },
  interests: ['Music', 'Reading', 'Cooking'],
  lookingFor: ['I am bored', 'Finding a friend', 'Chatting', 'People Aged: 18 - 90'],
  personalityType: 'Travel Enthusiast',
  about: ['Honest', 'Fun', 'Humorous'],
  description: "I'm not in a hurry and I don't expect perfection. I just hope to find someone who is calm enough to listen, sincere enough to share, and patient enough to understand each other through everyday stories. If he also values simplicity and...",
  onlineNow: [
    { 
      id: 1, 
      name: 'Alexandra', 
      age: 41, 
      location: 'Phoenix, United States', 
      photos: 34,
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop'
    },
    { 
      id: 2, 
      name: 'Liliya', 
      age: 40, 
      location: 'Kiev, Ukraine', 
      photos: 22,
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop'
    },
    { 
      id: 3, 
      name: 'Ying', 
      age: 41, 
      location: 'Shanghai, China', 
      photos: 17,
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop'
    },
    { 
      id: 4, 
      name: 'Yuanping', 
      age: 62, 
      location: 'Beijing, China', 
      photos: 8,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop'
    },
  ],
  activity: {
    chats: 156,
    mail: 42,
    following: 89
  },
  isVerified: true,
  lastActive: '2 minutes ago'
};

// Posts Data
const posts = [
  {
    id: 1,
    content: 'Had an amazing time exploring the city today! Looking for someone to join me for coffee tomorrow ☕️',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    likes: 245,
    comments: 32,
    timeAgo: '2 hours ago',
    tags: ['Coffee', 'Explore', 'Fun'],
    isLiked: false
  },
  {
    id: 2,
    content: 'Music lover here! Currently listening to some chill vibes. What\'s your favorite genre? 🎵',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=800&fit=crop',
    likes: 189,
    comments: 45,
    timeAgo: '1 day ago',
    tags: ['Music', 'Chill', 'Vibes'],
    isLiked: false
  },
  {
    id: 3,
    content: 'Just finished reading an amazing book! Looking for book recommendations 📚',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=800&fit=crop',
    likes: 312,
    comments: 67,
    timeAgo: '3 days ago',
    tags: ['Books', 'Reading', 'Recommendations'],
    isLiked: false
  },
];

export default function PeoplePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [showCreditsPopup, setShowCreditsPopup] = useState(false);
  const [userPosts, setUserPosts] = useState(posts);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showMoreOnline, setShowMoreOnline] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handleLike = () => {
    setLiked(!liked);
  };

  const handlePostLike = (postId: number) => {
    setUserPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleChat = () => {
    alert(`Starting chat with ${profile.name}. This would open chat window.`);
  };

  const handleFollow = () => {
    alert(`Following ${profile.name}.`);
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % profile.photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + profile.photos.length) % profile.photos.length);
  };

  const visibleOnlineNow = showMoreOnline ? profile.onlineNow : profile.onlineNow.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <LayoutController />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Large Image + Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* LARGE IMAGE CONTAINER - SEPARATE */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="relative h-[500px] group">
                <Image
                  src={profile.photos[currentPhotoIndex]}
                  alt={`${profile.name} photo ${currentPhotoIndex + 1}`}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Photo Navigation */}
                {profile.photos.length > 1 && (
                  <>
                    <button 
                      onClick={prevPhoto}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={nextPhoto}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
                
                {/* Photo Counter */}
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  {currentPhotoIndex + 1} / {profile.photos.length}
                </div>
                
                {/* Action Buttons Over Image - Hover Effect */}
                <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={handleLike}
                    className="bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Heart className={`w-6 h-6 ${liked ? 'text-[#ff2e2e] fill-[#ff2e2e]' : ''}`} />
                  </button>
                  <button 
                    onClick={handleChat}
                    className="bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <MessageCircle className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={closeImageModal}
                    className="bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* PROFILE INFO CONTAINER - BELOW IMAGE */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-8">
                {/* Name and Location */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-4xl font-bold text-gray-900">
                        {profile.name}, {profile.age}
                      </h1>
                      {profile.isVerified && (
                        <CheckCircle className="w-7 h-7 text-blue-500 fill-blue-100" />
                      )}
                    </div>
                    <div className="flex items-center text-gray-600 mt-2">
                      <MapPin className="w-6 h-6 mr-3" />
                      <span className="text-xl">{profile.location}</span>
                    </div>
                  </div>
                  <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
                    <MoreVertical className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {/* Bio */}
                <p className="text-gray-700 mb-8 text-xl">{profile.bio}</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="text-3xl font-bold text-gray-900">{profile.stats.photos}</div>
                    <div className="text-gray-600">photos</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="text-3xl font-bold text-gray-900">{profile.stats.chats}</div>
                    <div className="text-gray-600">chats</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="text-3xl font-bold text-gray-900">{profile.stats.following}</div>
                    <div className="text-gray-600">following</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="text-3xl font-bold text-gray-900">{profile.stats.posts}</div>
                    <div className="text-gray-600">posts</div>
                  </div>
                </div>

                {/* Interests */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {profile.interests.map((interest, index) => (
                    <div 
                      key={index}
                      className="px-5 py-3 bg-gradient-to-r from-[#5e17eb]/10 to-[#ff2e2e]/10 text-gray-800 rounded-xl flex items-center gap-3 hover:from-[#5e17eb]/20 hover:to-[#ff2e2e]/20 transition-all duration-300"
                    >
                      <div className="text-[#5e17eb]">
                        {interest === 'Music' && <Music className="w-6 h-6" />}
                        {interest === 'Reading' && <Book className="w-6 h-6" />}
                        {interest === 'Cooking' && <ChefHat className="w-6 h-6" />}
                      </div>
                      <span className="font-bold text-lg">{interest}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button 
                    onClick={handleChat}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-[#5e17eb] to-[#4a13c4] text-white rounded-xl font-bold text-lg hover:from-[#4a13c4] hover:to-[#5e17eb] transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02]"
                  >
                    <MessageCircle className="w-6 h-6" />
                    Start Chat
                  </button>
                  <button 
                    onClick={handleFollow}
                    className="flex-1 px-8 py-4 bg-white border-2 border-gray-300 text-gray-800 rounded-xl font-bold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02]"
                  >
                    <User className="w-6 h-6" />
                    Follow
                  </button>
                  <button className="px-6 py-4 bg-white border-2 border-gray-300 text-gray-800 rounded-xl font-bold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-[1.02]">
                    <Gift className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Posts Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <MessageSquareText className="w-7 h-7 text-[#5e17eb]" />
                Posts ({profile.stats.posts})
              </h2>
              
              <div className="space-y-8">
                {userPosts.map(post => (
                  <div key={post.id} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                    <div className="mb-6">
                      <p className="text-gray-800 text-lg mb-4">{post.content}</p>
                      <div className="flex flex-wrap gap-3">
                        {post.tags.map(tag => (
                          <span key={tag} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <div 
                        className="relative h-80 rounded-xl overflow-hidden cursor-pointer group"
                        onClick={() => openImageModal(post.imageUrl)}
                      >
                        <Image
                          src={post.imageUrl}
                          alt="Post image"
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => handlePostLike(post.id)}
                          className="flex items-center gap-3 text-gray-600 hover:text-gray-900 group"
                        >
                          <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                            <ThumbsUp className={`w-5 h-5 ${post.isLiked ? 'text-[#ff2e2e] fill-[#ff2e2e]' : ''}`} />
                          </div>
                          <span className="font-bold text-lg">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-3 text-gray-600 hover:text-gray-900 group">
                          <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                            <MessageCircle className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-lg">{post.comments}</span>
                        </button>
                      </div>
                      <div className="text-gray-500">{post.timeAgo}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">About</h2>
              
              <div className="space-y-10">
                {/* Looking For */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Looking For</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {profile.lookingFor.map((item, index) => (
                      <div 
                        key={index}
                        className="p-4 bg-gray-50 rounded-xl text-center hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <div className="font-medium text-gray-900">{item}</div>
                      </div>
                    ))}
                  </div>
                  <div className="p-5 bg-gradient-to-r from-[#5e17eb]/10 to-[#ff2e2e]/10 rounded-xl">
                    <div className="text-lg font-bold text-gray-900">
                      Personality Type: <span className="text-[#5e17eb]">{profile.personalityType}</span>
                    </div>
                  </div>
                </div>

                {/* About Me */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">About Me</h3>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {profile.about.map((trait, index) => (
                      <div 
                        key={index}
                        className="px-5 py-3 bg-[#5e17eb] text-white rounded-xl font-bold text-lg"
                      >
                        {trait}
                      </div>
                    ))}
                  </div>
                  <div className="text-gray-700 text-lg">
                    <p className={showFullDescription ? '' : 'line-clamp-3'}>
                      {profile.description}
                    </p>
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-[#5e17eb] font-bold hover:underline mt-3 text-lg"
                    >
                      {showFullDescription ? 'See Less' : 'See More'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Get More with Credits */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-[#5e17eb]" />
                Get More with Credits
              </h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <MessageSquare className="w-5 h-5 text-[#5e17eb]" />
                  <span className="text-gray-700">Chat with anyone you like</span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Gift className="w-5 h-5 text-[#5e17eb]" />
                  <span className="text-gray-700">Send Virtual Gifts</span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Mail className="w-5 h-5 text-[#5e17eb]" />
                  <span className="text-gray-700">Respond in Mail</span>
                </div>
              </div>
              <button 
                onClick={() => setShowCreditsPopup(true)}
                className="w-full py-3.5 bg-gradient-to-r from-[#5e17eb] to-[#ff2e2e] text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all duration-300 hover:scale-[1.02]"
              >
                Get Credits
              </button>
            </div>

            {/* My Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                <UsersIcon className="w-6 h-6 text-[#5e17eb]" />
                My Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-700">Chats</div>
                  <div className="text-2xl font-bold text-[#5e17eb]">{profile.activity.chats}</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-700">Mail</div>
                  <div className="text-2xl font-bold text-[#5e17eb]">{profile.activity.mail}</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-700">Following</div>
                  <div className="text-2xl font-bold text-[#5e17eb]">{profile.activity.following}</div>
                </div>
              </div>
            </div>

            {/* Online Now - WITH USER IMAGES */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  Online now:
                </h3>
                <button 
                  onClick={() => setShowMoreOnline(!showMoreOnline)}
                  className="text-[#5e17eb] text-sm font-bold hover:underline flex items-center gap-1"
                >
                  {showMoreOnline ? 'Show less' : 'Show more'}
                  {showMoreOnline ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="space-y-4">
                {visibleOnlineNow.map((person) => (
                  <div 
                    key={person.id}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                    onClick={() => alert(`Viewing ${person.name}'s profile`)}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                          <Image
                            src={person.image}
                            alt={person.name}
                            width={56}
                            height={56}
                            className="object-cover"
                          />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">
                          {person.name}{person.age ? `, ${person.age}` : ''}
                        </div>
                        {person.location && (
                          <div className="text-gray-600 text-sm flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {person.location}
                          </div>
                        )}
                      </div>
                      {person.photos > 0 && (
                        <div className="text-gray-500 text-xs flex items-center gap-1">
                          <Camera className="w-3 h-3" />
                          <span>{person.photos}</span>
                        </div>
                      )}
                    </div>
                    <button className="w-full py-2.5 bg-[#5e17eb] text-white rounded-lg font-bold hover:bg-[#4a13c4] transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02]">
                      <MessageCircle className="w-4 h-4" />
                      Start Chat
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* More Photos */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                <ImageIcon className="w-6 h-6 text-[#5e17eb]" />
                More Photos
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {profile.photos.slice(0, 6).map((photo, index) => (
                  <div 
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => {
                      setCurrentPhotoIndex(index);
                      openImageModal(photo);
                    }}
                  >
                    <Image
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-all duration-300 hover:scale-[1.02]">
                View All Photos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <Image
              src={selectedImage}
              alt="Enlarged view"
              width={1200}
              height={1200}
              className="rounded-2xl object-contain max-h-[90vh]"
            />
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-black/60 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="w-7 h-7" />
            </button>
          </div>
        </div>
      )}

      {/* Credits Popup Modal */}
      {showCreditsPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Get Credits</h3>
              <button
                onClick={() => setShowCreditsPopup(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-[#5e17eb] transition-colors cursor-pointer hover:scale-[1.02]">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg">30 Credits</div>
                    <div className="text-gray-600 text-sm">30 messages</div>
                  </div>
                  <div className="text-xl font-bold text-[#5e17eb]">€9.99</div>
                </div>
              </div>
              
              <div className="p-4 border-2 border-[#5e17eb] rounded-lg bg-[#5e17eb]/5 relative hover:scale-[1.02] transition-transform">
                <div className="absolute -top-2 left-4 bg-[#ff2e2e] text-white text-xs font-bold px-3 py-1 rounded-full">
                  🥇 Best Value
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg">100 Credits</div>
                    <div className="text-gray-600 text-sm">100 messages</div>
                  </div>
                  <div className="text-xl font-bold text-[#5e17eb]">€19.99</div>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:border-[#5e17eb] transition-colors cursor-pointer hover:scale-[1.02]">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg">350 Credits</div>
                    <div className="text-gray-600 text-sm">350 messages</div>
                  </div>
                  <div className="text-xl font-bold text-[#5e17eb]">€39.99</div>
                </div>
              </div>
            </div>
            
            <button className="w-full py-3.5 bg-gradient-to-r from-[#5e17eb] to-[#ff2e2e] text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all duration-300 hover:scale-[1.02]">
              Continue to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}