/* eslint-disable @typescript-eslint/no-explicit-any */
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
  ExternalLink,
  Palette,
  Type,
  Monitor
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTheme } from '@/lib/context/ThemeContext';
import authService from '@/lib/services/authService';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, profile, loading: authLoading, refresh } = useAuth();
  const themeContext = useTheme();
  const router = useRouter();
  
  // Get everything from theme context
  const theme = themeContext.theme;
  const setTheme = themeContext.setTheme;
  const isDark = themeContext.isDark;
  const themeMounted = themeContext.mounted;
  const colors = themeContext.colors;
  
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
  
  // Appearance states
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  
  // Processing states
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize appearance settings
  useEffect(() => {
    // Font size
    const savedSize = localStorage.getItem('tabootalks-fontsize') as 'small' | 'medium' | 'large';
    if (savedSize) {
      setFontSize(savedSize);
      applyFontSize(savedSize);
    }
  }, []);

  const applyFontSize = (size: 'small' | 'medium' | 'large') => {
    const root = document.documentElement;
    switch (size) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
      default:
        root.style.fontSize = '16px';
    }
  };

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    setFontSize(size);
    localStorage.setItem('tabootalks-fontsize', size);
    applyFontSize(size);
    setSuccessMessage(`Font size changed to ${size}`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    setSuccessMessage(`Theme changed to ${newTheme} mode`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

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
      await authService.updateEmail(newEmail);
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
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-5 h-5" /> },
    { id: 'support', label: 'Help & Support', icon: <Info className="w-5 h-5" /> }
  ];

  const renderAccountSettings = () => (
    <div className="space-y-8">
      {/* Email Verification Section */}
      <div className={`border rounded-xl p-6 ${isDark ? 'bg-gradient-to-r from-purple-900/20 to-blue-900/20' : 'bg-gradient-to-r from-purple-50 to-blue-50'}`} style={{ 
        backgroundColor: isDark ? colors.panelBackground : 'transparent',
        borderColor: colors.border 
      }}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ 
                backgroundColor: user?.emailVerification 
                  ? (isDark ? '#10b981' + '30' : '#10b981' + '20') 
                  : (isDark ? '#f59e0b' + '30' : '#f59e0b' + '20') 
              }}>
                {user?.emailVerification ? (
                  <CheckCircle className="w-5 h-5" style={{ color: colors.success }} />
                ) : (
                  <Mail className="w-5 h-5" style={{ color: colors.warning }} />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ color: colors.primaryText }}>
                  Email Verification
                </h3>
                <p className="text-sm mt-1" style={{ color: colors.secondaryText }}>
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
                  className="font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: '#ffffff'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e62e2e'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
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
                <div className="text-xs flex items-center gap-1 px-3" style={{ color: colors.secondaryText }}>
                  <Info className="w-3 h-3" />
                  Check your inbox and click the verification link
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Verification Section */}
      <div className={`border rounded-xl p-6 ${isDark ? 'bg-gradient-to-r from-blue-900/20 to-cyan-900/20' : 'bg-gradient-to-r from-blue-50 to-cyan-50'}`} style={{ 
        backgroundColor: isDark ? colors.panelBackground : 'transparent',
        borderColor: colors.border 
      }}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ 
                backgroundColor: profile?.isVerified 
                  ? (isDark ? '#10b981' + '30' : '#10b981' + '20') 
                  : (isDark ? '#5e17eb' + '30' : '#5e17eb' + '20') 
              }}>
                {profile?.isVerified ? (
                  <BadgeCheck className="w-5 h-5" style={{ color: colors.success }} />
                ) : (
                  <ShieldCheck className="w-5 h-5" style={{ color: colors.secondary }} />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ color: colors.primaryText }}>
                  Account Verification
                </h3>
                <p className="text-sm mt-1" style={{ color: colors.secondaryText }}>
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
                className="mt-4 font-medium px-4 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2"
                style={{ 
                  backgroundColor: colors.secondary,
                  color: '#ffffff'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4e14d3'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
              >
                <Mail className="w-4 h-4" />
                Request Verification
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="border rounded-xl p-6" style={{ 
        backgroundColor: colors.cardBackground,
        borderColor: colors.border 
      }}>
        <h3 className="text-lg font-bold mb-6" style={{ color: colors.primaryText }}>
          Contact Information
        </h3>
        
        <div className="space-y-6">
          {/* Username */}
          <div className="flex items-center justify-between p-4 rounded-lg" style={{ 
            backgroundColor: colors.activeBackground 
          }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ 
                backgroundColor: isDark ? colors.secondary + '30' : colors.secondary + '10' 
              }}>
                <User className="w-5 h-5" style={{ color: colors.secondary }} />
              </div>
              <div>
                <div className="text-sm" style={{ color: colors.secondaryText }}>Username</div>
                <div className="font-medium" style={{ color: colors.primaryText }}>
                  {profile?.username || 'Not set'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowUsernameModal(true)}
              className="font-medium px-4 py-2 rounded-lg transition-colors"
              style={{ 
                color: colors.secondary 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? colors.secondary + '20' : colors.secondary + '10';
                e.currentTarget.style.color = '#4e14d3';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = colors.secondary;
              }}
            >
              Edit
            </button>
          </div>

          {/* Current Email */}
          <div className="flex items-center justify-between p-4 rounded-lg" style={{ 
            backgroundColor: colors.activeBackground 
          }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ 
                backgroundColor: isDark ? colors.secondary + '30' : colors.secondary + '10' 
              }}>
                <AtSign className="w-5 h-5" style={{ color: colors.secondary }} />
              </div>
              <div>
                <div className="text-sm" style={{ color: colors.secondaryText }}>Email address</div>
                <div className="font-medium" style={{ color: colors.primaryText }}>
                  {profile?.email || 'Not set'}
                </div>
                {user?.emailVerification && (
                  <div className="flex items-center gap-1 mt-1">
                    <BadgeCheck className="w-4 h-4" style={{ color: colors.success }} />
                    <span className="text-xs" style={{ color: colors.success }}>Verified</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowEmailModal(true)}
              className="font-medium px-4 py-2 rounded-lg transition-colors"
              style={{ 
                color: colors.secondary 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? colors.secondary + '20' : colors.secondary + '10';
                e.currentTarget.style.color = '#4e14d3';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = colors.secondary;
              }}
            >
              Edit
            </button>
          </div>

          {/* Password */}
          <div className="flex items-center justify-between p-4 rounded-lg" style={{ 
            backgroundColor: colors.activeBackground 
          }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ 
                backgroundColor: isDark ? '#3b82f6' + '30' : '#3b82f6' + '10' 
              }}>
                <Lock className="w-5 h-5" style={{ color: '#3b82f6' }} />
              </div>
              <div>
                <div className="text-sm" style={{ color: colors.secondaryText }}>Password</div>
                <div className="font-medium" style={{ color: colors.primaryText }}>••••••••</div>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="font-medium px-4 py-2 rounded-lg transition-colors"
              style={{ 
                color: colors.secondary 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? colors.secondary + '20' : colors.secondary + '10';
                e.currentTarget.style.color = '#4e14d3';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = colors.secondary;
              }}
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
      {/* Theme Selection */}
      <div className="border rounded-xl p-6" style={{ 
        backgroundColor: colors.cardBackground,
        borderColor: colors.border 
      }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ 
            backgroundColor: isDark ? colors.secondary + '30' : colors.secondary + '10' 
          }}>
            <Monitor className="w-5 h-5" style={{ color: colors.secondary }} />
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: colors.primaryText }}>
              Theme Mode
            </h3>
            <p className="text-sm" style={{ color: colors.secondaryText }}>
              Choose your preferred theme
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleThemeChange('light')}
            disabled={!themeMounted}
            className="p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3"
            style={{ 
              backgroundColor: theme === 'light' ? colors.primary + '10' : colors.cardBackground,
              borderColor: theme === 'light' ? colors.primary : colors.border,
              opacity: !themeMounted ? 0.5 : 1,
              cursor: !themeMounted ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (themeMounted && theme !== 'light') {
                e.currentTarget.style.borderColor = isDark ? '#3a4a52' : '#d1d5db';
              }
            }}
            onMouseLeave={(e) => {
              if (themeMounted && theme !== 'light') {
                e.currentTarget.style.borderColor = colors.border;
              }
            }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-white to-gray-100 border border-gray-300 rounded-xl flex items-center justify-center shadow-sm">
              <Sun className="w-8 h-8 text-yellow-500" />
            </div>
            <div>
              <div className="font-semibold" style={{ color: colors.primaryText }}>
                Light Mode
              </div>
              <div className="text-xs mt-1" style={{ color: colors.secondaryText }}>
                White background with dark text
              </div>
            </div>
            {theme === 'light' && themeMounted && (
              <div className="mt-2">
                <CheckCircle className="w-5 h-5" style={{ color: colors.primary }} />
              </div>
            )}
          </button>

          <button
            onClick={() => handleThemeChange('dark')}
            disabled={!themeMounted}
            className="p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3"
            style={{ 
              backgroundColor: theme === 'dark' ? colors.secondary + '10' : colors.cardBackground,
              borderColor: theme === 'dark' ? colors.secondary : colors.border,
              opacity: !themeMounted ? 0.5 : 1,
              cursor: !themeMounted ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (themeMounted && theme !== 'dark') {
                e.currentTarget.style.borderColor = isDark ? '#3a4a52' : '#d1d5db';
              }
            }}
            onMouseLeave={(e) => {
              if (themeMounted && theme !== 'dark') {
                e.currentTarget.style.borderColor = colors.border;
              }
            }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[#111b21] to-[#202c33] border border-[#2a3942] rounded-xl flex items-center justify-center shadow-sm">
              <Moon className="w-8 h-8 text-blue-300" />
            </div>
            <div>
              <div className="font-semibold" style={{ color: colors.primaryText }}>
                Dark Mode
              </div>
              <div className="text-xs mt-1" style={{ color: colors.secondaryText }}>
                WhatsApp-like dark theme
              </div>
            </div>
            {theme === 'dark' && themeMounted && (
              <div className="mt-2">
                <CheckCircle className="w-5 h-5" style={{ color: colors.secondary }} />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Font Size */}
      <div className="border rounded-xl p-6" style={{ 
        backgroundColor: colors.cardBackground,
        borderColor: colors.border 
      }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ 
            backgroundColor: isDark ? '#3b82f6' + '30' : '#3b82f6' + '10' 
          }}>
            <Type className="w-5 h-5" style={{ color: '#3b82f6' }} />
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: colors.primaryText }}>
              Text Size
            </h3>
            <p className="text-sm" style={{ color: colors.secondaryText }}>
              Adjust reading comfort
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          {[
            { value: 'small' as const, label: 'Small', example: 'Compact view for more content', size: 'text-xs' },
            { value: 'medium' as const, label: 'Medium', example: 'Standard comfortable reading', size: 'text-sm' },
            { value: 'large' as const, label: 'Large', example: 'Easier reading experience', size: 'text-base' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleFontSizeChange(option.value)}
              className="w-full flex items-center justify-between p-4 rounded-lg transition-colors"
              style={{ 
                backgroundColor: fontSize === option.value 
                  ? colors.secondary + '10' 
                  : colors.activeBackground,
                border: fontSize === option.value ? `1px solid ${colors.secondary}30` : 'none'
              }}
              onMouseEnter={(e) => {
                if (fontSize !== option.value) {
                  e.currentTarget.style.backgroundColor = colors.hoverBackground;
                }
              }}
              onMouseLeave={(e) => {
                if (fontSize !== option.value) {
                  e.currentTarget.style.backgroundColor = colors.activeBackground;
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ 
                  background: isDark 
                    ? `linear-gradient(135deg, ${colors.secondary}30, ${colors.primary}30)` 
                    : `linear-gradient(135deg, ${colors.secondary}10, ${colors.primary}10)` 
                }}>
                  <span className="font-bold" style={{ color: colors.secondary, fontSize: option.size === 'text-xs' ? '0.75rem' : option.size === 'text-sm' ? '0.875rem' : '1rem' }}>
                    Aa
                  </span>
                </div>
                <div className="text-left">
                  <div className="font-medium" style={{ color: colors.primaryText }}>
                    {option.label}
                  </div>
                  <div className="text-xs" style={{ color: colors.secondaryText }}>
                    {option.example}
                  </div>
                </div>
              </div>
              {fontSize === option.value && (
                <Check className="w-5 h-5" style={{ color: colors.secondary }} />
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
      <div className="border rounded-xl p-6" style={{ 
        backgroundColor: colors.cardBackground,
        borderColor: colors.border 
      }}>
        <h3 className="text-lg font-bold mb-6" style={{ color: colors.primaryText }}>
          Help & Support
        </h3>
        
        <div className="space-y-4">
          <a
            href="mailto:support@tabootalks.com?subject=Support Request"
            className="w-full flex items-center justify-between p-4 rounded-lg transition-colors group"
            style={{ 
              backgroundColor: colors.activeBackground 
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.hoverBackground;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.activeBackground;
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ 
                backgroundColor: isDark ? colors.secondary + '30' : colors.secondary + '10' 
              }}>
                <Mail className="w-5 h-5" style={{ color: colors.secondary }} />
              </div>
              <div className="text-left">
                <div className="font-medium" style={{ color: colors.primaryText }}>
                  Contact Support
                </div>
                <div className="text-sm" style={{ color: colors.secondaryText }}>
                  support@tabootalks.com
                </div>
              </div>
            </div>
            <ExternalLink className="w-5 h-5" style={{ color: colors.secondaryText }} />
          </a>

          <a
            href="mailto:verification.help@id-mail.info?subject=Verification Request"
            className="w-full flex items-center justify-between p-4 rounded-lg transition-colors group"
            style={{ 
              backgroundColor: colors.activeBackground 
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.hoverBackground;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.activeBackground;
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ 
                backgroundColor: isDark ? '#3b82f6' + '30' : '#3b82f6' + '10' 
              }}>
                <ShieldCheck className="w-5 h-5" style={{ color: '#3b82f6' }} />
              </div>
              <div className="text-left">
                <div className="font-medium" style={{ color: colors.primaryText }}>
                  Verification Support
                </div>
                <div className="text-sm" style={{ color: colors.secondaryText }}>
                  verification.help@id-mail.info
                </div>
              </div>
            </div>
            <ExternalLink className="w-5 h-5" style={{ color: colors.secondaryText }} />
          </a>

          <div className="p-4 border rounded-lg" style={{ 
            backgroundColor: isDark ? '#3b82f6' + '20' : '#3b82f6' + '10',
            borderColor: isDark ? '#3b82f6' + '40' : '#3b82f6' + '30' 
          }}>
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#3b82f6' }} />
              <div>
                <div className="font-medium mb-1" style={{ color: isDark ? '#93c5fd' : '#1e40af' }}>
                  App Version
                </div>
                <div className="text-sm" style={{ color: isDark ? '#60a5fa' : '#1d4ed8' }}>
                  TabooTalks v1.0.0
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border rounded-xl p-6" style={{ 
        backgroundColor: colors.cardBackground,
        borderColor: isDark ? colors.danger + '30' : colors.danger + '20' 
      }}>
        <h3 className="text-lg font-bold mb-6" style={{ color: colors.danger }}>
          Danger Zone
        </h3>
        
        <div className="space-y-4">
          <button
            onClick={handleLogout}
            disabled={processing}
            className="w-full flex items-center justify-between p-4 rounded-lg transition-colors group"
            style={{ 
              backgroundColor: colors.activeBackground 
            }}
            onMouseEnter={(e) => {
              if (!processing) {
                e.currentTarget.style.backgroundColor = colors.hoverBackground;
              }
            }}
            onMouseLeave={(e) => {
              if (!processing) {
                e.currentTarget.style.backgroundColor = colors.activeBackground;
              }
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ 
                backgroundColor: isDark ? colors.hoverBackground : colors.activeBackground 
              }}>
                <LogOut className="w-5 h-5" style={{ color: colors.secondaryText }} />
              </div>
              <div className="text-left">
                <div className="font-medium" style={{ color: colors.primaryText }}>
                  Log Out
                </div>
                <div className="text-sm" style={{ color: colors.secondaryText }}>
                  Sign out of your account
                </div>
              </div>
            </div>
            {processing ? (
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: colors.secondaryText }} />
            ) : (
              <ChevronRight className="w-5 h-5" style={{ color: colors.secondaryText }} />
            )}
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center justify-between p-4 rounded-lg transition-colors group"
            style={{ 
              backgroundColor: isDark ? colors.danger + '20' : colors.danger + '10' 
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? colors.danger + '30' : colors.danger + '20';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? colors.danger + '20' : colors.danger + '10';
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ 
                backgroundColor: isDark ? colors.danger + '30' : colors.danger + '20' 
              }}>
                <Trash2 className="w-5 h-5" style={{ color: colors.danger }} />
              </div>
              <div className="text-left">
                <div className="font-medium" style={{ color: colors.danger }}>Delete Account</div>
                <div className="text-sm" style={{ color: isDark ? colors.danger + '90' : colors.danger + '70' }}>
                  Permanently delete your account and data
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: isDark ? colors.danger + '60' : colors.danger + '40' }} />
          </button>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (authLoading || !themeMounted) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
        <LayoutController />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-12 h-12 animate-spin" style={{ color: colors.secondary }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors" style={{ backgroundColor: colors.background }}>
      <LayoutController />
      
      {/* Success Toast */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in max-w-md">
          <div className="px-6 py-4 rounded-lg shadow-lg flex items-start gap-3" style={{ 
            backgroundColor: colors.success,
            color: '#ffffff'
          }}>
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="font-medium">{successMessage}</div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in max-w-md">
          <div className="px-6 py-4 rounded-lg shadow-lg flex items-start gap-3" style={{ 
            backgroundColor: colors.danger,
            color: '#ffffff'
          }}>
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
              <h1 className="text-3xl font-bold" style={{ color: colors.primaryText }}>
                Settings
              </h1>
              <p className="mt-2" style={{ color: colors.secondaryText }}>
                Manage your account preferences and privacy settings
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm" style={{ color: colors.secondaryText }}>
                  Logged in as
                </div>
                <div className="font-bold" style={{ color: colors.primaryText }}>
                  {profile?.username || 'User'}
                </div>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ 
                background: `linear-gradient(135deg, ${colors.secondary}20, ${colors.primary}20)` 
              }}>
                <User className="w-6 h-6" style={{ color: colors.secondary }} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-xl shadow-sm border p-4 sticky top-8" style={{ 
              backgroundColor: colors.panelBackground,
              borderColor: colors.border 
            }}>
              <div className="space-y-2">
                {settingsSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(section.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                    style={{ 
                      backgroundColor: currentSection === section.id
                        ? colors.secondary + '10'
                        : 'transparent',
                      color: currentSection === section.id
                        ? colors.secondary
                        : colors.primaryText,
                      border: currentSection === section.id
                        ? `1px solid ${colors.secondary}30`
                        : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (currentSection !== section.id) {
                        e.currentTarget.style.backgroundColor = colors.hoverBackground;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentSection !== section.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ 
                      backgroundColor: currentSection === section.id 
                        ? colors.secondary + '20' 
                        : colors.activeBackground 
                    }}>
                      {section.icon}
                    </div>
                    <span>{section.label}</span>
                  </button>
                ))}
              </div>
              
              {/* Account Info */}
              <div className="mt-8 pt-8" style={{ borderTop: `1px solid ${colors.border}` }}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: colors.secondaryText }}>Account Status</span>
                    <span className="font-medium" style={{ color: colors.success }}>Active</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: colors.secondaryText }}>Member Since</span>
                    <span className="font-medium" style={{ color: colors.primaryText }}>
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
                    <span style={{ color: colors.secondaryText }}>Email Status</span>
                    <span className="font-medium" style={{ 
                      color: user?.emailVerification ? colors.success : colors.warning 
                    }}>
                      {user?.emailVerification ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="rounded-xl shadow-sm border p-6" style={{ 
              backgroundColor: colors.cardBackground,
              borderColor: colors.border 
            }}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold" style={{ color: colors.primaryText }}>
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
    </div>
  );
}