'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowLeft, Gift, Crown, Heart, Calendar, 
  TrendingUp, Users, DollarSign, Package
} from 'lucide-react';
import LayoutController from '@/components/layout/LayoutController';
import { useGifts } from '@/lib/hooks/useGifts';
import { useCredits } from '@/lib/hooks/useCredits';

export default function GiftHistoryPage() {
  const router = useRouter();
  const { giftHistory, giftStats, isLoading } = useGifts();
  const { credits } = useCredits();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <LayoutController />
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-[#5e17eb] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <LayoutController />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-[#5e17eb]"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Gift History</h1>
          </div>
          
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#5e17eb]/10 to-purple-500/10 px-4 py-2 rounded-xl">
            <Crown className="w-5 h-5 text-amber-500" />
            <span className="font-bold">{credits}</span>
            <span className="text-gray-600">credits</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <Gift className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Gifts Sent</p>
                <p className="text-2xl font-bold">{giftStats.totalSent}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Gifts Received</p>
                <p className="text-2xl font-bold">{giftStats.totalReceived}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-amber-500" />
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold">{giftStats.totalSpent}</p>
              </div>
            </div>
          </div>
          
          {giftStats.favoriteGift && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Favorite Gift</p>
                  <p className="text-sm font-bold truncate">{giftStats.favoriteGift.giftName}</p>
                  <p className="text-xs text-gray-500">{giftStats.favoriteGift.count}x sent</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Gift History */}
        <div className="space-y-6">
          {/* Sent Gifts */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-[#5e17eb]" />
              Gifts You&apos;ve Sent
            </h2>
            
            {giftHistory.sent.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <Gift className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No gifts sent yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {giftHistory.sent.map(gift => (
                  <div key={gift.$id} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {gift.giftImage ? (
                          <Image
                            src={gift.giftImage}
                            alt={gift.giftName}
                            width={64}
                            height={64}
                            className="object-contain"
                          />
                        ) : (
                          <Gift className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-900">{gift.giftName}</h3>
                            <p className="text-sm text-gray-600">To: {gift.recipientName}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Crown className="w-4 h-4 text-amber-500" />
                            <span className="font-bold">{gift.giftPrice}</span>
                          </div>
                        </div>
                        {gift.message && (
                          <p className="text-gray-700 mt-2 text-sm">&ldquo;{gift.message}&rdquo;</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(gift.sentAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-red-400" />
                            {gift.category}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Received Gifts */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-green-500" />
              Gifts You&apos;ve Received
            </h2>
            
            {giftHistory.received.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No gifts received yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {giftHistory.received.map(gift => (
                  <div key={gift.$id} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {gift.giftImage ? (
                          <Image
                            src={gift.giftImage}
                            alt={gift.giftName}
                            width={64}
                            height={64}
                            className="object-contain"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-900">{gift.giftName}</h3>
                            <p className="text-sm text-gray-600">From: {gift.senderId}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Crown className="w-4 h-4 text-amber-500" />
                            <span className="font-bold">{gift.giftPrice}</span>
                          </div>
                        </div>
                        {gift.message && (
                          <p className="text-gray-700 mt-2 text-sm">&ldquo;{gift.message}&rdquo;</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(gift.sentAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-red-400" />
                            {gift.category}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}