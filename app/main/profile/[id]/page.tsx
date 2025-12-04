// app/main/profile/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Heart, MessageCircle, MapPin, Calendar, Users, Image as ImageIcon, 
  Camera, Star, CheckCircle, Share2, MoreVertical, ArrowLeft, Gift,
  Mail, Video, UserPlus, UserCheck, Eye, Settings, Globe, Lock
} from 'lucide-react';
import Image from 'next/image';
import LayoutController from '@/components/layout/LayoutController';

// Mock profile data - simplified
const profileData = {
  id: 1,
  username: 'Anastasiya',
  age: 29,
  location: 'Berlin, Germany',
  distance: '3 km',
  isOnline: true,
  isVerified: true,
  imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
  coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=400&fit=crop',
  bio: 'Adventure seeker and coffee lover. Looking for meaningful connections and great conversations.',
  about: 'Digital marketer with passion for photography, travel, and meaningful conversations.',
  interests: ['Traveling', 'Music', 'Photography', 'Cooking', 'Reading'],
  isFollowing: false,
  isPremium: true,
  lastSeen: 'Online now',
  zodiacSign: 'Libra',
  profession: 'Digital Marketer',
  languages: ['English', 'German', 'Russian'],
  relationshipStatus: 'Single',
  lookingFor: 'Meaningful connections'
};

// Mock user photos
const userPhotos = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w-300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1494790108755-2616b786d4d4?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=300&fit=crop'
];

// Mock user posts
const userPosts = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop',
    caption: 'Beautiful sunset in Berlin today! 🌅',
    likes: 234,
    comments: 42,
    timeAgo: '2h ago'
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=600&fit=crop',
    caption: 'Coffee and good vibes ☕️✨',
    likes: 189,
    comments: 28,
    timeAgo: '1d ago'
  }
];

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState(profileData);
  const [photos, setPhotos] = useState(userPhotos);
  const [posts, setPosts] = useState(userPosts);
  const [activeTab, setActiveTab] = useState<'info' | 'photos' | 'posts'>('info');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(profileData.isFollowing);

  useEffect(() => {
    // Fetch profile data based on params.id
    console.log('Loading profile:', params.id);
  }, [params.id]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setProfile(prev => ({
      ...prev,
      isFollowing: !isFollowing
    }));
  };

  const handleChat = () => {
    router.push('/main/chats');
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const handleLikePost = (postId: number) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <LayoutController />

      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <div className="py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        {/* Profile Header - Minimal */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-xl overflow-hidden border-4 border-white shadow-xl">
                <Image
                  src={profile.imageUrl}
                  alt={profile.username}
                  width={192}
                  height={192}
                  className="object-cover w-full h-full"
                />
              </div>
              {profile.isOnline && (
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-white"></div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profile.username}, {profile.age}
                    </h1>
                    {profile.isVerified && (
                      <CheckCircle className="w-6 h-6 text-blue-500" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      <span>{profile.lastSeen}</span>
                    </div>
                  </div>
                  
                  {/* Bio */}
                  <p className="text-gray-700 mb-6 max-w-2xl">
                    {profile.bio}
                  </p>
                </div>

                {/* Premium Badge */}
                {profile.isPremium && (
                  <div className="hidden md:flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb] text-white rounded-full text-sm font-bold">
                    <Star className="w-4 h-4" />
                    PREMIUM
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleChat}
                  className="px-6 py-3 bg-[#5e17eb] text-white rounded-lg font-medium hover:bg-[#4a13c4] transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Start Chat
                </button>
                
                <button
                  onClick={handleFollow}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    isFollowing
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-5 h-5" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Follow
                    </>
                  )}
                </button>
                
                <button className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                  <Gift className="w-5 h-5" />
                </button>
                
                <button className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Info */}
          <div className="lg:w-2/3">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === 'info'
                    ? 'border-[#5e17eb] text-[#5e17eb]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Information
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === 'photos'
                    ? 'border-[#5e17eb] text-[#5e17eb]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Photos
              </button>
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === 'posts'
                    ? 'border-[#5e17eb] text-[#5e17eb]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Posts
              </button>
            </div>

            {/* Content */}
            {activeTab === 'info' && (
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* About Section */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-gray-900">About</h3>
                    <p className="text-gray-700">{profile.about}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Relationship Status</div>
                          <div className="font-medium">{profile.relationshipStatus}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Looking For</div>
                          <div className="font-medium">{profile.lookingFor}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Profession</div>
                          <div className="font-medium">{profile.profession}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interests & Languages */}
                  <div className="space-y-6">
                    {/* Interests */}
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-3">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full text-sm font-medium"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-3">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.languages.map((language, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full text-sm font-medium"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'photos' && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => openImageModal(photo)}
                    >
                      <Image
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="space-y-6">
                {posts.map(post => (
                  <div key={post.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    {/* Post Image */}
                    <div 
                      className="relative h-64 md:h-96 cursor-pointer"
                      onClick={() => openImageModal(post.imageUrl)}
                    >
                      <Image
                        src={post.imageUrl}
                        alt={post.caption}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Post Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleLikePost(post.id)}
                            className="flex items-center gap-2 text-gray-600 hover:text-[#ff2e2e]"
                          >
                            <Heart className="w-5 h-5" />
                            <span className="font-medium">{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-600 hover:text-[#5e17eb]">
                            <MessageCircle className="w-5 h-5" />
                            <span className="font-medium">{post.comments}</span>
                          </button>
                        </div>
                        <span className="text-sm text-gray-500">{post.timeAgo}</span>
                      </div>
                      
                      <p className="text-gray-800">{post.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Quick Actions & Stats */}
          <div className="lg:w-1/3">
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-[#5e17eb] to-[#ff2e2e] rounded-xl p-6 text-white">
                <h3 className="font-bold text-lg mb-6">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">1.2K</div>
                    <div className="text-sm opacity-90">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">328</div>
                    <div className="text-sm opacity-90">Following</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">45</div>
                    <div className="text-sm opacity-90">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">92%</div>
                    <div className="text-sm opacity-90">Match</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Video className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-700">Video Call</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-700">Send Mail</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Gift className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-700">Send Gift</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-700">Private Photos</span>
                  </button>
                </div>
              </div>

              {/* Get More Credits */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Get More Credits</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Unlock more features and connect better
                </p>
                <button className="w-full py-3 bg-[#5e17eb] text-white rounded-lg font-medium hover:bg-[#4a13c4] transition-colors">
                  Buy Credits
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Image Modal */}
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