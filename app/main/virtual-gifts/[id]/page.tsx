/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { 
  ArrowLeft, Gift, Zap, Crown, Heart, Star, Sparkles, ChevronRight, 
  MessageCircle, Mail, Users, Search, CheckCircle, X, Send,
  CreditCard, AlertCircle, Info, Filter, TrendingUp, Flower2,
  Music, Camera, BookOpen, Coffee, Globe, Palette, Gamepad2,
  Dumbbell, Wine, Camera as CameraIcon, Film, Car, Plane,
  Coffee as CoffeeIcon, Shirt, Diamond, ShoppingBag,
  ShoppingCart, Droplets, Music2, PartyPopper, Cake, Gem,
  Film as FilmIcon, Headphones, CookingPot, Tent, Compass,
  Dumbbell as Gym, Wine as WineIcon, ShoppingCart as CartIcon,
  MailCheck
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
    featuredGifts, 
    giftsByCategory, 
    isLoading: giftsLoading, 
    error: giftsError,
    sendGift,
    canAffordGift,
    refreshGifts 
  } = useGifts();
  
  // State
  const [recipient, setRecipient] = useState<ParsedPersonaProfile | null>(null);
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const [personalMessage, setPersonalMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showGiftOverlay, setShowGiftOverlay] = useState(false);
  const [showInsufficientCredits, setShowInsufficientCredits] = useState(false);

  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Categories with Lucide icons
  const categories: Category[] = [
    { 
      id: 'featured', 
      name: 'Featured', 
      icon: <Sparkles className="w-5 h-5" />,
      color: 'from-amber-500 to-orange-500',
      description: 'Most popular gifts this week'
    },
    { 
      id: 'romantic', 
      name: 'Romantic', 
      icon: <Heart className="w-5 h-5" />,
      color: 'from-rose-500 to-pink-500',
      description: 'Express your love and affection'
    },
    { 
      id: 'flowers', 
      name: 'Flowers', 
      icon: <Flower2 className="w-5 h-5" />,
      color: 'from-emerald-500 to-green-500',
      description: 'Beautiful floral arrangements'
    },
    { 
      id: 'hobby', 
      name: 'Hobbies', 
      icon: <Palette className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      description: 'Gifts for every interest'
    },
    { 
      id: 'fashion', 
      name: 'Fashion', 
      icon: <Shirt className="w-5 h-5" />,
      color: 'from-violet-500 to-purple-500',
      description: 'Stylish accessories & jewelry'
    },
    { 
      id: 'celebration', 
      name: 'Celebration', 
      icon: <PartyPopper className="w-5 h-5" />,
      color: 'from-fuchsia-500 to-pink-500',
      description: 'For special occasions'
    },
    {
      id:'postcard',
      name: 'Postcards',
      icon: <MailCheck className="w-5 h-5" />,
      color: 'from-yellow-500 to-amber-500',
      description: 'Send virtual postcards'
    },
    { 
      id: 'animated', 
      name: 'Animated', 
      icon: <Zap className="w-5 h-5" />,
      color: 'from-indigo-500 to-purple-500',
      description: 'Interactive animated gifts'
    },
  ];

  // Subcategory icons
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
    'fitness': <Gym className="w-4 h-4" />,
    'wine': <WineIcon className="w-4 h-4" />,
    'film': <FilmIcon className="w-4 h-4" />,
    'cars': <Car className="w-4 h-4" />,
    'drinks': <CoffeeIcon className="w-4 h-4" />,
    'shopping': <CartIcon className="w-4 h-4" />,
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

  // Get category display name
  const getCategoryDisplayName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
  };

  // Get category icon
  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : <Gift className="w-5 h-5" />;
  };

  // Get category color
  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : 'from-gray-500 to-gray-600';
  };

  // Handle gift selection
  const handleSelectGift = async (gift: any) => {
    setSelectedGift(gift);
    
    // Check if user can afford
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
      // Get current conversation ID - CRITICAL FIX
      let conversationId = '';
      
      // Try to find existing conversation between current user and recipient
      try {
        if (currentUser?.$id) {
          // Query conversations collection
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
            // Create new conversation if doesn't exist
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
  
      // Use giftHandlerService which properly saves conversationId
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
        
        // Also trigger a global credits refresh
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('credits-updated'));
        }
        
        setTimeout(() => {
          setSuccess('');
          setSelectedGift(null);
          setPersonalMessage('');
          setShowGiftOverlay(false);
          
          // If we have a conversationId, go to that chat
          if (conversationId) {
            router.push(`/main/chats/${conversationId}`);
          } else {
            router.back();
          }
        }, 3000);
      } else {
        setError(result.error || 'Failed to send gift');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send gift');
    } finally {
      setIsSending(false);
    }
  };
  // Buy credits
  const handleBuyCredits = () => {
    router.push('/main/credits');
  };

  // Go back
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(`/main/chats/${recipient?.$id || ''}`);
    }
  };

 // Get filtered gifts
 const getFilteredGifts = () => {
  if (activeCategory === 'all') {
    return giftsByCategory;
  } else if (activeCategory === 'popular') {
    const popularGifts = allGifts
      .filter(g => g.popularityScore > 200)
      .sort((a, b) => b.popularityScore - a.popularityScore);
    return { 'popular': popularGifts };
  } else if (activeCategory === 'featured') {
    return { 'featured': featuredGifts };
  } else {
    return { [activeCategory]: giftsByCategory[activeCategory] || [] };
  }
};

