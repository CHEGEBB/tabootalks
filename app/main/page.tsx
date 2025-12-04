'use client';

import { useState } from 'react';
import { Heart, MessageCircle, MoreVertical, MapPin, Eye, Gift, Star, Sparkles, Filter, Flame, Zap, Camera, UserCheck, UserPlus, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import LayoutController from '@/components/layout/LayoutController';

// Mock data for posts
const mockPosts = [
  {
    id: 1,
    username: 'Sophie',
    age: 28,
    location: 'Berlin, Germany',
    imageUrl: 'https://images.unsplash.com/photo-1456885284447-7dd4bb8720bf?q=80&w=687&fit=crop',
    likes: 324,
    comments: 42,
    isLiked: false,
    timeAgo: '2h ago',
    caption: 'Looking for someone to explore Berlin with! 💕 Who wants to join me tonight?',
    isOnline: true,
    isVerified: true,
    interests: ['Travel', 'Music', 'Dancing'],
    distance: '3 km',
    isFollowing: false
  },
  {
    id: 2,
    username: 'Emma',
    age: 32,
    location: 'Munich, Germany',
    imageUrl: 'https://images.unsplash.com/photo-1522765312985-2a1e2bce9ad7?q=80&w=687&fit=crop',
    likes: 289,
    comments: 31,
    isLiked: true,
    timeAgo: '4h ago',
    caption: 'Ready for meaningful connections and deep conversations. Let\'s chat! 💬',
    isOnline: true,
    isVerified: true,
    interests: ['Yoga', 'Meditation', 'Books'],
    distance: '12 km',
    isFollowing: true
  },
  {
    id: 3,
    username: 'Lily',
    age: 26,
    location: 'Hamburg, Germany',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=800&fit=crop',
    likes: 412,
    comments: 58,
    isLiked: false,
    timeAgo: '6h ago',
    caption: 'Beach vibes and good conversations 🌊 Looking for someone fun and adventurous!',
    isOnline: false,
    isVerified: false,
    interests: ['Beach', 'Surfing', 'Parties'],
    distance: '8 km',
    isFollowing: false
  },
  {
    id: 4,
    username: 'Chloe',
    age: 30,
    location: 'Frankfurt, Germany',
    imageUrl: 'https://images.unsplash.com/photo-1680783147882-1f48af96e349?q=80&w=837&fit=crop',
    likes: 256,
    comments: 38,
    isLiked: false,
    timeAgo: '8h ago',
    caption: 'Coffee lover seeking coffee dates and meaningful connections ☕️ Let\'s meet!',
    isOnline: true,
    isVerified: true,
    interests: ['Coffee', 'Art', 'Photography'],
    distance: '5 km',
    isFollowing: true
  },
  {
    id: 5,
    username: 'Grace',
    age: 29,
    location: 'Cologne, Germany',
    imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=800&fit=crop',
    likes: 378,
    comments: 46,
    isLiked: true,
    timeAgo: '1d ago',
    caption: 'Exploring the city and looking for someone special to share moments with!',
    isOnline: true,
    isVerified: true,
    interests: ['Travel', 'Food', 'History'],
    distance: '15 km',
    isFollowing: false
  },
  {
    id: 6,
    username: 'Mia',
    age: 27,
    location: 'Stuttgart, Germany',
    imageUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=800&h=800&fit=crop',
    likes: 298,
    comments: 39,
    isLiked: false,
    timeAgo: '1d ago',
    caption: 'Looking for that special connection for romantic evenings. Message me! 💕',
    isOnline: false,
    isVerified: true,
    interests: ['Romance', 'Wine', 'Fashion'],
    distance: '20 km',
    isFollowing: false
  },
];

// Suggested people
const suggestedPeople = [
  {
    id: 1,
    username: 'Anna',
    age: 27,
    location: 'Berlin',
    imageUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=300&h=300&fit=crop',
    isOnline: true,
    isVerified: true,
    compatibility: 92
  },
  {
    id: 2,
    username: 'Laura',
    age: 29,
    location: 'Munich',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop',
    isOnline: false,
    isVerified: true,
    compatibility: 87
  },
  {
    id: 3,
    username: 'Sarah',
    age: 33,
    location: 'Hamburg',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
    isOnline: true,
    isVerified: false,
    compatibility: 95
  },
  {
    id: 4,
    username: 'Julia',
    age: 25,
    location: 'Frankfurt',
    imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=300&fit=crop',
    isOnline: true,
    isVerified: true,
    compatibility: 89
  },
  {
    id: 5,
    username: 'Natalie',
    age: 30,
    location: 'Cologne',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&fit=crop',
    isOnline: false,
    isVerified: true,
    compatibility: 84
  },
  {
    id: 6,
    username: 'Michelle',
    age: 28,
    location: 'Stuttgart',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop',
    isOnline: true,
    isVerified: true,
    compatibility: 91
  },
];

export default function HomePage() {
  const [posts, setPosts] = useState(mockPosts);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [likingPost, setLikingPost] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'following'>('all');
  const [currentUser] = useState({
    name: 'David',
    credits: 150,
    location: 'Berlin, Germany'
  });

  const filteredPosts = activeTab === 'all' 
    ? posts 
    : posts.filter(post => post.isFollowing);

  const handleLike = (postId: number) => {
    setLikingPost(postId);
    setTimeout(() => {
      setPosts(prev =>
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
      setLikingPost(null);
    }, 300);
  };

  const handleChat = (userId: number) => {
    alert(`Starting chat with user ${userId}. This would open chat window in real app.`);
  };

  const handleViewProfile = (postId: number) => {
    alert(`Viewing profile of post ${postId}. This would navigate to profile page in real app.`);
  };

  const handleFollow = (postId: number) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, isFollowing: !post.isFollowing } : post
      )
    );
  };

  const handleGift = (postId: number) => {
    alert(`Sending gift to user ${postId}. This would open gift modal in real app.`);
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <LayoutController />

      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Main Feed - Single Column */}
          <div className="flex-1 max-w-2xl mx-auto w-full">
            {/* Feed Header with Tabs */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Discover People</h2>
                  {/* Tabs for All Posts / Following */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
                        activeTab === 'all'
                          ? 'bg-white text-[#5e17eb] shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      All Posts
                    </button>
                    <button
                      onClick={() => setActiveTab('following')}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
                        activeTab === 'following'
                          ? 'bg-white text-[#5e17eb] shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Following ({posts.filter(p => p.isFollowing).length})
                    </button>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2.5 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors self-start">
                  <Filter className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                  <span className="text-xs sm:text-sm font-medium">Filters</span>
                </button>
              </div>
              
              {/* Stories/Online Users */}
              <div className="flex gap-4 sm:gap-6 mb-6 sm:mb-8 pb-3 px-1 overflow-x-auto">
                {suggestedPeople.slice(0, 4).map(person => (
                  <div key={person.id} className="flex flex-col items-center flex-shrink-0">
                    <div className="relative mb-2">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#5e17eb] p-0.5">
                        <Image
                          src={person.imageUrl}
                          alt={person.username}
                          width={80}
                          height={80}
                          className="rounded-full object-cover w-full h-full"
                        />
                      </div>
                      {person.isOnline && (
                        <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-900">{person.username}</span>
                    <span className="text-xs text-gray-500">{person.compatibility}% match</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Posts - Single Column */}
            <div className="space-y-6 sm:space-y-8">
              {filteredPosts.map(post => (
                <div
                  key={post.id}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white"
                >
                  {/* Post Header with Follow button next to three dots */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden">
                            <Image
                              src={post.imageUrl}
                              alt={post.username}
                              width={56}
                              height={56}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          {post.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="max-w-[180px] sm:max-w-none">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <h3 className="font-semibold text-sm sm:text-lg text-gray-900 truncate">
                              {post.username}, {post.age}
                            </h3>
                            {post.isVerified && (
                              <CheckCircle className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px] text-blue-500 fill-blue-100 flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center flex-wrap gap-1 text-gray-500 text-xs sm:text-sm">
                            <MapPin className="w-3 h-3 sm:w-[14px] sm:h-[14px]" />
                            <span className="truncate">{post.location}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>{post.distance}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>{post.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Follow button and three dots */}
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button
                          onClick={() => handleFollow(post.id)}
                          className={`flex items-center gap-1 px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                            post.isFollowing
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                              : 'bg-[#5e17eb] text-white hover:bg-[#4a13c4]'
                          }`}
                        >
                          {post.isFollowing ? (
                            <>
                              <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">Following</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">Follow</span>
                            </>
                          )}
                        </button>
                        <button className="p-1.5 sm:p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Post Image */}
                  <div 
                    className="relative h-[300px] sm:h-[400px] md:h-[500px] cursor-pointer group"
                    onClick={() => openImageModal(post.imageUrl)}
                  >
                    <Image
                      src={post.imageUrl}
                      alt={post.username}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 672px"
                    />
                  </div>

                  {/* Post Actions - Premium Design */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                      <div className="flex items-center gap-2 sm:gap-4">
                        {/* Like button */}
                        <button
                          onClick={() => handleLike(post.id)}
                          className="relative group"
                        >
                          {likingPost === post.id && (
                            <div className="absolute -inset-1 sm:-inset-2">
                              <div className="absolute inset-0 animate-ping bg-[#ff2e2e]/20 rounded-full"></div>
                            </div>
                          )}
                          <div className={`p-2 sm:p-3 rounded-full transition-all duration-300 group-hover:scale-110 ${
                            post.isLiked 
                              ? 'bg-[#ff2e2e]/10 text-[#ff2e2e]' 
                              : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                          }`}>
                            <Heart
                              className="w-5 h-5 sm:w-[22px] sm:h-[22px]"
                              fill={post.isLiked ? '#ff2e2e' : 'none'}
                            />
                          </div>
                        </button>

                        {/* Chat button */}
                        <button 
                          onClick={() => handleChat(post.id)}
                          className="p-2 sm:p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300 hover:scale-110 relative group"
                        >
                          <MessageCircle className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                          <span className="absolute -top-1 -right-1 text-xs bg-[#5e17eb] text-white rounded-full px-1.5 py-0.5 font-medium">
                            1
                          </span>
                        </button>

                        {/* Gift button */}
                        <button 
                          onClick={() => handleGift(post.id)}
                          className="p-2 sm:p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300 hover:scale-110"
                        >
                          <Gift className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                        </button>

                        {/* Camera button */}
                        <button className="p-2 sm:p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300 hover:scale-110">
                          <Camera className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                        </button>
                      </div>
                      
                      {/* View Profile Button */}
                      <button
                        onClick={() => handleViewProfile(post.id)}
                        className="flex items-center gap-1 px-3 py-2 sm:px-5 sm:py-3 bg-[#5e17eb] text-white rounded-lg font-medium hover:bg-[#4a13c4] transition-all duration-300 hover:scale-105"
                      >
                        <Eye className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                        <span className="text-xs sm:text-sm">View Profile</span>
                      </button>
                    </div>

                    {/* Likes Count */}
                    <div className="mb-3 sm:mb-4">
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">{formatNumber(post.likes)} likes</span>
                      <span className="mx-2 sm:mx-3 text-gray-300">•</span>
                      <span className="text-gray-600 text-sm sm:text-base">{post.comments} messages</span>
                    </div>

                    {/* Caption */}
                    <div className="mb-3 sm:mb-5">
                      <span className="font-semibold text-gray-900 mr-2 text-sm sm:text-base">{post.username}</span>
                      <span className="text-gray-800 text-sm sm:text-base">{post.caption}</span>
                    </div>

                    {/* Interests */}
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                      {post.interests.map((interest, idx) => (
                        <span key={idx} className="px-2 sm:px-4 py-1 sm:py-2 bg-gray-100 text-xs sm:text-sm rounded-full text-gray-700 hover:bg-gray-200 transition-colors duration-200">
                          {interest}
                        </span>
                      ))}
                    </div>

                    {/* Send Message Section */}
                    <div className="flex gap-2 sm:gap-3">
                      <div className="flex-1 relative">
                        <input 
                          type="text" 
                          placeholder={`Send a message to ${post.username}...`}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3.5 text-xs sm:text-sm border border-gray-300 rounded-lg outline-none focus:border-[#5e17eb] focus:ring-2 focus:ring-[#5e17eb]/20 transition-all duration-300"
                        />
                        <div className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1 sm:gap-2">
                          <button className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                            <Sparkles className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                          </button>
                          <button className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                            <Zap className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => handleChat(post.id)}
                        className="px-3 sm:px-6 bg-[#ff2e2e] text-white rounded-lg font-medium hover:bg-[#e62626] transition-all duration-300 hover:scale-105 flex items-center gap-1 sm:gap-2"
                      >
                        <MessageCircle className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                        <span className="text-xs sm:text-sm">Send</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar - Fixed */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Suggestions */}
              <div className="p-6 border border-gray-200 rounded-xl bg-white ">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-lg text-gray-900">Suggestions For You</h3>
                  <button className="text-sm text-[#5e17eb] hover:underline font-medium transition-colors">
                    See All
                  </button>
                </div>
                <div className="space-y-4">
                  {suggestedPeople.map(person => (
                    <div key={person.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <Image
                              src={person.imageUrl}
                              alt={person.username}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          </div>
                          {person.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{person.username}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin size={10} />
                            {person.location}
                          </div>
                          <div className="text-xs text-[#5e17eb] font-medium">
                            {person.compatibility}% match
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleChat(person.id)}
                        className="px-3 py-1.5 bg-[#5e17eb] text-white text-xs rounded-lg hover:bg-[#4a13c4] transition-all duration-200"
                      >
                        Chat
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Credits */}
              <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-[#5e17eb]/5 to-white">
                <h3 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <Star size={18} className="text-[#5e17eb]" />
                  Your Credits
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                    <div>
                      <div className="font-medium text-gray-600">Balance</div>
                      <div className="text-3xl font-bold text-[#5e17eb]">{currentUser.credits}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Active</div>
                      <div className="text-sm text-green-600 font-medium">✓ Valid</div>
                    </div>
                  </div>
                  <button className="w-full py-3.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all duration-300">
                    Buy More Credits
                  </button>
                </div>
              </div>

              {/* Activity Stats */}
              <div className="p-6 border border-gray-200 rounded-xl bg-white">
                <h3 className="font-bold mb-5 text-gray-900">Your Activity</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-[#5e17eb]">1,234</div>
                    <div className="text-xs text-gray-500">Profile Views</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-[#5e17eb]">567</div>
                    <div className="text-xs text-gray-500">Likes Received</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-[#5e17eb]">89</div>
                    <div className="text-xs text-gray-500">Matches</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-[#5e17eb]">24</div>
                    <div className="text-xs text-gray-500">Active Chats</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Image Modalll */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <Image
              src={selectedImage}
              alt="Enlarged view"
              width={1200}
              height={1200}
              className="rounded-lg object-contain max-h-[90vh]"
            />
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}