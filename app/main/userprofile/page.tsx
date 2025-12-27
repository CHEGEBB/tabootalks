/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import LayoutController from '@/components/layout/LayoutController';
import useAuth from '@/lib/hooks/useAuth';
import authService from '@/lib/services/authService';
import storageService from '@/lib/appwrite/storage';
import { ID } from 'appwrite';
import { useTheme } from '@/lib/context/ThemeContext';
import {
  Edit,
  Camera,
  MapPin,
  Calendar,
  Globe,
  Heart,
  Users,
  MessageSquare,
  Mail,
  Video,
  Music,
  Film,
  Star,
  Check,
  X,
  Lock,
  Upload,
  Trash2,
  User,
  Briefcase,
  GraduationCap,
  Coffee,
  Gamepad2,
  Dumbbell,
  Palette,
  Utensils,
  BookOpen,
  Plane,
  Settings,
  Shield,
  Bell,
  CreditCard,
  LogOut,
  Eye,
  EyeOff,
  Camera as CameraIcon,
  Globe as GlobeIcon,
  Heart as HeartIcon,
  Languages,
  Crown,
  Zap,
  Target,
  Search,
  Filter,
  Save,
  Loader2,
  Sparkles,
  Target as TargetIcon,
  Heart as HeartIcon2,
  Users as UsersIcon,
  Tag,
  Smile,
  Award,
  TrendingUp,
  Activity,
  GitBranch,
  Eye as EyeIcon,
  Key,
  Phone,
  Home,
  Building,
  Map,
  Briefcase as BriefcaseIcon,
  Book,
  Music as MusicIcon,
  Film as FilmIcon,
  Gamepad2 as GameIcon,
  Coffee as CoffeeIcon,
  Dumbbell as DumbbellIcon,
  Palette as PaletteIcon,
  Utensils as UtensilsIcon,
  BookOpen as BookOpenIcon,
  Plane as PlaneIcon
} from 'lucide-react';


interface UserProfile {
  userId?: string;
  username: string;
  email: string;
  age?: number;
  gender?: string;
  goals?: string;  // JSON string
  bio?: string;
  profilePic?: string;  // NO | null, just ?
  credits: number;
  location?: string;
  createdAt: string;
  lastActive: string;
  preferences: string;
  birthday?: string;
  martialStatus?: string;
  fieldOfWork?: string;
  englishLevel?: string;
  languages?: string[];
  interests?: string[];
  personalityTraits?: string[];
  totalChats?: number;
  totalMatches?: number;
  followingCount?: number;
  isVerified?: boolean;
  isPremium?: boolean;
}

interface UserPhoto {
  id: string;
  url: string;
  isPrivate: boolean;
  isProfile: boolean;
}

// Goals options
const GOALS_OPTIONS = [
  'Find friends', 'Have fun', 'Meet people', 'Chat', 'Find relationship',
  'Learn languages', 'Practice English', 'Cultural exchange', 'Business networking',
  'Travel buddies'
];

// English level options
const ENGLISH_LEVELS = ['Basic', 'Intermediate', 'Fluent', 'Native'];

// Martial status options
const MARTIAL_STATUS = ['Single', 'In a relationship', 'Married', 'Divorced', 'Separated', 'Widowed'];

// Gender options
const GENDER_OPTIONS = ['men', 'women', 'other', 'prefer-not-to-say'];

// Interests options
const INTERESTS_OPTIONS = [
  'Music', 'Movies', 'Gaming', 'Sports', 'Travel', 'Food', 'Art', 'Reading',
  'Technology', 'Fitness', 'Photography', 'Dancing', 'Cooking', 'Writing',
  'Hiking', 'Yoga', 'Meditation', 'Fashion', 'Cars', 'Animals'
];

// Personality traits options
const TRAITS_OPTIONS = [
  'Adventurous', 'Creative', 'Friendly', 'Introvert', 'Extrovert', 'Optimistic',
  'Realistic', 'Ambitious', 'Calm', 'Energetic', 'Funny', 'Serious', 'Patient',
  'Impulsive', 'Organized', 'Spontaneous', 'Thoughtful', 'Confident', 'Humble'
];

