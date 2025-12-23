/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Gift, Crown, Heart, Star, Sparkles, ChevronRight, ChevronLeft,
  CheckCircle, X, Send, CreditCard, AlertCircle, TrendingUp, Flower2,
  Palette, Gamepad2, Dumbbell, Wine, Camera, Film, Car, Coffee,
  Shirt, Gem, ShoppingCart, Droplets, PartyPopper, Headphones,
  CookingPot, Tent, Compass, BookOpen, MailCheck, History,
  PlayCircleIcon, GemIcon, Users, Search, Filter, Package
} from 'lucide-react';
import LayoutController from '@/components/layout/LayoutController';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCredits } from '@/lib/hooks/useCredits';
import { useGifts } from '@/lib/hooks/useGifts';
import personaService, { ParsedPersonaProfile } from '@/lib/services/personaService';
import { COLLECTIONS, DATABASE_ID, databases } from '@/lib/appwrite/config';
import { Query } from 'appwrite';

// Types
interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

export default function VirtualGiftsMainPage() {
  const router = useRouter();
  
  // Hooks
  const { profile: currentUser } = useAuth();
  const { credits: userCredits } = useCredits();
  const { 
    allGifts, 
    giftsByCategory, 
    isLoading: giftsLoading, 
    error: giftsError,
  } = useGifts();
  
  // State
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const [showRecipientSelector, setShowRecipientSelector] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGiftDetails, setShowGiftDetails] = useState(false);
  const [people, setPeople] = useState<ParsedPersonaProfile[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const [recentRecipients, setRecentRecipients] = useState<ParsedPersonaProfile[]>([]);
  
  // Refs
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Categories - same as the ID page
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

  // Load recent recipients from gift history
  useEffect(() => {
    const loadRecentRecipients = async () => {
      if (!currentUser?.$id) return;
      
      try {
        // Check if GIFT_HISTORY collection exists in COLLECTIONS
        if (!COLLECTIONS.GIFT_HISTORY) {
          console.log('Gift history collection not configured');
          return;
        }
        
        const giftHistory = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.GIFT_HISTORY,
          [
            Query.equal('senderId', currentUser.$id),
            Query.orderDesc('sentAt'),
            Query.limit(5)
          ]
        );
        
        const uniqueRecipientIds = [...new Set(giftHistory.documents.map(doc => doc.recipientId))];
        const recipientProfiles = await Promise.all(
          uniqueRecipientIds.slice(0, 3).map(id => personaService.getPersonaById(id))
        );
        
        setRecentRecipients(recipientProfiles.filter(Boolean));
      } catch (err) {
        console.error('Error loading recent recipients:', err);
        // Silently fail - recent recipients is not critical functionality
      }
    };
    
    loadRecentRecipients();
  }, [currentUser]);

  // Load all people when recipient selector opens
  const loadPeople = async () => {
    setLoadingPeople(true);
    try {
      const allPeople = await personaService.getAllPersonas();
      setPeople(allPeople);
    } catch (err) {
      console.error('Error loading people:', err);
    } finally {
      setLoadingPeople(false);
    }
  };

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

  // Handle gift selection - show details first
  const handleSelectGift = (gift: any) => {
    setSelectedGift(gift);
    setShowGiftDetails(true);
  };

  // Handle send this gift - open recipient selector
  const handleSendThisGift = async () => {
    setShowGiftDetails(false);
    await loadPeople();
    setShowRecipientSelector(true);
  };

  // Handle recipient selection - navigate to gift page with ID
  const handleRecipientSelect = (person: ParsedPersonaProfile) => {
    router.push(`/main/virtual-gifts/${person.$id}`);
  };

  const handleBuyCredits = () => {
    router.push('/main/credits');
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
    let gifts = activeCategory === 'all' ? allGifts : giftsByCategory[activeCategory] || [];
    
    // Apply search filter
    if (searchQuery.trim()) {
      gifts = gifts.filter(gift => 
        gift.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gift.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gift.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return gifts;
  };

  // Get gifts organized by category for "all" view
  const getOrganizedGifts = () => {
    if (activeCategory === 'all') {
      const orderedCategories = [
        'flowers',
        'romantic', 
        'magical',
        'celebration',
        'postcard',
        'fashion',
        'hobby',
        'animated'
      ];
      
      const orderedGifts: Record<string, any[]> = {};
      
      if (giftsByCategory['featured'] && giftsByCategory['featured'].length > 0) {
        orderedGifts['featured'] = giftsByCategory['featured'];
      }
      
      orderedCategories.forEach(catId => {
        if (giftsByCategory[catId] && giftsByCategory[catId].length > 0) {
          orderedGifts[catId] = giftsByCategory[catId];
        }
      });
      
      Object.keys(giftsByCategory).forEach(catId => {
        if (catId !== 'featured' && !orderedCategories.includes(catId) && giftsByCategory[catId].length > 0) {
          orderedGifts[catId] = giftsByCategory[catId];
        }
      });
      
      return orderedGifts;
    } else {
      const filtered = getFilteredGifts();
      return filtered.length > 0 ? { [activeCategory]: filtered } : {};
    }
  };

  const displayGifts = searchQuery.trim() ? { search: getFilteredGifts() } : getOrganizedGifts();

  // Loading state
  if (giftsLoading) {
    return (
      <div className="min-h-screen bg-white">
        <LayoutController />
        <div className="flex items-center justify-center min-h-screen bg-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 border-4 border-[#5e17eb] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-gray-600 font-medium">Loading gift marketplace...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <LayoutController />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        
        {/* Header - Enhanced for marketplace */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          {/* Top Row */}
          <div className="flex items-center justify-between gap-3 mb-4">
            {/* Left: Title & Description */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-[#5e17eb] to-purple-600 shadow-lg">
                  <Gift className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Virtual Gifts</h1>
                  <p className="text-xs sm:text-sm text-gray-600">Send special gifts to someone special</p>
                </div>
              </div>
            </div>
            
            {/* Right: Credits & Actions */}
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
          
          {/* Second Row - Search & Gift History */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gifts by name, description, or category..."
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5e17eb]/20 focus:border-[#5e17eb]"
              />
            </div>
            
            <button
              onClick={handleGiftHistory}
              className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 whitespace-nowrap"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </button>
          </div>
          
          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                <Package className="w-5 h-5 text-[#5e17eb]" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">How Virtual Gifts Work</h3>
                <p className="text-xs sm:text-sm text-gray-700">
                  Browse our collection, select a gift, choose who to send it to, and send! Gifts appear instantly in your conversation.
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Error Message */}
          <AnimatePresence>
            {giftsError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4"
              >
                <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="font-medium text-sm sm:text-base">{giftsError}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Category Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Browse by Category</h3>
            <div className="text-sm text-gray-600">
              {allGifts.length} gifts available
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => scrollCategories('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center lg:hidden hover:bg-white transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
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
            
            <button
              onClick={() => scrollCategories('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center lg:hidden hover:bg-white transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </motion.div>
        
        {/* Gift Display */}
        <div className="space-y-8 sm:space-y-12 mb-12">
          {Object.keys(displayGifts).length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No gifts found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or category filter</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#5e17eb] to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
              >
                View All Gifts
              </button>
            </motion.div>
          ) : (
            Object.entries(displayGifts).map(([categoryId, gifts], sectionIndex) => {
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
                  {categoryId !== 'search' && (
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
                  )}
                  
                  {categoryId === 'search' && (
                    <div className="mb-4 sm:mb-6">
                      <h3 className="text-lg sm:text-2xl font-bold text-gray-900">
                        Search Results
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Found {gifts.length} {gifts.length === 1 ? 'gift' : 'gifts'} matching &ldquo;{searchQuery}&rdquo;
                      </p>
                    </div>
                  )}
                  
                  {/* Gift Cards Grid */}
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
            })
          )}
        </div>
      </div>
      
      {/* Gift Details Modal - Redesigned */}
      <AnimatePresence>
        {showGiftDetails && selectedGift && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-end justify-center z-50"
            onClick={() => {
              setShowGiftDetails(false);
              setSelectedGift(null);
            }}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ 
                type: 'spring', 
                damping: 25, 
                stiffness: 300,
                mass: 0.8
              }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full sm:w-[50%] sm:mx-auto max-h-[92vh] overflow-hidden flex flex-col shadow-2xl rounded-t-[2rem]"
            >
              {/* Header - Sleek gradient */}
              <div className="relative bg-purple-600 p-6 sm:p-8">
                <div className="absolute inset-0 bg-black/5"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">Gift Details</h3>
                      <p className="text-purple-100 text-sm">Everything you need to know</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowGiftDetails(false);
                      setSelectedGift(null);
                    }}
                    className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 rounded-full"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Image */}
                    <div className="lg:w-1/2">
                      <div className="relative rounded-2xl aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
                        {selectedGift.imageUrl ? (
                          <Image
                            src={selectedGift.imageUrl}
                            alt={selectedGift.name}
                            width={500}
                            height={500}
                            className="relative object-contain  w-full h-full p-8 drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <Gift className="w-32 h-32 text-gray-300" />
                        )}
                      </div>
                    </div>
                    
                    {/* Right: Details */}
                    <div className="lg:w-1/2 space-y-6">
                      {/* Title & Description */}
                      <div className=''>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{selectedGift.name}</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">{selectedGift.description}</p>
                      </div>
                      
                      {/* Badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {selectedGift.isAnimated && (
                          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-4 py-2 text-sm font-bold">
                            <Sparkles className="w-4 h-4" />
                            <span>Animated</span>
                          </div>
                        )}
                        
                        {selectedGift.popularityScore > 250 && (
                          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-sm font-bold">
                            <TrendingUp className="w-4 h-4" />
                            <span>Trending</span>
                          </div>
                        )}
                        
                        {selectedGift.subcategory && (
                          <div className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 text-sm font-bold">
                            {subcategoryIcons[selectedGift.subcategory]}
                            <span className="capitalize">{selectedGift.subcategory}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Price - Large and prominent */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-6">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                              <Crown className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 font-medium mb-1">Price</p>
                              <p className="text-4xl font-bold text-gray-900">{selectedGift.price}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">credits</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-5 border border-red-100">
                          <Heart className="w-7 h-7 text-red-500 mb-3" />
                          <p className="text-3xl font-bold text-gray-900 mb-1">{selectedGift.popularityScore}</p>
                          <p className="text-sm text-gray-600 font-medium">Times Sent</p>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-5 border border-yellow-100">
                          <Star className="w-7 h-7 text-yellow-500 mb-3" />
                          <p className="text-xl font-bold text-gray-900 mb-1">{getCategoryDisplayName(selectedGift.category)}</p>
                          <p className="text-sm text-gray-600 font-medium">Category</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer Actions - Sleek */}
              <div className="border-t-2 border-gray-100 p-6 sm:p-8 bg-gray-50 space-y-4">
                {userCredits < selectedGift.price && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-rose-500 to-red-500 p-5 flex items-center gap-4 text-white"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg mb-1">Insufficient Credits</p>
                      <p className="text-rose-50 text-sm">You need {selectedGift.price - userCredits} more credits</p>
                    </div>
                    <button
                      onClick={handleBuyCredits}
                      className="px-6 py-3 bg-white text-rose-600 font-bold hover:bg-rose-50 transition-all whitespace-nowrap"
                    >
                      Add Credits
                    </button>
                  </motion.div>
                )}
                
                <button
                  onClick={handleSendThisGift}
                  disabled={userCredits < selectedGift.price}
                  className="w-full py-5 bg-gradient-to-r from-[#5e17eb] to-purple-600 text-white font-bold text-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                  <Send className="w-6 h-6 relative group-hover:rotate-12 transition-transform" />
                  <span className="relative">Choose Recipient & Send</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Recipient Selector Modal - Redesigned */}
      <AnimatePresence>
        {showRecipientSelector && selectedGift && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-end justify-center z-50"
            onClick={() => setShowRecipientSelector(false)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ 
                type: 'spring', 
                damping: 25, 
                stiffness: 300,
                mass: 0.8
              }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full sm:w-[50%] sm:mx-auto max-h-[92vh] overflow-hidden flex flex-col shadow-2xl rounded-t-[2rem]"
            >
              {/* Header - Sleek gradient */}
              <div className="relative bg-pink-600 p-6 sm:p-8">
                <div className="absolute inset-0 bg-black/5"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white">Choose Recipient</h3>
                        <p className="text-purple-100 text-sm">Who should receive this gift?</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowRecipientSelector(false)}
                      className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 rounded-full"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  {/* Selected Gift Preview - Compact */}
                  <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 border-2 border-white/20">
                    <div className="w-16 h-16 bg-white p-2 flex items-center justify-center flex-shrink-0">
                      {selectedGift.imageUrl ? (
                        <Image
                          src={selectedGift.imageUrl}
                          alt={selectedGift.name}
                          width={64}
                          height={64}
                          className="object-contain w-full h-full"
                        />
                      ) : (
                        <Gift className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-lg truncate">{selectedGift.name}</h4>
                      <div className="flex items-center gap-2 text-white/90">
                        <Crown className="w-4 h-4" />
                        <span className="font-bold">{selectedGift.price} credits</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto bg-gray-50">
                {loadingPeople ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600 font-semibold text-lg">Loading...</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 sm:p-8 space-y-8">
                    {/* Recent Recipients */}
                    {recentRecipients.length > 0 && (
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <History className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="text-lg font-bold text-gray-900">Recent</h4>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {recentRecipients.map((person) => (
                            <motion.button
                              key={person.$id}
                              whileHover={{ scale: 1.02, x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleRecipientSelect(person)}
                              className="flex items-center gap-4 p-4 bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 border-2 border-gray-200 hover:border-purple-300 transition-all group"
                            >
                              <div className="relative flex-shrink-0">
                                <div className="w-14 h-14 overflow-hidden border-2 border-white shadow-md">
                                  {person.profilePic ? (
                                    <Image
                                      src={person.profilePic}
                                      alt={person.username}
                                      width={56}
                                      height={56}
                                      className="object-cover w-full h-full"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                                      {person.username.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                {person.lastActive && Date.now() - new Date(person.lastActive).getTime() < 5 * 60 * 1000 && (
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white"></div>
                                )}
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <h5 className="font-bold text-gray-900 truncate text-lg">{person.username}</h5>
                                <p className="text-sm text-gray-600 truncate">{person.bio || 'Chat member'}</p>
                              </div>
                              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:from-purple-600 group-hover:to-pink-600 flex items-center justify-center transition-all">
                                <ChevronRight className="w-5 h-5 text-white" />
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* All People */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">All Members</h4>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {people
                          .filter(p => !recentRecipients.some(r => r.$id === p.$id))
                          .map((person) => (
                            <motion.button
                              key={person.$id}
                              whileHover={{ scale: 1.02, x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleRecipientSelect(person)}
                              className="flex items-center gap-4 p-4 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 border-2 border-gray-200 hover:border-blue-300 transition-all group"
                            >
                              <div className="relative flex-shrink-0">
                                <div className="w-14 h-14 overflow-hidden border-2 border-white shadow-md">
                                  {person.profilePic ? (
                                    <Image
                                      src={person.profilePic}
                                      alt={person.username}
                                      width={56}
                                      height={56}
                                      className="object-cover w-full h-full"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                                      {person.username.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                {person.lastActive && Date.now() - new Date(person.lastActive).getTime() < 5 * 60 * 1000 && (
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white"></div>
                                )}
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <h5 className="font-bold text-gray-900 truncate text-lg">{person.username}</h5>
                                <p className="text-sm text-gray-600 truncate">{person.bio || 'Chat member'}</p>
                              </div>
                              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:from-blue-600 group-hover:to-cyan-600 flex items-center justify-center transition-all">
                                <ChevronRight className="w-5 h-5 text-white" />
                              </div>
                            </motion.button>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}