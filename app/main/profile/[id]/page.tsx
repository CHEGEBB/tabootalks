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
import { useThemeColors } from '@/lib/hooks/useThemeColors';

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
  const colors = useThemeColors();

  const [profile, setProfile] = useState<ParsedPersonaProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isWinking, setIsWinking] = useState(false);
  const [message, setMessage] = useState('');
  const [winkAnimation, setWinkAnimation] = useState(false);

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

  const handleSendWink = async () => {
    if (!profile) return;
  
    setIsWinking(true);
    setWinkAnimation(true); // Start animation
  
    try {
      // 1. Send wink as a message to the chat
      const winkMessage = "😉"; // Wink emoji
  
      // 2. Navigate to chat with wink message pre-filled
      router.push(`/main/chats/${profile.$id}?wink=true`);
  
      // Show animation for 1.5 seconds before navigating
      setTimeout(() => {
        setWinkAnimation(false);
        setIsWinking(false);
      }, 1500);
  
    } catch (error: any) {
      console.error('Error sending wink:', error);
      alert('Failed to send wink. Please try again.');
      setWinkAnimation(false);
      setIsWinking(false);
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
    router.push(`/main/virtual-gifts/${profile?.$id}`);
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
      <div className="min-h-screen" style={{ background: colors.background }}>
        <LayoutController />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 rounded w-1/4 mb-6" style={{ background: colors.hoverBackground }}></div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <div className="h-96 rounded-xl" style={{ background: colors.hoverBackground }}></div>
              </div>
              <div className="lg:w-1/3 space-y-4">
                <div className="h-12 rounded" style={{ background: colors.hoverBackground }}></div>
                <div className="h-8 rounded" style={{ background: colors.hoverBackground }}></div>
                <div className="h-32 rounded" style={{ background: colors.hoverBackground }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen" style={{ background: colors.background }}>
        <LayoutController />
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: `${colors.danger}20` }}>
            <X className="w-10 h-10" style={{ color: colors.danger }} />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: colors.primaryText }}>Profile Not Found</h1>
          <p className="mb-6" style={{ color: colors.secondaryText }}>{error || 'The profile you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/main/home')}
            className="px-6 py-3 rounded-lg font-medium transition-colors"
            style={{ background: colors.secondary, color: colors.primaryText === '#000000' ? '#ffffff' : colors.primaryText }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: colors.background }}>
      <LayoutController />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity"
          style={{ color: colors.secondaryText }}
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        {/* Main Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info & Photos */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="rounded-2xl border p-6" style={{ 
              background: colors.cardBackground, 
              borderColor: colors.borderLight
            }}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 shadow-lg" style={{ borderColor: colors.cardBackground }}>
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
                    <h1 className="text-3xl font-bold" style={{ color: colors.primaryText }}>
                      {profile.username}, {profile.age}
                    </h1>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${profile.isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${profile.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        {profile.isOnline ? 'Online Now' : 'Offline'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4" style={{ color: colors.secondaryText }}>
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
                    <div className="px-3 py-1 rounded-full text-sm" style={{ 
                      background: colors.hoverBackground, 
                      color: colors.secondaryText 
                    }}>
                      {profile.fieldOfWork}
                    </div>
                    <div className="px-3 py-1 rounded-full text-sm" style={{ 
                      background: colors.hoverBackground, 
                      color: colors.secondaryText 
                    }}>
                      {profile.englishLevel} English
                    </div>
                    <div className="px-3 py-1 rounded-full text-sm" style={{ 
                      background: colors.hoverBackground, 
                      color: colors.secondaryText 
                    }}>
                      {profile.martialStatus}
                    </div>
                  </div>

                  {/* Bio */}
                  <p style={{ color: colors.secondaryText }}>{profile.bio}</p>
                </div>
              </div>
            </div>

            {/* Photos Section */}
            <div className="rounded-2xl border p-6" style={{ 
              background: colors.cardBackground, 
              borderColor: colors.borderLight
            }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: colors.primaryText }}>Photos</h2>
                <span className="text-sm" style={{ color: colors.tertiaryText }}>{allImages.length} photos</span>
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
            <div className="rounded-2xl border p-6" style={{ 
              background: colors.cardBackground, 
              borderColor: colors.borderLight
            }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: colors.primaryText }}>About Me</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personality Traits */}
                <div>
                  <h3 className="font-semibold mb-3" style={{ color: colors.primaryText }}>Personality</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.personalityTraits.map((trait, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 rounded-lg text-sm font-medium"
                        style={{ 
                          background: `${colors.secondary}20`, 
                          color: colors.secondary 
                        }}
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-sm" style={{ color: colors.secondaryText }}>{profile.personality}</p>
                </div>

                {/* Looking For */}
                <div>
                  <h3 className="font-semibold mb-3" style={{ color: colors.primaryText }}>Looking For</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" style={{ color: colors.secondary }} />
                      <span style={{ color: colors.secondaryText }}>Get attention</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" style={{ color: colors.secondary }} />
                      <span style={{ color: colors.secondaryText }}>
                        People aged {profile.preferences.ageRange?.[0] || 18} - {profile.preferences.ageRange?.[1] || 90}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" style={{ color: colors.secondary }} />
                      <span style={{ color: colors.secondaryText }}>{profile.preferences.lookingFor || 'Meaningful connections'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* SEND GIFT SECTION */}
            <div className="rounded-lg md:rounded-xl shadow border p-4 md:p-6" style={{ 
              background: colors.cardBackground, 
              borderColor: colors.borderLight 
            }}>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                <div>
                  <h2 className="text-lg md:text-xl font-bold flex items-center gap-2" style={{ color: colors.primaryText }}>
                    <Gift className="w-5 h-5 md:w-6 md:h-6" style={{ color: colors.secondary }} />
                    Virtual Gifts for Special Ones
                  </h2>
                  <p className="text-sm md:text-base mt-1" style={{ color: colors.secondaryText }}>
                    Liven up your chat with {profile.username} by sending a thoughtful gift
                  </p>
                </div>
                <button
                  onClick={handleSendGift}
                  className="text-sm font-medium px-4 py-2 rounded-full transition-colors w-fit"
                  style={{ 
                    background: colors.secondary,
                    color: '#ffffff'
                  }}
                >
                  Choose Virtual Gift
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                {/* Gift 1 - Just image, no click */}
                <div className="flex flex-col items-center p-3 md:p-4">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 mb-2">
                    <Image
                      src="/magical/roseinglass.png"
                      alt="Gift 1"
                      width={96}
                      height={96}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium" style={{ color: colors.primaryText }}>Rose</span>
                </div>

                {/* Gift 2 - Just image, no click */}
                <div className="flex flex-col items-center p-3 md:p-4">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 mb-2">
                    <Image
                      src="/magical/wishwell.png"
                      alt="Gift 2"
                      width={96}
                      height={96}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium" style={{ color: colors.primaryText }}>Wishwell</span>
                </div>

                {/* Gift 3 - Just image, no click */}
                <div className="flex flex-col items-center p-3 md:p-4">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 mb-2">
                    <Image
                      src="/gifts/flower5.png"
                      alt="Gift 3"
                      width={96}
                      height={96}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium" style={{ color: colors.primaryText }}>Flowers</span>
                </div>

                {/* Gift 4 - Just image, no click */}
                <div className="flex flex-col items-center p-3 md:p-4">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 mb-2">
                    <Image
                      src="/gifts/love_potion.png"
                      alt="Gift 4"
                      width={96}
                      height={96}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium" style={{ color: colors.primaryText }}>Love potion</span>
                </div>
              </div>
            </div>
            {/* Posts Section */}
            <div className="rounded-2xl border p-6" style={{ 
              background: colors.cardBackground, 
              borderColor: colors.borderLight
            }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: colors.primaryText }}>Recent Posts</h2>
              <div className="space-y-4">
                {/* Sample post */}
                <div className="p-4 rounded-xl" style={{ background: colors.hoverBackground }}>
                  <p style={{ color: colors.secondaryText }} className="italic">
                    &ldquo;I remind myself that happiness is a choice, so I choose joy daily even when life feels heavy and uncertain.&rdquo;
                  </p>
                  <div className="flex items-center justify-between mt-3 text-sm" style={{ color: colors.tertiaryText }}>
                    <span>Just now</span>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 hover:opacity-80 transition-opacity" style={{ color: colors.tertiaryText }}>
                        <Heart className="w-4 h-4" />
                        <span>24</span>
                      </button>
                      <button className="flex items-center gap-1 hover:opacity-80 transition-opacity" style={{ color: colors.tertiaryText }}>
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
            <div className="rounded-2xl border p-6" style={{ 
              background: colors.cardBackground, 
              borderColor: colors.borderLight
            }}>
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/main/chats/${personaId}`)}
                  className="w-full py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  style={{ 
                    background: colors.secondary,
                    color: '#ffffff'
                  }}
                >
                  <MessageCircle className="w-5 h-5" />
                  Start Chat
                </button>

                <button
                  onClick={handleSendWink}
                  disabled={isWinking}
                  className="w-full py-3 bg-gradient-to-r from-[#ff2e2e] to-[#ff6b6b] text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 relative overflow-hidden"
                >
                  <Sparkles className="w-5 h-5" />
                  {isWinking ? 'Winking...' : 'Send Wink'}
                  
                  {/* Animated background effect */}
                  {winkAnimation && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleFollow}
                    className={`py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2`}
                    style={{ 
                      background: isFollowing ? colors.hoverBackground : colors.secondary,
                      color: isFollowing ? colors.secondaryText : '#ffffff',
                      border: isFollowing ? `1px solid ${colors.borderLight}` : 'none'
                    }}
                  >
                    <UserPlus className="w-5 h-5" />
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>

                  <button
                    onClick={handleSendGift}
                    className="py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    style={{ 
                      background: colors.cardBackground,
                      color: colors.secondary,
                      border: `2px solid ${colors.secondary}`
                    }}
                  >
                    <Gift className="w-5 h-5" />
                    Gift
                  </button>
                </div>
              </div>
            </div>

            {/* Interests */}
            <div className="rounded-2xl border p-6" style={{ 
              background: colors.cardBackground, 
              borderColor: colors.borderLight
            }}>
              <h3 className="font-semibold mb-4" style={{ color: colors.primaryText }}>Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{ 
                      background: colors.hoverBackground,
                      color: colors.secondaryText
                    }}
                  >
                    {getInterestIcon(interest)}
                    <span className="text-sm">{interest}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="rounded-2xl border p-6" style={{ 
              background: colors.cardBackground, 
              borderColor: colors.borderLight
            }}>
              <h3 className="font-semibold mb-4" style={{ color: colors.primaryText }}>Languages</h3>
              <div className="space-y-2">
                {profile.languages.map((language, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: colors.secondary }}></div>
                    <span style={{ color: colors.secondaryText }}>{language}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Credits Info */}
            <div className="rounded-2xl border p-6" style={{ 
              background: `linear-gradient(135deg, ${colors.secondary}05 0%, ${colors.cardBackground} 100%)`,
              borderColor: colors.borderLight 
            }}>
              <h3 className="font-semibold mb-4" style={{ color: colors.primaryText }}>Credits Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg border" style={{
                  background: colors.cardBackground,
                  borderColor: colors.borderLight
                }}>
                  <span style={{ color: colors.secondaryText }}>Sending a photo:</span>
                  <span className="font-semibold" style={{ color: colors.secondary }}>10 cr</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg border" style={{
                  background: colors.cardBackground,
                  borderColor: colors.borderLight
                }}>
                  <span style={{ color: colors.secondaryText }}>Sending a sticker:</span>
                  <span className="font-semibold" style={{ color: colors.secondary }}>5 cr</span>
                </div>
                <button 
                  className="w-full py-3 rounded-lg font-medium transition-colors"
                  style={{ 
                    background: colors.primaryText === '#000000' ? '#000000' : '#ffffff',
                    color: colors.primaryText === '#000000' ? '#ffffff' : '#000000' 
                  }}
                >
                  Get Credits
                </button>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="rounded-2xl border p-6" style={{ 
              background: colors.cardBackground, 
              borderColor: colors.borderLight
            }}>
              <h3 className="font-semibold mb-4" style={{ color: colors.primaryText }}>Activity Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-lg" style={{ background: colors.hoverBackground }}>
                  <div className="text-2xl font-bold" style={{ color: colors.secondary }}>{profile.totalChats}</div>
                  <div className="text-xs" style={{ color: colors.tertiaryText }}>Total Chats</div>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ background: colors.hoverBackground }}>
                  <div className="text-2xl font-bold" style={{ color: colors.secondary }}>{profile.totalMatches}</div>
                  <div className="text-xs" style={{ color: colors.tertiaryText }}>Matches</div>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ background: colors.hoverBackground }}>
                  <div className="text-2xl font-bold" style={{ color: colors.secondary }}>{profile.followingCount}</div>
                  <div className="text-xs" style={{ color: colors.tertiaryText }}>Following</div>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ background: colors.hoverBackground }}>
                  <div className="text-xs" style={{ color: colors.tertiaryText }}>Last Active</div>
                  <div className="text-sm font-medium" style={{ color: colors.secondaryText }}>{getTimeAgo(profile.lastActive)}</div>
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
                    onClick={(e) => {
                      e.stopPropagation();
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
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        
        /* Wink emoji animation */
        .wink-emoji {
          animation: wink-bounce 1s infinite;
          display: inline-block;
        }
        
        @keyframes wink-bounce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;