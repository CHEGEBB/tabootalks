/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import LayoutController from '@/components/layout/LayoutController';
import useAuth from '@/lib/hooks/useAuth';
import authService from '@/lib/services/authService';
import storageService from '@/lib/appwrite/storage';
import { ID } from 'appwrite';
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
  userId: string;
  username: string;
  email: string;
  gender?: string;
  goals?: string;
  bio?: string;
  profilePic?: string | null;
  credits: number;
  location?: string;
  createdAt: string;
  lastActive: string;
  preferences: string;
  age?: number;
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

      loadUserPhotos(profile);
      calculateProfileCompletion(profile);
    }
  }, [profile, loading]);

  // Load user's photos
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <LayoutController />
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Not authenticated state
  if (!isAuthenticated || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <LayoutController />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
            <p className="text-gray-600 mb-6">You need to be signed in to view your profile.</p>
            <a
              href="/login"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-colors inline-block"
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <LayoutController />
      
      {/* Profile Completion Modal */}
      {showCompletionModal && profileCompletion < 80 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Complete Your Profile</h3>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Profile Completion</span>
                <span className="font-bold text-purple-600">{profileCompletion}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
            </div>
            
            <button
              onClick={() => {
                setShowCompletionModal(false);
                setIsEditing(true);
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Complete Profile Now
            </button>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              
              {/* Profile Image */}
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  {profileData.profilePic ? (
                    <img 
                      src={profileData.profilePic} 
                      alt={profileData.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                      {profileData.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                {/* Edit Profile Photo Button */}
                <button 
                  onClick={() => setShowPhotoModal(true)}
                  className="absolute bottom-2 right-2 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
                >
                  <CameraIcon className="w-4 h-4" />
                </button>
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {profileData.username}
                        {profileData.age && `, ${profileData.age}`}
                      </h1>
                      {profileData.isVerified && (
                        <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Verified
                        </div>
                      )}
                    </div>
                    
                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      {profileData.location ? (
                        <>
                          <MapPin className="w-4 h-4" />
                          <span>{profileData.location}</span>
                          <span className="mx-2">•</span>
                        </>
                      ) : (
                        <span className="text-gray-400">No location set</span>
                      )}
                      
                      {/* Online status */}
                      <span className={`font-medium flex items-center gap-1 ${
                        isOnline ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                        {onlineStatus}
                      </span>
                    </div>
                    
                    {/* User details chips */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profileData.gender && (
                        <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {profileData.gender === 'men' ? 'Male' : 
                           profileData.gender === 'women' ? 'Female' : 
                           profileData.gender}
                        </span>
                      )}
                      {profileData.fieldOfWork && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <BriefcaseIcon className="w-3 h-3" />
                          {profileData.fieldOfWork}
                        </span>
                      )}
                      {profileData.englishLevel && (
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          English: {profileData.englishLevel}
                        </span>
                      )}
                      {profileData.martialStatus && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
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
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                    <button
                      className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-6 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      {profileData.credits} Credits
                    </button>
                  </div>
                </div>
                
                {/* Profile Completion Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Profile Strength</span>
                    <span className="text-sm font-bold text-purple-600">{profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${profileCompletion}%` }}
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
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Photos</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('public')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'public'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Public ({photos.filter(p => !p.isPrivate).length})
                  </button>
                  <button
                    onClick={() => setActiveTab('private')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'private'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
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
                <label className={`aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-purple-400 hover:bg-purple-50 ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                  />
                  {uploading ? (
                    <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-600">Add Photo</span>
                    </>
                  )}
                </label>
                
                {/* Display Photos */}
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="aspect-square rounded-xl overflow-hidden relative group cursor-pointer bg-gray-100"
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
                          <div className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs">
                            Profile
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePhoto(photo.id);
                          }}
                          className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
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
                        className="absolute top-2 right-2 bg-white/90 text-gray-800 p-1.5 rounded-full hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                        title="Set as profile photo"
                      >
                        <User className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* About Section - SHOWING ALL FIELDS */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">About Me</h2>
                {isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      disabled={isUpdating}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username *
                      </label>
                      <input
                        type="text"
                        value={editForm.username}
                        onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-colors placeholder:text-gray-500 text-gray-500"
                        placeholder="Enter your username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editForm.email}
                        readOnly
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 placeholder:text-gray-500 text-gray-500"
                        placeholder="Your email (cannot change)"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        value={editForm.age}
                        onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-colors placeholder:text-gray-500 text-gray-500"
                        placeholder="Enter your age"
                        min="18"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Birthday
                      </label>
                      <input
                        type="date"
                        value={editForm.birthday}
                        onChange={(e) => setEditForm({...editForm, birthday: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-colors placeholder:text-gray-500 text-gray-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        value={editForm.gender}
                        onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-colors placeholder:text-gray-500 text-gray-500"
                      >
                        <option value="" className="placeholder:text-gray-500 text-gray-500">Select gender</option>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship Status
                      </label>
                      <select
                        value={editForm.martialStatus}
                        onChange={(e) => setEditForm({...editForm, martialStatus: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-colors placeholder:text-gray-500 text-gray-500"
                      >
                        <option value="" className="placeholder:text-gray-500 text-gray-500">Select status</option>
                        {MARTIAL_STATUS.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-colors placeholder:text-gray-500 text-gray-500"
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profession / Field of Work
                      </label>
                      <input
                        type="text"
                        value={editForm.fieldOfWork}
                        onChange={(e) => setEditForm({...editForm, fieldOfWork: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-colors placeholder:text-gray-500 text-gray-500"
                        placeholder="Your profession"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio *
                    </label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-colors placeholder:text-gray-500 text-gray-500"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        English Level
                      </label>
                      <select
                        value={editForm.englishLevel}
                        onChange={(e) => setEditForm({...editForm, englishLevel: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-colors placeholder:text-gray-500 text-gray-500"
                      >
                        <option value="" className="placeholder:text-gray-500 text-gray-500">Select level</option>
                        {ENGLISH_LEVELS.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Languages (comma separated)
                      </label>
                      <input
                        type="text"
                        value={editForm.languages}
                        onChange={(e) => setEditForm({...editForm, languages: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-colors placeholder:text-gray-500 text-gray-500"
                        placeholder="English, German, Spanish"
                      />
                    </div>
                  </div>

                  {/* Goals Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Your Goals (Select up to 3)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {GOALS_OPTIONS.map(goal => (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => handleArrayFieldChange('goals', goal)}
                          className={`px-4 py-2.5 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                            editForm.goals.includes(goal)
                              ? 'bg-purple-600 text-white border-purple-600'
                              : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          <TargetIcon className="w-4 h-4" />
                          {goal}
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Selected: {editForm.goals.join(', ')}
                    </div>
                  </div>

                  {/* Interests Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Your Interests
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {INTERESTS_OPTIONS.map(interest => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => handleArrayFieldChange('interests', interest)}
                          className={`px-3 py-2 rounded-lg border transition-colors flex items-center justify-center gap-2 text-sm ${
                            editForm.interests.includes(interest)
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                          }`}
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
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Personality Traits
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {TRAITS_OPTIONS.map(trait => (
                        <button
                          key={trait}
                          type="button"
                          onClick={() => handleArrayFieldChange('personalityTraits', trait)}
                          className={`px-3 py-2 rounded-lg border transition-colors flex items-center justify-center gap-2 text-sm ${
                            editForm.personalityTraits.includes(trait)
                              ? 'bg-green-600 text-white border-green-600'
                              : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                          }`}
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
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-600" />
                      About Me
                    </h3>
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                      {profileData.bio || (
                        <span className="text-gray-400 italic">No bio added yet. Add a bio to tell others about yourself.</span>
                      )}
                    </p>
                  </div>

                  {/* Basic Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Username */}
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Username</div>
                          <div className="font-bold text-gray-900">{profileData.username || 'Not set'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Email</div>
                          <div className="font-bold text-gray-900 truncate">{profileData.email}</div>
                        </div>
                      </div>
                    </div>

                    {/* Age */}
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Age</div>
                          <div className="font-bold text-gray-900">{profileData.age || 'Not set'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Birthday */}
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Birthday</div>
                          <div className="font-bold text-gray-900">
                            {profileData.birthday ? new Date(profileData.birthday).toLocaleDateString() : 'Not set'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gender */}
                    {profileData.gender && (
                      <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Gender</div>
                            <div className="font-bold text-gray-900">
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
                      <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                            <HeartIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Relationship Status</div>
                            <div className="font-bold text-gray-900">{profileData.martialStatus}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    {profileData.location && (
                      <div className="p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl border border-cyan-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Location</div>
                            <div className="font-bold text-gray-900">{profileData.location}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Field of Work */}
                    {profileData.fieldOfWork && (
                      <div className="p-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center">
                            <BriefcaseIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Profession</div>
                            <div className="font-bold text-gray-900">{profileData.fieldOfWork}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* English Level */}
                    {profileData.englishLevel && (
                      <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <Globe className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">English Level</div>
                            <div className="font-bold text-gray-900">{profileData.englishLevel}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Languages */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Languages className="w-5 h-5 text-purple-600" />
                      Languages
                    </h3>
                    {profileData.languagesArray.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profileData.languagesArray.map((lang: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, index: React.Key | null | undefined) => (
                          <span 
                            key={index}
                            className="bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-300 text-indigo-800 px-4 py-2 rounded-full font-medium hover:shadow-md transition-shadow flex items-center gap-2"
                          >
                            <Globe className="w-4 h-4" />
                            {lang}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic bg-gray-50 p-4 rounded-lg border border-gray-200">
                        No languages added. Add languages you speak.
                      </p>
                    )}
                  </div>

                  {/* Goals */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <TargetIcon className="w-5 h-5 text-purple-600" />
                      My Goals
                    </h3>
                    {profileData.goalsArray.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profileData.goalsArray.map((goal, index) => (
                          <span 
                            key={index}
                            className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 text-purple-800 px-4 py-2 rounded-full font-medium hover:shadow-md transition-shadow flex items-center gap-2"
                          >
                            <TargetIcon className="w-4 h-4" />
                            {goal}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic bg-gray-50 p-4 rounded-lg border border-gray-200">
                        No goals set. What are you looking for on this platform?
                      </p>
                    )}
                  </div>

                  {/* Interests */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      My Interests
                    </h3>
                    {profileData.interestsArray.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {profileData.interestsArray.map((interest, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center p-3 bg-white border border-gray-200 hover:border-purple-300 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-md group"
                          >
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-gray-300 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                              {interest === 'Music' && <MusicIcon className="w-5 h-5 text-purple-600" />}
                              {interest === 'Movies' && <FilmIcon className="w-5 h-5 text-purple-600" />}
                              {interest === 'Gaming' && <GameIcon className="w-5 h-5 text-purple-600" />}
                              {interest === 'Sports' && <Activity className="w-5 h-5 text-purple-600" />}
                              {interest === 'Travel' && <PlaneIcon className="w-5 h-5 text-purple-600" />}
                              {interest === 'Food' && <UtensilsIcon className="w-5 h-5 text-purple-600" />}
                              {interest === 'Art' && <PaletteIcon className="w-5 h-5 text-purple-600" />}
                              {interest === 'Reading' && <BookOpenIcon className="w-5 h-5 text-purple-600" />}
                              {interest === 'Fitness' && <DumbbellIcon className="w-5 h-5 text-purple-600" />}
                              {!['Music','Movies','Gaming','Sports','Travel','Food','Art','Reading','Fitness'].includes(interest) && 
                               <Sparkles className="w-5 h-5 text-purple-600" />}
                            </div>
                            <span className="text-sm font-medium text-gray-900 text-center">{interest}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic bg-gray-50 p-4 rounded-lg border border-gray-200">
                        No interests added. Add your hobbies and interests.
                      </p>
                    )}
                  </div>

                  {/* Personality Traits */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Smile className="w-5 h-5 text-purple-600" />
                      Personality Traits
                    </h3>
                    {profileData.traitsArray.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profileData.traitsArray.map((trait, index) => (
                          <span 
                            key={index}
                            className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 text-green-800 px-4 py-2 rounded-full font-medium hover:shadow-md transition-shadow flex items-center gap-2"
                          >
                            <Smile className="w-4 h-4" />
                            {trait}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic bg-gray-50 p-4 rounded-lg border border-gray-200">
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
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Your Stats</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Credits</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {profileData.credits}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Total Matches</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {profileData.totalMatches}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Total Chats</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {profileData.totalChats}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center">
                      <UsersIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Following</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {profileData.followingCount}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Account Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Account Info</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium text-gray-900">
                    {new Date(profileData.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-gray-600">Last Active</span>
                  <span className="font-medium text-gray-900">
                    {new Date(profileData.lastActive).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-gray-600">User ID</span>
                  <span className="font-mono text-xs text-gray-500 truncate">
                    {profileData.userId.substring(0, 8)}...
                  </span>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-purple-50 rounded-xl transition-colors group">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:from-purple-600 group-hover:to-purple-700 transition-colors">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Discover People</div>
                    <div className="text-sm text-gray-600">Find new connections</div>
                  </div>
                </button>
                
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-red-50 rounded-xl transition-colors group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center group-hover:from-red-600 group-hover:to-red-700 transition-colors">
                    <LogOut className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-red-600">Log Out</div>
                    <div className="text-sm text-red-500">Sign out of your account</div>
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
              <div className="text-white">
                <h3 className="text-xl font-bold">Photo Gallery</h3>
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
            <div className="bg-white rounded-xl p-4 mb-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
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
                    <Camera className="w-24 h-24 text-gray-300" />
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
              <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
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
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
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
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
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