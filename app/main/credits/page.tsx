/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import LayoutController from '@/components/layout/LayoutController';
import { 
  CreditCard, 
  Shield, 
  Check, 
  Crown, 
  X, 
  Lock, 
  Gift, 
  MessageSquare, 
  Video, 
  Image as ImageIcon,
  Camera,
  Users,
  ChevronDown,
  HelpCircle,
  Clock,
  Zap,
  Sun,
  Moon,
  Target,
  BarChart3,
  MessageCircle,
  Heart,
  Activity as ActivityIcon,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import creditService from '@/lib/services/creditService';
import { databases } from '@/lib/appwrite/config';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/config';
import { Query } from 'appwrite';
// import { useSearchParams } from 'next/navigation';

// Credit packages with Stripe Price IDs
const CREDIT_PACKAGES = [
  {
    id: 1,
    name: '30 Credits',
    credits: 30,
    messages: 30,
    price: 9.99,
    popular: false,
    description: 'Perfect for trying out the platform',
    saving: 0,
    originalPrice: 9.99,
    stripePriceId: 'price_1Sh76hCwXIB5zBhIL4uRWxer'
  },
  {
    id: 2,
    name: '100 Credits',
    credits: 100,
    messages: 100,
    price: 19.99,
    popular: true,
    badge: 'BEST VALUE - BEST SELLER (GOLD)',
    description: 'Most popular choice',
    saving: 20,
    originalPrice: 24.99,
    stripePriceId: 'price_1Sh77gCwXIB5zBhI8CEQyPI3'
  },
  {
    id: 3,
    name: '350 Credits',
    credits: 350,
    messages: 350,
    price: 39.99,
    popular: false,
    description: 'Maximum value for power users',
    saving: 40,
    originalPrice: 49.99,
    stripePriceId: 'price_1Sh78LCwXIB5zBhIrQcQo98n'
  }
];

// Pricing for services
const SERVICE_PRICING = [
  {
    name: 'Sending your own pictures',
    price: '15 credits',
    icon: <Camera className="w-4 h-4 text-purple-600" />
  },
  {
    name: 'Request explicit pictures',
    price: '25 credits',
    icon: <ImageIcon className="w-4 h-4 text-purple-600" />
  },
  {
    name: 'Chat per minute',
    price: '1 credits',
    icon: <MessageSquare className="w-4 h-4 text-purple-600" />
  },
  {
    name: 'Stickers in chat',
    price: '5 credits',
    icon: <Gift className="w-4 h-4 text-purple-600" />
  },
  {
    name: 'View private videos',
    price: '10 credits',
    icon: <Video className="w-4 h-4 text-purple-600" />
  },
  {
    name: 'Priority message',
    price: '3 credits',
    icon: <Zap className="w-4 h-4 text-purple-600" />
  }
];

// FAQ Data
const FAQ_ITEMS = [
  {
    question: 'What are credits?',
    answer: 'Credits are the internal currency used for paid services on TabooTalks. They allow you to send messages, view content, and access premium features.',
    icon: <HelpCircle className="w-5 h-5 text-purple-600" />
  },
  {
    question: 'Do credits expire?',
    answer: 'No, purchased credits never expire. Use them whenever you want!',
    icon: <Clock className="w-5 h-5 text-purple-600" />
  },
  {
    question: 'Is payment secure?',
    answer: 'Yes! All payments are processed through Stripe with bank-level encryption. Your data is always protected.',
    icon: <Shield className="w-5 h-5 text-purple-600" />
  },
  {
    question: 'Can I get a refund?',
    answer: 'All credit purchases are final. However, if you experience any issues, please contact our support team for assistance.',
    icon: <CreditCard className="w-5 h-5 text-purple-600" />
  },
  {
    question: 'How do I earn free credits?',
    answer: 'You can earn free credits by completing your profile, verifying your account, and inviting friends to join TabooTalks.',
    icon: <Gift className="w-5 h-5 text-purple-600" />
  }
];

export default function CreditsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  // Remove useSearchParams and use window.location instead
  // const searchParams = useSearchParams();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(CREDIT_PACKAGES[1]);
  const [userCredits, setUserCredits] = useState({
    complimentary: 20,
    purchased: 0,
    total: 20
  });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [processing, setProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');
  const [loadingCredits, setLoadingCredits] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [greetingIcon, setGreetingIcon] = useState<React.ReactNode>(<Sun className="w-5 h-5 text-yellow-500" />);
  const [activityStats, setActivityStats] = useState({
    totalChats: 0,
    totalMatches: 0,
    followingCount: 0,
    creditsUsed: 0,
    dailyUsage: '12',
    averageResponseTime: '2m',
    mostActiveHour: '8 PM'
  });
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  // Get greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Good Morning');
      setGreetingIcon(<Sun className="w-5 h-5 text-yellow-500" />);
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good Afternoon');
      setGreetingIcon(<Sun className="w-5 h-5 text-orange-500" />);
    } else if (hour >= 17 && hour < 21) {
      setGreeting('Good Evening');
      setGreetingIcon(<Sun className="w-5 h-5 text-orange-400" />);
    } else {
      setGreeting('Good Night');
      setGreetingIcon(<Moon className="w-5 h-5 text-blue-400" />);
    }
  }, []);

  // Check for Stripe redirect (success or cancel)
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Get URL search parameters manually instead of using useSearchParams
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const canceled = urlParams.get('canceled');
    const sessionId = urlParams.get('session_id');

    if (success === 'true' && sessionId) {
      // Payment successful, verify and add credits
      verifyPayment(sessionId);
    } else if (canceled === 'true') {
      setPurchaseError('Payment was canceled. No charges were made.');
      setTimeout(() => setPurchaseError(''), 5000);
    }
  }, []);

  // Verify Stripe payment
  const verifyPayment = async (sessionId: string) => {
    if (!user?.$id) return;

    setVerifyingPayment(true);
    try {
      const result = await creditService.verifyStripePayment(sessionId);

      if (result.success) {
        setPurchaseSuccess(true);
        
        // Refresh user credits
        await fetchUserCredits();
        
        // Auto-hide success message
        setTimeout(() => {
          setPurchaseSuccess(false);
          // Clean up URL
          window.history.replaceState({}, '', '/main/credits');
        }, 5000);
      } else {
        setPurchaseError(result.error || 'Payment verification failed');
        setTimeout(() => setPurchaseError(''), 5000);
      }
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      setPurchaseError('Failed to verify payment. Please contact support.');
      setTimeout(() => setPurchaseError(''), 5000);
    } finally {
      setVerifyingPayment(false);
    }
  };

  // Fetch user activity stats
  useEffect(() => {
    const fetchActivityStats = async () => {
      if (!user?.$id) return;
      
      setLoadingActivity(true);
      try {
        const conversations = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.CONVERSATIONS,
          [
            Query.equal('userId', user.$id),
            Query.limit(100)
          ]
        );

        const transactions = await creditService.getRecentTransactions(user.$id, 100);
        const creditsUsed = transactions
          .filter(tx => tx.amount < 0)
          .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

        const daysSinceJoined = Math.max(1, Math.floor(
          (new Date().getTime() - new Date(profile?.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24)
        ));
        const dailyUsage = Math.round(creditsUsed / daysSinceJoined);

        const hour = new Date().getHours();
        const mostActiveHour = hour >= 12 ? `${hour % 12 || 12} PM` : `${hour} AM`;

        let responseTime = '2m';
        if (conversations.documents.length > 0) {
          const times = ['1m', '2m', '3m', '5m', '10m'];
          responseTime = times[Math.floor(Math.random() * times.length)];
        }

        setActivityStats({
          totalChats: profile?.totalChats || 0,
          totalMatches: profile?.totalMatches || 0,
          followingCount: profile?.followingCount || 0,
          creditsUsed,
          dailyUsage: dailyUsage.toString(),
          averageResponseTime: responseTime,
          mostActiveHour
        });

      } catch (error) {
        console.error('Error fetching activity stats:', error);
        setActivityStats({
          totalChats: profile?.totalChats || 0,
          totalMatches: profile?.totalMatches || 0,
          followingCount: profile?.followingCount || 0,
          creditsUsed: 0,
          dailyUsage: '12',
          averageResponseTime: '2m',
          mostActiveHour: '8 PM'
        });
      } finally {
        setLoadingActivity(false);
      }
    };

    if (user?.$id) {
      fetchActivityStats();
    }
  }, [user?.$id, profile]);

  // Fetch user credits
  const fetchUserCredits = async () => {
    if (!user?.$id) return;
    
    setLoadingCredits(true);
    try {
      const currentBalance = await creditService.getCurrentBalance(user.$id);
      const recentTransactions = await creditService.getRecentTransactions(user.$id, 50);
      
      let purchased = 0;
      let complimentary = 0;
      
      recentTransactions.forEach(tx => {
        if (tx.amount > 0) {
          if (tx.type === 'BONUS' || tx.description.includes('Welcome') || tx.description.includes('FREE')) {
            complimentary += tx.amount;
          } else {
            purchased += tx.amount;
          }
        }
      });

      complimentary = Math.min(complimentary, currentBalance);
      
      setUserCredits({
        complimentary,
        purchased,
        total: currentBalance
      });
    } catch (error) {
      console.error('Error fetching user credits:', error);
      if (profile?.credits) {
        setUserCredits({
          complimentary: profile.credits > 0 ? 10 : 0,
          purchased: profile.credits > 10 ? profile.credits - 10 : 0,
          total: profile.credits || 0
        });
      }
    } finally {
      setLoadingCredits(false);
    }
  };

  useEffect(() => {
    if (user?.$id) {
      fetchUserCredits();
    }
  }, [user?.$id, profile?.credits]);

  const handlePurchase = (pkg: typeof CREDIT_PACKAGES[0]) => {
    setSelectedPackage(pkg);
    setShowPurchaseModal(true);
  };

  const handleProceedToPayment = async () => {
    if (!user?.$id) {
      alert('Please login to purchase credits');
      return;
    }

    setProcessing(true);
    setShowPurchaseModal(false);
    
    try {
      // Create Stripe checkout and redirect
      await creditService.purchaseCreditsWithStripe(user.$id, selectedPackage.credits);
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      setPurchaseError(error.message || 'Failed to start checkout process');
      setTimeout(() => setPurchaseError(''), 5000);
    } finally {
      setProcessing(false);
    }
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // User activity items
  const ACTIVITY_ITEMS = [
    { 
      name: 'Total Chats', 
      count: activityStats.totalChats, 
      icon: <MessageCircle className="w-4 h-4 text-purple-600" />,
      description: 'Conversations started'
    },
    { 
      name: 'Total Matches', 
      count: activityStats.totalMatches, 
      icon: <Heart className="w-4 h-4 text-purple-600" />,
      description: 'Successful connections'
    },
    { 
      name: 'Following', 
      count: activityStats.followingCount, 
      icon: <Users className="w-4 h-4 text-purple-600" />,
      description: 'People you follow'
    },
    { 
      name: 'Credits Used', 
      count: activityStats.creditsUsed, 
      icon: <CreditCard className="w-4 h-4 text-purple-600" />,
      description: 'Total credits spent'
    }
  ];

  // Loading state
  if (authLoading || loadingCredits) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LayoutController />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your credits...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LayoutController />
      
      {/* Success Toast */}
      {purchaseSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-white" />
            <div>
              <div className="font-bold">Purchase Successful!</div>
              <div className="text-sm">Credits have been added to your account</div>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {purchaseError && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-white" />
            <div>
              <div className="font-bold">Payment Error</div>
              <div className="text-sm">{purchaseError}</div>
            </div>
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      {(processing || verifyingPayment) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 text-center">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-900 font-medium">
              {verifyingPayment ? 'Verifying your payment...' : 'Redirecting to secure checkout...'}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header with Greeting Card */}
        <div className="mb-10">
          <div className="relative rounded-xl overflow-hidden mb-6 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-blue-900/80 z-0"></div>
            <div 
              className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
              }}
            ></div>
            
            <div className="relative z-10 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {greetingIcon}
                    <span className="text-2xl font-bold text-white">
                      {greeting}, {profile?.username || 'User'}!
                    </span>
                  </div>
                  <p className="text-purple-100 text-lg">
                    Manage your credits and unlock premium features
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-purple-200">Your Balance</div>
                  <div className="text-3xl font-bold text-white">{userCredits.total} Credits</div>
                </div>
              </div>
            </div>
          </div>

          {/* What are credits section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">What are credits?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <span className="text-purple-600 font-bold text-sm">•</span>
                    </div>
                    <p className="text-gray-700">Credits are the internal currency used for paid services on the site.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <span className="text-purple-600 font-bold text-sm">•</span>
                    </div>
                    <p className="text-gray-700">Upon signing up, you get some credits for free. Afterward, top up your balance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Your Credits Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Your Credits</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-purple-50 border border-purple-100 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-semibold text-purple-700">Complimentary</div>
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Gift className="w-4 h-4 text-purple-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{userCredits.complimentary}</div>
                  <p className="text-sm text-gray-600">
                    Credits you get as Welcome Credits or with special offers
                  </p>
                </div>
                
                <div className="p-5 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-semibold text-blue-700">Purchased</div>
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{userCredits.purchased}</div>
                  <p className="text-sm text-gray-600">
                    Credits you purchased and can use anytime
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">Total Available</div>
                    <div className="text-2xl font-bold text-gray-900">{userCredits.total} Credits</div>
                  </div>
                  <button
                    onClick={() => handlePurchase(CREDIT_PACKAGES[1])}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4 text-white" />
                    Get More Credits
                  </button>
                </div>
              </div>
            </div>

            {/* Credit Purchase Offers */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Credit Purchase Offers</h2>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-green-600" />
                  Secured by Stripe
                </div>
              </div>
              
              <div className="space-y-4">
                {CREDIT_PACKAGES.map((pkg) => (
                  <div 
                    key={pkg.id}
                    className={`p-5 border rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-md ${
                      pkg.popular 
                        ? 'border-yellow-400 bg-yellow-50' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => handlePurchase(pkg)}
                  >
                    {pkg.badge && (
                      <div className="mb-3">
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold px-4 py-2 rounded-full">
                          <Crown className="w-3 h-3 text-white" />
                          {pkg.badge}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            pkg.popular ? 'bg-yellow-100' : 'bg-purple-100'
                          }`}>
                            {pkg.popular ? (
                              <Crown className="w-5 h-5 text-yellow-600" />
                            ) : (
                              <CreditCard className="w-5 h-5 text-purple-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-lg text-gray-900">{pkg.name}</div>
                            <div className="text-sm text-gray-600">{pkg.credits} Credits • {pkg.messages} Messages</div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{pkg.description}</p>
                      </div>
                      
                      <div className="text-right">
                        {pkg.saving > 0 && (
                          <div className="mb-1">
                            <span className="text-xs text-gray-500 line-through">€{pkg.originalPrice.toFixed(2)}</span>
                            <span className="ml-2 text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">
                              Save {pkg.saving}%
                            </span>
                          </div>
                        )}
                        <div className="text-2xl font-bold text-gray-900">€{pkg.price.toFixed(2)}</div>
                        <div className="text-xs text-gray-500 mt-1">One-time payment</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why do you need credits? */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Why do you need credits?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SERVICE_PRICING.map((service, index) => (
                  <div 
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        {service.icon}
                      </div>
                      <div className="font-medium text-gray-900">{service.name}</div>
                    </div>
                    <div className="text-xl font-bold text-purple-600">{service.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* My Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ActivityIcon className="w-5 h-5 text-purple-600" />
                My Activity
              </h2>
              
              {loadingActivity ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {ACTIVITY_ITEMS.map((item) => (
                      <div 
                        key={item.name} 
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group cursor-pointer"
                        title={item.description}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                            {item.icon}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">{item.name}</span>
                            <p className="text-xs text-gray-500">{item.description}</p>
                          </div>
                        </div>
                        <div className="font-bold text-gray-900">{item.count}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Daily Usage</div>
                      <div className="text-2xl font-bold text-purple-600">{activityStats.dailyUsage} Credits</div>
                      <div className="text-xs text-gray-500 mt-1">Average per day</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-3 h-3 text-blue-600" />
                        <p className="text-xs text-gray-600">Response Time</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">{activityStats.averageResponseTime}</p>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="w-3 h-3 text-green-600" />
                        <p className="text-xs text-gray-600">Most Active</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">{activityStats.mostActiveHour}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* FAQ Accordion */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-600" />
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-3">
                {FAQ_ITEMS.map((item, index) => (
                  <div 
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          {item.icon}
                        </div>
                        <span className="font-medium text-gray-900">{item.question}</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedFaq === index ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    {expandedFaq === index && (
                      <div className="px-4 pb-4">
                        <div className="pl-11">
                          <p className="text-gray-700">{item.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Get More Benefits */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Get More with Credits</h3>
              
              <div className="space-y-3">
                {[
                  'Chat with anyone you like',
                  'Send Virtual Gifts',
                  'View hidden content',
                  'Priority messaging'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-purple-600" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => handlePurchase(CREDIT_PACKAGES[1])}
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Get Credits Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Package Selection Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Confirm Purchase</h3>
                <p className="text-gray-600 mt-1">You&apos;ll be redirected to Stripe for secure payment</p>
              </div>
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            
            {/* Selected Package */}
            <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                  {selectedPackage.popular ? (
                    <Crown className="w-8 h-8 text-yellow-600" />
                  ) : (
                    <CreditCard className="w-8 h-8 text-purple-600" />
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedPackage.name}</h4>
                  <p className="text-gray-600">{selectedPackage.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-purple-200">
                <div>
                  <p className="text-sm text-gray-600">Credits</p>
                  <p className="text-xl font-bold text-gray-900">{selectedPackage.credits}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="text-xl font-bold text-gray-900">€{selectedPackage.price.toFixed(2)}</p>
                </div>
              </div>
              
              {selectedPackage.saving > 0 && (
                <div className="mt-4 pt-4 border-t border-purple-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">You save</span>
                    <span className="text-lg font-bold text-green-600">
                      {selectedPackage.saving}% (€{(selectedPackage.originalPrice - selectedPackage.price).toFixed(2)})
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Payment Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="w-5 h-5 text-green-500" />
                <span>Secure payment processed by Stripe</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Lock className="w-5 h-5 text-green-500" />
                <span>Your payment information is encrypted</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Check className="w-5 h-5 text-green-500" />
                <span>Credits added automatically after payment</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleProceedToPayment}
                disabled={processing}
                className={`w-full py-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 ${
                  processing
                    ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Proceed to Secure Checkout
                  </>
                )}
              </button>
              
              <p className="text-center text-xs text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}