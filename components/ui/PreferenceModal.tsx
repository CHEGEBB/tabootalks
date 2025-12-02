// components/ui/PreferenceModal.tsx
'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';

interface PreferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { gender: string; lookingFor: string; name: string; birthday: string }) => void;
}

const PreferenceModal: React.FC<PreferenceModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    gender: '',
    lookingFor: '',
    name: '',
    birthday: ''
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderSelect = (gender: string) => {
    setFormData(prev => ({ ...prev, gender }));
  };

  const handleLookingForSelect = (lookingFor: string) => {
    setFormData(prev => ({ ...prev, lookingFor }));
  };
  
  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };
  
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-white rounded-3xl w-full max-w-md relative overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Close button */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 z-10"
          >
            <X size={18} />
          </button>
          
          {/* Header with progress indicator */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">
              {currentStep === 1 && "Who are you?"}
              {currentStep === 2 && "What are you looking for?"}
              {currentStep === 3 && "Almost there!"}
            </h3>
            
            <div className="flex space-x-2 mt-4">
              {[1, 2, 3].map(step => (
                <div 
                  key={step} 
                  className={`h-1 flex-1 rounded-full ${
                    step <= currentStep ? 'bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb]' : 'bg-gray-200'
                  }`}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Form content */}
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              {/* Step 1: Gender Selection */}
              {currentStep === 1 && (
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-600 mb-6">Select who you are</p>
                  
                  <div className="space-y-3">
                    <button 
                      type="button"
                      onClick={() => handleGenderSelect('male')}
                      className={`w-full py-3 px-4 rounded-xl border-2 text-left transition-all ${
                        formData.gender === 'male'
                          ? 'border-[#5e17eb] bg-[#5e17eb]/5 text-[#5e17eb]'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Man
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => handleGenderSelect('female')}
                      className={`w-full py-3 px-4 rounded-xl border-2 text-left transition-all ${
                        formData.gender === 'female'
                          ? 'border-[#5e17eb] bg-[#5e17eb]/5 text-[#5e17eb]'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Woman
                    </button>
                  </div>
                </motion.div>
              )}
              
              {/* Step 2: Looking For Selection */}
              {currentStep === 2 && (
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-600 mb-6">Select who you&apos;re interested in</p>
                  
                  <div className="space-y-3">
                    <button 
                      type="button"
                      onClick={() => handleLookingForSelect('male')}
                      className={`w-full py-3 px-4 rounded-xl border-2 text-left transition-all ${
                        formData.lookingFor === 'male'
                          ? 'border-[#ff2e2e] bg-[#ff2e2e]/5 text-[#ff2e2e]'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Men
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => handleLookingForSelect('female')}
                      className={`w-full py-3 px-4 rounded-xl border-2 text-left transition-all ${
                        formData.lookingFor === 'female'
                          ? 'border-[#ff2e2e] bg-[#ff2e2e]/5 text-[#ff2e2e]'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Women
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => handleLookingForSelect('both')}
                      className={`w-full py-3 px-4 rounded-xl border-2 text-left transition-all ${
                        formData.lookingFor === 'both'
                          ? 'border-[#ff2e2e] bg-[#ff2e2e]/5 text-[#ff2e2e]'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Both
                    </button>
                  </div>
                </motion.div>
              )}
              
              {/* Step 3: Personal Information */}
              {currentStep === 3 && (
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-600 mb-6">Just a few more details</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700">
                        Your name
                      </label>
                      <input 
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. John"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#5e17eb] focus:outline-none transition"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="birthday" className="block text-sm font-medium mb-2 text-gray-700">
                        Your birthday
                      </label>
                      <input 
                        type="text"
                        id="birthday"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleInputChange}
                        placeholder="MM/DD/YYYY"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#5e17eb] focus:outline-none transition"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-[#5e17eb] focus:ring-[#5e17eb]"
                        required
                      />
                      <span className="text-sm text-gray-600">
                        I have read and agree to the{' '}
                        <a href="#" className="text-[#5e17eb] underline hover:text-[#4f50ff] transition-colors">Terms of Use</a>{' '}
                        and{' '}
                        <a href="#" className="text-[#5e17eb] underline hover:text-[#4f50ff] transition-colors">Privacy Policy</a>
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Footer with navigation buttons */}
            <div className="p-6 border-t border-gray-100 flex justify-between">
              {currentStep > 1 ? (
                <Button
                  variant="outline"
                  type="button"
                  onClick={handlePrevStep}
                >
                  Back
                </Button>
              ) : (
                <div></div>
              )}
              
              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={
                    (currentStep === 1 && !formData.gender) ||
                    (currentStep === 2 && !formData.lookingFor)
                  }
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!formData.name || !formData.birthday}
                >
                  Create Account
                </Button>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PreferenceModal;