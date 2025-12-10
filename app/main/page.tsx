'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, MoreVertical, MapPin, Eye, Gift, Star, Sparkles, Filter, Camera, UserCheck, UserPlus, CheckCircle, ChevronLeft, ChevronRight, X, MessageCircleCodeIcon, MessageCirclePlus } from 'lucide-react';
import Image from 'next/image';
import LayoutController from '@/components/layout/LayoutController';
import Offer from '@/components/features/credits/CreditOffer';
import ProfileNotification from '@/components/ui/ProfileNotification';
import { useAuth } from '@/lib/hooks/useAuth';
import { useOffer } from '@/lib/hooks/useOffer';
import personaService, { ParsedPersonaProfile } from '@/lib/services/personaService';
import { CiPaperplane } from 'react-icons/ci';
import { useCredits } from '@/lib/hooks/useCredits';


// Types for our posts
interface Post {
  id: string;
  personaId: string;
  username: string;
  age: number;
  location: string;
  imageUrl: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  timeAgo: string;
  caption: string;
  isOnline: boolean;
  isVerified: boolean;
  interests: string[];
  distance: string;
  isFollowing: boolean;
  bio: string;
  additionalPhotos: string[];
  gender: string;
  personalityTraits: string[];
  followingCount: number;
  lastActive: string;
  email?: string;
  fieldOfWork?: string;
  englishLevel?: string;
  languages?: string[];
  martialStatus?: string;
  personality?: string;
}
const handleBuyCredits = () => {
  window.location.href = '/main/credits';
}
// Skeleton loader component
const PostSkeleton = () => (
  <div className="border border-gray-200 rounded-xl overflow-hidden bg-white animate-pulse">
    <div className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gray-300"></div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
            <div className="h-3 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="h-10 w-24 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
    
    <div className="h-[500px] bg-gray-300"></div>
    
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
      </div>
      <div className="h-4 w-32 bg-gray-300 rounded"></div>
      <div className="h-3 w-full bg-gray-200 rounded"></div>
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
        <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
        <div className="h-6 w-24 bg-gray-300 rounded-full"></div>
      </div>
      <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

const ProfileCardSkeleton = () => (
  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gray-300"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-20 bg-gray-300 rounded"></div>
        <div className="h-2 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="w-16 h-8 bg-gray-300 rounded-lg"></div>
  </div>
);

// Helper function to calculate time ago
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

// Helper function to get random distance (for demo)
const getRandomDistance = () => {
  const distances = ['2 km', '3 km', '5 km', '8 km', '12 km', '15 km'];
  return distances[Math.floor(Math.random() * distances.length)];
};

// Helper function to convert persona to post format
const convertPersonaToPost = (persona: ParsedPersonaProfile, index: number): Post => {
  const randomOnline = Math.random() > 0.3;
  const randomFollowing = Math.random() > 0.7;
  
  return {
    id: `${persona.$id}-${index}-${Date.now()}`,
    personaId: persona.$id,
    username: persona.username,
    age: persona.age,
    location: persona.location,
    imageUrl: persona.profilePic || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&h=800&fit=crop',
    likes: Math.floor(Math.random() * 500) + 100,
    comments: Math.floor(Math.random() * 50) + 10,
    isLiked: false,
    timeAgo: getTimeAgo(persona.lastActive || persona.$createdAt),
    caption: persona.bio || `Looking for meaningful connections in ${persona.location}`,
    isOnline: randomOnline,
    isVerified: persona.isVerified,
    interests: persona.interests?.slice(0, 3) || ['Travel', 'Music', 'Art'],
    distance: getRandomDistance(),
    isFollowing: randomFollowing,
    bio: persona.bio,
    additionalPhotos: persona.additionalPhotos || [],
    gender: persona.gender,
    personalityTraits: persona.personalityTraits || [],
    followingCount: persona.followingCount || 0,
    lastActive: persona.lastActive || persona.$createdAt,
    email: persona.email,
    fieldOfWork: persona.fieldOfWork,
    englishLevel: persona.englishLevel,
    languages: persona.languages || [],
    martialStatus: persona.martialStatus,
    personality: persona.personality
  };
};

// Enhanced Image Modal Component
const EnhancedImageModal = ({ 
  images, 
  initialIndex, 
  onClose,
  username 
}: { 
  images: string[], 
  initialIndex: number, 
  onClose: () => void,
  username: string 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const handlePrev = () => {
    setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-4 text-white">
          <div className="flex items-center gap-2">
            <span className="font-medium">{username}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-300">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative flex-1 flex items-center justify-center">
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div 
            className="relative w-full h-[70vh]"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <Image
              src={images[currentIndex]}
              alt={`${username}'s photo ${currentIndex + 1}`}
              fill
              className="object-contain rounded-lg"
              sizes="100vw"
              priority
            />
          </div>

          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {images.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto py-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  currentIndex === index 
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

        <div className="text-center text-gray-400 text-sm mt-4">
          <p>Use ← → arrows or swipe to navigate • Press ESC to close</p>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { showOffer, handleCloseOffer, isChecking } = useOffer();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggestedPeople, setSuggestedPeople] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [selectedPostForModal, setSelectedPostForModal] = useState<{
    post: Post | null;
    initialIndex: number;
  }>({ post: null, initialIndex: 0 });
  const [likingPost, setLikingPost] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'following'>('all');
  const [currentUser] = useState({
    name: 'David',
    credits: 150,
    location: 'Berlin, Germany'
  });

  const postsRef = useRef<Post[]>([]);
  const loadedIdsRef = useRef<Set<string>>(new Set());
  const isLoadingRef = useRef(false);
  const { credits: userCredits, isLoading: creditsLoading, refreshCredits } = useCredits();


  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    if (!authLoading && !isChecking && !isLoadingRef.current) {
      loadInitialData();
    }
  }, [authLoading, isChecking]);

  const loadInitialData = async () => {
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setIsLoading(true);
    loadedIdsRef.current.clear();
    
    try {
      const randomPersonas = await personaService.getRandomPersonas(ITEMS_PER_PAGE);
      
      const postsData = randomPersonas.map((persona, index) => {
        const post = convertPersonaToPost(persona, index);
        loadedIdsRef.current.add(persona.$id);
        return post;
      });
      
      setPosts(postsData);
      postsRef.current = postsData;
      
      const suggestedPersonas = await personaService.getRandomPersonas(6, randomPersonas.map(p => p.$id));
      const suggestedData = suggestedPersonas.map((persona, index) => 
        convertPersonaToPost(persona, index + ITEMS_PER_PAGE)
      );
      setSuggestedPeople(suggestedData);
      
      setPage(1);
      setHasMore(true);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  };

  const loadMorePosts = async () => {
    if (isLoadingMore || !hasMore || isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setIsLoadingMore(true);
    
    try {
      const offset = page * ITEMS_PER_PAGE;
      const newPersonas = await personaService.getAllPersonas({
        limit: ITEMS_PER_PAGE,
        offset: offset,
        gender: 'female'
      });
      
      if (newPersonas.length === 0) {
        setHasMore(false);
        return;
      }
      
      const uniquePersonas = newPersonas.filter(persona => !loadedIdsRef.current.has(persona.$id));
      
      if (uniquePersonas.length === 0) {
        setPage(prev => prev + 1);
        return;
      }
      
      uniquePersonas.forEach(persona => loadedIdsRef.current.add(persona.$id));
      
      const newPosts = uniquePersonas.map((persona, index) => 
        convertPersonaToPost(persona, postsRef.current.length + index)
      );
      
      const updatedPosts = [...postsRef.current, ...newPosts];
      postsRef.current = updatedPosts;
      setPosts(updatedPosts);
      
      setPage(prev => prev + 1);
      
      if (updatedPosts.length >= 52) {
        setHasMore(false);
      }
      
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoadingMore(false);
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= 
        document.documentElement.offsetHeight - 500 && 
        !isLoadingMore && 
        hasMore
      ) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, hasMore, page]);

  const filteredPosts = activeTab === 'all' 
    ? posts 
    : posts.filter(post => post.isFollowing);

  const handleLike = async (postId: string) => {
    setLikingPost(postId);
    try {
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
      
      postsRef.current = postsRef.current.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      );
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.error('Error liking post:', error);
      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes + 1 : post.likes - 1,
              }
            : post
        )
      );
    } finally {
      setLikingPost(null);
    }
  };

  const handleChat = (userId: string) => {
    // Navigate to chats with this user
    router.push(`/main/chats?user=${userId}`);
  };

  const handleViewProfile = (personaId: string) => {
    router.push(`/main/profile/${personaId}`);
  };

  const handleFollow = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;
      
      const newFollowingCount = !post.isFollowing ? post.followingCount + 1 : post.followingCount - 1;
      
      setPosts(prev =>
        prev.map(p =>
          p.id === postId 
            ? { 
                ...p, 
                isFollowing: !p.isFollowing,
                followingCount: newFollowingCount
              } 
            : p
        )
      );
      
      postsRef.current = postsRef.current.map(p =>
        p.id === postId 
          ? { 
              ...p, 
              isFollowing: !p.isFollowing,
              followingCount: newFollowingCount
            } 
          : p
      );
      
      await personaService.updatePersonaStats(post.personaId, {
        followingCount: newFollowingCount,
        lastActive: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error following user:', error);
      setPosts(prev =>
        prev.map(p =>
          p.id === postId 
            ? { 
                ...p, 
                isFollowing: !p.isFollowing,
                followingCount: !p.isFollowing ? p.followingCount - 1 : p.followingCount + 1
              } 
            : p
        )
      );
    }
  };

  const handleGift = () => {
    // Gift functionality would go here
    console.log('Send gift');
  };

  const openImageModal = (post: Post, index: number = 0) => {
    setSelectedPostForModal({ post, initialIndex: index });
  };

  const closeImageModal = () => {
    setSelectedPostForModal({ post: null, initialIndex: 0 });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const renderAdditionalPhotos = (post: Post) => {
    if (!post.additionalPhotos || post.additionalPhotos.length === 0) {
      return null;
    }
    
    const allImages = [post.imageUrl, ...post.additionalPhotos];
    const displayPhotos = allImages.slice(0, 4);
    const extraCount = allImages.length - 4;
    
    return (
      <div className="absolute bottom-4 left-4 flex gap-2">
        {displayPhotos.map((photo, index) => (
          <div 
            key={`${post.id}-photo-${index}`} 
            className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              openImageModal(post, index);
            }}
          >
            <Image
              src={photo}
              alt={`Photo ${index + 1}`}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
        {extraCount > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              openImageModal(post);
            }}
            className="w-12 h-12 rounded-lg bg-black/60 flex items-center justify-center text-white text-sm font-medium border-2 border-white shadow-lg hover:bg-black/70 transition-colors"
          >
            +{extraCount}
          </button>
        )}
      </div>
    );
  };

  const shouldShowOffer = showOffer && isAuthenticated && !authLoading && !isChecking;

  if (authLoading || isChecking || isLoading) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <LayoutController />
        <main className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="flex-1 max-w-2xl mx-auto w-full space-y-8">
              {[...Array(3)].map((_, i) => (
                <PostSkeleton key={`skeleton-${i}`} />
              ))}
            </div>
            
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <div className="p-6 border border-gray-200 rounded-xl bg-white">
                  <div className="h-6 w-32 bg-gray-300 rounded mb-5"></div>
                  <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                      <ProfileCardSkeleton key={`sidebar-skeleton-${i}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <LayoutController />

      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1 max-w-2xl mx-auto w-full">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Discover People</h2>
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
              
              </div>
              
              <div className="flex gap-4 sm:gap-6 mb-6 sm:mb-8 pb-3 px-1 overflow-x-auto">
              {suggestedPeople.slice(0, 4).map((person, index) => (
                <button 
                  key={`story-${person.id}-${index}`} 
                  className="flex flex-col items-center flex-shrink-0 cursor-pointer group focus:outline-none"
                  onClick={() => handleViewProfile(person.personaId)}
                >
                  <div className="relative mb-2">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#5e17eb] p-0.5 group-hover:border-[#4a13c4] group-focus:border-[#4a13c4] transition-colors duration-300">
                      <Image
                        src={person.imageUrl}
                        alt={person.username}
                        width={80}
                        height={80}
                        className="rounded-full object-cover w-full h-full group-hover:scale-110 group-focus:scale-110 transition-transform duration-300"
                      />
                    </div>
                    {person.isOnline && (
                      <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform"></div>
                    )}
                    {/* Optional: Add a subtle pulse animation for online users */}
                    {person.isOnline && (
                      <div className="absolute inset-0 rounded-full border-2 border-[#5e17eb] animate-ping opacity-50"></div>
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-[#5e17eb] group-focus:text-[#5e17eb] transition-colors duration-200">
                    {person.username}
                  </span>
                  <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                    {person.age} years
                  </span>
                </button>
              ))}
            </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {filteredPosts.map((post, index) => {
                const allImages = [post.imageUrl, ...(post.additionalPhotos || [])];
                
                return (
                  <div
                    key={`${post.id}-${index}`}
                    className="border border-gray-200 rounded-xl overflow-hidden bg-white"
                  >
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
                            {post.bio && (
                              <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                                {post.bio}
                              </p>
                            )}
                          </div>
                        </div>
                        
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
                                <span className="ml-1 text-xs">({post.followingCount})</span>
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

                    <div 
                      className="relative h-[300px] sm:h-[400px] md:h-[500px] cursor-pointer group"
                      onClick={() => openImageModal(post, 0)}
                    >
                      <Image
                        src={post.imageUrl}
                        alt={post.username}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 672px"
                      />
                      {renderAdditionalPhotos(post)}
                    </div>

                    <div className="p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-4 sm:mb-5">
                        <div className="flex items-center gap-2 sm:gap-4">
                          <button
                            onClick={() => handleLike(post.id)}
                            className="relative group"
                            disabled={likingPost === post.id}
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

                          <button 
                            onClick={() => handleChat(post.personaId)}
                            className="p-2 sm:p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300 hover:scale-110 relative group"
                          >
                            <MessageCircle className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                            <span className="absolute -top-1 -right-1 text-xs bg-[#5e17eb] text-white rounded-full px-1.5 py-0.5 font-medium">
                              {post.comments}
                            </span>
                          </button>

                          <button 
                            onClick={handleGift}
                            className="p-2 sm:p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300 hover:scale-110"
                          >
                            <Gift className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                          </button>

                          <button className="p-2 sm:p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300 hover:scale-110">
                            <Camera className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleViewProfile(post.personaId)}
                          className="flex items-center gap-1 px-3 py-2 sm:px-5 sm:py-3 bg-[#5e17eb] text-white rounded-lg font-medium hover:bg-[#4a13c4] transition-all duration-300 hover:scale-105"
                        >
                          <Eye className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                          <span className="text-xs sm:text-sm">View Profile</span>
                        </button>
                      </div>

                      <div className="mb-3 sm:mb-4">
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">{formatNumber(post.likes)} likes</span>
                        <span className="mx-2 sm:mx-3 text-gray-300">•</span>
                        <span className="text-gray-600 text-sm sm:text-base">{post.comments} messages</span>
                      </div>

                      <div className="mb-3 sm:mb-5 space-y-2">
                        <span className="font-semibold text-gray-900 mr-2 text-sm sm:text-base">{post.username}</span>
                        <span className="text-gray-800 text-sm sm:text-base">{post.caption}</span>
                        {post.bio && post.bio !== post.caption && (
                          <p className="text-gray-600 text-sm mt-2">{post.bio}</p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                        {post.interests.map((interest, idx) => (
                          <span key={`${post.id}-interest-${idx}`} className="px-2 sm:px-4 py-1 sm:py-2 bg-gray-100 text-xs sm:text-sm rounded-full text-gray-700 hover:bg-gray-200 transition-colors duration-200">
                            {interest}
                          </span>
                        ))}
                        {post.personalityTraits?.slice(0, 2).map((trait, idx) => (
                          <span key={`${post.id}-trait-${idx}`} className="px-2 sm:px-4 py-1 sm:py-2 bg-[#5e17eb]/10 text-xs sm:text-sm rounded-full text-[#5e17eb] hover:bg-[#5e17eb]/20 transition-colors duration-200">
                            {trait}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2 sm:gap-3">
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            placeholder={`Send a message to ${post.username}...`}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3.5 text-xs sm:text-sm border border-gray-300 rounded-lg outline-none focus:border-[#5e17eb] focus:ring-2 focus:ring-[#5e17eb]/20 transition-all duration-300"
                          />
                          <div className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1 sm:gap-2">
                            <button className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                            </button>
                            <button className="p-1 sm:p-2 text-black hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                              <CiPaperplane className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => handleChat(post.personaId)}
                          className="px-3 sm:px-6 bg-[#ff2e2e] text-white rounded-lg font-medium hover:bg-[#e62626] transition-all duration-300 hover:scale-105 flex items-center gap-1 sm:gap-2"
                        >
                          <MessageCircle className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                          <span className="text-xs sm:text-sm">Send</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {isLoadingMore && (
                <div className="space-y-8">
                  <PostSkeleton key="skeleton-loading-1" />
                  <PostSkeleton key="skeleton-loading-2" />
                </div>
              )}
              
              {!hasMore && !isLoadingMore && posts.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg font-medium">You&apos;ve seen all {posts.length} profiles for now!</p>
                  <p className="text-sm mt-2">Check back later for more matches</p>
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="p-6 border border-gray-200 rounded-xl bg-white">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-lg text-gray-900">Suggestions For You</h3>
                  <button 
                    onClick={() => loadInitialData()}
                    className="text-sm text-[#5e17eb] hover:underline font-medium transition-colors"
                  >
                    Refresh
                  </button>
                </div>
                <div className="space-y-4">
                  {suggestedPeople.map((person, index) => (
                    <div key={`suggestion-${person.id}-${index}`} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
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
                          <div className="text-xs text-gray-500">{person.age} years</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleViewProfile(person.personaId)}
                        className="px-3 py-1.5 bg-[#5e17eb] text-white text-xs rounded-lg hover:bg-[#4a13c4] transition-all duration-200"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-[#5e17eb]/5 to-white">
              <h3 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                <Star size={18} className="text-[#5e17eb]" />
                Your Credits
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                  <div>
                    <div className="font-medium text-gray-600">Balance</div>
                    {creditsLoading ? (
                      <div className="h-10 w-24 bg-gray-200 rounded animate-pulse mt-2"></div>
                    ) : (
                      <div className="text-3xl font-bold text-[#5e17eb]">{userCredits.toLocaleString()}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Active</div>
                    <div className="text-sm text-green-600 font-medium">✓ Valid</div>
                  </div>
                </div>
                <button 
                  className="w-full py-3.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
                  onClick={() => router.push('/main/credits')}
                  disabled={creditsLoading}
                >
                  {creditsLoading ? 'Loading...' : 'Buy More Credits'}
                </button>
              </div>
            </div>

              <div className="p-6 border border-gray-200 rounded-xl bg-white">
                <h3 className="font-bold mb-5 text-gray-900">Your Activity</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-[#5e17eb]">
                      {posts.reduce((acc, post) => acc + post.likes, 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Total Likes</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-[#5e17eb]">
                      {posts.filter(p => p.isFollowing).length}
                    </div>
                    <div className="text-xs text-gray-500">Following</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-[#5e17eb]">
                      {posts.length}
                    </div>
                    <div className="text-xs text-gray-500">Profiles Viewed</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-[#5e17eb]">
                      {posts.filter(p => p.isOnline).length}
                    </div>
                    <div className="text-xs text-gray-500">Online Now</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {selectedPostForModal.post && (
        <EnhancedImageModal
          images={[selectedPostForModal.post.imageUrl, ...(selectedPostForModal.post.additionalPhotos || [])]}
          initialIndex={selectedPostForModal.initialIndex}
          onClose={closeImageModal}
          username={selectedPostForModal.post.username}
        />
      )}

      <Offer isOpen={shouldShowOffer} onClose={handleCloseOffer} />
      <ProfileNotification 
        autoShow={true}
        minInterval={100000}
        maxInterval={200000}
        notificationDuration={10000}
        position="top-right"
      />
    </div>
  );
}