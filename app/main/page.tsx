'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, MoreVertical, MapPin, Eye, Gift, Star, Sparkles, Filter, Camera, UserCheck, UserPlus, CheckCircle, ChevronLeft, ChevronRight, X, MessageCircleCodeIcon, MessageCirclePlus, Flag, Shield, AlertCircle, Check, Ban, UserX, Activity, Users, Zap, TrendingUp, Award, Clock, BarChart3, Target, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import LayoutController from '@/components/layout/LayoutController';
import Offer from '@/components/features/credits/CreditOffer';
import ProfileNotification from '@/components/ui/ProfileNotification';
import { useAuth } from '@/lib/hooks/useAuth';
import { useOffer } from '@/lib/hooks/useOffer';
import personaService, { ParsedPersonaProfile } from '@/lib/services/personaService';
import { CiPaperplane } from 'react-icons/ci';
import { useCredits } from '@/lib/hooks/useCredits';
import { useChatService } from '@/lib/hooks/useChatService';
import { useTheme } from '@/lib/context/ThemeContext';
import { useThemeColors } from '@/lib/hooks/useThemeColors';

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

const ReportAbuseModal = ({ 
  isOpen, 
  onClose, 
  username,
  onReportSuccess 
}: { 
  isOpen: boolean;
  onClose: () => void;
  username: string;
  onReportSuccess: () => void;
}) => {
  const themeColors = useThemeColors(); // This returns colors directly
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const reportReasons = [
    { value: 'spam', label: 'Spam or misleading content' },
    { value: 'inappropriate', label: 'Inappropriate content' },
    { value: 'harassment', label: 'Harassment or bullying' },
    { value: 'hate_speech', label: 'Hate speech or discrimination' },
    { value: 'fake_profile', label: 'Fake profile or impersonation' },
    { value: 'scam', label: 'Scam or fraud' },
    { value: 'violence', label: 'Violent or dangerous behavior' },
    { value: 'underage', label: 'Underage user' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedReason) {
      alert('Please select a reason for reporting');
      return;
    }
    
    if (!description.trim()) {
      alert('Please provide a detailed description');
      return;
    }
    
    if (!email.trim()) {
      alert('Please enter your email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Report submitted:', {
        username,
        reason: selectedReason,
        description,
        email,
        timestamp: new Date().toISOString()
      });
      
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        onReportSuccess();
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: themeColors.cardBackground }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Flag className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: themeColors.primaryText }}>Report Abuse</h2>
                <p className="text-sm" style={{ color: themeColors.secondaryText }}>Help us keep the community safe</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-colors"
              style={{ 
                backgroundColor: themeColors.hoverBackground,
                color: themeColors.secondaryText
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isSuccess ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: themeColors.primaryText }}>Report Submitted Successfully!</h3>
              <p style={{ color: themeColors.secondaryText }}>
                Thank you for helping us keep the community safe. Our team will review your report shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: themeColors.panelBackground }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: themeColors.primaryText }}>{username}</h3>
                    <p className="text-sm" style={{ color: themeColors.tertiaryText }}>Report this user for inappropriate behavior</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-3" style={{ color: themeColors.primaryText }}>
                  Please tell us what happened. The more details you provide, the better.
                </label>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: themeColors.primaryText }}>
                    Select a reason *
                  </label>
                  <div className="space-y-2">
                    {reportReasons.map((reason) => (
                      <label
                        key={reason.value}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedReason === reason.value
                            ? 'border-[#5e17eb] bg-[#5e17eb]/5'
                            : 'hover:bg-gray-50'
                        }`}
                        style={{ 
                          borderColor: selectedReason === reason.value ? themeColors.secondary : themeColors.border,
                          backgroundColor: selectedReason === reason.value ? `${themeColors.secondary}10` : themeColors.cardBackground,
                          color: themeColors.primaryText
                        }}
                      >
                        <input
                          type="radio"
                          name="reason"
                          value={reason.value}
                          checked={selectedReason === reason.value}
                          onChange={(e) => setSelectedReason(e.target.value)}
                          className="w-4 h-4 focus:ring-[#5e17eb]"
                          style={{ color: themeColors.secondary }}
                        />
                        <span className="text-sm" style={{ color: themeColors.secondaryText }}>{reason.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: themeColors.primaryText }}>
                    Add a detailed description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please provide specific details about what you observed..."
                    className="w-full px-4 py-3 text-sm border rounded-lg outline-none focus:ring-2 transition-all min-h-[120px] resize-none"
                    style={{ 
                      backgroundColor: themeColors.inputBackground,
                      color: themeColors.primaryText,
                      borderColor: themeColors.border
                    }}
                    required
                  />
                  <style jsx>{`
                    textarea::placeholder {
                      color: ${themeColors.placeholderText};
                    }
                  `}</style>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: themeColors.primaryText }}>
                    Your email address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 text-sm border rounded-lg outline-none focus:ring-2 transition-all"
                    style={{ 
                      backgroundColor: themeColors.inputBackground,
                      color: themeColors.primaryText,
                      borderColor: themeColors.border
                    }}
                    required
                  />
                  <style jsx>{`
                    input::placeholder {
                      color: ${themeColors.placeholderText};
                    }
                  `}</style>
                  <p className="text-xs mt-2" style={{ color: themeColors.tertiaryText }}>
                    We&apos;ll use this email to contact you if we need more information about your report.
                  </p>
                </div>
              </div>

              <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800 mb-2">
                      <strong>Important:</strong> By clicking &ldquo;Report Content&rdquo;, you confirm that the information you provided is accurate and complete.
                    </p>
                    <p className="text-sm text-blue-700">
                      Please note that after submitting your report, our safety team will review the content and take appropriate action.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3.5 border font-medium rounded-lg transition-colors"
                  style={{ 
                    borderColor: themeColors.border,
                    color: themeColors.primaryText,
                    backgroundColor: themeColors.cardBackground
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3.5 bg-red-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Flag className="w-5 h-5" />
                      Report Content
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const PostOptionsDropdown = ({ 
  post, 
  isOpen, 
  onClose, 
  onReportClick 
}: { 
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onReportClick: () => void;
}) => {
  const themeColors = useThemeColors(); // Added missing import
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const options = [
    {
      icon: <Flag className="w-4 h-4" />,
      label: 'Report Abuse',
      color: 'text-red-600',
      hoverColor: 'hover:bg-red-50',
      onClick: onReportClick
    },
    
    {
      icon: <AlertCircle className="w-4 h-4" />,
      label: 'Get Help',
      color: 'text-blue-600',
      hoverColor: 'hover:bg-blue-50',
      onClick: () => {
        console.log('Get help clicked');
        onClose();
        window.open('/help', '_blank');
      }
    }
  ];

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-10 z-50 w-56 rounded-xl shadow-lg border py-2"
      style={{ 
        backgroundColor: themeColors.cardBackground,
        borderColor: themeColors.border 
      }}
    >
      <div className="px-3 py-2 border-b" style={{ borderColor: themeColors.borderLight }}>
        <p className="text-xs font-medium" style={{ color: themeColors.tertiaryText }}>Post Options</p>
      </div>
      
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => {
            option.onClick();
            onClose();
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 text-sm ${option.color} transition-colors`}
          style={{ 
            backgroundColor: themeColors.cardBackground
          }}
        >
          {option.icon}
          <span className="font-medium">{option.label}</span>
        </button>
      ))}
      
      <div className="px-4 py-3 border-t" style={{ borderColor: themeColors.borderLight }}>
        <p className="text-xs" style={{ color: themeColors.tertiaryText }}>
          Reporting helps keep our community safe.
        </p>
      </div>
    </div>
  );
};

