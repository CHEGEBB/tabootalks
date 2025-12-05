// app/main/credits/page.tsx
'use client';

import React, { useState } from 'react';
import LayoutController from '@/components/layout/LayoutController';
import Image from 'next/image';
import { 
  CreditCard, 
  Shield, 
  Check, 
  Crown, 
  X, 
  Lock, 
  Gift, 
  MessageSquare, 
  Mail, 
  Video, 
  Image as ImageIcon,
  Camera,
  Users,
  ChevronDown,
  CreditCard as CardIcon,
  Calendar,
  Key,
  User,
  HelpCircle,
  Clock,
  Zap,
  Star,
  TrendingUp
} from 'lucide-react';

// Mock data for credit packages
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
    originalPrice: 9.99
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
    originalPrice: 24.99
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
    originalPrice: 49.99
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
    price: '2 credits',
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

// FAQ Data with accordion
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
    answer: 'Yes! All payments are processed through secure payment gateways with bank-level encryption. Your data is always protected.',
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

// User activity data
const ACTIVITY_ITEMS = [
  { name: 'Chats', count: 156, icon: <MessageSquare className="w-4 h-4 text-purple-600" /> },
  { name: 'Mail', count: 42, icon: <Mail className="w-4 h-4 text-purple-600" /> },
  { name: 'Following', count: 89, icon: <Users className="w-4 h-4 text-purple-600" /> },
  { name: 'Likes', count: 234, icon: <Star className="w-4 h-4 text-purple-600" /> }
];

export default function CreditsPage() {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(CREDIT_PACKAGES[1]);
  const [userCredits, setUserCredits] = useState({
    complimentary: 20,
    purchased: 0,
    total: 20
  });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [processing, setProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const handlePurchase = (pkg: typeof CREDIT_PACKAGES[0]) => {
    setSelectedPackage(pkg);
    setShowPurchaseModal(true);
  };

  const handleProceedToPayment = () => {
    setShowPurchaseModal(false);
    setShowCardModal(true);
  };

  const handleCardSubmit = () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setShowCardModal(false);
      setPurchaseSuccess(true);
      
      // Update user credits
      setUserCredits(prev => ({
        ...prev,
        purchased: prev.purchased + selectedPackage.credits,
        total: prev.total + selectedPackage.credits
      }));
      
      // Auto-hide success message
      setTimeout(() => setPurchaseSuccess(false), 3000);
    }, 2000);
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LayoutController />
      
      {/* Success Toast */}
      {purchaseSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <Check className="w-5 h-5 text-white" />
            <div>
              <div className="font-bold">Purchase Successful!</div>
              <div className="text-sm">{selectedPackage.credits} credits added to your account</div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">TabooTalks Credits</h1>
              <p className="text-gray-600 mt-2">Unlock premium features and connect with amazing people</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Your Balance</div>
                <div className="text-2xl font-bold text-purple-600">{userCredits.total} Credits</div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
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
                  <Lock className="w-3 h-3 text-gray-600" />
                  Secure payment
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
                <TrendingUp className="w-5 h-5 text-purple-600" />
                My Activity
              </h2>
              
              <div className="space-y-3">
                {ACTIVITY_ITEMS.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        {item.icon}
                      </div>
                      <span className="font-medium text-gray-700">{item.name}</span>
                    </div>
                    <div className="font-bold text-gray-900">{item.count}</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Daily Usage</div>
                  <div className="text-2xl font-bold text-purple-600">12 Credits</div>
                  <div className="text-xs text-gray-500 mt-1">Average per day</div>
                </div>
              </div>
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
                  'Respond in Mail',
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
                <h3 className="text-xl font-bold text-gray-900">Select Package</h3>
                <p className="text-gray-600 mt-1">Choose your preferred credit package</p>
              </div>
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            
            <div className="space-y-4 mb-8">
              {CREDIT_PACKAGES.map((pkg) => (
                <div 
                  key={pkg.id}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${
                    pkg.id === selectedPackage.id 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        pkg.id === selectedPackage.id ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                        <CreditCard className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{pkg.name}</div>
                        <div className="text-sm text-gray-600">{pkg.credits} Credits</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">€{pkg.price.toFixed(2)}</div>
                      {pkg.saving > 0 && (
                        <div className="text-xs text-green-600 font-medium mt-1">
                          Save {pkg.saving}%
                        </div>
                      )}
                    </div>
                  </div>
                  {pkg.id === selectedPackage.id && (
                    <div className="mt-3 pt-3 border-t border-purple-200">
                      <div className="flex items-center gap-2 text-sm text-purple-600">
                        <Check className="w-4 h-4 text-purple-600" />
                        Selected package
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handleProceedToPayment}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Continue to Payment
              </button>
              <p className="text-center text-sm text-gray-500">
                One-time payment • No recurring fees • Secure checkout
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Card Payment Modal - FIXED ICONS */}
      {showCardModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Payment Details</h3>
                <p className="text-gray-600 mt-1">Complete your purchase securely</p>
              </div>
              <button
                onClick={() => setShowCardModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={processing}
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            
            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium text-gray-900">{selectedPackage.name}</div>
                <div className="font-bold text-gray-900">€{selectedPackage.price.toFixed(2)}</div>
              </div>
              <div className="text-sm text-gray-600">
                {selectedPackage.credits} Credits • {selectedPackage.messages} Messages
              </div>
              {selectedPackage.badge && (
                <div className="flex items-center gap-1 mt-2">
                  <Crown className="w-3 h-3 text-yellow-600" />
                  <span className="text-xs font-medium text-yellow-700">{selectedPackage.badge}</span>
                </div>
              )}
            </div>
            
            {/* Card Form - ALL ICONS VISIBLE */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <CardIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    disabled={processing}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                      disabled={processing}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVC
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Key className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                      value={cardDetails.cvc}
                      onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                      disabled={processing}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                    disabled={processing}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 pt-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Your payment is secure and encrypted</span>
              </div>
            </div>
            
            <button
              onClick={handleCardSubmit}
              disabled={processing}
              className={`w-full mt-6 py-3.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 ${
                processing
                  ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-white" />
                  Pay €{selectedPackage.price.toFixed(2)}
                </>
              )}
            </button>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center gap-4">
                <div className="text-xs text-gray-500">We accept:</div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-5 bg-blue-600 text-white text-xs font-bold rounded flex items-center justify-center">VISA</div>
                  <div className="w-8 h-5 bg-red-500 text-white text-xs font-bold rounded flex items-center justify-center">MC</div>
                  <div className="w-8 h-5 bg-blue-800 text-white text-xs font-bold rounded flex items-center justify-center">AMEX</div>
                </div>
              </div>
            </div>
            
            <p className="text-center text-xs text-gray-500 mt-4">
              By completing this purchase, you agree to our Terms of Service
            </p>
          </div>
        </div>
      )}
    </div>
  );
}