export default function ProfilePage() {
  const { user, profile, loading, error, logout, isAuthenticated } = useAuth();
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'public' | 'private'>('public');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<UserPhoto | null>(null);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { colors, isDark } = useTheme();

  // FULL edit form state - ALL fields from Appwrite
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    bio: '',
    gender: '',
    location: '',
    fieldOfWork: '',
    englishLevel: '',
    martialStatus: '',
    age: '',
    birthday: '',
    languages: '',
    interests: [] as string[],
    personalityTraits: [] as string[],
    goals: [] as string[],
  });

  // Load ALL user data
  useEffect(() => {
    if (profile && !loading) {
      console.log('📊 Full profile data from Appwrite:', profile);
      
      // Parse goals from JSON string
      let goalsArray: string[] = [];
      try {
        goalsArray = profile.goals ? JSON.parse(profile.goals) : [];
      } catch {
        goalsArray = [];
      }

      // Parse preferences if needed
      let languagePref = 'en';
      try {
        const prefs = profile.preferences ? JSON.parse(profile.preferences) : {};
        languagePref = prefs.language || 'en';
      } catch {
        // Ignore parse error
      }

      // Initialize FULL edit form with ALL Appwrite fields
      setEditForm({
        username: profile.username || '',
        email: profile.email || '',
        bio: profile.bio || '',
        gender: profile.gender || '',
        location: profile.location || '',
        fieldOfWork: profile.fieldOfWork || '',
        englishLevel: profile.englishLevel || '',
        martialStatus: profile.martialStatus || '',
        age: profile.age?.toString() || '',
        birthday: profile.birthday || '',
        languages: profile.languages ? profile.languages.join(', ') : '',
        interests: profile.interests || [],
        personalityTraits: profile.personalityTraits || [],
        goals: goalsArray,
      });

     
      loadUserPhotos(profile as UserProfile);
      calculateProfileCompletion(profile as UserProfile);
      
    }
  }, [profile, loading]);

  const loadUserPhotos = async (profileData: UserProfile) => {
    try {
      const photoList: UserPhoto[] = [];
      
      if (profileData.profilePic) {
        photoList.push({
          id: 'profile',
          url: profileData.profilePic,
          isPrivate: false,
          isProfile: true
        });
      }
      
      setPhotos(photoList);
    } catch (error) {
      console.error('Failed to load photos:', error);
    }
  };

  // Calculate profile completion
  const calculateProfileCompletion = (profileData: UserProfile) => {
    const fields = [
      'username',
      'bio',
      'gender',
      'goals',
      'profilePic',
      'location',
      'age',
      'martialStatus',
      'fieldOfWork',
      'englishLevel',
      'languages',
      'interests',
    ];

    let completed = 0;
    
    fields.forEach(field => {
      const value = profileData[field as keyof UserProfile];
      if (field === 'goals') {
        try {
          const goals = value ? JSON.parse(value as string) : [];
          if (Array.isArray(goals) && goals.length > 0) completed++;
        } catch {
          if (value && (value as string).length > 0) completed++;
        }
      } else if (field === 'languages' || field === 'interests') {
        const arr = value as string[];
        if (arr && arr.length > 0) completed++;
      } else if (field === 'age') {
        if (value !== undefined && value !== null && Number(value) > 0) completed++;
      } else if (value && value.toString().trim().length > 0) {
        completed++;
      }
    });

    const percentage = Math.round((completed / fields.length) * 100);
    setProfileCompletion(percentage);

    if (percentage < 80 && !showCompletionModal) {
      setTimeout(() => {
        setShowCompletionModal(true);
      }, 1000);
    }
  };

  // Handle profile update
  const handleSaveChanges = async () => {
    if (!user || !profile) return;

    setIsUpdating(true);
    try {
      // Convert languages string to array
      const languagesArray = editForm.languages
        .split(',')
        .map(lang => lang.trim())
        .filter(lang => lang.length > 0);

      const updates: Partial<UserProfile> = {
        username: editForm.username,
        bio: editForm.bio,
        gender: editForm.gender,
        location: editForm.location,
        fieldOfWork: editForm.fieldOfWork,
        englishLevel: editForm.englishLevel,
        martialStatus: editForm.martialStatus,
        languages: languagesArray,
        interests: editForm.interests,
        personalityTraits: editForm.personalityTraits,
        goals: JSON.stringify(editForm.goals),
        age: editForm.age ? parseInt(editForm.age) : undefined,
        birthday: editForm.birthday || undefined,
      };

      console.log('🔄 Updating profile with:', updates);
      
      await authService.updateProfile(user.$id, updates);
      
      // Refresh user data without full page reload
      const result = await authService.getCurrentUser();
      if (result) {
        window.location.reload(); // Temporary until we implement proper state update
      }
      
      setIsEditing(false);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      alert(`Failed to update profile: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle multi-select changes
  const handleArrayFieldChange = (field: 'interests' | 'personalityTraits' | 'goals', value: string) => {
    setEditForm(prev => {
      const currentArray = prev[field];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  };

  // Handle photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        
        const fileUrl = await storageService.uploadProfilePictureFromBase64(
          base64,
          `${user.$id}-gallery-${Date.now()}.jpg`
        );

        const newPhoto: UserPhoto = {
          id: ID.unique(),
          url: fileUrl,
          isPrivate: activeTab === 'private',
          isProfile: false
        };
        
        setPhotos([...photos, newPhoto]);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Failed to upload photo:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle SET as profile photo
  const handleSetProfilePhoto = async (photoUrl: string) => {
    if (!user) return;

    try {
      await authService.updateProfile(user.$id, { profilePic: photoUrl });
      
      setPhotos(photos.map(photo => ({
        ...photo,
        isProfile: photo.url === photoUrl
      })));
      
      alert('Profile photo updated successfully!');
    } catch (error) {
      console.error('Failed to update profile photo:', error);
      alert('Failed to update profile photo.');
    }
  };

  // Handle photo delete
  const handleDeletePhoto = async (photoId: string) => {
    if (!user) return;

    const photoToDelete = photos.find(p => p.id === photoId);
    if (!photoToDelete) return;

    try {
      if (photoToDelete.isProfile) {
        alert('Cannot delete profile photo. Set another photo as profile first.');
        return;
      }

      setPhotos(photos.filter(photo => photo.id !== photoId));
      alert('Photo deleted successfully!');
    } catch (error) {
      console.error('Failed to delete photo:', error);
      alert('Failed to delete photo.');
    }
  };

  // Get online status
  const getOnlineStatus = () => {
    if (!profile?.lastActive) return 'Offline';
    
    const lastActive = new Date(profile.lastActive);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastActive.getTime()) / (1000 * 60);
    
    if (diffMinutes < 5) return 'Active now';
    if (diffMinutes < 60) return `${Math.floor(diffMinutes)} minutes ago`;
    if (diffMinutes < 1440) return 'Today';
    return 'Offline';
  };

  // Get parsed profile data
  const getProfileData = () => {
    if (!profile) return null;

    let goalsArray: string[] = [];
    try {
      goalsArray = profile.goals ? JSON.parse(profile.goals) : [];
    } catch {
      goalsArray = [];
    }

    const languagesArray = profile.languages || [];
    const interestsArray = profile.interests || [];
    const traitsArray = profile.personalityTraits || [];
    
    return {
      ...profile,
      goalsArray,
      languagesArray,
      interestsArray,
      traitsArray,
      isVerified: profile.isVerified || false,
      isPremium: profile.isPremium || false,
      totalChats: profile.totalChats || 0,
      totalMatches: profile.totalMatches || 0,
      followingCount: profile.followingCount || 0,
    };
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
        <LayoutController />
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: colors.primary }} />
          <p style={{ color: colors.secondaryText }}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Not authenticated state
  if (!isAuthenticated || !profile) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
        <LayoutController />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="rounded-2xl shadow-lg p-8 text-center" style={{ backgroundColor: colors.cardBackground }}>
            <h1 className="text-2xl font-bold mb-4" style={{ color: colors.primaryText }}>Please Sign In</h1>
            <p className="mb-6" style={{ color: colors.secondaryText }}>You need to be signed in to view your profile.</p>
            <a
              href="/login"
              className="hover:bg-purple-700 font-bold py-3 px-6 rounded-xl transition-colors inline-block"
              style={{ backgroundColor: colors.primary, color: 'white' }}
            >
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  const profileData = getProfileData();
  if (!profileData) return null;

  const onlineStatus = getOnlineStatus();
  const isOnline = onlineStatus === 'Active now';

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <LayoutController />
      
      {/* Profile Completion Modal */}
      {showCompletionModal && profileCompletion < 80 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl p-6 max-w-md w-full" style={{ backgroundColor: colors.cardBackground }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold" style={{ color: colors.primaryText }}>Complete Your Profile</h3>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
                style={{ color: colors.primaryText }}
              >
                <X className="w-5 h-5 rounded-full" style={{ backgroundColor: colors.danger }} />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span style={{ color: colors.secondaryText }}>Profile Completion</span>
                <span className="font-bold" style={{ color: colors.secondary }}>{profileCompletion}%</span>
              </div>
              <div className="w-full rounded-full h-2" style={{ backgroundColor: colors.borderLight }}>
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${profileCompletion}%`,
                    background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})` 
                  }}
                ></div>
              </div>
            </div>
            
            <button
              onClick={() => {
                setShowCompletionModal(false);
                setIsEditing(true);
              }}
              className="w-full hover:bg-purple-700 font-bold py-3 rounded-xl transition-colors"
              style={{ backgroundColor: colors.primary, color: 'white' }}
            >
              Complete Profile Now
            </button>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="rounded-2xl shadow-lg p-6" style={{ backgroundColor: colors.cardBackground }}>
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              
              {/* Profile Image */}
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 shadow-xl" 
                     style={{ borderColor: colors.background }}>
                  {profileData.profilePic ? (
                    <img 
                      src={profileData.profilePic} 
                      alt={profileData.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold"
                         style={{ background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary})` }}>
                      {profileData.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                {/* Edit Profile Photo Button */}
                <button 
                  onClick={() => setShowPhotoModal(true)}
                  className="absolute bottom-2 right-2 p-2 rounded-full shadow-lg transition-colors"
                  style={{ backgroundColor: colors.secondary, color: 'white' }}
                >
                  <CameraIcon className="w-4 h-4" />
                </button>
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold" style={{ color: colors.primaryText }}>
                        {profileData.username}
                        {profileData.age && `, ${profileData.age}`}
                      </h1>
                      {profileData.isVerified && (
                        <div className="px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                             style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}>
                          <Shield className="w-3 h-3" />
                          Verified
                        </div>
                      )}
                    </div>
                    
                    {/* Location */}
                    <div className="flex items-center gap-2 mb-4" style={{ color: colors.secondaryText }}>
                      {profileData.location ? (
                        <>
                          <MapPin className="w-4 h-4" />
                          <span>{profileData.location}</span>
                          <span className="mx-2">•</span>
                        </>
                      ) : (
                        <span style={{ color: colors.placeholderText }}>No location set</span>
                      )}
                      
                      {/* Online status */}
                      <span className={`font-medium flex items-center gap-1`} 
                            style={{ color: isOnline ? colors.success : colors.tertiaryText }}>
                        <div className={`w-2 h-2 rounded-full ${isOnline ? 'animate-pulse' : ''}`} 
                             style={{ backgroundColor: isOnline ? colors.success : colors.tertiaryText }}></div>
                        {onlineStatus}
                      </span>
                    </div>
                    
                    {/* User details chips */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profileData.gender && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                              style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                          <User className="w-3 h-3" />
                          {profileData.gender === 'men' ? 'Male' : 
                           profileData.gender === 'women' ? 'Female' : 
                           profileData.gender}
                        </span>
                      )}
                      {profileData.fieldOfWork && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                              style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}>
                          <BriefcaseIcon className="w-3 h-3" />
                          {profileData.fieldOfWork}
                        </span>
                      )}
                      {profileData.englishLevel && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                              style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}>
                          <Globe className="w-3 h-3" />
                          English: {profileData.englishLevel}
                        </span>
                      )}
                      {profileData.martialStatus && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                              style={{ backgroundColor: `${colors.success}20`, color: colors.success }}>
                          <HeartIcon className="w-3 h-3" />
                          {profileData.martialStatus}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="hover:opacity-90 font-bold py-2 px-6 rounded-xl transition-colors flex items-center gap-2"
                      style={{ backgroundColor: colors.secondary, color: 'white' }}
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                    <button
                      className="border font-medium py-2 px-6 rounded-xl transition-colors flex items-center gap-2"
                      style={{ 
                        backgroundColor: colors.background, 
                        color: colors.secondaryText, 
                        borderColor: colors.border 
                      }}
                    >
                      <CreditCard className="w-4 h-4" />
                      {profileData.credits} Credits
                    </button>
                  </div>
                </div>
                
                {/* Profile Completion Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm" style={{ color: colors.secondaryText }}>Profile Strength</span>
                    <span className="text-sm font-bold" style={{ color: colors.secondary }}>{profileCompletion}%</span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ backgroundColor: colors.borderLight }}>
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${profileCompletion}%`,
                        background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Photos & Basic Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Photo Gallery */}
            <div className="rounded-2xl shadow-lg p-6" style={{ backgroundColor: colors.cardBackground }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: colors.primaryText }}>Photos</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('public')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors`}
                    style={{ 
                      backgroundColor: activeTab === 'public' ? colors.secondary : colors.inputBackground,
                      color: activeTab === 'public' ? 'white' : colors.secondaryText
                    }}
                  >
                    Public ({photos.filter(p => !p.isPrivate).length})
                  </button>
                  <button
                    onClick={() => setActiveTab('private')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors`}
                    style={{ 
                      backgroundColor: activeTab === 'private' ? colors.secondary : colors.inputBackground,
                      color: activeTab === 'private' ? 'white' : colors.secondaryText
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="w-3 h-3" />
                      Private ({photos.filter(p => p.isPrivate).length})
                    </div>
                  </button>
                </div>
              </div>
              
              {/* Photos Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Upload Photo Card */}
                <label className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors hover:opacity-80 ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                style={{ borderColor: colors.border, backgroundColor: colors.inputBackground }}>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                  />
                  {uploading ? (
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: colors.secondary }} />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mb-2" style={{ color: colors.tertiaryText }} />
                      <span className="text-sm font-medium" style={{ color: colors.secondaryText }}>Add Photo</span>
                    </>
                  )}
                </label>
                
                {/* Display Photos */}
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="aspect-square rounded-xl overflow-hidden relative group cursor-pointer"
                    style={{ backgroundColor: colors.inputBackground }}
                    onClick={() => {
                      setSelectedPhoto(photo);
                      setShowPhotoModal(true);
                    }}
                  >
                    <img 
                      src={photo.url} 
                      alt="Profile photo"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Photo Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                        {photo.isProfile && (
                          <div className="px-2 py-1 rounded-full text-xs text-white"
                               style={{ backgroundColor: colors.secondary }}>
                            Profile
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePhoto(photo.id);
                          }}
                          className="p-1.5 rounded-full transition-colors text-white hover:opacity-80"
                          style={{ backgroundColor: colors.danger }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Set as Profile Photo Button */}
                    {!photo.isProfile && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetProfilePhoto(photo.url);
                        }}
                        className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        title="Set as profile photo"
                        style={{ color: colors.iconColor }}
                      >
                        <User className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* About Section - SHOWING ALL FIELDS */}
            <div className="rounded-2xl shadow-lg p-6" style={{ backgroundColor: colors.cardBackground }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: colors.primaryText }}>About Me</h2>
                {isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-lg transition-colors"
                      style={{ color: colors.secondaryText, backgroundColor: colors.inputBackground }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      disabled={isUpdating}
                      className="font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: colors.secondary, color: 'white' }}
                    >
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
              
              {/* EDIT MODE - Show ALL fields for editing */}
              {isEditing ? (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.secondaryText }}>
                        Username *
                      </label>
                      <input
                        type="text"
                        value={editForm.username}
                        onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 transition-colors"
                        placeholder="Enter your username"
                        style={{ 
                          backgroundColor: colors.inputBackground,
                          color: colors.primaryText,
                          borderColor: colors.border,
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.secondaryText }}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={editForm.email}
                        readOnly
                        className="w-full px-4 py-2.5 border rounded-lg"
                        placeholder="Your email (cannot change)"
                        style={{ 
                          backgroundColor: colors.inputBackground,
                          color: colors.primaryText,
                          borderColor: colors.border,
                          opacity: 0.7
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.secondaryText }}>
                        Age
                      </label>
                      <input
                        type="number"
                        value={editForm.age}
                        onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 transition-colors"
                        placeholder="Enter your age"
                        min="18"
                        max="100"
                        style={{ 
                          backgroundColor: colors.inputBackground,
                          color: colors.primaryText,
                          borderColor: colors.border,
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.secondaryText }}>
                        Birthday
                      </label>
                      <input
                        type="date"
                        value={editForm.birthday}
                        onChange={(e) => setEditForm({...editForm, birthday: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 transition-colors"
                        style={{ 
                          backgroundColor: colors.inputBackground,
                          color: colors.primaryText,
                          borderColor: colors.border,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.secondaryText }}>
                        Gender
                      </label>
                      <select
                        value={editForm.gender}
                        onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 transition-colors"
                        style={{ 
                          backgroundColor: colors.inputBackground,
                          color: colors.primaryText,
                          borderColor: colors.border,
                        }}
                      >
                        <option value="" style={{ color: colors.placeholderText }}>Select gender</option>
                        {GENDER_OPTIONS.map(option => (
                          <option key={option} value={option}>
                            {option === 'men' ? 'Male' : 
                             option === 'women' ? 'Female' : 
                             option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.secondaryText }}>
                        Relationship Status
                      </label>
                      <select
                        value={editForm.martialStatus}
                        onChange={(e) => setEditForm({...editForm, martialStatus: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 transition-colors"
                        style={{ 
                          backgroundColor: colors.inputBackground,
                          color: colors.primaryText,
                          borderColor: colors.border,
                        }}
                      >
                        <option value="" style={{ color: colors.placeholderText }}>Select status</option>
                        {MARTIAL_STATUS.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.secondaryText }}>
                        Location
                      </label>
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 transition-colors"
                        placeholder="City, Country"
                        style={{ 
                          backgroundColor: colors.inputBackground,
                          color: colors.primaryText,
                          borderColor: colors.border,
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.secondaryText }}>
                        Profession / Field of Work
                      </label>
                      <input
                        type="text"
                        value={editForm.fieldOfWork}
                        onChange={(e) => setEditForm({...editForm, fieldOfWork: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 transition-colors"
                        placeholder="Your profession"
                        style={{ 
                          backgroundColor: colors.inputBackground,
                          color: colors.primaryText,
                          borderColor: colors.border,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.secondaryText }}>
                      Bio *
                    </label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 transition-colors"
                      placeholder="Tell us about yourself..."
                      style={{ 
                        backgroundColor: colors.inputBackground,
                        color: colors.primaryText,
                        borderColor: colors.border,
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.secondaryText }}>
                        English Level
                      </label>
                      <select
                        value={editForm.englishLevel}
                        onChange={(e) => setEditForm({...editForm, englishLevel: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 transition-colors"
                        style={{ 
                          backgroundColor: colors.inputBackground,
                          color: colors.primaryText,
                          borderColor: colors.border,
                        }}
                      >
                        <option value="" style={{ color: colors.placeholderText }}>Select level</option>
                        {ENGLISH_LEVELS.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.secondaryText }}>
                        Languages (comma separated)
                      </label>
                      <input
                        type="text"
                        value={editForm.languages}
                        onChange={(e) => setEditForm({...editForm, languages: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 transition-colors"
                        placeholder="English, German, Spanish"
                        style={{ 
                          backgroundColor: colors.inputBackground,
                          color: colors.primaryText,
                          borderColor: colors.border,
                        }}
                      />
                    </div>
                  </div>

                  {/* Goals Section */}
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: colors.secondaryText }}>
                      Your Goals (Select up to 3)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {GOALS_OPTIONS.map(goal => (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => handleArrayFieldChange('goals', goal)}
                          className="px-4 py-2.5 rounded-lg border transition-colors flex items-center justify-center gap-2"
                          style={{
                            backgroundColor: editForm.goals.includes(goal) 
                              ? colors.secondary 
                              : colors.inputBackground,
                            color: editForm.goals.includes(goal) 
                              ? 'white' 
                              : colors.primaryText,
                            borderColor: editForm.goals.includes(goal) 
                              ? colors.secondary 
                              : colors.border,
                          }}
                        >
                          <TargetIcon className="w-4 h-4" />
                          {goal}
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 text-sm" style={{ color: colors.tertiaryText }}>
                      Selected: {editForm.goals.join(', ')}
                    </div>
                  </div>

                  {/* Interests Section */}
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: colors.secondaryText }}>
                      Your Interests
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {INTERESTS_OPTIONS.map(interest => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => handleArrayFieldChange('interests', interest)}
                          className="px-3 py-2 rounded-lg border transition-colors flex items-center justify-center gap-2 text-sm"
                          style={{
                            backgroundColor: editForm.interests.includes(interest) 
                              ? colors.primary 
                              : colors.inputBackground,
                            color: editForm.interests.includes(interest) 
                              ? 'white' 
                              : colors.primaryText,
                            borderColor: editForm.interests.includes(interest) 
                              ? colors.primary 
                              : colors.border,
                          }}
                        >
                          {interest === 'Music' && <MusicIcon className="w-4 h-4" />}
                          {interest === 'Movies' && <FilmIcon className="w-4 h-4" />}
                          {interest === 'Gaming' && <GameIcon className="w-4 h-4" />}
                          {interest === 'Sports' && <Activity className="w-4 h-4" />}
                          {interest === 'Travel' && <PlaneIcon className="w-4 h-4" />}
                          {interest === 'Food' && <UtensilsIcon className="w-4 h-4" />}
                          {interest === 'Art' && <PaletteIcon className="w-4 h-4" />}
                          {interest === 'Reading' && <BookOpenIcon className="w-4 h-4" />}
                          {interest === 'Fitness' && <DumbbellIcon className="w-4 h-4" />}
                          {!['Music','Movies','Gaming','Sports','Travel','Food','Art','Reading','Fitness'].includes(interest) && 
                           <Sparkles className="w-4 h-4" />}
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Personality Traits */}
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: colors.secondaryText }}>
                      Personality Traits
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {TRAITS_OPTIONS.map(trait => (
                        <button
                          key={trait}
                          type="button"
                          onClick={() => handleArrayFieldChange('personalityTraits', trait)}
                          className="px-3 py-2 rounded-lg border transition-colors flex items-center justify-center gap-2 text-sm"
                          style={{
                            backgroundColor: editForm.personalityTraits.includes(trait) 
                              ? colors.success 
                              : colors.inputBackground,
                            color: editForm.personalityTraits.includes(trait) 
                              ? 'white' 
                              : colors.primaryText,
                            borderColor: editForm.personalityTraits.includes(trait) 
                              ? colors.success 
                              : colors.border,
                          }}
                        >
                          <Smile className="w-4 h-4" />
                          {trait}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* VIEW MODE - Show ALL fields from Appwrite */
                <div className="space-y-8">
                  
                  {/* Bio */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: colors.primaryText }}>
                      <User className="w-5 h-5" style={{ color: colors.secondary }} />
                      About Me
                    </h3>
                    <p className="leading-relaxed p-4 rounded-lg border"
                       style={{ 
                         backgroundColor: colors.inputBackground, 
                         borderColor: colors.borderLight,
                         color: profileData.bio ? colors.primaryText : colors.placeholderText
                       }}>
                      {profileData.bio || (
                        <span className="italic">No bio added yet. Add a bio to tell others about yourself.</span>
                      )}
                    </p>
                  </div>

                  {/* Basic Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Username */}
                    <div className="p-4 rounded-xl border" 
                         style={{ backgroundColor: colors.inputBackground, borderColor: colors.borderLight }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                             style={{ backgroundColor: colors.primary }}>
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm" style={{ color: colors.secondaryText }}>Username</div>
                          <div className="font-bold" style={{ color: colors.primaryText }}>
                            {profileData.username || 'Not set'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="p-4 rounded-xl border" 
                         style={{ backgroundColor: colors.inputBackground, borderColor: colors.borderLight }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                             style={{ backgroundColor: colors.secondary }}>
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm" style={{ color: colors.secondaryText }}>Email</div>
                          <div className="font-bold truncate" style={{ color: colors.primaryText }}>
                            {profileData.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Age */}
                    <div className="p-4 rounded-xl border" 
                         style={{ backgroundColor: colors.inputBackground, borderColor: colors.borderLight }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                             style={{ backgroundColor: colors.success }}>
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm" style={{ color: colors.secondaryText }}>Age</div>
                          <div className="font-bold" style={{ color: colors.primaryText }}>
                            {profileData.age || 'Not set'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Birthday */}
                    <div className="p-4 rounded-xl border" 
                         style={{ backgroundColor: colors.inputBackground, borderColor: colors.borderLight }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                             style={{ backgroundColor: colors.warning }}>
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm" style={{ color: colors.secondaryText }}>Birthday</div>
                          <div className="font-bold" style={{ color: colors.primaryText }}>
                            {profileData.birthday ? new Date(profileData.birthday).toLocaleDateString() : 'Not set'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gender */}
                    {profileData.gender && (
                      <div className="p-4 rounded-xl border" 
                           style={{ backgroundColor: colors.inputBackground, borderColor: colors.borderLight }}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                               style={{ backgroundColor: colors.primary }}>
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm" style={{ color: colors.secondaryText }}>Gender</div>
                            <div className="font-bold" style={{ color: colors.primaryText }}>
                              {profileData.gender === 'men' ? 'Male' : 
                               profileData.gender === 'women' ? 'Female' : 
                               profileData.gender}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Martial Status */}
                    {profileData.martialStatus && (
                      <div className="p-4 rounded-xl border" 
                           style={{ backgroundColor: colors.inputBackground, borderColor: colors.borderLight }}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                               style={{ backgroundColor: colors.danger }}>
                            <HeartIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm" style={{ color: colors.secondaryText }}>Relationship Status</div>
                            <div className="font-bold" style={{ color: colors.primaryText }}>
                              {profileData.martialStatus}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    {profileData.location && (
                      <div className="p-4 rounded-xl border" 
                           style={{ backgroundColor: colors.inputBackground, borderColor: colors.borderLight }}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                               style={{ backgroundColor: colors.success }}>
                            <MapPin className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm" style={{ color: colors.secondaryText }}>Location</div>
                            <div className="font-bold" style={{ color: colors.primaryText }}>
                              {profileData.location}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Field of Work */}
                    {profileData.fieldOfWork && (
                      <div className="p-4 rounded-xl border" 
                           style={{ backgroundColor: colors.inputBackground, borderColor: colors.borderLight }}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                               style={{ backgroundColor: colors.secondary }}>
                            <BriefcaseIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm" style={{ color: colors.secondaryText }}>Profession</div>
                            <div className="font-bold" style={{ color: colors.primaryText }}>
                              {profileData.fieldOfWork}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* English Level */}
                    {profileData.englishLevel && (
                      <div className="p-4 rounded-xl border" 
                           style={{ backgroundColor: colors.inputBackground, borderColor: colors.borderLight }}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                               style={{ backgroundColor: colors.secondary }}>
                            <Globe className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm" style={{ color: colors.secondaryText }}>English Level</div>
                            <div className="font-bold" style={{ color: colors.primaryText }}>
                              {profileData.englishLevel}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Languages */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: colors.primaryText }}>
                      <Languages className="w-5 h-5" style={{ color: colors.secondary }} />
                      Languages
                    </h3>
                    {profileData.languagesArray.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profileData.languagesArray.map((lang, index) => (
                          <span 
                            key={index}
                            className="px-4 py-2 rounded-full font-medium hover:shadow-md transition-shadow flex items-center gap-2"
                            style={{ 
                              backgroundColor: `${colors.secondary}20`, 
                              color: colors.secondary,
                              borderColor: `${colors.secondary}40`
                            }}
                          >
                            <Globe className="w-4 h-4" />
                            {lang}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="italic p-4 rounded-lg border" 
                         style={{ 
                           backgroundColor: colors.inputBackground, 
                           borderColor: colors.borderLight,
                           color: colors.placeholderText
                         }}>
                        No languages added. Add languages you speak.
                      </p>
                    )}
                  </div>

                  {/* Goals */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: colors.primaryText }}>
                      <TargetIcon className="w-5 h-5" style={{ color: colors.secondary }} />
                      My Goals
                    </h3>
                    {profileData.goalsArray.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profileData.goalsArray.map((goal, index) => (
                          <span 
                            key={index}
                            className="px-4 py-2 rounded-full font-medium hover:shadow-md transition-shadow flex items-center gap-2"
                            style={{ 
                              backgroundColor: `${colors.secondary}20`, 
                              color: colors.secondary,
                              borderColor: `${colors.secondary}40`
                            }}
                          >
                            <TargetIcon className="w-4 h-4" />
                            {goal}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="italic p-4 rounded-lg border" 
                         style={{ 
                           backgroundColor: colors.inputBackground, 
                           borderColor: colors.borderLight,
                           color: colors.placeholderText
                         }}>
                        No goals set. What are you looking for on this platform?
                      </p>
                    )}
                  </div>

                  {/* Interests */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: colors.primaryText }}>
                      <Sparkles className="w-5 h-5" style={{ color: colors.secondary }} />
                      My Interests
                    </h3>
                    {profileData.interestsArray.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {profileData.interestsArray.map((interest, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center p-3 border rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-md group"
                            style={{ 
                              backgroundColor: colors.cardBackground,
                              borderColor: colors.border
                            }}
                          >
                            <div className="w-12 h-12 border-2 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"
                                 style={{ 
                                   backgroundColor: `${colors.primary}10`,
                                   borderColor: colors.border
                                 }}>
                              {interest === 'Music' && <MusicIcon className="w-5 h-5" style={{ color: colors.secondary }} />}
                              {interest === 'Movies' && <FilmIcon className="w-5 h-5" style={{ color: colors.secondary }} />}
                              {interest === 'Gaming' && <GameIcon className="w-5 h-5" style={{ color: colors.secondary }} />}
                              {interest === 'Sports' && <Activity className="w-5 h-5" style={{ color: colors.secondary }} />}
                              {interest === 'Travel' && <PlaneIcon className="w-5 h-5" style={{ color: colors.secondary }} />}
                              {interest === 'Food' && <UtensilsIcon className="w-5 h-5" style={{ color: colors.secondary }} />}
                              {interest === 'Art' && <PaletteIcon className="w-5 h-5" style={{ color: colors.secondary }} />}
                              {interest === 'Reading' && <BookOpenIcon className="w-5 h-5" style={{ color: colors.secondary }} />}
                              {interest === 'Fitness' && <DumbbellIcon className="w-5 h-5" style={{ color: colors.secondary }} />}
                              {!['Music','Movies','Gaming','Sports','Travel','Food','Art','Reading','Fitness'].includes(interest) && 
                               <Sparkles className="w-5 h-5" style={{ color: colors.secondary }} />}
                            </div>
                            <span className="text-sm font-medium text-center" style={{ color: colors.primaryText }}>
                              {interest}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="italic p-4 rounded-lg border" 
                         style={{ 
                           backgroundColor: colors.inputBackground, 
                           borderColor: colors.borderLight,
                           color: colors.placeholderText
                         }}>
                        No interests added. Add your hobbies and interests.
                      </p>
                    )}
                  </div>

                  {/* Personality Traits */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: colors.primaryText }}>
                      <Smile className="w-5 h-5" style={{ color: colors.secondary }} />
                      Personality Traits
                    </h3>
                    {profileData.traitsArray.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profileData.traitsArray.map((trait, index) => (
                          <span 
                            key={index}
                            className="px-4 py-2 rounded-full font-medium hover:shadow-md transition-shadow flex items-center gap-2"
                            style={{ 
                              backgroundColor: `${colors.success}20`, 
                              color: colors.success,
                              borderColor: `${colors.success}40`
                            }}
                          >
                            <Smile className="w-4 h-4" />
                            {trait}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="italic p-4 rounded-lg border" 
                         style={{ 
                           backgroundColor: colors.inputBackground, 
                           borderColor: colors.borderLight,
                           color: colors.placeholderText
                         }}>
                        No personality traits added. Describe your personality.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Stats & Quick Actions */}
          <div className="space-y-8">
            
            {/* Stats Card */}
            <div className="rounded-2xl shadow-lg p-6" style={{ backgroundColor: colors.cardBackground }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: colors.primaryText }}>Your Stats</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl border"
                     style={{ 
                       backgroundColor: colors.inputBackground,
                       borderColor: colors.borderLight
                     }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                         style={{ backgroundColor: colors.primary }}>
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: colors.primaryText }}>Credits</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: colors.primary }}>
                    {profileData.credits}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl border"
                     style={{ 
                       backgroundColor: colors.inputBackground,
                       borderColor: colors.borderLight
                     }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                         style={{ backgroundColor: colors.danger }}>
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: colors.primaryText }}>Total Matches</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: colors.danger }}>
                    {profileData.totalMatches}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl border"
                     style={{ 
                       backgroundColor: colors.inputBackground,
                       borderColor: colors.borderLight
                     }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                         style={{ backgroundColor: colors.success }}>
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: colors.primaryText }}>Total Chats</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: colors.success }}>
                    {profileData.totalChats}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl border"
                     style={{ 
                       backgroundColor: colors.inputBackground,
                       borderColor: colors.borderLight
                     }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                         style={{ backgroundColor: colors.warning }}>
                      <UsersIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: colors.primaryText }}>Following</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: colors.warning }}>
                    {profileData.followingCount}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Account Info */}
            <div className="rounded-2xl shadow-lg p-6" style={{ backgroundColor: colors.cardBackground }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: colors.primaryText }}>Account Info</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 rounded-lg transition-colors"
                     style={{ color: colors.secondaryText }}>
                  <span>Member Since</span>
                  <span className="font-medium" style={{ color: colors.primaryText }}>
                    {new Date(profileData.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-lg transition-colors"
                     style={{ color: colors.secondaryText }}>
                  <span>Last Active</span>
                  <span className="font-medium" style={{ color: colors.primaryText }}>
                    {new Date(profileData.lastActive).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-lg transition-colors"
                     style={{ color: colors.secondaryText }}>
                  <span>User ID</span>
                  <span className="font-mono text-xs truncate" style={{ color: colors.tertiaryText }}>
                    {profileData.userId?.substring(0, 8)}...
                  </span>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="rounded-2xl shadow-lg p-6" style={{ backgroundColor: colors.cardBackground }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: colors.primaryText }}>Quick Actions</h2>
              
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors group hover:opacity-90"
                        style={{ backgroundColor: colors.inputBackground }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                       style={{ backgroundColor: colors.secondary }}>
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium" style={{ color: colors.primaryText }}>Discover People</div>
                    <div className="text-sm" style={{ color: colors.secondaryText }}>Find new connections</div>
                  </div>
                </button>
                
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors group hover:opacity-90"
                  style={{ backgroundColor: colors.inputBackground }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                       style={{ backgroundColor: colors.danger }}>
                    <LogOut className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium" style={{ color: colors.danger }}>Log Out</div>
                    <div className="text-sm" style={{ color: colors.danger, opacity: 0.7 }}>Sign out of your account</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Photo Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Photo Gallery</h3>
                <p className="text-gray-300 mt-1">View and manage your photos</p>
              </div>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            
            {/* Main Photo Display */}
            <div className="bg-white rounded-xl p-4 mb-4" style={{ backgroundColor: colors.cardBackground }}>
              <div className="aspect-square rounded-lg overflow-hidden"
                   style={{ backgroundColor: colors.inputBackground }}>
                {selectedPhoto ? (
                  <img 
                    src={selectedPhoto.url} 
                    alt="Selected"
                    className="w-full h-full object-cover"
                  />
                ) : photos.length > 0 ? (
                  <img 
                    src={photos[0].url} 
                    alt="Gallery"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="w-24 h-24" style={{ color: colors.border }} />
                  </div>
                )}
              </div>
            </div>
            
            {/* Thumbnail Strip */}
            {photos.length > 0 ? (
              <div className="grid grid-cols-6 gap-2">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                      selectedPhoto?.id === photo.id 
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-105' 
                        : 'opacity-80 hover:opacity-100 hover:scale-105'
                    }`}
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <img 
                      src={photo.url} 
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white">
                <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-300">No photos yet</p>
                <p className="text-gray-400 text-sm">Upload some photos to get started</p>
              </div>
            )}
            
            {/* Photo Actions */}
            {selectedPhoto && (
              <div className="mt-6 p-4 backdrop-blur-sm rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <div className="font-medium">Photo Info</div>
                    <div className="text-sm text-gray-300">
                      {selectedPhoto.isPrivate ? 'Private Photo' : 'Public Photo'} • 
                      {selectedPhoto.isProfile ? ' Profile Picture' : ''}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!selectedPhoto.isProfile && (
                      <button
                        onClick={() => handleSetProfilePhoto(selectedPhoto.url)}
                        className="px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 hover:opacity-90"
                        style={{ backgroundColor: colors.secondary }}
                      >
                        <User className="w-4 h-4" />
                        Set as Profile
                      </button>
                    )}
                    {!selectedPhoto.isProfile && (
                      <button
                        onClick={() => {
                          handleDeletePhoto(selectedPhoto.id);
                          setSelectedPhoto(null);
                        }}
                        className="px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 hover:opacity-90"
                        style={{ backgroundColor: colors.danger }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}