const PostSkeleton = () => {
  const colors = useThemeColors(); // Fixed: useThemeColors returns colors directly
  
  return (
    <div className="border rounded-xl overflow-hidden animate-pulse" 
         style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
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
};

const ProfileCardSkeleton = () => {
  const colors = useThemeColors(); // Fixed: useThemeColors returns colors directly
  
  return (
    <div className="flex items-center justify-between p-3 rounded-lg transition-colors duration-200 animate-pulse"
         style={{ backgroundColor: colors.hoverBackground }}>
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

const getRandomDistance = () => {
  const distances = ['2 km', '3 km', '5 km', '8 km', '12 km', '15 km'];
  return distances[Math.floor(Math.random() * distances.length)];
};

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
  const colors = useThemeColors(); // Fixed: useThemeColors returns colors directly
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
  const { isAuthenticated, loading: authLoading, profile } = useAuth();
  const { showOffer, handleCloseOffer, isChecking } = useOffer();
  const { openChat } = useChatService();
  const colors = useThemeColors(); // Fixed: useThemeColors returns colors directly
  const { isDark } = useTheme();
  
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
  
  const [activityStats, setActivityStats] = useState({
    totalLikes: 0,
    followingCount: 0,
    profilesViewed: 0,
    onlineNow: 0,
    activeChats: 0,
    totalMessages: 0,
    averageResponseTime: '2m',
    longestConversation: '45m',
    mostActiveHour: '8 PM'
  });

  const [openDropdownPostId, setOpenDropdownPostId] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedPostForReport, setSelectedPostForReport] = useState<Post | null>(null);
  const [showReportSuccessToast, setShowReportSuccessToast] = useState(false);

  const postsRef = useRef<Post[]>([]);
  const loadedIdsRef = useRef<Set<string>>(new Set());
  const isLoadingRef = useRef(false);
  const { credits: userCredits, isLoading: creditsLoading, refreshCredits } = useCredits();

  const ITEMS_PER_PAGE = 6;

  const calculateActivityStats = (postsData: Post[]) => {
    const totalLikes = postsData.reduce((acc, post) => acc + post.likes, 0);
    const followingCount = postsData.filter(p => p.isFollowing).length;
    const profilesViewed = postsData.length;
    const onlineNow = postsData.filter(p => p.isOnline).length;
    
    const totalMessages = postsData.reduce((acc, post) => acc + post.comments, 0);
    const activeChats = postsData.filter(p => p.comments > 0).length;
    
    const responseTimes = ['1m', '2m', '3m', '5m', '10m'];
    const conversationLengths = ['15m', '30m', '45m', '1h', '2h'];
    const hours = ['2 PM', '6 PM', '8 PM', '10 PM', '12 AM'];
    
    setActivityStats({
      totalLikes,
      followingCount,
      profilesViewed,
      onlineNow,
      activeChats,
      totalMessages,
      averageResponseTime: responseTimes[Math.floor(Math.random() * responseTimes.length)],
      longestConversation: conversationLengths[Math.floor(Math.random() * conversationLengths.length)],
      mostActiveHour: hours[Math.floor(Math.random() * hours.length)]
    });
  };

  useEffect(() => {
    if (!authLoading && !isChecking && !isLoadingRef.current) {
      loadInitialData();
    }
  }, [authLoading, isChecking, profile]);

  const loadInitialData = async () => {
    if (isLoadingRef.current || !profile) return;
    
    isLoadingRef.current = true;
    setIsLoading(true);
    loadedIdsRef.current.clear();
    
    try {
      const randomOffset = Math.floor(Math.random() * 30);
      const randomPersonas = await personaService.smartFetchPersonas(profile, {
        limit: ITEMS_PER_PAGE * 3,
        offset: randomOffset
      });
      
      const shuffledPersonas = randomPersonas.sort(() => Math.random() - 0.5);
      const postsData = shuffledPersonas.slice(0, ITEMS_PER_PAGE).map((persona, index) => {
        const post = convertPersonaToPost(persona, index);
        loadedIdsRef.current.add(persona.$id);
        return post;
      });
      
      setPosts(postsData);
      postsRef.current = postsData;
      
      calculateActivityStats(postsData);
      
      const suggestedPersonas = await personaService.smartFetchPersonas(profile, {
        limit: 6,
        offset: Math.floor(Math.random() * 20)
      });
      const suggestedData = suggestedPersonas
      .filter(persona => !loadedIdsRef.current.has(persona.$id))
      .slice(0, 6)
      .map((persona, index) => convertPersonaToPost(persona, index + ITEMS_PER_PAGE));
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
    if (isLoadingMore || !hasMore || isLoadingRef.current || !profile) return;
    
    isLoadingRef.current = true;
    setIsLoadingMore(true);
    
    try {
      const offset = page * ITEMS_PER_PAGE;
      
      const newPersonas = await personaService.smartFetchPersonas(profile, {
        limit: ITEMS_PER_PAGE,
        offset: offset
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
      
      calculateActivityStats(updatedPosts);
      
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

  useEffect(() => {
    if (showReportSuccessToast) {
      const timer = setTimeout(() => {
        setShowReportSuccessToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showReportSuccessToast]);

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

  const handleChat = (personaId: string) => {
    router.push(`/main/chats/${personaId}`);
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

  const handleGift = (personaId: string) => {
      router.push(`/main/virtual-gifts/${personaId}`);
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

  const handleThreeDotsClick = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdownPostId(openDropdownPostId === postId ? null : postId);
  };

  const handleReportClick = (post: Post) => {
    setSelectedPostForReport(post);
    setOpenDropdownPostId(null);
    setShowReportModal(true);
  };

  const handleReportSuccess = () => {
    setShowReportSuccessToast(true);
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
      <div className="min-h-screen" style={{ backgroundColor: colors.background, color: colors.primaryText }}>
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
                <div className="p-6 border rounded-xl" style={{ 
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border 
                }}>
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
    <div className="min-h-screen" style={{ backgroundColor: colors.background, color: colors.primaryText }}>
      <LayoutController />

      {showReportSuccessToast && (
        <div className="fixed top-4 right-4 z-[100]">
          <div className="bg-green-50 border border-green-200 rounded-xl shadow-lg p-4 flex items-center gap-3 animate-slide-in">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-green-800">Report Submitted</h4>
              <p className="text-sm text-green-700">
                Thank you for helping keep our community safe. Our team will review your report.
              </p>
            </div>
            <button
              onClick={() => setShowReportSuccessToast(false)}
              className="ml-4 text-green-600 hover:text-green-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1 max-w-2xl mx-auto w-full">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-0">
                  <h2 className="text-xl sm:text-2xl font-bold" style={{ color: colors.primaryText }}>Discover People</h2>
                  <div className="flex rounded-lg p-1" style={{ backgroundColor: colors.inputBackground }}>
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200`}
                      style={{ 
                        backgroundColor: activeTab === 'all' ? colors.cardBackground : 'transparent',
                        color: activeTab === 'all' ? colors.secondary : colors.secondaryText,
                        boxShadow: activeTab === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                      }}
                    >
                      All Posts
                    </button>
                    <button
                      onClick={() => setActiveTab('following')}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200`}
                      style={{ 
                        backgroundColor: activeTab === 'following' ? colors.cardBackground : 'transparent',
                        color: activeTab === 'following' ? colors.secondary : colors.secondaryText,
                        boxShadow: activeTab === 'following' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                      }}
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
                      {person.isOnline && (
                        <div className="absolute inset-0 rounded-full border-2 border-[#5e17eb] animate-ping opacity-50"></div>
                      )}
                    </div>
                    <span 
                      className="text-xs sm:text-sm font-medium group-hover:text-[#5e17eb] group-focus:text-[#5e17eb] transition-colors duration-200"
                      style={{ color: colors.primaryText }}
                    >
                      {person.username}
                    </span>
                    <span 
                      className="text-xs group-hover:text-gray-700 transition-colors"
                      style={{ color: colors.tertiaryText }}
                    >
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
                    className="border rounded-xl overflow-hidden relative"
                    style={{ 
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border
                    }}
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
                              <h3 
                                className="font-semibold text-sm sm:text-lg truncate"
                                style={{ color: colors.primaryText }}
                              >
                                {post.username}, {post.age}
                              </h3>
                              {post.isVerified && (
                                <CheckCircle className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px] text-blue-500 fill-blue-100 flex-shrink-0" />
                              )}
                            </div>
                            <div 
                              className="flex items-center flex-wrap gap-1 text-xs sm:text-sm"
                              style={{ color: colors.tertiaryText }}
                            >
                              <MapPin className="w-3 h-3 sm:w-[14px] sm:h-[14px]" />
                              <span className="truncate">{post.location}</span>
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span>{post.distance}</span>
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span>{post.timeAgo}</span>
                            </div>
                            {post.bio && (
                              <p 
                                className="text-xs mt-1 line-clamp-1"
                                style={{ color: colors.secondaryText }}
                              >
                                {post.bio}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 sm:gap-2">
                          <button
                            onClick={() => handleFollow(post.id)}
                            className={`flex items-center gap-1 px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200`}
                            style={{ 
                              backgroundColor: post.isFollowing ? colors.panelBackground : colors.secondary,
                              color: post.isFollowing ? colors.primaryText : 'white',
                              border: post.isFollowing ? `1px solid ${colors.border}` : 'none'
                            }}
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
                          <div className="relative">
                            <button 
                              onClick={(e) => handleThreeDotsClick(post.id, e)}
                              className="p-1.5 sm:p-2.5 rounded-lg transition-colors"
                              style={{ 
                                color: colors.secondaryText,
                                backgroundColor: colors.hoverBackground
                              }}
                            >
                              <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            
                            <PostOptionsDropdown
                              post={post}
                              isOpen={openDropdownPostId === post.id}
                              onClose={() => setOpenDropdownPostId(null)}
                              onReportClick={() => handleReportClick(post)}
                            />
                          </div>
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
                            <div className={`p-2 sm:p-3 rounded-full transition-all duration-300 group-hover:scale-110`}
                                 style={{ 
                                   backgroundColor: post.isLiked ? `${colors.primary}10` : colors.panelBackground,
                                   color: post.isLiked ? colors.primary : colors.secondaryText
                                 }}>
                              <Heart
                                className="w-5 h-5 sm:w-[22px] sm:h-[22px]"
                                fill={post.isLiked ? colors.primary : 'none'}
                              />
                            </div>
                          </button>

                          <button 
                            onClick={() => handleChat(post.personaId)}
                            className="p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 relative group"
                            style={{ 
                              backgroundColor: colors.panelBackground,
                              color: colors.secondaryText
                            }}
                          >
                            <MessageCircle className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                            <span className="absolute -top-1 -right-1 text-xs bg-[#5e17eb] text-white rounded-full px-1.5 py-0.5 font-medium">
                              {post.comments}
                            </span>
                          </button>

                          <button 
                            onClick={() => handleGift(post.personaId)}
                            className="p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110"
                            style={{ 
                              backgroundColor: colors.panelBackground,
                              color: colors.secondaryText
                            }}
                          >
                            <Gift className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                          </button>

                          <button 
                            className="p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110"
                            style={{ 
                              backgroundColor: colors.panelBackground,
                              color: colors.secondaryText
                            }}
                          >
                            <Camera className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleViewProfile(post.personaId)}
                          className="flex items-center gap-1 px-3 py-2 sm:px-5 sm:py-3 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105"
                          style={{ 
                            backgroundColor: colors.secondary,
                          }}
                        >
                          <Eye className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                          <span className="text-xs sm:text-sm">View Profile</span>
                        </button>
                      </div>

                      <div className="mb-3 sm:mb-4">
                        <span 
                          className="font-semibold text-sm sm:text-base"
                          style={{ color: colors.primaryText }}
                        >{formatNumber(post.likes)} likes</span>
                        <span className="mx-2 sm:mx-3 text-gray-300">•</span>
                        <span 
                          className="text-sm sm:text-base"
                          style={{ color: colors.secondaryText }}
                        >{post.comments} messages</span>
                      </div>

                      <div className="mb-3 sm:mb-5 space-y-2">
                        <span 
                          className="font-semibold mr-2 text-sm sm:text-base"
                          style={{ color: colors.primaryText }}
                        >{post.username}</span>
                        <span 
                          className="text-sm sm:text-base"
                          style={{ color: colors.primaryText }}
                        >{post.caption}</span>
                        {post.bio && post.bio !== post.caption && (
                          <p 
                            className="text-sm mt-2"
                            style={{ color: colors.secondaryText }}
                          >{post.bio}</p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                        {post.interests.map((interest, idx) => (
                          <span 
                            key={`${post.id}-interest-${idx}`} 
                            className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm rounded-full transition-colors duration-200"
                            style={{ 
                              backgroundColor: colors.panelBackground,
                              color: colors.secondaryText
                            }}
                          >
                            {interest}
                          </span>
                        ))}
                        {post.personalityTraits?.slice(0, 2).map((trait, idx) => (
                          <span 
                            key={`${post.id}-trait-${idx}`} 
                            className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm rounded-full transition-colors duration-200"
                            style={{ 
                              backgroundColor: `${colors.secondary}10`,
                              color: colors.secondary
                            }}
                          >
                            {trait}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2 sm:gap-3">
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            placeholder={`Send a message to ${post.username}...`}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3.5 text-xs sm:text-sm border rounded-lg outline-none focus:ring-2 transition-all duration-300"
                            style={{ 
                              backgroundColor: colors.inputBackground,
                              color: colors.primaryText,
                              borderColor: colors.border
                            }}
                          />
                          <style jsx>{`
                            input::placeholder {
                              color: ${colors.placeholderText};
                            }
                          `}</style>
                          <div className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1 sm:gap-2">
                            <button className="p-1 sm:p-2 rounded-full transition-colors"
                                   style={{ 
                                     color: colors.tertiaryText,
                                     backgroundColor: colors.hoverBackground
                                   }}>
                            </button>
                            <button className="p-1 sm:p-2 rounded-full transition-colors"
                                   style={{ 
                                     color: colors.primaryText,
                                     backgroundColor: colors.hoverBackground
                                   }}>
                              <CiPaperplane className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => handleChat(post.personaId)}
                          className="px-3 sm:px-6 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-1 sm:gap-2"
                          style={{ 
                            backgroundColor: colors.primary
                          }}
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
                <div 
                  className="text-center py-8"
                  style={{ color: colors.secondaryText }}
                >
                  <p 
                    className="text-lg font-medium"
                    style={{ color: colors.primaryText }}
                  >You&apos;ve seen all {posts.length} profiles for now!</p>
                  <p className="text-sm mt-2">Check back later for more matches</p>
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div 
                className="p-6 border rounded-xl shadow-sm"
                style={{ 
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h3 
                      className="font-bold text-lg"
                      style={{ color: colors.primaryText }}
                    >Suggested People</h3>
                  </div>
                  <button 
                    onClick={() => loadInitialData()}
                    className="text-sm font-medium flex items-center gap-1 transition-colors"
                    style={{ 
                      color: colors.secondary
                    }}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>
                <div className="space-y-4">
                  {suggestedPeople.map((person, index) => (
                    <div 
                      key={`suggestion-${person.id}-${index}`} 
                      className="flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:shadow-sm group cursor-pointer"
                      style={{ 
                        backgroundColor: colors.hoverBackground
                      }}
                      onClick={() => router.push(`/main/profile/${person.personaId}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 shadow-sm"
                               style={{ borderColor: isDark ? colors.panelBackground : 'white' }}>
                            <Image
                              src={person.imageUrl}
                              alt={person.username}
                              width={48}
                              height={48}
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          {person.isOnline && (
                            <div 
                              className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 group-hover:scale-110 transition-transform"
                              style={{ borderColor: isDark ? colors.panelBackground : 'white' }}
                            ></div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div 
                            className="font-medium truncate flex items-center gap-1"
                            style={{ color: colors.primaryText }}
                          >
                            {person.username}
                            {person.isVerified && (
                              <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-100 flex-shrink-0" />
                            )}
                          </div>
                          <div 
                            className="text-xs flex items-center gap-1 truncate"
                            style={{ color: colors.tertiaryText }}
                          >
                            <MapPin size={10} />
                            {person.location}
                          </div>
                          <div 
                            className="text-xs"
                            style={{ color: colors.tertiaryText }}
                          >{person.age} years • {person.distance}</div>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/main/profile/${person.personaId}`);
                        }}
                        className="px-3 py-1.5 text-white text-xs rounded-lg transition-all duration-200 hover:scale-105 shadow-sm"
                        style={{ 
                          backgroundColor: colors.secondary
                        }}
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div 
                className="p-6 border rounded-xl shadow-sm bg-gradient-to-br"
                style={{ 
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  backgroundImage: `linear-gradient(to bottom right, ${colors.secondary}05, ${colors.cardBackground})`
                }}
              >
                <h3 
                  className="font-bold mb-4 flex items-center gap-2"
                  style={{ color: colors.primaryText }}
                >
                  <Zap size={18} className="text-[#5e17eb]" />
                  Your Credits
                </h3>
                <div className="space-y-4">
                  <div 
                    className="flex items-center justify-between p-4 rounded-lg border shadow-sm"
                    style={{ 
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border
                    }}
                  >
                    <div>
                      <div 
                        className="font-medium text-sm"
                        style={{ color: colors.secondaryText }}
                      >Balance</div>
                      {creditsLoading ? (
                        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse mt-2"></div>
                      ) : (
                        <div 
                          className="text-3xl font-bold"
                          style={{ color: colors.secondary }}
                        >{userCredits.toLocaleString()}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div 
                        className="text-sm"
                        style={{ color: colors.tertiaryText }}
                      >Active</div>
                      <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Valid
                      </div>
                    </div>
                  </div>
                  <button 
                    className="w-full py-3.5 bg-black text-white rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm" 
                    onClick={() => router.push('/main/credits')}
                    disabled={creditsLoading}
                    style={{ 
                      backgroundColor: isDark ? colors.cardBackground : 'black',
                      color: isDark ? colors.primaryText : 'white'
                    }}
                  >
                    {creditsLoading ? 'Loading...' : '💎 Buy More Credits'}
                  </button>
                </div>
              </div>

              <div 
                className="p-6 border rounded-xl shadow-sm"
                style={{ 
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border
                }}
              >
                <h3 
                  className="font-bold mb-5 flex items-center gap-2"
                  style={{ color: colors.primaryText }}
                >
                  <Activity className="w-5 h-5" style={{ color: colors.secondary }} />
                  Your Activity
                </h3>
                
                <div className="space-y-4">
                  <div 
                    className="rounded-xl p-4 border"
                    style={{ 
                      backgroundColor: `${colors.secondary}05`,
                      borderColor: `${colors.secondary}20`
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#5e17eb] to-purple-500 flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p 
                            className="text-sm"
                            style={{ color: colors.secondaryText }}
                          >People Online</p>
                          <p 
                            className="text-2xl font-bold"
                            style={{ color: colors.primaryText }}
                          >{activityStats.onlineNow}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div 
                          className="text-xs"
                          style={{ color: colors.tertiaryText }}
                        >Active Now</div>
                        <div className="text-xs font-medium text-green-600 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                          Live
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div 
                      className="rounded-xl p-4 border"
                      style={{ 
                        backgroundColor: isDark ? `rgba(59, 130, 246, 0.1)` : 'rgba(59, 130, 246, 0.05)',
                        borderColor: isDark ? `rgba(59, 130, 246, 0.3)` : 'rgba(59, 130, 246, 0.15)'
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <p 
                          className="text-xs"
                          style={{ color: colors.secondaryText }}
                        >Following</p>
                      </div>
                      <p 
                        className="text-xl font-bold"
                        style={{ color: colors.primaryText }}
                      >{activityStats.followingCount}</p>
                    </div>

                    <div 
                      className="rounded-xl p-4 border"
                      style={{ 
                        backgroundColor: isDark ? `rgba(16, 185, 129, 0.1)` : 'rgba(16, 185, 129, 0.05)',
                        borderColor: isDark ? `rgba(16, 185, 129, 0.3)` : 'rgba(16, 185, 129, 0.15)'
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-green-600" />
                        <p 
                          className="text-xs"
                          style={{ color: colors.secondaryText }}
                        >Likes</p>
                      </div>
                      <p 
                        className="text-xl font-bold"
                        style={{ color: colors.primaryText }}
                      >
                        {activityStats.totalLikes >= 1000 
                          ? `${(activityStats.totalLikes / 1000).toFixed(1)}k`
                          : activityStats.totalLikes}
                      </p>
                    </div>
                  </div>

                  <div 
                    className="rounded-xl p-4 border"
                    style={{ 
                      backgroundColor: isDark ? `rgba(245, 158, 11, 0.1)` : 'rgba(245, 158, 11, 0.05)',
                      borderColor: isDark ? `rgba(245, 158, 11, 0.3)` : 'rgba(245, 158, 11, 0.15)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-amber-600" />
                        <p 
                          className="text-sm font-medium"
                          style={{ color: colors.primaryText }}
                        >Messages Sent</p>
                      </div>
                      <span className="text-xs font-bold text-amber-700">{activityStats.totalMessages}</span>
                    </div>
                    <div 
                      className="flex items-center justify-between text-xs"
                      style={{ color: colors.secondaryText }}
                    >
                      <span>Active chats: {activityStats.activeChats}</span>
                      <span>⚡ Fast replies</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 
                    className="font-bold mb-3 text-sm"
                    style={{ color: colors.primaryText }}
                  >Quick Stats</h4>
                  <div className="space-y-3">
                    <div 
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ backgroundColor: colors.panelBackground }}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" style={{ color: colors.tertiaryText }} />
                        <span 
                          className="text-sm"
                          style={{ color: colors.secondaryText }}
                        >Avg. Response</span>
                      </div>
                      <span 
                        className="font-medium"
                        style={{ color: colors.primaryText }}
                      >{activityStats.averageResponseTime}</span>
                    </div>
                    <div 
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ backgroundColor: colors.panelBackground }}
                    >
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4" style={{ color: colors.tertiaryText }} />
                        <span 
                          className="text-sm"
                          style={{ color: colors.secondaryText }}
                        >Most Active</span>
                      </div>
                      <span 
                        className="font-medium"
                        style={{ color: colors.primaryText }}
                      >{activityStats.mostActiveHour}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 
                    className="font-bold mb-3 text-sm"
                    style={{ color: colors.primaryText }}
                  >Quick Actions</h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => router.push('/main/people')}
                      className="w-full py-3 bg-gradient-to-r from-[#5e17eb] to-[#8a4bff] text-white font-medium rounded-xl shadow-sm flex items-center justify-center gap-2 text-sm transition-all"
                    >
                      <Users className="w-4 h-4" />
                      Discover More People
                    </button>
                    <button
                      onClick={() => router.push('/main/chats')}
                      className="w-full py-3 border text-[#5e17eb] font-medium rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
                      style={{ 
                        borderColor: colors.secondary,
                        color: colors.secondary
                      }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      View All Chats
                    </button>
                  </div>
                </div>

                <div 
                  className="mt-6 rounded-xl p-4 border"
                  style={{ 
                    backgroundColor: colors.panelBackground,
                    borderColor: colors.border
                  }}
                >
                  <h5 
                    className="font-bold mb-2 flex items-center gap-2 text-sm"
                    style={{ color: colors.primaryText }}
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Pro Tip
                  </h5>
                  <p 
                    className="text-sm mb-3"
                    style={{ color: colors.secondaryText }}
                  >
                    Send messages during peak hours (6 PM - 10 PM) for faster responses!
                  </p>
                  <div 
                    className="flex items-center justify-between text-xs"
                    style={{ color: colors.tertiaryText }}
                  >
                    <span>Response rate: 95%</span>
                    <span>Peak hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {selectedPostForReport && (
        <ReportAbuseModal
          isOpen={showReportModal}
          onClose={() => {
            setShowReportModal(false);
            setSelectedPostForReport(null);
          }}
          username={selectedPostForReport.username}
          onReportSuccess={handleReportSuccess}
        />
      )}

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