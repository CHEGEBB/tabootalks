/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Gift, Crown, Heart, Star, Sparkles, ChevronRight, ChevronLeft,
  CheckCircle, X, Send, CreditCard, AlertCircle, TrendingUp, Flower2,
  Palette, Gamepad2, Dumbbell, Wine, Camera, Film, Car, Coffee,
  Shirt, Gem, ShoppingCart, Droplets, PartyPopper, Headphones,
  CookingPot, Tent, Compass, BookOpen, MailCheck, History,
  PlayCircleIcon,
  DiamondIcon,
  GemIcon
} from 'lucide-react';
import LayoutController from '@/components/layout/LayoutController';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCredits } from '@/lib/hooks/useCredits';
import { useGifts } from '@/lib/hooks/useGifts';
import personaService, { ParsedPersonaProfile } from '@/lib/services/personaService';
import giftHandlerService from '@/lib/services/giftHandlerService';
import { COLLECTIONS, DATABASE_ID, databases } from '@/lib/appwrite/config';
import { Query, ID } from 'appwrite';

// Types
interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

export default function VirtualGiftToPersonaPage() {
  const router = useRouter();
  const params = useParams();
  const personaId = params.id as string;
  
  // Hooks
  const { profile: currentUser } = useAuth();
  const { credits: userCredits, refreshCredits } = useCredits();
  const { 
    allGifts, 
    giftsByCategory, 
    isLoading: giftsLoading, 
    error: giftsError,
    canAffordGift,
  } = useGifts();
  
  // State
  const [recipient, setRecipient] = useState<ParsedPersonaProfile | null>(null);
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const [personalMessage, setPersonalMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false); // New state for navigation loading
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showGiftOverlay, setShowGiftOverlay] = useState(false);
  const [showInsufficientCredits, setShowInsufficientCredits] = useState(false);
  
  // Refs
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Categories - ordered romantically with animated last
  const categories: Category[] = [
    { 
      id: 'romantic', 
      name: 'Romantic', 
      icon: <Heart className="w-5 h-5" />,
      color: 'from-rose-500 to-pink-500',
      description: 'Express your love'
    },
    { 
      id: 'flowers', 
      name: 'Flowers', 
      icon: <Flower2 className="w-5 h-5" />,
      color: 'from-emerald-500 to-green-500',
      description: 'Beautiful blooms'
    },
    { 
      id: 'celebration', 
      name: 'Celebration', 
      icon: <PartyPopper className="w-5 h-5" />,
      color: 'from-fuchsia-500 to-pink-500',
      description: 'Special occasions'
    },
    {
      id:'postcard',
      name: 'Postcards',
      icon: <MailCheck className="w-5 h-5" />,
      color: 'from-yellow-500 to-amber-500',
      description: 'Send postcards'
    },
    { 
      id: 'fashion', 
      name: 'Fashion', 
      icon: <Shirt className="w-5 h-5" />,
      color: 'from-violet-500 to-purple-500',
      description: 'Stylish gifts'
    },
    { 
      id: 'hobby', 
      name: 'Hobbies', 
      icon: <Palette className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      description: 'For every interest'
    },
    { 
      id: 'magical', 
      name: 'Magical', 
      icon: <Star className="w-5 h-5" />,
      color: 'from-purple-500 to-fuchsia-500',
      description: 'Enchanted gifts'
    },
    { 
      id: 'animated', 
      name: 'Animated', 
      icon: <PlayCircleIcon className="w-5 h-5" />,
      color: 'from-indigo-500 to-purple-500',
      description: 'Interactive gifts'
    },
  ];

  const subcategoryIcons: Record<string, React.ReactNode> = {
    'flowers': <Flower2 className="w-4 h-4" />,
    'jewelry': <Gem className="w-4 h-4" />,
    'music': <Headphones className="w-4 h-4" />,
    'photography': <Camera className="w-4 h-4" />,
    'reading': <BookOpen className="w-4 h-4" />,
    'cooking': <CookingPot className="w-4 h-4" />,
    'travel': <Compass className="w-4 h-4" />,
    'camping': <Tent className="w-4 h-4" />,
    'art': <Palette className="w-4 h-4" />,
    'gaming': <Gamepad2 className="w-4 h-4" />,
    'fitness': <Dumbbell className="w-4 h-4" />,
    'wine': <Wine className="w-4 h-4" />,
    'film': <Film className="w-4 h-4" />,
    'cars': <Car className="w-4 h-4" />,
    'drinks': <Coffee className="w-4 h-4" />,
    'shopping': <ShoppingCart className="w-4 h-4" />,
    'beauty': <Droplets className="w-4 h-4" />,
  };

  // Load recipient data
  useEffect(() => {
    const loadRecipient = async () => {
      if (!personaId) return;
      
      try {
        const persona = await personaService.getPersonaById(personaId);
        setRecipient(persona);
      } catch (err) {
        console.error('Error loading recipient:', err);
        setError('Could not load recipient profile');
      }
    };
    
    loadRecipient();
  }, [personaId]);

  // Get category helpers
  const getCategoryDisplayName = (categoryId: string) => {
    if (categoryId === 'featured') return 'Featured';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
  };

  const getCategoryIcon = (categoryId: string) => {
    if (categoryId === 'featured') return <GemIcon className="w-5 h-5" />;
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : <Gift className="w-5 h-5" />;
  };

  const getCategoryColor = (categoryId: string) => {
    if (categoryId === 'featured') return 'from-amber-500 to-orange-500';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : 'from-gray-500 to-gray-600';
  };

  // Handle gift selection
  const handleSelectGift = async (gift: any) => {
    setSelectedGift(gift);
    
    const affordability = await canAffordGift(gift.id);
    if (!affordability.canAfford) {
      setShowInsufficientCredits(true);
    } else {
      setShowGiftOverlay(true);
    }
  };

  // Send gift
  const handleSendGift = async () => {
    if (!selectedGift || !recipient) {
      setError('Missing required information');
      return;
    }
    
    setIsSending(true);
    setError('');
    
    try {
      let conversationId = '';
      
      try {
        if (currentUser?.$id) {
          const conversations = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.CONVERSATIONS,
            [
              Query.equal('userId', currentUser.$id),
              Query.equal('botProfileId', recipient.$id),
              Query.limit(1)
            ]
          );
          
          if (conversations.documents.length > 0) {
            conversationId = conversations.documents[0].$id;
          } else {
            const newConversation = await databases.createDocument(
              DATABASE_ID,
              COLLECTIONS.CONVERSATIONS,
              ID.unique(),
              {
                userId: currentUser.$id,
                botProfileId: recipient.$id,
                lastMessage: `Sent ${selectedGift.name} as a gift! 🎁`,
                lastMessageAt: new Date().toISOString(),
                messageCount: 0,
                isActive: true
              }
            );
            conversationId = newConversation.$id;
          }
        }
      } catch (convError) {
        console.warn('Could not find/create conversation:', convError);
      }
  
      const result = await giftHandlerService.sendGiftToChat(
        currentUser?.$id || '',
        recipient.$id,
        selectedGift.id,
        personalMessage,
        conversationId
      );
      
      if (result.success) {
        setSuccess(`🎁 Gift sent to ${recipient.username}!`);
        refreshCredits();
        
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('credits-updated'));
        }
        
        setIsSending(false);
        setShowGiftOverlay(false);
        setIsNavigating(true); // Start navigation loading
        
        // Give a moment for the success message to be visible
        setTimeout(() => {
          if (conversationId) {
            router.push(`/main/chats/${conversationId}`);
          } else {
            router.back();
          }
        }, 1000);
      } else {
        setError(result.error || 'Failed to send gift');
        setIsSending(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send gift');
      setIsSending(false);
    }
  };

  const handleBuyCredits = () => {
    router.push('/main/credits');
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(`/main/chats/${recipient?.$id || ''}`);
    }
  };

  const handleGiftHistory = () => {
    router.push('/main/virtual-gifts/history');
  };

  // Scroll category bar
  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 200;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Get filtered gifts
  const getFilteredGifts = () => {
    if (activeCategory === 'all') {
      // Custom order for displaying all categories
      // Featured FIRST, then romantic order, Animated LAST
      const orderedCategories = [
        'flowers',
        'romantic', 
        'magical',
        'celebration',
        'postcard',
        'fashion',
        'hobby',
        'animated' // LAST
      ];
      
      const orderedGifts: Record<string, any[]> = {};
      
      // Add FEATURED first if it exists
      if (giftsByCategory['featured'] && giftsByCategory['featured'].length > 0) {
        orderedGifts['featured'] = giftsByCategory['featured'];
      }
      
      // Then add categories in the desired order
      orderedCategories.forEach(catId => {
        if (giftsByCategory[catId] && giftsByCategory[catId].length > 0) {
          orderedGifts[catId] = giftsByCategory[catId];
        }
      });
      
      // Add any remaining categories not in the ordered list
      Object.keys(giftsByCategory).forEach(catId => {
        if (catId !== 'featured' && !orderedCategories.includes(catId) && giftsByCategory[catId].length > 0) {
          orderedGifts[catId] = giftsByCategory[catId];
        }
      });
      
      return orderedGifts;
    } else {
      return { [activeCategory]: giftsByCategory[activeCategory] || [] };
    }
  };

  const filteredGifts = getFilteredGifts();

  // Loading states - Initial loading, gift loading, or navigation loading
  if (giftsLoading || !recipient || isNavigating) {
    return (
      <div className="min-h-screen bg-white">
        <LayoutController />
        <div className="flex items-center justify-center min-h-screen bg-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            {isNavigating ? (
              <>
                <div className="relative flex justify-center mb-6">
                  <div className="w-16 h-16 border-4 border-[#5e17eb] border-t-transparent rounded-full animate-spin"></div>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#5e17eb] bg-white rounded-full p-1"
                  >
                    <Gift className="w-6 h-6" />
                  </motion.div>
                </div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Gift Sent Successfully!</h3>
                <p className="text-gray-600">Taking you to your conversation...</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 border-4 border-[#5e17eb] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-gray-600 font-medium">Loading gifts...</p>
              </>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <LayoutController />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        
        {/* Header - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          {/* Top Row - Mobile Optimized */}
          <div className="flex items-center justify-between gap-3 mb-4">
            {/* Left: Back Button + Persona */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <button
                onClick={handleBack}
                className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-[#5e17eb] group-hover:-translate-x-1 transition-all" />
              </button>
              
              {/* Persona Info */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-white shadow-md">
                    {recipient.profilePic ? (
                      <Image
                        src={recipient.profilePic}
                        alt={recipient.username}
                        width={44}
                        height={44}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                        {recipient.username.charAt(0)}
                      </div>
                    )}
                  </div>
                  {recipient.lastActive && Date.now() - new Date(recipient.lastActive).getTime() < 5 * 60 * 1000 && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-gray-900 text-sm sm:text-base truncate">{recipient.username}</h2>
                  <p className="text-xs text-gray-500 hidden sm:block truncate">Send a virtual gift</p>
                </div>
              </div>
            </div>
            
            {/* Right: Credits */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-[#5e17eb]/10 to-purple-500/10 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl">
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                <span className="text-base sm:text-lg font-bold text-gray-900">{userCredits}</span>
              </div>
              <button
                onClick={handleBuyCredits}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#5e17eb] to-purple-600 text-white font-medium rounded-lg sm:rounded-xl hover:shadow-lg transition-all text-xs sm:text-sm flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>
          </div>
          
          {/* Second Row - Choose Gift Text + Gift History Button */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm sm:text-base text-gray-600">
              Choose a virtual gift for <span className="font-semibold text-gray-900">{recipient.username}</span>
            </p>
            
            <button
              onClick={handleGiftHistory}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 whitespace-nowrap"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Gift History</span>
            </button>
          </div>
          
          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4"
              >
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-sm sm:text-base">{success}</span>
                  </div>
                  <button onClick={() => setSuccess('')} className="text-green-500 hover:text-green-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Error Messages */}
          <AnimatePresence>
            {(error || giftsError) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4"
              >
                <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="font-medium text-sm sm:text-base">{error || giftsError}</span>
                  </div>
                  <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Category Navigation - Enhanced with scroll indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Browse Categories</h3>
          </div>
          
          <div className="relative">
            {/* Scroll Button Left - Mobile */}
            <button
              onClick={() => scrollCategories('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center lg:hidden hover:bg-white transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Category Scroll Container */}
            <div
              ref={categoryScrollRef}
              className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide scroll-smooth px-8 lg:px-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory('all')}
                className={`flex flex-col items-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl whitespace-nowrap transition-all min-w-[100px] sm:min-w-[120px] flex-shrink-0 ${
                  activeCategory === 'all'
                    ? 'bg-gradient-to-r from-[#5e17eb] to-purple-600 text-white shadow-lg'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-300'
                }`}
              >
                <Gift className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
                <span className="font-medium text-xs sm:text-sm">All Gifts</span>
              </motion.button>
              
              {categories.map(category => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex flex-col items-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl whitespace-nowrap transition-all min-w-[100px] sm:min-w-[120px] flex-shrink-0 ${
                    activeCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-300'
                  }`}
                >
                  <div className="mb-1">
                    {category.icon}
                  </div>
                  <span className="font-medium text-xs sm:text-sm">{category.name}</span>
                </motion.button>
              ))}
            </div>
            
            {/* Scroll Button Right - Mobile */}
            <button
              onClick={() => scrollCategories('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center lg:hidden hover:bg-white transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </motion.div>
        
        {/* Main Content - Gift Cards */}
        <div className="space-y-8 sm:space-y-12 mb-12">
          {Object.entries(filteredGifts).map(([categoryId, gifts], sectionIndex) => {
            if (!gifts || gifts.length === 0) return null;
            
            return (
              <motion.section
                key={categoryId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
                className="scroll-mt-8"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r ${getCategoryColor(categoryId)}`}>
                      <div className="text-white">
                        {getCategoryIcon(categoryId)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-2xl font-bold text-gray-900">
                        {categoryId === 'featured' ? 'Featured Gifts' : `${getCategoryDisplayName(categoryId)} Gifts`}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {categoryId === 'featured' ? 'Most popular gifts' : `${gifts.length} gifts available`}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Gift Cards Grid - Responsive */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  {gifts.map((gift, giftIndex) => (
                    <motion.div
                      key={`${categoryId}-${gift.id}-${giftIndex}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: giftIndex * 0.05 }}
                      whileHover={{ scale: 1.03, y: -5 }}
                      onClick={() => handleSelectGift(gift)}
                      className="group relative bg-white overflow-hidden hover:shadow-2xl transition-all cursor-pointer flex flex-col border border-gray-100 rounded-xl"
                    >
                      {/* Popular Badge */}
                      {gift.popularityScore > 250 && (
                        <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] sm:text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                          <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span className="hidden sm:inline">Hot</span>
                        </div>
                      )}
                      
                      {/* Subcategory Badge */}
                      {gift.subcategory && subcategoryIcons[gift.subcategory] && (
                        <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] sm:text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <span className="hidden sm:inline">{subcategoryIcons[gift.subcategory]}</span>
                          <span className="capitalize hidden sm:inline">{gift.subcategory}</span>
                        </div>
                      )}
                      
                      {/* Gift Image */}
                      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative rounded-t-xl">
                        {gift.imageUrl ? (
                          <Image
                            src={gift.imageUrl}
                            alt={gift.name}
                            width={300}
                            height={300}
                            className="object-contain w-full h-full p-3 sm:p-4 group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <Gift className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                        )}
                      </div>
                      
                      {/* Gift Info */}
                      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
                        <div className="mb-2">
                          <h4 className="font-bold text-gray-900 text-xs sm:text-sm lg:text-base mb-0.5 sm:mb-1 line-clamp-1">{gift.name}</h4>
                          <p className="text-[10px] sm:text-xs text-gray-600 line-clamp-2">{gift.description}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-1 sm:gap-1.5">
                            <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                            <span className="font-bold text-sm sm:text-base lg:text-lg text-gray-900">{gift.price}</span>
                          </div>
                          
                          {gift.isAnimated ? (
                            <div className="text-[9px] sm:text-xs text-purple-600 bg-purple-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              <span className="hidden sm:inline">Animated</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm text-gray-500">
                              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                              <span className="hidden sm:inline">{gift.popularityScore}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>
      </div>
      
      {/* Gift Overlay Modal - Improved with better border radius and styling */}
      <AnimatePresence>
        {showGiftOverlay && selectedGift && recipient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50"
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              
              {/* Modal Content - Stacked on Mobile, Side by Side on Desktop */}
              <div className="flex flex-col md:flex-row overflow-y-auto">
                
                {/* Left Side - Gift Preview */}
                <div className="md:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-8 flex flex-col items-center justify-center md:rounded-l-3xl">
                  <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 mb-4 sm:mb-6 bg-white rounded-2xl shadow-lg p-4 flex items-center justify-center">
                    {selectedGift.imageUrl ? (
                      <Image
                        src={selectedGift.imageUrl}
                        alt={selectedGift.name}
                        width={320}
                        height={320}
                        className="object-contain w-full h-full drop-shadow-md"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl">
                        <Gift className="w-32 h-32 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-bold text-gray-900 text-xl sm:text-2xl mb-2">{selectedGift.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">{selectedGift.description}</p>
                    
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex items-center gap-2 sm:gap-3 bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-gray-100 shadow-md">
                        <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                        <span className="text-2xl sm:text-3xl font-bold text-gray-900">{selectedGift.price}</span>
                        <span className="text-gray-600 text-sm sm:text-base">credits</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Side - Send Form */}
                <div className="md:w-1/2 p-6 sm:p-8 flex flex-col">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg sm:text-xl">Send to {recipient.username}</h3>
                      <p className="text-gray-500 text-xs sm:text-sm">Add a personal message</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowGiftOverlay(false);
                        setSelectedGift(null);
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full p-1.5"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Credit Status */}
                  <div className="mb-4 sm:mb-6">
                    {userCredits < selectedGift.price ? (
                      <div className="bg-white border border-rose-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-5 h-5 text-rose-500" />
                          </div>
                          <div>
                            <h5 className="font-bold text-rose-800 text-sm sm:text-base">Insufficient Credits</h5>
                            <p className="text-rose-700 text-xs sm:text-sm">
                              You need {selectedGift.price - userCredits} more credits
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleBuyCredits}
                          className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-rose-500 to-red-500 text-white font-bold rounded-xl hover:shadow-lg transition-all text-sm sm:text-base"
                        >
                          Add Credits Now
                        </button>
                      </div>
                    ) : (
                      <div className="bg-white border border-green-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>
                          <div>
                            <h5 className="font-bold text-green-800 text-sm sm:text-base">Ready to Send</h5>
                            <p className="text-green-700 text-xs sm:text-sm">
                              You have {userCredits} credits available
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Personal Message */}
                  <div className="mb-4 sm:mb-6 flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Personal message (optional)
                    </label>
                    <textarea
                      value={personalMessage}
                      onChange={(e) => setPersonalMessage(e.target.value)}
                      placeholder={`Write something sweet for ${recipient.username}...`}
                      className="w-full h-24 sm:h-32 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5e17eb]/20 focus:border-[#5e17eb] text-sm resize-none"
                      maxLength={200}
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                      {personalMessage.length}/200
                    </div>
                  </div>
                  
                  {/* Send Button */}
                  <button
                    onClick={handleSendGift}
                    disabled={isSending || userCredits < selectedGift.price}
                    className="w-full py-3 sm:py-4 bg-gradient-to-r from-[#5e17eb] to-purple-600 text-white font-bold rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg"
                  >
                    {isSending ? (
                      <>
                        <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span>Send Gift ({selectedGift.price} credits)</span>
                      </>
                    )}
                  </button>
                  
                  {/* Balance Info */}
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                          <Crown className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-900">Your Balance</p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">{userCredits} credits</p>
                        </div>
                      </div>
                      <button
                        onClick={handleBuyCredits}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-xs sm:text-sm"
                      >
                        Get More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Insufficient Credits Modal - Improved with better styling */}
      <AnimatePresence>
        {showInsufficientCredits && selectedGift && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-rose-50 border-4 border-rose-100 flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-rose-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Not Enough Credits</h3>
                <p className="text-gray-600">
                  You need <span className="font-bold text-[#5e17eb]">{selectedGift.price}</span> credits to send{' '}
                  <span className="font-bold">{selectedGift.name}</span>, but you only have{' '}
                  <span className="font-bold text-rose-500">{userCredits}</span> credits.
                </p>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={handleBuyCredits}
                  className="w-full py-3.5 bg-gradient-to-r from-[#5e17eb] to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  Add Credits Now
                </button>
                <button
                  onClick={() => {
                    setShowInsufficientCredits(false);
                    setSelectedGift(null);
                  }}
                  className="w-full py-3.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Choose Different Gift
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}