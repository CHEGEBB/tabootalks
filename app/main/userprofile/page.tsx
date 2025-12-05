// app/main/profile/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import LayoutController from '@/components/layout/LayoutController';
import Image from 'next/image';
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
  Music as MusicIcon,
  Film as FilmIcon,
  Gamepad2 as GameIcon,
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
  Save
} from 'lucide-react';

// Unsplash Image URLs - Use these for profile images
const UNS_PHOTO_URLS = {
  profile: 'https://images.unsplash.com/photo-1739590441594-8e4e35a8a813?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  photo1: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
  photo2: 'https://images.unsplash.com/photo-1494790108755-2616b786d4d9?w=400&h=400&fit=crop',
  photo3: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
  photo4: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
  photo5: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop',
  berlin: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=400&h=300&fit=crop',
  travel: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
  coding: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop'
};

// Mock user data
const MOCK_USER = {
  id: 'user_001',
  name: 'David',
  fullName: 'David Müller',
  age: 28,
  country: 'Germany',
  city: 'Berlin',
  bio: 'Digital nomad and adventure seeker. Passionate about technology, travel, and meeting new people from around the world. Always up for a good conversation and new experiences!',
  birthday: '1996-03-15',
  martialStatus: 'Single',
  fieldOfWork: 'Software Developer',
  englishLevel: 'Fluent',
  languages: ['German', 'English', 'Spanish'],
  credits: 120,
  isVerified: true,
  isPremium: true,
  joinDate: '2024-01-15',
  lastActive: 'Just now'
};

// Mock photos with Unsplash URLs
const MOCK_PHOTOS = [
  { id: 1, url: UNS_PHOTO_URLS.profile, isPrivate: false, isProfile: true },
  { id: 2, url: UNS_PHOTO_URLS.photo1, isPrivate: false, isProfile: false },
  { id: 3, url: UNS_PHOTO_URLS.photo2, isPrivate: true, isProfile: false },
  { id: 4, url: UNS_PHOTO_URLS.photo3, isPrivate: false, isProfile: false },
  { id: 5, url: UNS_PHOTO_URLS.photo4, isPrivate: true, isProfile: false },
  { id: 6, url: UNS_PHOTO_URLS.photo5, isPrivate: false, isProfile: false },
];

// Mock traits/interests
const TRAITS = [
  'Adventurous', 'Creative', 'Tech-Savvy', 'Open-minded', 'Friendly', 'Ambitious'
];

const INTERESTS = [
  { name: 'Traveling', icon: <Plane className="w-4 h-4" />, color: 'text-blue-700  ' },
  { name: 'Coding', icon: <Globe className="w-4 h-4" />, color: 'text-purple-700' },
  { name: 'Photography', icon: <Camera className="w-4 h-4" />, color: ' text-emerald-500' },
  { name: 'Music', icon: <MusicIcon className="w-4 h-4" />, color: ' text-green-700' },
  { name: 'Movies', icon: <FilmIcon className="w-4 h-4" />, color: ' text-yellow-700' },
  { name: 'Gaming', icon: <GameIcon className="w-4 h-4" />, color: 'text-indigo-700' },
  { name: 'Fitness', icon: <Dumbbell className="w-4 h-4" />, color: ' text-pink-700' },
  { name: 'Cooking', icon: <Utensils className="w-4 h-4" />, color: 'text-orange-700' },
  { name: 'Reading', icon: <BookOpen className="w-4 h-4" />, color: ' text-black' },
  { name: 'Art', icon: <Palette className="w-4 h-4" />, color: 'text-cyan-700' },
];

const MOVIES = ['Inception', 'Interstellar', 'The Dark Knight', 'Pulp Fiction'];
const MUSIC = ['Rock', 'Electronic', 'Jazz', 'Indie Pop'];

// Looking for preferences
const LOOKING_FOR = {
  goal: 'Meaningful connections and fun conversations',
  ageRange: { min: 22, max: 35 },
  personality: ['Honest', 'Funny', 'Intelligent', 'Adventurous']
};

// Activity stats
const ACTIVITY_STATS = [
  { label: 'Total Chats', value: 156, icon: <MessageSquare className="w-4 h-4" />, color: 'bg-purple-100 text-purple-700' },
  { label: 'Following', value: 89, icon: <Users className="w-4 h-4" />, color: 'bg-blue-100 text-blue-700' },
  { label: 'Matches', value: 47, icon: <Heart className="w-4 h-4" />, color: 'bg-red-100 text-red-700' },
  { label: 'Messages Sent', value: 1243, icon: <Mail className="w-4 h-4" />, color: 'bg-green-100 text-green-700' },
];

