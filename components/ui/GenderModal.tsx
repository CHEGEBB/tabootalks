// components/ui/GenderModal.tsx
'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

interface GenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { selectedGender: string; lookingFor: string; name: string; birthday: string }) => void;
}

const GenderModal: React.FC<GenderModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedGender, setSelectedGender] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = () => {
    if (selectedGender && lookingFor && name && birthday && agreedToTerms) {
      onSubmit({ selectedGender, lookingFor, name, birthday });
      setSelectedGender('');
      setLookingFor('');
      setName('');
      setBirthday('');
      setAgreedToTerms(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Let&apos;s Get Started</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X />
          </button>
        </div>

        {/* I am a */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-3 text-gray-700">I am a</label>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedGender('man')}
              className={`flex-1 py-3 px-4 rounded-full border-2 font-medium transition ${
                selectedGender === 'man'
                  ? 'border-[#5e17eb] bg-[#5e17eb]/10 text-[#5e17eb]'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
              }`}
            >
              Man
            </button>
            <button
              onClick={() => setSelectedGender('woman')}
              className={`flex-1 py-3 px-4 rounded-full border-2 font-medium transition ${
                selectedGender === 'woman'
                  ? 'border-[#ff2e2e] bg-[#ff2e2e]/10 text-[#ff2e2e]'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
              }`}
            >
              Woman
            </button>
          </div>
        </div>

        {/* Looking for */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-3 text-gray-700">I am looking for</label>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setLookingFor('man')}
              className={`py-3 px-4 rounded-full border-2 font-medium transition ${
                lookingFor === 'man'
                  ? 'border-[#5e17eb] bg-[#5e17eb]/10 text-[#5e17eb]'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
              }`}
            >
              Man
            </button>
            <button
              onClick={() => setLookingFor('woman')}
              className={`py-3 px-4 rounded-full border-2 font-medium transition ${
                lookingFor === 'woman'
                  ? 'border-[#ff2e2e] bg-[#ff2e2e]/10 text-[#ff2e2e]'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
              }`}
            >
              Woman
            </button>
            <button
              onClick={() => setLookingFor('both')}
              className={`py-3 px-4 rounded-full border-2 font-medium transition ${
                lookingFor === 'both'
                  ? 'border-[#4F50FF] bg-[#4F50FF]/10 text-[#4F50FF]'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
              }`}
            >
              Both
            </button>
          </div>
        </div>

        {/* Name and Birthday */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">My name is</label>
            <input
              type="text"
              placeholder="e.g. John"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-[#5e17eb] focus:outline-none transition text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">My birthday</label>
            <input
              type="text"
              placeholder="MM/DD/YYYY"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-[#5e17eb] focus:outline-none transition text-gray-900"
            />
          </div>
        </div>

        {/* Terms */}
        <div className="mb-6">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-[#5e17eb] focus:ring-[#5e17eb]"
            />
            <span className="text-xs text-gray-600">
              I have read, understand and agree to{' '}
              <a href="#" className="text-[#5e17eb] underline">Terms of Use</a>,{' '}
              <a href="#" className="text-[#5e17eb] underline">Privacy Policy</a>,{' '}
              <a href="#" className="text-[#5e17eb] underline">Payment and Refund Policy</a>.
            </span>
          </label>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!selectedGender || !lookingFor || !name || !birthday || !agreedToTerms}
          className="w-full"
        >
          Create an account
        </Button>
      </div>
    </div>
  );
};

export default GenderModal;