const filteredGifts = getFilteredGifts();

  // Loading state
  if (giftsLoading || !recipient) {
    return (
      <div className="min-h-screen bg-white">
        <LayoutController />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#5e17eb] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-gray-600 font-medium">Loading gifts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <LayoutController />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-[#5e17eb] transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Chat</span>
              </button>
              
              {/* Recipient Info */}
              <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    {recipient.profilePic ? (
                      <Image
                        src={recipient.profilePic}
                        alt={recipient.username}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                        {recipient.username.charAt(0)}
                      </div>
                    )}
                  </div>
                  {recipient.lastActive && Date.now() - new Date(recipient.lastActive).getTime() < 5 * 60 * 1000 && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Choose a virtual gift for {recipient.username}</h2>
                  <p className="text-xs text-gray-500">Some orders come with a unique gift 😊</p>
                </div>
              </div>
            </div>
            
            {/* Credits Display */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-[#5e17eb]/10 to-purple-500/10 px-4 py-2.5 rounded-xl">
                <Crown className="w-5 h-5 text-amber-500" />
                <span className="text-lg font-bold text-gray-900">{userCredits}</span>
                <span className="text-gray-600">credits</span>
              </div>
              <button
                onClick={handleBuyCredits}
                className="px-5 py-2.5 bg-gradient-to-r from-[#5e17eb] to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Add Credits
              </button>
            </div>
          </div>
          
          {/* Success Message */}
          {success && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center justify-between animate-in slide-in-from-top">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium">{success}</span>
                </div>
                <button onClick={() => setSuccess('')} className="text-green-500 hover:text-green-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
          
          {/* Error Messages */}
          {(error || giftsError) && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="font-medium">{error || giftsError}</span>
                </div>
                <button onClick={() => { setError(''); }} className="text-red-500 hover:text-red-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Category Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Browse Categories</h3>
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#5e17eb] transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
          
          <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-thin">
            <button
              key="all"
              onClick={() => setActiveCategory('all')}
              className={`flex flex-col items-center px-6 py-3 h-20 rounded-xl whitespace-nowrap transition-all min-w-[120px] ${
                activeCategory === 'all'
                  ? 'bg-gradient-to-r from-[#5e17eb] to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="mb-2">
                <Gift className="w-5 h-5" />
              </div>
              <span className="font-medium text-sm">All Gifts</span>
            </button>
            
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex flex-col items-center px-6 py-3 h-20 rounded-xl whitespace-nowrap transition-all min-w-[120px] ${
                  activeCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="mb-2">
                  {category.icon}
                </div>
                <span className="font-medium text-sm">{category.name}</span>
              </button>
            ))}
            
            <button
              key="popular"
              onClick={() => setActiveCategory('popular')}
              className={`flex flex-col items-center px-6 py-3 h-20 rounded-xl whitespace-nowrap transition-all min-w-[120px] ${
                activeCategory === 'popular'
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="mb-2">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="font-medium text-sm">Popular</span>
            </button>
          </div>
        </div>
        
        {/* Main Content - All Gifts in Sections */}
        <div className="space-y-12 mb-12">
          {Object.entries(filteredGifts).map(([categoryId, gifts]) => {
            if (!gifts || gifts.length === 0) return null;
            
            const isFeatured = categoryId === 'featured';
            const isPopular = categoryId === 'popular';
            
            return (
              <section key={categoryId} className="scroll-mt-8">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${getCategoryColor(categoryId)}`}>
                        {getCategoryIcon(categoryId)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {isFeatured ? 'Featured Gifts' : 
                           isPopular ? 'Popular Gifts' : 
                           `${getCategoryDisplayName(categoryId)} Gifts`}
                        </h3>
                        <p className="text-gray-600">
                          {isFeatured ? 'Most popular gifts this week' : 
                           isPopular ? 'Trending gifts everyone loves' : 
                           `${gifts.length} beautiful gifts to choose from`}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {isFeatured && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-500">Trending now</span>
                    </div>
                  )}
                </div>
                
                {/* Gift Cards Grid */}
                <div className={`grid grid-cols-1 ${isFeatured ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                  {gifts.map((gift, giftIndex) => (
  <div
    key={`${categoryId}-${gift.id}-${giftIndex}`}
                      onClick={() => handleSelectGift(gift)}
                      className="group relative bg-white border border-gray-200 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer flex flex-col"
                      style={{ height: isFeatured ? '320px' : '340px' }}
                    >
                      {/* Popular Badge */}
                      {gift.popularityScore > 250 && (
                        <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                          <TrendingUp className="w-3 h-3" />
                          Hot
                        </div>
                      )}
                      
                      {/* Subcategory Badge */}
                      {gift.subcategory && subcategoryIcons[gift.subcategory] && (
                        <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm text-gray-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                          {subcategoryIcons[gift.subcategory]}
                          <span className="capitalize">{gift.subcategory}</span>
                        </div>
                      )}
                      
                      {/* Gift Image */}
                      <div 
                        className={`bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden ${
                          isFeatured ? 'h-48' : 'h-56'
                        }`}
                      >
                      {gift.imageUrl ? (
                          <Image
                            src={gift.imageUrl}
                            alt={gift.name}
                            width={isFeatured ? 250 : 280}
                            height={isFeatured ? 250 : 280}
                            className="object-contain w-full h-full p-4 group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Gift className={`${isFeatured ? 'w-20 h-20' : 'w-24 h-24'} text-gray-400`} />
                          </div>
                        )}
                      </div>
                      
                      {/* Gift Info */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg mb-1 truncate">{gift.name}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{gift.description}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Crown className="w-5 h-5 text-amber-500" />
                            <span className="font-bold text-xl text-gray-900">{gift.price}</span>
                          </div>
                          
                          {gift.isAnimated ? (
                            <div className="text-xs text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full font-medium">
                              <Sparkles className="w-3 h-3 inline mr-1" />
                              Animated
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Heart className="w-4 h-4 text-red-400" />
                              <span>{gift.popularityScore}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
        
        {/* Info Section */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Info className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-2xl mb-4">How Virtual Gifts Work</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">1 credit = 1 gift value</h5>
                      <p className="text-gray-600 text-sm">Each credit represents the value of your gift</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Send className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Instant Delivery</h5>
                      <p className="text-gray-600 text-sm">Recipient gets notification immediately</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Special Effects</h5>
                      <p className="text-gray-600 text-sm">Gifts appear in chat with animations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Boost Connections</h5>
                      <p className="text-gray-600 text-sm">Increase your match chances with gifts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Credits CTA for Mobile */}
        <div className="lg:hidden mb-8">
          <div className="bg-gradient-to-br from-[#5e17eb] to-purple-700 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <Zap className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-xl">Get More with Credits</h4>
                <p className="text-white/90 text-sm">Unlock premium features</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm">Chat with anyone you like</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm">Send Virtual Gifts</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm">Respond in Mail</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm">Get Credits</span>
              </div>
            </div>
            
            <button
              onClick={handleBuyCredits}
              className="w-full py-3 bg-white text-[#5e17eb] font-bold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Top Up Credits
            </button>
          </div>
        </div>
      </div>
      
      {/* Gift Overlay Modal */}
      {showGiftOverlay && selectedGift && recipient && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl">
            
            {/* Left Side - Gift Preview */}
            <div className="md:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex flex-col items-center justify-center">
              <div className="w-64 h-64 md:w-80 md:h-80 mb-6">
              {selectedGift.imageUrl ? (
                  <Image
                    src={selectedGift.imageUrl}
                    alt={selectedGift.name}
                    width={320}
                    height={320}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl">
                    <Gift className="w-32 h-32 text-white" />
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <h3 className="font-bold text-gray-900 text-2xl mb-2">{selectedGift.name}</h3>
                <p className="text-gray-600 mb-4">{selectedGift.description}</p>
                
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-3 rounded-xl border border-amber-200">
                    <Crown className="w-6 h-6 text-amber-500" />
                    <span className="text-3xl font-bold text-gray-900">{selectedGift.price}</span>
                    <span className="text-gray-600">credits</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Send Form */}
            <div className="md:w-1/2 p-8 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 text-xl">Your Gift for {recipient.username}</h3>
                  <p className="text-gray-500 text-sm">Preview and send your virtual gift</p>
                </div>
                <button
                  onClick={() => {
                    setShowGiftOverlay(false);
                    setSelectedGift(null);
                    
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Credit Status */}
              <div className="mb-6">
                {userCredits < selectedGift.price ? (
                  <div className="bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertCircle className="w-6 h-6 text-rose-500" />
                      <div>
                        <h5 className="font-bold text-rose-800">Insufficient Credits</h5>
                        <p className="text-rose-700 text-sm">
                          You need {selectedGift.price - userCredits} more credits
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleBuyCredits}
                      className="w-full py-3 bg-gradient-to-r from-rose-500 to-red-500 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                    >
                      Add Credits Now
                    </button>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <div>
                        <h5 className="font-bold text-green-800">Ready to Send</h5>
                        <p className="text-green-700 text-sm">
                          You have {userCredits} credits available
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Personal Message */}
              <div className="mb-6 flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add a personal message...
                </label>
                <textarea
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  placeholder={`Type a sweet message for ${recipient.username}...`}
                  className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5e17eb]/20 focus:border-[#5e17eb] text-sm resize-none"
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
                className="w-full py-4 bg-gradient-to-r from-[#5e17eb] to-purple-600 text-white font-bold rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 text-lg"
              >
                {isSending ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending Gift...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    <span>Send Gift ({selectedGift.price} credits)</span>
                  </>
                )}
              </button>
              
              {/* Credit Balance */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Your Balance</p>
                      <p className="text-2xl font-bold text-gray-900">{userCredits} credits</p>
                    </div>
                  </div>
                  <button
                    onClick={handleBuyCredits}
                    className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Get More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Insufficient Credits Modal */}
      {showInsufficientCredits && selectedGift && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-in slide-in-from-bottom">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-rose-100 to-red-100 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Not Enough Credits</h3>
              <p className="text-gray-600">
                You need <span className="font-bold text-[#5e17eb]">{selectedGift.price}</span> credits to send{' '}
                <span className="font-bold">{selectedGift.name}</span>, but you only have{' '}
                <span className="font-bold text-rose-500">{userCredits}</span> credits.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleBuyCredits}
                className="w-full py-3.5 bg-gradient-to-r from-[#5e17eb] to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Buy Credits Now
              </button>
              <button
                onClick={() => {
                  setShowInsufficientCredits(false);
                  setSelectedGift(null);
                }}
                className="w-full py-3.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Choose Different Gift
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}