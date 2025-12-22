/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Gift, Crown, Heart, Calendar, 
  TrendingUp, Users, DollarSign, Package, Sparkles,
  Filter, Search, ChevronDown, Star, Trophy,
  MessageCircle, Mail, CheckCircle, Clock, Zap
} from 'lucide-react';
import LayoutController from '@/components/layout/LayoutController';
import { useGifts } from '@/lib/hooks/useGifts';
import { useCredits } from '@/lib/hooks/useCredits';

type TabType = 'sent' | 'received' | 'all';
type FilterType = 'all' | 'this-week' | 'this-month' | 'this-year';

export default function GiftHistoryPage() {
  const router = useRouter();
  const { giftHistory, giftStats, isLoading } = useGifts();
  const { credits } = useCredits();
  
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [filterPeriod, setFilterPeriod] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter gifts based on period
  const filterByPeriod = (gifts: any[]) => {
    const now = new Date();
    return gifts.filter(gift => {
      const giftDate = new Date(gift.sentAt);
      
      switch (filterPeriod) {
        case 'this-week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return giftDate >= weekAgo;
        case 'this-month':
          return giftDate.getMonth() === now.getMonth() && 
                 giftDate.getFullYear() === now.getFullYear();
        case 'this-year':
          return giftDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  };

  // Get filtered and searched gifts
  const getDisplayedGifts = () => {
    let gifts: any[] = [];
    
    if (activeTab === 'sent') {
      gifts = giftHistory.sent;
    } else if (activeTab === 'received') {
      gifts = giftHistory.received;
    } else {
      gifts = [...giftHistory.sent, ...giftHistory.received].sort(
        (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
      );
    }
    
    // Apply period filter
    gifts = filterByPeriod(gifts);
    
    // Apply search
    if (searchQuery) {
      gifts = gifts.filter(gift => 
        gift.giftName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (gift.recipientName && gift.recipientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (gift.message && gift.message.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return gifts;
  };

  const displayedGifts = getDisplayedGifts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <LayoutController />
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 border-4 border-[#5e17eb] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading your gift history...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      <LayoutController />
      
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8">
        
        {/* Header - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-white rounded-lg transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-[#5e17eb] group-hover:-translate-x-1 transition-all" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <Gift className="w-6 h-6 sm:w-7 sm:h-7 text-[#5e17eb]" />
                  Gift History
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Track all your sent and received gifts</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-[#5e17eb]/10 to-purple-500/10 px-3 sm:px-4 py-2 rounded-xl border border-purple-100">
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                <span className="font-bold text-base sm:text-lg">{credits}</span>
                <span className="text-gray-600 text-sm hidden sm:inline">credits</span>
              </div>
              <button
                onClick={() => router.push('/main/credits')}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-[#5e17eb] to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all text-xs sm:text-sm"
              >
                Add Credits
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards - Responsive Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 sm:p-5 rounded-2xl shadow-lg text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <Gift className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3 relative z-10" />
            <p className="text-xs sm:text-sm text-white/90 mb-1">Gifts Sent</p>
            <p className="text-2xl sm:text-3xl font-bold">{giftStats.totalSent}</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 sm:p-5 rounded-2xl shadow-lg text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <Package className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3 relative z-10" />
            <p className="text-xs sm:text-sm text-white/90 mb-1">Received</p>
            <p className="text-2xl sm:text-3xl font-bold">{giftStats.totalReceived}</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-amber-500 to-orange-500 p-4 sm:p-5 rounded-2xl shadow-lg text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <Crown className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3 relative z-10" />
            <p className="text-xs sm:text-sm text-white/90 mb-1">Total Spent</p>
            <p className="text-2xl sm:text-3xl font-bold">{giftStats.totalSpent}</p>
          </motion.div>
          
          {giftStats.favoriteGift ? (
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 sm:p-5 rounded-2xl shadow-lg text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3 relative z-10" />
              <p className="text-xs sm:text-sm text-white/90 mb-1">Favorite</p>
              <p className="text-sm sm:text-base font-bold truncate">{giftStats.favoriteGift.giftName}</p>
              <p className="text-xs text-white/80">{giftStats.favoriteGift.count}x sent</p>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 sm:p-5 rounded-2xl shadow-lg text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3 relative z-10" />
              <p className="text-xs sm:text-sm text-white/90 mb-1">Total Gifts</p>
              <p className="text-2xl sm:text-3xl font-bold">{giftStats.totalSent + giftStats.totalReceived}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Tabs & Filters - Responsive */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('all')}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-[#5e17eb] to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
              }`}
            >
              All Gifts
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('sent')}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all flex items-center gap-2 text-sm sm:text-base ${
                activeTab === 'sent'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
              }`}
            >
              <Gift className="w-4 h-4" />
              Sent ({giftStats.totalSent})
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('received')}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all flex items-center gap-2 text-sm sm:text-base ${
                activeTab === 'received'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
              }`}
            >
              <Package className="w-4 h-4" />
              Received ({giftStats.totalReceived})
            </motion.button>
          </div>
          
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search gifts, names, or messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5e17eb]/20 focus:border-[#5e17eb] text-sm"
              />
            </div>
            
            {/* Period Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full sm:w-auto px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {filterPeriod === 'all' ? 'All Time' : 
                   filterPeriod === 'this-week' ? 'This Week' :
                   filterPeriod === 'this-month' ? 'This Month' : 'This Year'}
                </span>
                <span className="sm:hidden">Filter</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden"
                  >
                    {[
                      { value: 'all', label: 'All Time' },
                      { value: 'this-week', label: 'This Week' },
                      { value: 'this-month', label: 'This Month' },
                      { value: 'this-year', label: 'This Year' }
                    ].map(filter => (
                      <button
                        key={filter.value}
                        onClick={() => {
                          setFilterPeriod(filter.value as FilterType);
                          setShowFilters(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${
                          filterPeriod === filter.value ? 'bg-purple-50 text-[#5e17eb] font-medium' : 'text-gray-700'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Gift List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {displayedGifts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white rounded-2xl border border-gray-200"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Gift className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No gifts found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? 'Try a different search term' : 'Start sending gifts to see your history'}
              </p>
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-gradient-to-r from-[#5e17eb] to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
              >
                Browse Gifts
              </button>
            </motion.div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {displayedGifts.map((gift, index) => {
                const isSent = giftHistory.sent.some(g => g.$id === gift.$id);
                
                return (
                  <motion.div
                    key={gift.$id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                    className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 hover:shadow-xl transition-all"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Gift Image */}
                      <div className="relative flex-shrink-0">
                        <div className="w-full sm:w-20 h-32 sm:h-20 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border border-gray-200">
                          {gift.giftImage ? (
                            <Image
                              src={gift.giftImage}
                              alt={gift.giftName}
                              width={80}
                              height={80}
                              className="object-contain w-full h-full p-2"
                            />
                          ) : (
                            <Gift className="w-10 h-10 text-gray-400" />
                          )}
                        </div>
                        
                        {/* Sent/Received Badge */}
                        <div className={`absolute -top-2 -right-2 sm:static sm:absolute sm:-top-2 sm:-right-2 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isSent 
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                            : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        }`}>
                          {isSent ? '→ Sent' : '← Received'}
                        </div>
                      </div>
                      
                      {/* Gift Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 flex items-center gap-2">
                              {gift.giftName}
                              {gift.isAnimated && (
                                <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                                  <Sparkles className="w-3 h-3" />
                                  Animated
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600 mb-1">
                              {isSent ? (
                                <>To: <span className="font-medium text-gray-900">{gift.recipientName || 'Unknown'}</span></>
                              ) : (
                                <>From: <span className="font-medium text-gray-900">{gift.senderName || gift.senderId}</span></>
                              )}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-2 rounded-lg border border-amber-200 flex-shrink-0">
                            <Crown className="w-4 h-4 text-amber-500" />
                            <span className="font-bold text-lg">{gift.giftPrice}</span>
                          </div>
                        </div>
                        
                        {/* Message */}
                        {gift.message && (
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-lg p-3 mb-3">
                            <div className="flex items-start gap-2">
                              <MessageCircle className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-gray-700 italic">&ldquo;{gift.message}&rdquo;</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(gift.sentAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{new Date(gift.sentAt).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit' 
                            })}</span>
                          </div>
                          
                          {gift.category && (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-full">
                              <Heart className="w-3.5 h-3.5 text-red-400" />
                              <span className="capitalize">{gift.category}</span>
                            </div>
                          )}
                          
                          {gift.status && (
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${
                              gift.status === 'delivered' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span className="capitalize">{gift.status}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Pagination hint for many gifts */}
        {displayedGifts.length > 20 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-600">
              Showing {displayedGifts.length} gifts
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}