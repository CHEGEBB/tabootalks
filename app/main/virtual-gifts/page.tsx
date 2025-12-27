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
import { useTheme } from '@/lib/context/ThemeContext';

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
  const { colors, isDark } = useTheme();
  
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
      <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
        <LayoutController />
        <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: colors.background }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-6" style={{ borderColor: colors.secondary, borderTopColor: 'transparent' }}></div>
            <p className="font-medium" style={{ color: colors.secondaryText }}>Loading gift marketplace...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
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
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ color: colors.primaryText }}>Virtual Gifts</h1>
                  <p className="text-xs sm:text-sm" style={{ color: colors.secondaryText }}>Send special gifts to someone special</p>
                </div>
              </div>
            </div>
            
            {/* Right: Credits & Actions */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl" style={{ 
                background: `linear-gradient(to right, ${colors.secondary}10, ${colors.secondary}10)` 
              }}>
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                <span className="text-base sm:text-lg font-bold" style={{ color: colors.primaryText }}>{userCredits}</span>
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" style={{ color: colors.placeholderText }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gifts by name, description, or category..."
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-[#5e17eb]"
                style={{ 
                  backgroundColor: colors.inputBackground, 
                  color: colors.primaryText, 
                  border: `1px solid ${colors.border}`,
                  caretColor: colors.primary,
                }}
              />
            </div>
            
            <button
              onClick={handleGiftHistory}
              className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium whitespace-nowrap"
              style={{ 
                backgroundColor: colors.cardBackground, 
                color: colors.primaryText,
                border: `1px solid ${colors.border}`
              }}
            >
              <History className="w-4 h-4" style={{ color: colors.iconColor }} />
              <span className="hidden sm:inline">History</span>
            </button>
          </div>
          
          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-4"
            style={{ 
              background: isDark ? colors.panelBackground : 'linear-gradient(to right, #f5f0ff, #fff0f7)',
              border: `1px solid ${isDark ? colors.borderLight : '#e9d5ff'}`
            }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full shadow-sm flex items-center justify-center" style={{ backgroundColor: colors.cardBackground }}>
                <Package className="w-5 h-5" style={{ color: colors.secondary }} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm sm:text-base mb-1" style={{ color: colors.primaryText }}>How Virtual Gifts Work</h3>
                <p className="text-xs sm:text-sm" style={{ color: colors.secondaryText }}>
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
                <div className="px-4 py-3 rounded-xl flex items-center justify-between" style={{ 
                  backgroundColor: isDark ? 'rgba(254, 202, 202, 0.1)' : '#fff1f2',
                  border: `1px solid ${isDark ? 'rgba(254, 202, 202, 0.2)' : '#fecaca'}`,
                  color: isDark ? '#fda4af' : '#e11d48'
                }}>
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" style={{ color: isDark ? '#fda4af' : '#e11d48' }} />
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
            <h3 className="text-base sm:text-lg font-bold" style={{ color: colors.primaryText }}>Browse by Category</h3>
            <div className="text-sm" style={{ color: colors.tertiaryText }}>
              {allGifts.length} gifts available
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => scrollCategories('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full shadow-lg flex items-center justify-center lg:hidden hover:bg-white transition-colors"
              style={{ 
                backgroundColor: `${colors.cardBackground}90`, 
                backdropFilter: 'blur(4px)' 
              }}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" style={{ color: colors.secondaryText }} />
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
                className={`flex flex-col items-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl whitespace-nowrap transition-all min-w-[100px] sm:min-w-[120px] flex-shrink-0`}
                style={{ 
                  backgroundColor: activeCategory === 'all' ? '#5e17eb' : colors.cardBackground,
                  backgroundImage: activeCategory === 'all' ? 'linear-gradient(to right, #5e17eb, #7c3aed)' : 'none',
                  color: activeCategory === 'all' ? 'white' : colors.primaryText,
                  border: activeCategory === 'all' ? 'none' : `1px solid ${colors.border}`,
                  boxShadow: activeCategory === 'all' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
                }}
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
                  className={`flex flex-col items-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl whitespace-nowrap transition-all min-w-[100px] sm:min-w-[120px] flex-shrink-0`}
                  style={{ 
                    backgroundColor: activeCategory === category.id ? '#5e17eb' : colors.cardBackground,
                    backgroundImage: activeCategory === category.id ? `linear-gradient(to right, ${category.color.split(' ')[1]}, ${category.color.split(' ')[3]})`.replace('from-', '').replace('to-', '') : 'none',
                    color: activeCategory === category.id ? 'white' : colors.primaryText,
                    border: activeCategory === category.id ? 'none' : `1px solid ${colors.border}`,
                    boxShadow: activeCategory === category.id ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
                  }}
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
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full shadow-lg flex items-center justify-center lg:hidden hover:bg-white transition-colors"
              style={{ 
                backgroundColor: `${colors.cardBackground}90`, 
                backdropFilter: 'blur(4px)' 
              }}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" style={{ color: colors.secondaryText }} />
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
              <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.inputBackground }}>
                <Search className="w-12 h-12" style={{ color: colors.tertiaryText }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: colors.primaryText }}>No gifts found</h3>
              <p className="mb-6" style={{ color: colors.secondaryText }}>Try adjusting your search or category filter</p>
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
                          <h3 className="text-lg sm:text-2xl font-bold" style={{ color: colors.primaryText }}>
                            {categoryId === 'featured' ? 'Featured Gifts' : `${getCategoryDisplayName(categoryId)} Gifts`}
                          </h3>
                          <p className="text-xs sm:text-sm" style={{ color: colors.tertiaryText }}>
                            {categoryId === 'featured' ? 'Most popular gifts' : `${gifts.length} gifts available`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {categoryId === 'search' && (
                    <div className="mb-4 sm:mb-6">
                      <h3 className="text-lg sm:text-2xl font-bold" style={{ color: colors.primaryText }}>
                        Search Results
                      </h3>
                      <p className="text-xs sm:text-sm" style={{ color: colors.secondaryText }}>
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
                        className="group relative overflow-hidden hover:shadow-2xl transition-all cursor-pointer flex flex-col rounded-xl"
                        style={{ 
                          backgroundColor: colors.cardBackground,
                          border: `1px solid ${colors.borderLight}`
                        }}
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
                          <div className="absolute top-2 left-2 z-10 text-[10px] sm:text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm"
                            style={{ 
                              backgroundColor: `${colors.cardBackground}90`,
                              backdropFilter: 'blur(4px)',
                              color: colors.primaryText
                            }}
                          >
                            <span className="hidden sm:inline">{subcategoryIcons[gift.subcategory]}</span>
                            <span className="capitalize hidden sm:inline">{gift.subcategory}</span>
                          </div>
                        )}
                        
                        {/* Gift Image */}
                        <div className="aspect-square flex items-center justify-center overflow-hidden relative rounded-t-xl"
                          style={{ 
                            background: isDark 
                              ? `linear-gradient(to bottom right, ${colors.panelBackground}, ${colors.inputBackground})` 
                              : 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)'
                          }}
                        >
                          {gift.imageUrl ? (
                            <Image
                              src={gift.imageUrl}
                              alt={gift.name}
                              width={300}
                              height={300}
                              className="object-contain w-full h-full p-3 sm:p-4 group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <Gift className="w-12 h-12 sm:w-16 sm:h-16" style={{ color: colors.tertiaryText }} />
                          )}
                        </div>
                        
                        {/* Gift Info */}
                        <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
                          <div className="mb-2">
                            <h4 className="font-bold text-xs sm:text-sm lg:text-base mb-0.5 sm:mb-1 line-clamp-1" style={{ color: colors.primaryText }}>{gift.name}</h4>
                            <p className="text-[10px] sm:text-xs line-clamp-2" style={{ color: colors.secondaryText }}>{gift.description}</p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-1 sm:gap-1.5">
                              <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                              <span className="font-bold text-sm sm:text-base lg:text-lg" style={{ color: colors.primaryText }}>{gift.price}</span>
                            </div>
                            
                            {gift.isAnimated ? (
                              <div className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium flex items-center gap-0.5" style={{
                                backgroundColor: isDark ? 'rgba(167, 139, 250, 0.1)' : '#f3e8ff',
                                color: isDark ? '#d8b4fe' : '#7e22ce'
                              }}>
                                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                <span className="hidden sm:inline">Animated</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm" style={{ color: colors.tertiaryText }}>
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
            className="fixed inset-0 backdrop-blur-md flex items-end justify-center z-50"
            style={{ backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.7)' }}
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
              className="w-full sm:w-[50%] sm:mx-auto max-h-[92vh] overflow-hidden flex flex-col shadow-2xl rounded-t-[2rem]"
              style={{ backgroundColor: colors.cardBackground }}
            >
              {/* Header - Sleek gradient */}
              <div className="relative p-6 sm:p-8" style={{ backgroundColor: colors.secondary }}>
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
              <div className="flex-1 overflow-y-auto" style={{ backgroundColor: colors.background }}>
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Image */}
                    <div className="lg:w-1/2">
                      <div className="relative rounded-2xl aspect-square flex items-center justify-center overflow-hidden group"
                        style={{ 
                          background: isDark 
                            ? `linear-gradient(to bottom right, ${colors.panelBackground}, ${colors.inputBackground})` 
                            : 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)'
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
                        {selectedGift.imageUrl ? (
                          <Image
                            src={selectedGift.imageUrl}
                            alt={selectedGift.name}
                            width={500}
                            height={500}
                            className="relative object-contain w-full h-full p-8 drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <Gift className="w-32 h-32" style={{ color: colors.tertiaryText }} />
                        )}
                      </div>
                    </div>
                    
                    {/* Right: Details */}
                    <div className="lg:w-1/2 space-y-6">
                      {/* Title & Description */}
                      <div className=''>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: colors.primaryText }}>{selectedGift.name}</h2>
                        <p className="text-lg leading-relaxed" style={{ color: colors.secondaryText }}>{selectedGift.description}</p>
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
                          <div className="flex items-center gap-2 px-4 py-2 text-sm font-bold" style={{ 
                            backgroundColor: colors.panelBackground,
                            color: colors.primaryText
                          }}>
                            {subcategoryIcons[selectedGift.subcategory]}
                            <span className="capitalize">{selectedGift.subcategory}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Price - Large and prominent */}
                      <div className="relative overflow-hidden p-6" style={{
                        backgroundColor: isDark ? colors.panelBackground : '#fff8e1',
                        borderColor: isDark ? colors.borderLight : '#ffd54f',
                        border: isDark ? `2px solid ${colors.borderLight}` : '2px solid #ffd54f'
                      }}>
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl" style={{
                          background: isDark 
                            ? 'linear-gradient(to bottom right, rgba(255, 193, 7, 0.1), rgba(255, 111, 0, 0.1))' 
                            : 'linear-gradient(to bottom right, rgba(255, 193, 7, 0.3), rgba(255, 111, 0, 0.3))'
                        }}></div>
                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                              <Crown className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1" style={{ color: colors.secondaryText }}>Price</p>
                              <p className="text-4xl font-bold" style={{ color: colors.primaryText }}>{selectedGift.price}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold" style={{ color: colors.primaryText }}>credits</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-5" style={{
                          backgroundColor: isDark ? colors.panelBackground : '#fef2f2',
                          border: isDark ? `1px solid ${colors.borderLight}` : '1px solid #fee2e2'
                        }}>
                          <Heart className="w-7 h-7 text-red-500 mb-3" />
                          <p className="text-3xl font-bold mb-1" style={{ color: colors.primaryText }}>{selectedGift.popularityScore}</p>
                          <p className="text-sm font-medium" style={{ color: colors.secondaryText }}>Times Sent</p>
                        </div>
                        <div className="p-5" style={{
                          backgroundColor: isDark ? colors.panelBackground : '#fffbeb',
                          border: isDark ? `1px solid ${colors.borderLight}` : '1px solid #fef3c7'
                        }}>
                          <Star className="w-7 h-7 text-yellow-500 mb-3" />
                          <p className="text-xl font-bold mb-1" style={{ color: colors.primaryText }}>{getCategoryDisplayName(selectedGift.category)}</p>
                          <p className="text-sm font-medium" style={{ color: colors.secondaryText }}>Category</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer Actions - Sleek */}
              <div className="p-6 sm:p-8 space-y-4" style={{
                borderTop: `2px solid ${colors.border}`,
                backgroundColor: colors.panelBackground
              }}>
                {userCredits < selectedGift.price && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 flex items-center gap-4 text-white bg-gradient-to-r from-rose-500 to-red-500"
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
                  className="w-full py-5 text-white font-bold text-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 group relative overflow-hidden bg-gradient-to-r from-[#5e17eb] to-purple-600"
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
            className="fixed inset-0 backdrop-blur-md flex items-end justify-center z-50"
            style={{ backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.7)' }}
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
              className="w-full sm:w-[50%] sm:mx-auto max-h-[92vh] overflow-hidden flex flex-col shadow-2xl rounded-t-[2rem]"
              style={{ backgroundColor: colors.cardBackground }}
            >
              {/* Header - Sleek gradient */}
              <div className="relative p-6 sm:p-8 bg-pink-600">
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
              <div className="flex-1 overflow-y-auto" style={{ backgroundColor: colors.background }}>
                {loadingPeople ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: colors.secondary, borderTopColor: 'transparent' }}></div>
                      <p className="font-semibold text-lg" style={{ color: colors.secondaryText }}>Loading...</p>
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
                          <h4 className="text-lg font-bold" style={{ color: colors.primaryText }}>Recent</h4>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {recentRecipients.map((person) => (
                            <motion.button
                              key={person.$id}
                              whileHover={{ scale: 1.02, x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleRecipientSelect(person)}
                              className="button flex items-center gap-4 p-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all group"
                              style={{ 
                                backgroundColor: colors.cardBackground,
                                border: `2px solid ${colors.border}`,
                                borderColor: colors.border
                              }}
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
                                <h5 className="font-bold truncate text-lg" style={{ color: colors.primaryText }}>{person.username}</h5>
                                <p className="text-sm truncate" style={{ color: colors.secondaryText }}>{person.bio || 'Chat member'}</p>
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
                        <h4 className="text-lg font-bold" style={{ color: colors.primaryText }}>All Members</h4>
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
                              className="button flex items-center gap-4 p-4 transition-all group"
                              style={{ 
                                backgroundColor: colors.cardBackground,
                                border: `2px solid ${colors.border}`
                              }}
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
                                <h5 className="font-bold truncate text-lg" style={{ color: colors.primaryText }}>{person.username}</h5>
                                <p className="text-sm truncate" style={{ color: colors.secondaryText }}>{person.bio || 'Chat member'}</p>
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