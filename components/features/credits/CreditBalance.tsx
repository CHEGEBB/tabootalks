// components/features/credits/CreditBalance.tsx
import React from 'react';
import { Wallet, Gift } from 'lucide-react';

interface CreditBalanceProps {
  complimentary: number;
  purchased: number;
  total: number;
}

export default function CreditBalance({ complimentary, purchased, total }: CreditBalanceProps) {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl shadow-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-white/20 rounded-lg mr-3">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Your Credit Balance</h2>
            <p className="text-purple-200">Total available credits</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold">{total}</div>
          <div className="text-sm text-purple-200">CREDITS</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center mb-2">
            <Gift className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Complimentary</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold mr-2">{complimentary}</span>
            <span className="text-sm text-purple-200">Free Credits</span>
          </div>
          <p className="text-xs text-purple-300 mt-2">
            Credits you received upon sign-up or from special offers
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center mb-2">
            <Wallet className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Purchased</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold mr-2">{purchased}</span>
            <span className="text-sm text-purple-200">Paid Credits</span>
          </div>
          <p className="text-xs text-purple-300 mt-2">
            Credits you purchased and can use anytime
          </p>
        </div>
      </div>
    </div>
  );
}