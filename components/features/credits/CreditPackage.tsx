// components/features/credits/CreditPackage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Star, Zap, ArrowRight } from 'lucide-react';

interface CreditPackageProps {
  name: string;
  credits: number;
  messages: number;
  price: number;
  pricePerCredit: number;
  badge: string | null;
  icon: React.ReactNode;
  popular: boolean;
  description: string;
  onSelect: () => void;
}

export default function CreditPackage({
  name,
  credits,
  messages,
  price,
  pricePerCredit,
  badge,
  icon,
  popular,
  description,
  onSelect
}: CreditPackageProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative rounded-xl p-4 cursor-pointer transition-all duration-300 ${
        popular
          ? 'bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-orange-500/20 border-2 border-yellow-500/30'
          : 'bg-gray-800/50 border border-gray-700'
      }`}
      onClick={onSelect}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900 font-bold px-4 py-1 rounded-full text-sm">
            <Crown className="w-3 h-3 mr-1" />
            {badge}
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center mb-1">
            {icon}
            <h3 className="text-lg font-bold ml-2">{name}</h3>
          </div>
          <p className="text-sm text-gray-300">{description}</p>
        </div>
        {popular && (
          <div className="p-1 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full">
            <Star className="w-4 h-4 text-gray-900" />
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-baseline mb-1">
          <span className="text-3xl font-bold">{credits}</span>
          <span className="text-sm text-gray-400 ml-1">CREDITS</span>
        </div>
        <div className="flex items-center text-sm text-gray-300">
          <Check className="w-4 h-4 mr-1 text-green-400" />
          {messages} messages included
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">€{price.toFixed(2)}</div>
          <div className="text-xs text-gray-400">
            €{pricePerCredit.toFixed(3)} per credit
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-all ${
            popular
              ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900 hover:shadow-lg hover:shadow-yellow-500/30'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30'
          }`}
        >
          Get Now
          <ArrowRight className="w-4 h-4 ml-2" />
        </motion.button>
      </div>
    </motion.div>
  );
}