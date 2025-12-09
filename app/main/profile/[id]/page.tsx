/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Heart, MessageCircle, MoreVertical, MapPin, Gift, Star, Camera, UserPlus,
  CheckCircle, Calendar, Mail, Lock, Globe, Users, Target, Music, Coffee,
  Plane, BookOpen, Film, GamepadIcon as Gamepad, Utensils, Palette, Dumbbell,
  ChevronLeft, ChevronRight, X, Sparkles, Send, Wifi, Eye, Shield
} from 'lucide-react';
import LayoutController from '@/components/layout/LayoutController';
import personaService, { ParsedPersonaProfile } from '@/lib/services/personaService';
import { useAuth } from '@/lib/hooks/useAuth';

// Interest icons mapping
const interestIcons: Record<string, React.ReactNode> = {
  music: <Music className="w-4 h-4" />,
  cooking: <Utensils className="w-4 h-4" />,
  travel: <Plane className="w-4 h-4" />,
  reading: <BookOpen className="w-4 h-4" />,
  movies: <Film className="w-4 h-4" />,
  gaming: <Gamepad className="w-4 h-4" />,
  art: <Palette className="w-4 h-4" />,
  fitness: <Dumbbell className="w-4 h-4" />,
  coffee: <Coffee className="w-4 h-4" />,
};

const ProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const [profile, setProfile] = useState<ParsedPersonaProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isWinking, setIsWinking] = useState(false);
  const [message, setMessage] = useState('');
  
  const personaId = params.id as string;

  useEffect(() => {
    if (personaId) {
      fetchProfile();
    }
  }, [personaId]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await personaService.getPersonaById(personaId);
      setProfile(data);
      
      // Simulate checking if following (in real app, this would be from user's data)
      setIsFollowing(Math.random() > 0.5);
      
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const allImages = profile ? [profile.profilePic, ...profile.additionalPhotos] : [];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Navigate to chats with this user
      router.push(`/main/chats?user=${personaId}&message=${encodeURIComponent(message)}`);
    }
  };

  const handleWink = async () => {
    setIsWinking(true);
    try {
      // Simulate wink action
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`You winked at ${profile?.username}!`);
    } catch (error) {
      console.error('Error sending wink:', error);
    } finally {
      setIsWinking(false);
    }
  };

  const handleFollow = async () => {
    try {
      const newFollowingState = !isFollowing;
      setIsFollowing(newFollowingState);
      
      if (profile) {
        const newFollowingCount = newFollowingState 
          ? profile.followingCount + 1 
          : profile.followingCount - 1;
        
        await personaService.updatePersonaStats(personaId, {
          followingCount: newFollowingCount,
          lastActive: new Date().toISOString()
        });
        
        // Update local profile
        setProfile(prev => prev ? { ...prev, followingCount: newFollowingCount } : null);
      }
    } catch (error) {
      console.error('Error following user:', error);
      setIsFollowing(!isFollowing); // Revert on error
    }
  };

  const handleSendGift = () => {
    alert(`Send a gift to ${profile?.username}. This would open gift selection modal.`);
  };

  const openImageModal = (imageUrl: string, index: number) => {
    setSelectedImage(imageUrl);
    setCurrentImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!allImages.length) return;
    
    let newIndex = currentImageIndex;
    if (direction === 'prev') {
      newIndex = currentImageIndex === 0 ? allImages.length - 1 : currentImageIndex - 1;
    } else {
      newIndex = currentImageIndex === allImages.length - 1 ? 0 : currentImageIndex + 1;
    }
    
    setCurrentImageIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${Math.floor(diffDays / 7)}w ago`;
  };

  const getInterestIcon = (interest: string) => {
    const interestLower = interest.toLowerCase();
    for (const [key, icon] of Object.entries(interestIcons)) {
      if (interestLower.includes(key)) return icon;
    }
    return <Star className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <LayoutController />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <div className="h-96 bg-gray-200 rounded-xl"></div>
              </div>
              <div className="lg:w-1/3 space-y-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <LayoutController />
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The profile you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/main/home')}
            className="px-6 py-3 bg-[#5e17eb] text-white rounded-lg font-medium hover:bg-[#4a13c4] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <LayoutController />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        {/* Main Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info & Photos */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <Image
                      src={profile.profilePic}
                      alt={profile.username}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {profile.isVerified && (
                    <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1.5 shadow-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {profile.isPremium && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb] rounded-full p-1.5 shadow-lg">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profile.username}, {profile.age}
                    </h1>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${profile.isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${profile.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        {profile.isOnline ? 'Online Now' : 'Offline'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(profile.birthday)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{profile.followingCount} following</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {profile.fieldOfWork}
                    </div>
                    <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {profile.englishLevel} English
                    </div>
                    <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {profile.martialStatus}
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-700">{profile.bio}</p>
                </div>
              </div>
            </div>

            {/* Photos Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Photos</h2>
                <span className="text-sm text-gray-500">{allImages.length} photos</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() => openImageModal(image, index)}
                  >
                    <Image
                      src={image}
                      alt={`${profile.username}'s photo ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        Profile
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* About Me Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">About Me</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personality Traits */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Personality</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.personalityTraits.map((trait, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-[#5e17eb]/10 text-[#5e17eb] rounded-lg text-sm font-medium"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-gray-600 text-sm">{profile.personality}</p>
                </div>

                {/* Looking For */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Looking For</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#5e17eb]" />
                      <span className="text-gray-700">Get attention</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#5e17eb]" />
                      <span className="text-gray-700">
                        People aged {profile.preferences.ageRange?.[0] || 18} - {profile.preferences.ageRange?.[1] || 90}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#5e17eb]" />
                      <span className="text-gray-700">{profile.preferences.lookingFor || 'Meaningful connections'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Posts</h2>
              <div className="space-y-4">
                {/* Sample post */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-700 italic">
                    &ldquo;I remind myself that happiness is a choice, so I choose joy daily even when life feels heavy and uncertain.&rdquo;
                  </p>
                  <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                    <span>Just now</span>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 hover:text-[#5e17eb]">
                        <Heart className="w-4 h-4" />
                        <span>24</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-[#5e17eb]">
                        <MessageCircle className="w-4 h-4" />
                        <span>8</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Details */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/main/chats?user=${personaId}`)}
                  className="w-full py-3 bg-[#5e17eb] text-white rounded-xl font-medium hover:bg-[#4a13c4] transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Start Chat
                </button>
                
                <button
                  onClick={handleWink}
                  disabled={isWinking}
                  className="w-full py-3 bg-gradient-to-r from-[#ff2e2e] to-[#ff6b6b] text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  {isWinking ? 'Winking...' : 'Send Wink'}
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleFollow}
                    className={`py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                      isFollowing
                        ? 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                        : 'bg-[#5e17eb] text-white hover:bg-[#4a13c4]'
                    }`}
                  >
                    <UserPlus className="w-5 h-5" />
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  
                  <button
                    onClick={handleSendGift}
                    className="py-3 bg-white border-2 border-[#5e17eb] text-[#5e17eb] rounded-xl font-medium hover:bg-[#5e17eb]/5 transition-colors flex items-center justify-center gap-2"
                  >
                    <Gift className="w-5 h-5" />
                    Gift
                  </button>
                </div>
              </div>
            </div>

            {/* Send Message */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Send a Message</h3>
              <div className="space-y-3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Say something nice to ${profile.username}...`}
                  className="w-full h-24 px-4 py-3 text-sm border border-gray-300 rounded-xl focus:border-[#5e17eb] focus:ring-2 focus:ring-[#5e17eb]/20 outline-none resize-none"
                  rows={3}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="w-full py-3 bg-[#ff2e2e] text-white rounded-xl font-medium hover:bg-[#e62626] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </div>
            </div>

            {/* Interests */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg"
                  >
                    {getInterestIcon(interest)}
                    <span className="text-sm">{interest}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Languages</h3>
              <div className="space-y-2">
                {profile.languages.map((language, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#5e17eb] rounded-full"></div>
                    <span className="text-gray-700">{language}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Credits Info */}
            <div className="bg-gradient-to-br from-[#5e17eb]/5 to-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Credits Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-gray-700">Sending a photo:</span>
                  <span className="font-semibold text-[#5e17eb]">10 cr</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-gray-700">Sending a sticker:</span>
                  <span className="font-semibold text-[#5e17eb]">5 cr</span>
                </div>
                <button className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Get Credits
                </button>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Activity Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#5e17eb]">{profile.totalChats}</div>
                  <div className="text-xs text-gray-500">Total Chats</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#5e17eb]">{profile.totalMatches}</div>
                  <div className="text-xs text-gray-500">Matches</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#5e17eb]">{profile.followingCount}</div>
                  <div className="text-xs text-gray-500">Following</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Last Active</div>
                  <div className="text-sm font-medium text-gray-700">{getTimeAgo(profile.lastActive)}</div>
                </div>
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
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-4 text-white">
              <div className="flex items-center gap-2">
                <span className="font-medium">{profile.username}</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-300">
                  {currentImageIndex + 1} / {allImages.length}
                </span>
              </div>
              <button
                onClick={closeImageModal}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative flex-1 flex items-center justify-center">
              {allImages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                  className="absolute left-4 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              <div className="relative w-full h-[70vh]">
                <Image
                  src={selectedImage}
                  alt={`${profile.username}'s photo ${currentImageIndex + 1}`}
                  fill
                  className="object-contain rounded-lg"
                  sizes="100vw"
                  priority
                />
              </div>

              {allImages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                  className="absolute right-4 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto py-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setSelectedImage(image);
                    }}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index 
                        ? 'border-[#5e17eb] scale-110' 
                        : 'border-transparent hover:border-white/50'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;