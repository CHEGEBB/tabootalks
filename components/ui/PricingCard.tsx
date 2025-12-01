// components/ui/PricingCard.tsx
import React from 'react';
import { CheckCircle } from 'lucide-react';
import Button from './Button';

interface PricingCardProps {
  name: string;
  price: string;
  credits: number;
  features: string[];
  popular?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ 
  name, 
  price, 
  credits, 
  features, 
  popular = false 
}) => {
  return (
    <div 
      className={`relative p-8 rounded-2xl border ${
        popular 
          ? 'bg-gradient-to-b from-[#ff2e2e]/10 to-[#5e17eb]/10 border-[#ff2e2e] scale-105' 
          : 'bg-white/5 border-white/10'
      } hover:scale-105 transition-transform`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb] rounded-full text-sm font-bold">
          🏆 Best Value
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2 text-white">{name}</h3>
        <div className="text-5xl font-bold mb-2 text-white">{price}</div>
        <div className="text-gray-400">{credits} Credits</div>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-[#10b981] flex-shrink-0" />
            <span className="text-white">{feature}</span>
          </li>
        ))}
      </ul>

      <Button 
        variant={popular ? 'primary' : 'secondary'}
        className="w-full"
      >
        Get Started
      </Button>
    </div>
  );
};

export default PricingCard;