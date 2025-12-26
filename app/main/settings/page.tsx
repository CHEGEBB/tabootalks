/* eslint-disable @typescript-eslint/no-explicit-any */
// app/main/settings/page.tsx - UPDATED WITH WORKING VERIFICATION
'use client';

import React, { useState, useEffect } from 'react';
import LayoutController from '@/components/layout/LayoutController';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  Send,
  AlertTriangle,
  User,
  Globe,
  Moon,
  Sun,
  Trash2,
  LogOut,
  ChevronRight,
  ShieldCheck,
  BadgeCheck,
  Info,
  AtSign,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import authService from '@/lib/services/authService';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, profile, loading: authLoading, refresh } = useAuth();
  const router = useRouter();
  
  const [currentSection, setCurrentSection] = useState<string>('account');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Form states
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteAgreed, setDeleteAgreed] = useState(false);
  
  // UI states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  
  // Processing states
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize language from Google Translate
  useEffect(() => {
    const checkLanguage = () => {
      const translateElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (translateElement) {
        const currentLang = translateElement.value;
        setLanguage(currentLang === 'de' ? 'German' : 'English');
      }
    };
    
    checkLanguage();
    const interval = setInterval(checkLanguage, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle verification email
  const handleSendVerificationEmail = async () => {
    try {
      setProcessing(true);
      await authService.sendVerificationEmail();
      setSuccessMessage('Verification email sent! Please check your inbox and click the verification link.');
      setTimeout(() => setSuccessMessage(''), 8000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to send verification email');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setProcessing(false);
    }
  };

  // Handle email change
  const handleSaveEmail = async () => {
    if (!newEmail || newEmail === profile?.email) {
      setErrorMessage('Please enter a different email address');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    try {
      setProcessing(true);
      
      // Update email in Appwrite
      await authService.updateEmail(newEmail);
      
      // Refresh profile
      await refresh();
      
      setNewEmail('');
      setShowEmailModal(false);
      setSuccessMessage('Email updated successfully! Please check your inbox to verify your new email.');
      setTimeout(() => setSuccessMessage(''), 8000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to update email');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setProcessing(false);
    }
  };

  // Handle password change
  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage('Please fill in all password fields');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    try {
      setProcessing(true);
      
      await authService.updatePassword(newPassword, currentPassword);
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordModal(false);
      setSuccessMessage('Password updated successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to update password');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setProcessing(false);
    }
  };

  // Handle username change
  const handleSaveUsername = async () => {
    if (!newUsername || newUsername === profile?.username) {
      setErrorMessage('Please enter a different username');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    try {
      setProcessing(true);
      
      await authService.updateProfile(profile?.$id || '', { username: newUsername });
      await refresh();
      
      setNewUsername('');
      setShowUsernameModal(false);
      setSuccessMessage('Username updated successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to update username');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setProcessing(false);
    }
  };

  // Handle language change
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    
    // Trigger Google Translate
    const translateElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (translateElement) {
      translateElement.value = lang === 'German' ? 'de' : 'en';
      translateElement.dispatchEvent(new Event('change'));
    }
  };

  // Handle theme change
  const handleThemeChange = (darkMode: boolean) => {
    setIsDarkMode(darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    document.body.classList.toggle('dark', darkMode);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      setProcessing(true);
      await authService.logout();
      router.push('/login');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to logout');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setProcessing(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE' || !deleteAgreed) {
      setErrorMessage('Please confirm account deletion');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    try {
      setProcessing(true);
      
      if (profile?.$id) {
        await authService.deleteAccount(profile.$id);
        router.push('/');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to delete account');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setProcessing(false);
    }
  };

  const settingsSections = [
    { id: 'account', label: 'Account Settings', icon: <User className="w-5 h-5" /> },
    { id: 'appearance', label: 'Appearance', icon: <Moon className="w-5 h-5" /> },
    { id: 'support', label: 'Help & Support', icon: <Info className="w-5 h-5" /> }
  ];

  const renderAccountSettings = () => (
    <div className="space-y-8">
      {/* Email Verification Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                user?.emailVerification ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                {user?.emailVerification ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Mail className="w-5 h-5 text-yellow-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Email Verification</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {user?.emailVerification 
                    ? 'Your email is verified ✓' 
                    : 'Verify your email to secure your account and enable password recovery.'
                  }
                </p>
              </div>
            </div>
            
            {!user?.emailVerification && (
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={handleSendVerificationEmail}
                  disabled={processing}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Verification Email
                    </>
                  )}
                </button>
                <div className="text-xs text-gray-500 flex items-center gap-1 px-3">
                  <Info className="w-3 h-3" />
                  Check your inbox and click the verification link
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Verification Section */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                profile?.isVerified ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                {profile?.isVerified ? (
                  <BadgeCheck className="w-5 h-5 text-green-600" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Account Verification</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {profile?.isVerified 
                    ? 'Your account is verified ✓' 
                    : 'Get verified to unlock premium features and build trust'
                  }
                </p>
              </div>
            </div>
            
            {!profile?.isVerified && (
              <a
                href="mailto:verification.help@id-mail.info?subject=Account Verification Request&body=Username: [YOUR_USERNAME]%0D%0AEmail: [YOUR_EMAIL]"
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Request Verification
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Contact Information</h3>
        
        <div className="space-y-6">
          {/* Username */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Username</div>
                <div className="font-medium text-gray-900">{profile?.username || 'Not set'}</div>
              </div>
            </div>
            <button
              onClick={() => setShowUsernameModal(true)}
              className="text-purple-600 hover:text-purple-700 font-medium px-4 py-2 hover:bg-purple-50 rounded-lg transition-colors"
            >
              Edit
            </button>
          </div>

          {/* Current Email */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <AtSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Email address</div>
                <div className="font-medium text-gray-900">{profile?.email || 'Not set'}</div>
                {user?.emailVerification && (
                  <div className="flex items-center gap-1 mt-1">
                    <BadgeCheck className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600">Verified</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowEmailModal(true)}
              className="text-purple-600 hover:text-purple-700 font-medium px-4 py-2 hover:bg-purple-50 rounded-lg transition-colors"
            >
              Edit
            </button>
          </div>

          {/* Password */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Password</div>
                <div className="font-medium text-gray-900">••••••••</div>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="text-purple-600 hover:text-purple-700 font-medium px-4 py-2 hover:bg-purple-50 rounded-lg transition-colors"
            >
              Change
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-6">
      {/* Theme */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Theme</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleThemeChange(false)}
            className={`p-6 rounded-xl border-2 transition-all ${
              !isDarkMode
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-white border border-gray-300 rounded-lg flex items-center justify-center">
                <Sun className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="font-medium text-gray-900">Light Mode</div>
            </div>
          </button>

          <button
            onClick={() => handleThemeChange(true)}
            className={`p-6 rounded-xl border-2 transition-all ${
              isDarkMode
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <Moon className="w-6 h-6 text-gray-300" />
              </div>
              <div className="font-medium text-gray-900">Dark Mode</div>
            </div>
          </button>
        </div>
      </div>

      {/* Language */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Language</h3>
        
        <div className="space-y-3">
          {['English', 'German'].map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${
                language === lang
                  ? 'bg-purple-50 border border-purple-200'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-purple-600" />
                </div>
                <span className="font-medium text-gray-900">{lang}</span>
              </div>
              {language === lang && (
                <Check className="w-5 h-5 text-purple-600" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6">
      {/* Help & Support */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Help & Support</h3>
        
        <div className="space-y-4">
          <a
            href="mailto:support@tabootalks.com?subject=Support Request"
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Contact Support</div>
                <div className="text-sm text-gray-600">support@tabootalks.com</div>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </a>

          <a
            href="mailto:verification.help@id-mail.info?subject=Verification Request"
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Verification Support</div>
                <div className="text-sm text-gray-600">verification.help@id-mail.info</div>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </a>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-blue-900 mb-1">App Version</div>
                <div className="text-sm text-blue-700">TabooTalks v1.0.0</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white border border-red-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-red-700 mb-6">Danger Zone</h3>
        
        <div className="space-y-4">
          <button
            onClick={handleLogout}
            disabled={processing}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <LogOut className="w-5 h-5 text-gray-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Log Out</div>
                <div className="text-sm text-gray-600">Sign out of your account</div>
              </div>
            </div>
            {processing ? (
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            )}
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-red-700">Delete Account</div>
                <div className="text-sm text-red-600">Permanently delete your account and data</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400 group-hover:text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <LayoutController />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <LayoutController />
      
      {/* Success Toast */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in max-w-md">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="font-medium">{successMessage}</div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in max-w-md">
          <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="font-medium">{errorMessage}</div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-2">Manage your account preferences and privacy settings</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Logged in as</div>
                <div className="font-bold text-gray-900">{profile?.username || 'User'}</div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-8">
              <div className="space-y-2">
                {settingsSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      currentSection === section.id
                        ? 'bg-purple-50 text-purple-700 font-medium border border-purple-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      currentSection === section.id ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      {section.icon}
                    </div>
                    <span>{section.label}</span>
                  </button>
                ))}
              </div>
              
              {/* Account Info */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Account Status</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium text-gray-900">
                      {profile?.createdAt 
                        ? new Date(profile.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            year: 'numeric'
                          })
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Email Status</span>
                    <span className={`font-medium ${
                      user?.emailVerification ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {user?.emailVerification ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {settingsSections.find(s => s.id === currentSection)?.label || 'Settings'}
                </h2>
              </div>

              {/* Render Current Section */}
              <div>
                {currentSection === 'account' && renderAccountSettings()}
                {currentSection === 'appearance' && renderAppearance()}
                {currentSection === 'support' && renderSupport()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Username Change Modal */}
      {showUsernameModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Change Username</h3>
              <button
                onClick={() => setShowUsernameModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Username
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-300 text-gray-700">
                  {profile?.username}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Username
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter new username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                />
              </div>
            </div>
            
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowUsernameModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUsername}
                disabled={!newUsername || processing}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  newUsername && !processing
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {processing ? 'Updating...' : 'Update Username'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Change Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Change Email Address</h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Email
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-300 text-gray-700">
                  {profile?.email}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Email Address
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-2">
                  You&apos;ll need to verify this email address after changing it.
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEmail}
                disabled={!newEmail || processing}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  newEmail && !processing
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {processing ? 'Updating...' : 'Update Email'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Must be at least 8 characters with letters and numbers.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePassword}
                disabled={!currentPassword || !newPassword || !confirmPassword || processing}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  currentPassword && newPassword && confirmPassword && !processing
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {processing ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-red-700">Delete Account</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5" />
                  <div>
                    <div className="font-bold text-red-800 mb-2">Warning: Account Deletion</div>
                    <div className="text-sm text-red-700">
                      Deleting your account will permanently remove:
                    </div>
                    <ul className="text-sm text-red-700 mt-2 space-y-1">
                      <li>• All your profile information</li>
                      <li>• Chat history and messages</li>
                      <li>• Photos and media</li>
                      <li>• Account settings and preferences</li>
                      <li>• All remaining credits and purchases</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Please type &ldquo;DELETE&rdquo; to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="DELETE"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={deleteAgreed}
                      onChange={(e) => setDeleteAgreed(e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500" 
                    />
                    <span className="text-sm text-gray-700">
                      I understand that this action is irreversible and I want to proceed with account deletion.
                    </span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || !deleteAgreed || processing}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  deleteConfirmText === 'DELETE' && deleteAgreed && !processing
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {processing ? 'Deleting...' : 'Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}