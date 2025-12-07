import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Eye, Sticker, CreditCard, Lock, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface OfferProps {
  isOpen: boolean;
  onClose: () => void;
}

const Offer: React.FC<OfferProps> = ({ isOpen, onClose }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [processing, setProcessing] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handlePayment = async () => {
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    window.location.href = '/credits';
  };

  return (
    <AnimatePresence>
      {(isOpen || showPayment) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              if (!processing) {
                setShowPayment(false);
                onClose();
              }
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl"
          >
            {!showPayment ? (
              <div>
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 z-10 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>

                <div className="p-6 text-center">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    WELCOME OFFER
                  </div>
                  <p className="text-sm text-gray-600">One-time payment. No recurring fees.</p>
                </div>

                <div className="px-6 pb-4">
                  <div className="bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-2xl p-4 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">💰</span>
                        </div>
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-gray-900">65</span>
                            <span className="text-sm font-bold text-gray-800">credits</span>
                          </div>
                          <div className="text-[11px] text-gray-800 line-through">$19.99 regular price</div>
                          <div className="text-2xl font-black text-gray-900">$9.99</div>
                        </div>
                      </div>
                      <div className="bg-emerald-500 text-white px-3 py-2 rounded-xl transform rotate-12">
                        <div className="text-lg font-black">-50%</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-4">
                  <h3 className="text-center text-sm font-bold text-gray-900 mb-3">With 65 credits you can</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl">
                      <div className="w-9 h-9 bg-gradient-to-br from-pink-400 to-pink-500 rounded-lg flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-white" strokeWidth={2.5} />
                      </div>
                      <span className="text-gray-900 font-medium text-sm">Chat with anyone you like</span>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                        <Eye className="w-4 h-4 text-white" strokeWidth={2.5} />
                      </div>
                      <span className="text-gray-900 font-medium text-sm">View hidden private content</span>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl">
                      <div className="w-9 h-9 bg-gradient-to-br from-rose-400 to-rose-500 rounded-lg flex items-center justify-center">
                        <Sticker className="w-4 h-4 text-white" strokeWidth={2.5} />
                      </div>
                      <span className="text-gray-900 font-medium text-sm">Reply with stickers in chats</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-3">
                  <div className="flex items-center justify-center gap-3">
                    <Image src="/assets/images/visa.png" alt="Visa" width={45} height={28} className="h-auto" />
                    <Image src="/assets/images/mastercard.png" alt="Mastercard" width={45} height={28} className="h-auto" />
                    <Image src="/assets/images/amex.png" alt="Amex" width={45} height={28} className="h-auto" />
                    <Image src="/assets/images/pal.png" alt="PAYPAL" width={45} height={28} className="h-auto" />
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <button
                    onClick={() => setShowPayment(true)}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Get 65 Credits</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => {
                    if (!processing) setShowPayment(false);
                  }}
                  disabled={processing}
                  className="absolute top-3 right-3 z-10 p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>

                <div className="p-6 pb-4 border-b border-gray-200">
                  <h2 className="text-base font-bold text-gray-900 text-center">
                    Pay securely: Get 65 credits for only <span className="text-emerald-600">USD $9.99</span>!
                  </h2>
                </div>

                <div className="p-6">
                  <div className="mb-4 bg-gray-900 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-gray-900" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-medium">Payment Method</div>
                      <div className="text-white font-bold text-sm">Card</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Credit or Debit Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="XXXX XXXX XXXX XXXX"
                        maxLength={19}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          CVV/CVC
                        </label>
                        <input
                          type="text"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="123"
                          maxLength={4}
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Name on card
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handlePayment}
                      disabled={processing}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60 mt-4"
                    >
                      <Lock className="w-4 h-4" />
                      {processing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        'GET CREDITS'
                      )}
                    </button>

                    <div className="pt-2 space-y-2">
                      <div className="flex items-center justify-center gap-3">
                        <Image src="/assets/images/visa.png" alt="Visa" width={45} height={28} className="h-auto" />
                        <Image src="/assets/images/mastercard.png" alt="Mastercard" width={45} height={28} className="h-auto" />
                        <Image src="/assets/images/amex.png" alt="Amex" width={45} height={28} className="h-auto" />
                        <Image src="/assets/images/pal.png" alt="PAYPAL" width={45} height={28} className="h-auto" />
                      </div>
                      <p className="text-[9px] text-gray-600 text-center leading-relaxed">
                        By proceeding with payment you reaffirm accepting our Terms of Use, Privacy Policy, Payment and Refund Policy, Arbitration Agreement.
                      </p>
                      <p className="text-[9px] text-gray-500 text-center">
                        Your privacy is important to us: your card statement may show payments with a neutral internet merchant descriptor to protect your personal online space (NOT TabooTalks).
                      </p>
                      <p className="text-[9px] text-gray-500 text-center">
                        This site uses 128-bit SSL encryption for the security of the data exchange between your browser and our servers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Offer;