// components/features/credits/PurchaseModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CreditCard, 
  Lock, 
  CheckCircle, 
  Shield,
  AlertCircle 
} from 'lucide-react';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: {
    name: string;
    credits: number;
    price: number;
  };
  onPurchaseComplete: (credits: number) => void;
}

export default function PurchaseModal({ 
  isOpen, 
  onClose, 
  package: pkg,
  onPurchaseComplete 
}: PurchaseModalProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'card' | null>(null);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [processing, setProcessing] = useState(false);

  const handlePayment = () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setStep('success');
      setTimeout(() => {
        onPurchaseComplete(pkg.credits);
        onClose();
        setStep('details');
      }, 2000);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold dark:text-white">
                  {step === 'details' && 'Purchase Credits'}
                  {step === 'payment' && 'Payment Details'}
                  {step === 'success' && 'Purchase Successful!'}
                </h2>
                {step === 'details' && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Complete your purchase securely
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {step === 'details' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-lg dark:text-white">{pkg.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {pkg.credits} credits
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          €{pkg.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold dark:text-white">Select Payment Method</h3>
                    
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === 'card'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${
                          paymentMethod === 'card'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}>
                          <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium dark:text-white">Credit Card</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Visa, Mastercard, American Express
                          </div>
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Lock className="w-4 h-4 mr-2" />
                      All payments are encrypted and secure
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('payment')}
                    disabled={!paymentMethod}
                    className={`w-full mt-6 py-3 rounded-xl font-bold transition-all ${
                      paymentMethod
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30'
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Continue to Payment
                  </button>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                      <div>
                        <div className="font-medium dark:text-white">{pkg.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {pkg.credits} credits
                        </div>
                      </div>
                      <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                        €{pkg.price.toFixed(2)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-white">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">
                          CVC
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                          value={cardDetails.cvc}
                          onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-white">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                      />
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Shield className="w-4 h-4 mr-2 text-green-500" />
                      Secured by Stripe • Your data is encrypted
                    </div>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className={`w-full mt-6 py-3 rounded-xl font-bold transition-all ${
                      processing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30'
                    }`}
                  >
                    {processing ? 'Processing...' : `Pay €${pkg.price.toFixed(2)}`}
                  </button>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2 dark:text-white">
                    Purchase Complete!
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {pkg.credits} credits have been added to your account
                  </p>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      +{pkg.credits}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Credits Added
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}