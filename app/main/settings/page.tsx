// app/main/settings/page.tsx
'use client';

import React, { useState } from 'react';
import LayoutController from '@/components/layout/LayoutController';
import {
  Mail,
  Lock,
  Phone,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Check,
  X,
  Send,
  Volume2,
  VolumeX,
  AlertTriangle,
  User,
  CreditCard,
  Globe,
  Moon,
  Sun,
  Trash2,
  LogOut,
  ChevronRight,
  Key,
  MessageSquare,
  Heart,
  Users,
  HelpCircle,
  FileText,
  ShieldCheck,
  BadgeCheck,
  Info,
  AtSign,
  UserCheck,
  MailCheck
} from 'lucide-react';

export default function SettingsPage() {
  const [currentSection, setCurrentSection] = useState<string>('account');
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [sensitiveContent, setSensitiveContent] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [email, setEmail] = useState('chegephil24@gmail.com');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');

  // Mock user data
  const user = {
    name: 'David Müller',
    email: 'chegephil24@gmail.com',
    emailVerified: false,
    phoneVerified: false,
    accountCreated: '2024-01-15',
    lastLogin: 'Just now',
    isPremium: true,
    credits: 120
  };

  const handleVerifyEmail = () => {
    // Simulate email verification
    setEmailVerified(true);
  };

  const handleResendEmail = () => {
    // Simulate resend verification email
    alert('Verification email sent!');
  };

  const handleSaveEmail = () => {
    if (newEmail && newEmail !== email) {
      setEmail(newEmail);
      setEmailVerified(false);
      setNewEmail('');
      setShowEmailModal(false);
      alert('Email updated successfully! Please verify your new email.');
    }
  };

  const handleSavePassword = () => {
    if (newPassword === confirmPassword) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordModal(false);
      alert('Password updated successfully!');
    } else {
      alert('Passwords do not match!');
    }
  };

  const handleSavePhone = () => {
    if (phoneNumber) {
      setPhoneNumber(phoneNumber);
      setPhoneVerified(false);
      setShowPhoneModal(false);
      alert('Phone number updated! Verification required.');
    }
  };

  const handleDeleteAccount = () => {
    // Simulate account deletion
    setShowDeleteModal(false);
    alert('Account deletion request sent. Our team will contact you shortly.');
  };

  const settingsSections = [
    { id: 'account', label: 'Account Settings', icon: <User className="w-5 h-5" /> },
    { id: 'privacy', label: 'Privacy & Security', icon: <Shield className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'appearance', label: 'Appearance', icon: <Moon className="w-5 h-5" /> },
    { id: 'preferences', label: 'Preferences', icon: <Heart className="w-5 h-5" /> },
    { id: 'support', label: 'Help & Support', icon: <HelpCircle className="w-5 h-5" /> }
  ];

  const renderAccountSettings = () => (
    <div className="space-y-8">
      {/* Email Verification Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${emailVerified ? 'bg-green-100' : 'bg-yellow-100'}`}>
                {emailVerified ? (
                  <MailCheck className="w-5 h-5 text-green-600" />
                ) : (
                  <Mail className="w-5 h-5 text-yellow-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Email Verification</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Confirm your email to get important updates and easily reset your password.
                </p>
              </div>
            </div>
            
            {!emailVerified ? (
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={handleResendEmail}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Resend Verification Email
                </button>
                <button
                  onClick={handleVerifyEmail}
                  className="bg-white border border-purple-300 text-purple-700 hover:bg-purple-50 font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  I&apos;ve Verified My Email
                </button>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2 text-green-600 font-medium">
                <Check className="w-5 h-5" />
                Email verified successfully!
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
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${phoneVerified ? 'bg-green-100' : 'bg-blue-100'}`}>
                {phoneVerified ? (
                  <UserCheck className="w-5 h-5 text-green-600" />
                ) : (
                  <User className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Account Verification</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Verify your account with Persona by contacting our Support Team at{' '}
                  <a href="mailto:verification.help@id-mail.info" className="text-purple-600 hover:text-purple-700 font-medium">
                    verification.help@id-mail.info
                  </a>
                </p>
              </div>
            </div>
            
            {!phoneVerified && (
              <button
                onClick={() => setShowVerificationModal(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Start Verification Process
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Email Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Contact Information</h3>
        
        <div className="space-y-6">
          {/* Current Email */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <AtSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Current email</div>
                <div className="font-medium text-gray-900">{user.email}</div>
                {emailVerified && (
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
                <div className="text-xs text-gray-500 mt-1">Last changed 2 months ago</div>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="text-purple-600 hover:text-purple-700 font-medium px-4 py-2 hover:bg-purple-50 rounded-lg transition-colors"
            >
              Edit
            </button>
          </div>

          {/* Phone Number */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Phone Number</div>
                {phoneNumber ? (
                  <>
                    <div className="font-medium text-gray-900">{phoneNumber}</div>
                    {phoneVerified && (
                      <div className="flex items-center gap-1 mt-1">
                        <BadgeCheck className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-600">Verified</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-gray-500 italic">Not set</div>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowPhoneModal(true)}
              className="text-purple-600 hover:text-purple-700 font-medium px-4 py-2 hover:bg-purple-50 rounded-lg transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySecurity = () => (
    <div className="space-y-6">
      {/* Sensitive Content Control */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Sensitive Content Control</h3>
            <p className="text-sm text-gray-600 mt-1">
              Control what type of content you want to see on the platform
            </p>
          </div>
          <button
            onClick={() => setSensitiveContent(!sensitiveContent)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              sensitiveContent ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                sensitiveContent ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-yellow-800">Content Warning</div>
              <div className="text-sm text-yellow-700 mt-1">
                When enabled, you may see explicit content. This setting is automatically enabled for users 18+.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sound Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Sound Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                {soundsEnabled ? (
                  <Volume2 className="w-5 h-5 text-purple-600" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900">Sound Effects</div>
                <div className="text-sm text-gray-600">Play sounds for notifications and actions</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSoundsEnabled(true)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  soundsEnabled
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Enabled
              </button>
              <button
                onClick={() => setSoundsEnabled(false)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !soundsEnabled
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Disabled
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Security Settings</h3>
        
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Key className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                <div className="text-sm text-gray-600">Add an extra layer of security</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Login History</div>
                <div className="text-sm text-gray-600">View recent login activity</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Active Sessions</div>
                <div className="text-sm text-gray-600">Manage logged-in devices</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Email Notifications</h3>
            <p className="text-sm text-gray-600 mt-1">
              Control what email notifications you receive
            </p>
          </div>
          <button
            onClick={() => setEmailNotifications(!emailNotifications)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              emailNotifications ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                emailNotifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900 mb-2">Receive notifications</div>
            <div className="text-sm text-gray-600">
              Get important updates, security alerts, and platform news via email
            </div>
          </div>
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Push Notifications</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">New Messages</div>
                <div className="text-sm text-gray-600">Notify me when I receive new messages</div>
              </div>
            </div>
            <div className="relative">
              <input type="checkbox" className="sr-only" id="message-notif" defaultChecked />
              <label htmlFor="message-notif" className="block w-12 h-6 bg-purple-600 rounded-full cursor-pointer">
                <div className="dot absolute right-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">New Matches</div>
                <div className="text-sm text-gray-600">Notify me when I get new matches</div>
              </div>
            </div>
            <div className="relative">
              <input type="checkbox" className="sr-only" id="match-notif" defaultChecked />
              <label htmlFor="match-notif" className="block w-12 h-6 bg-purple-600 rounded-full cursor-pointer">
                <div className="dot absolute right-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Profile Views</div>
                <div className="text-sm text-gray-600">Notify me when someone views my profile</div>
              </div>
            </div>
            <div className="relative">
              <input type="checkbox" className="sr-only" id="view-notif" defaultChecked />
              <label htmlFor="view-notif" className="block w-12 h-6 bg-purple-600 rounded-full cursor-pointer">
                <div className="dot absolute right-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
              </label>
            </div>
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
            onClick={() => setIsDarkMode(false)}
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
            onClick={() => setIsDarkMode(true)}
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
          {['English', 'German', 'Spanish', 'French', 'Italian'].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
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

  const renderPreferences = () => (
    <div className="space-y-6">
      {/* Privacy Preferences */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Privacy Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Show Online Status</div>
              <div className="text-sm text-gray-600">Let others see when you&apos;re online</div>
            </div>
            <div className="relative">
              <input type="checkbox" className="sr-only" id="online-status" defaultChecked />
              <label htmlFor="online-status" className="block w-12 h-6 bg-purple-600 rounded-full cursor-pointer">
                <div className="dot absolute right-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Show Profile in Search</div>
              <div className="text-sm text-gray-600">Allow others to find your profile</div>
            </div>
            <div className="relative">
              <input type="checkbox" className="sr-only" id="profile-search" defaultChecked />
              <label htmlFor="profile-search" className="block w-12 h-6 bg-purple-600 rounded-full cursor-pointer">
                <div className="dot absolute right-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Allow Profile Views</div>
              <div className="text-sm text-gray-600">Let others know you viewed their profile</div>
            </div>
            <div className="relative">
              <input type="checkbox" className="sr-only" id="profile-views" />
              <label htmlFor="profile-views" className="block w-12 h-6 bg-gray-300 rounded-full cursor-pointer">
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Data Preferences */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Data Preferences</h3>
        
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
            <div className="text-left">
              <div className="font-medium text-gray-900">Download My Data</div>
              <div className="text-sm text-gray-600">Get a copy of your personal data</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
            <div className="text-left">
              <div className="font-medium text-gray-900">Clear Search History</div>
              <div className="text-sm text-gray-600">Delete your recent searches</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>
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
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Help Center</div>
                <div className="text-sm text-gray-600">Find answers to common questions</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Terms & Privacy</div>
                <div className="text-sm text-gray-600">Read our policies and guidelines</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Info className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">About TabooTalks</div>
                <div className="text-sm text-gray-600">Learn more about our platform</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white border border-red-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-red-700 mb-6">Danger Zone</h3>
        
        <div className="space-y-4">
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

          <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <LogOut className="w-5 h-5 text-gray-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Log Out</div>
                <div className="text-sm text-gray-600">Sign out of your account on all devices</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <LayoutController />
      
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
                <div className="font-bold text-gray-900">{user.name}</div>
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
                      {new Date(user.accountCreated).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Email Status</span>
                    <span className={`font-medium ${emailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                      {emailVerified ? 'Verified' : 'Pending'}
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
                <p className="text-gray-600 mt-2">
                  {currentSection === 'account' && 'Manage your account information and security'}
                  {currentSection === 'privacy' && 'Control your privacy and security settings'}
                  {currentSection === 'notifications' && 'Customize your notification preferences'}
                  {currentSection === 'appearance' && 'Customize the look and feel of the app'}
                  {currentSection === 'preferences' && 'Set your personal preferences'}
                  {currentSection === 'support' && 'Get help and support'}
                </p>
              </div>

              {/* Render Current Section */}
              <div>
                {currentSection === 'account' && renderAccountSettings()}
                {currentSection === 'privacy' && renderPrivacySecurity()}
                {currentSection === 'notifications' && renderNotifications()}
                {currentSection === 'appearance' && renderAppearance()}
                {currentSection === 'preferences' && renderPreferences()}
                {currentSection === 'support' && renderSupport()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Change Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Change Email Address</h3>
                <p className="text-gray-600 mt-1">Update your email address</p>
              </div>
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
                  {user.email}
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
                disabled={!newEmail}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  newEmail
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Update Email
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
              <div>
                <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
                <p className="text-gray-600 mt-1">Update your account password</p>
              </div>
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
                disabled={!currentPassword || !newPassword || !confirmPassword}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  currentPassword && newPassword && confirmPassword
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phone Change Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Update Phone Number</h3>
                <p className="text-gray-600 mt-1">Add or update your phone number</p>
              </div>
              <button
                onClick={() => setShowPhoneModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-2">
                  We&apos;ll send a verification code to this number.
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowPhoneModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePhone}
                disabled={!phoneNumber}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  phoneNumber
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Update Phone
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Account Verification</h3>
                <p className="text-gray-600 mt-1">Complete account verification</p>
              </div>
              <button
                onClick={() => setShowVerificationModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-bold text-blue-800 mb-2">Verification Required</div>
                    <div className="text-sm text-blue-700">
                      To verify your account, please contact our Support Team at:
                    </div>
                    <div className="mt-2 text-lg font-bold text-blue-900">
                      verification.help@id-mail.info
                    </div>
                    <div className="text-sm text-blue-700 mt-2">
                      Include your username and the email address associated with your account.
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Age verification (18+)</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Identity verification</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Account security check</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowVerificationModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Close
              </button>
              <a
                href="mailto:verification.help@id-mail.info"
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-center"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-red-700">Delete Account</h3>
                <p className="text-gray-600 mt-1">This action cannot be undone</p>
              </div>
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
                    placeholder="DELETE"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
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
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}