export default function ProfilePage() {
  const [user, setUser] = useState(MOCK_USER);
  const [photos, setPhotos] = useState(MOCK_PHOTOS);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'public' | 'private'>('public');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<typeof MOCK_PHOTOS[0] | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: user.fullName,
    bio: user.bio,
    city: user.city,
    fieldOfWork: user.fieldOfWork,
    englishLevel: user.englishLevel,
    martialStatus: user.martialStatus,
    languages: user.languages.join(', '),
  });

  // Filter photos based on active tab
  const filteredPhotos = photos.filter(photo => 
    activeTab === 'public' ? !photo.isPrivate : photo.isPrivate
  );

  // Handle photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, use a random Unsplash URL
    const unsplashUrls = [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1494790108755-2616b786d4d9?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop'
    ];
    
    const randomUrl = unsplashUrls[Math.floor(Math.random() * unsplashUrls.length)];
    
    const newPhoto = {
      id: photos.length + 1,
      url: randomUrl,
      isPrivate: activeTab === 'private',
      isProfile: false
    };
    
    setPhotos([...photos, newPhoto]);
    setUploading(false);
  };

  // Handle profile photo change
  const handleSetProfilePhoto = (photoId: number) => {
    setPhotos(photos.map(photo => ({
      ...photo,
      isProfile: photo.id === photoId
    })));
  };

  // Handle photo delete
  const handleDeletePhoto = (photoId: number) => {
    setPhotos(photos.filter(photo => photo.id !== photoId));
  };

  // Handle save changes
  const handleSaveChanges = () => {
    setUser({
      ...user,
      fullName: editForm.fullName,
      bio: editForm.bio,
      city: editForm.city,
      fieldOfWork: editForm.fieldOfWork,
      englishLevel: editForm.englishLevel,
      martialStatus: editForm.martialStatus,
      languages: editForm.languages.split(',').map(lang => lang.trim()),
    });
    setIsEditing(false);
  };

  // Calculate age from birthday
  const calculateAge = (birthday: string) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <LayoutController />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              
              {/* Profile Image - ROUNDED */}
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-500 opacity-20"></div>
                    <img 
                      src={UNS_PHOTO_URLS.profile} 
                      alt="David Müller"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Edit Profile Photo Button */}
                <button 
                  onClick={() => setShowPhotoModal(true)}
                  className="absolute bottom-2 right-2 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
                >
                  <CameraIcon className="w-4 h-4" />
                </button>
                
                {/* Premium Badge */}
                {user.isPremium && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    PREMIUM
                  </div>
                )}
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">{user.name}, {calculateAge(user.birthday)}</h1>
                      {user.isVerified && (
                        <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Verified
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{user.city}, {user.country}</span>
                      <span className="mx-2">•</span>
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        {user.lastActive}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {user.fieldOfWork}
                      </span>
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                        English: {user.englishLevel}
                      </span>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        {user.martialStatus}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons - REMOVED SETTINGS BUTTON */}
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
                      {user.credits} Credits
                    </button>
                  </div>
                </div>
                
                {/* Activity Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {ACTIVITY_STATS.map((stat, index) => (
                    <div key={index} className="bg-white border border-gray-200 p-4 rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                          {stat.icon}
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
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
                    <div className="w-10 h-10 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-600">Add Photo</span>
                    </>
                  )}
                </label>
                
                {/* Display Photos */}
                {filteredPhotos.map((photo) => (
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
                        <div className="flex gap-2">
                          {photo.isPrivate && (
                            <div className="bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                            </div>
                          )}
                          {photo.isProfile && (
                            <div className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs">
                              Profile
                            </div>
                          )}
                        </div>
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
                          handleSetProfilePhoto(photo.id);
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
              
              {/* Photo Count */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{photos.length} photos total</span>
                  <span>{photos.filter(p => p.isPrivate).length} private</span>
                </div>
              </div>
            </div>
            
            {/* About Section */}
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
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
              
              {/* BIO Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Bio</h3>
                  {isEditing && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      Editing
                    </span>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={editForm.fullName}
                          onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-colors"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={editForm.city}
                          onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-colors"
                          placeholder="Enter your city"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        About Me
                      </label>
                      <textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-colors"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Profession
                        </label>
                        <input
                          type="text"
                          value={editForm.fieldOfWork}
                          onChange={(e) => setEditForm({...editForm, fieldOfWork: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-colors"
                          placeholder="Your profession"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          English Level
                        </label>
                        <select
                          value={editForm.englishLevel}
                          onChange={(e) => setEditForm({...editForm, englishLevel: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-colors"
                        >
                          <option>Basic</option>
                          <option>Intermediate</option>
                          <option>Fluent</option>
                          <option>Native</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Relationship Status
                        </label>
                        <select
                          value={editForm.martialStatus}
                          onChange={(e) => setEditForm({...editForm, martialStatus: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-colors"
                        >
                          <option>Single</option>
                          <option>In a relationship</option>
                          <option>Married</option>
                          <option>Divorced</option>
                          <option>Separated</option>
                          <option>Prefer not to say</option>
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
                          placeholder="English, German, Spanish"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Bio Text */}
                    <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                    
                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Full Name</div>
                          <div className="font-bold text-gray-900">{user.fullName}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Location</div>
                          <div className="font-bold text-gray-900">{user.city}, {user.country}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Birthday</div>
                          <div className="font-bold text-gray-900">
                            {new Date(user.birthday).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Profession</div>
                          <div className="font-bold text-gray-900">{user.fieldOfWork}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Languages */}
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Languages className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 mb-2">Languages I speak</div>
                        <div className="flex flex-wrap gap-2">
                          {user.languages.map((lang, index) => (
                            <span key={index} className="bg-white px-3 py-1.5 rounded-full text-sm font-medium border border-indigo-200 text-indigo-700">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Personality Traits */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Personality Traits</h3>
                <div className="flex flex-wrap gap-2">
                  {TRAITS.map((trait, index) => (
                    <span 
                      key={index}
                      className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 text-purple-700 px-4 py-2.5 rounded-full font-medium hover:shadow-md transition-shadow"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Interests */}
              <div className="mb-8 ">
                <h3 className="text-lg font-bold text-gray-900 mb-4">My Interests</h3>
                <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {INTERESTS.map((interest, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center p-3 bg-white border border-gray-200 hover:border-purple-300 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-md group cursor-pointer"
                    >
                      <div className={`w-12 h-12 border-2 border-gray-300 ${interest.color.split(' ')[0]} rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                        {interest.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-900 text-center">{interest.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Movies & Music */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Film className="w-5 h-5 text-purple-600" />
                    Favorite Movies
                  </h3>
                  <div className="space-y-2">
                    {MOVIES.map((movie, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-purple-50 rounded-lg transition-colors group">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center group-hover:from-purple-200 group-hover:to-purple-300">
                          <Film className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="font-medium text-gray-900">{movie}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Music className="w-5 h-5 text-blue-600" />
                    Music Preferences
                  </h3>
                  <div className="space-y-2">
                    {MUSIC.map((genre, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors group">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300">
                          <Music className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{genre}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Looking For & Quick Actions */}
          <div className="space-y-8">
            
            {/* Looking For Card */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Looking For
              </h2>
              
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-gray-600 mb-2">My Goal</div>
                  <div className="font-medium text-gray-900 p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-purple-100">
                    {LOOKING_FOR.goal}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 mb-2">Age Range I&apos;m Interested In</div>
                  <div className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-purple-100">
                    <div className="text-2xl font-bold text-purple-600">{LOOKING_FOR.ageRange.min}</div>
                    <div className="flex-1 h-2 bg-gradient-to-r from-purple-400 via-purple-300 to-blue-400 rounded-full"></div>
                    <div className="text-2xl font-bold text-blue-600">{LOOKING_FOR.ageRange.max}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 mb-2">Preferred Personality Traits</div>
                  <div className="flex flex-wrap gap-2">
                    {LOOKING_FOR.personality.map((trait, index) => (
                      <span
                        key={index}
                        className="bg-white/80 backdrop-blur-sm border border-blue-200 text-blue-700 px-3 py-1.5 rounded-full font-medium hover:shadow-sm transition-shadow"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Credits Card */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-purple-200 mb-1">Credit Balance</div>
                  <div className="text-3xl font-bold">{user.credits}</div>
                  <div className="text-purple-200">credits available</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-purple-200">Chatting</span>
                  <span className="font-medium">1 credit/message</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200">Send Photos</span>
                  <span className="font-medium">15 credits</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200">Request Photos</span>
                  <span className="font-medium">25 credits</span>
                </div>
              </div>
              
              <button className="w-full bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                Buy More Credits
              </button>
            </div>
            
            {/* Account Quick Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Account Info</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium text-gray-900">
                    {new Date(user.joinDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-gray-600">Profile ID</span>
                  <span className="font-mono font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {user.id}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-gray-600">Account Status</span>
                  <span className="font-medium text-green-600 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Active
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-gray-600">Email Verified</span>
                  <Check className="w-5 h-5 text-green-500" />
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
                
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 rounded-xl transition-colors group">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-700 transition-colors">
                    <Filter className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Preferences</div>
                    <div className="text-sm text-gray-600">Edit match filters</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-green-50 rounded-xl transition-colors group">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:from-green-600 group-hover:to-green-700 transition-colors">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Privacy Center</div>
                    <div className="text-sm text-gray-600">Manage privacy settings</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-red-50 rounded-xl transition-colors group">
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
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="w-24 h-24 text-gray-300" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Thumbnail Strip */}
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
            
            {/* Photo Info & Actions */}
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
                        onClick={() => handleSetProfilePhoto(selectedPhoto.id)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Set as Profile
                      </button>
                    )}
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