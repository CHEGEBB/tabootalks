// components/layout/Navigation.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Languages } from 'lucide-react';
import Button from '../ui/Button';
import Link from 'next/link';
import Image from 'next/image';

interface NavigationProps {
  onGetStarted?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onGetStarted }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Height of navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <div className="flex items-center">
            <motion.div 
              className="flex items-center space-x-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Image
                src="/assets/logo2.png"
                alt="TabooTalks Logo"
                width={240}
                height={140}
                className=""
              />
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('features')} 
              className="text-gray-700 hover:text-[#ff2e2e] font-medium transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('community')} 
              className="text-gray-700 hover:text-[#ff2e2e] font-medium transition-colors"
            >
              Community
            </button>
            <button 
              onClick={() => scrollToSection('mission')} 
              className="text-gray-700 hover:text-[#ff2e2e] font-medium transition-colors"
            >
              Mission
            </button>
            <button 
              onClick={() => scrollToSection('journey')} 
              className="text-gray-700 hover:text-[#ff2e2e] font-medium transition-colors"
            >
              How It Works
            </button>
            
            <motion.button 
              className="px-6 py-2 text-gray-700 hover:text-[#ff2e2e] transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/login'}
            >
              Login
            </motion.button>
            
            <Button 
              onClick={onGetStarted}
              className="bg-[#ff2e2e] text-white"
            >
              Get Started
            </Button>

            {/* LANGUAGE SWITCHER (DESKTOP) */}
            <div className="flex items-center space-x-3 ml-4">
              <Languages className="w-5 h-5 text-gray-600" />
              <Link href="/" locale="en" className="text-gray-700 hover:text-[#ff2e2e] font-medium">
                EN
              </Link>
              <span className="text-gray-400">|</span>
              <Link href="/" locale="de" className="text-gray-700 hover:text-[#ff2e2e] font-medium">
                DE
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 focus:outline-none"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <button 
                onClick={() => scrollToSection('features')} 
                className="block w-full text-left py-2 text-gray-700 hover:text-[#ff2e2e] font-medium"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('community')} 
                className="block w-full text-left py-2 text-gray-700 hover:text-[#ff2e2e] font-medium"
              >
                Community
              </button>
              <button 
                onClick={() => scrollToSection('mission')} 
                className="block w-full text-left py-2 text-gray-700 hover:text-[#ff2e2e] font-medium"
              >
                Mission
              </button>
              <button 
                onClick={() => scrollToSection('journey')} 
                className="block w-full text-left py-2 text-gray-700 hover:text-[#ff2e2e] font-medium"
              >
                How It Works
              </button>
              <button 
                onClick={() => window.location.href = '/login'} 
                className="block w-full text-left py-2 text-gray-700 hover:text-[#ff2e2e] font-medium"
              >
                Login
              </button>
              <Button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGetStarted && onGetStarted();
                }}
                className="w-full bg-[#ff2e2e] text-white"
              >
                Get Started
              </Button>

              {/* LANGUAGE SWITCHER (MOBILE) */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Language</p>
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/" 
                    locale="en"
                    className="text-gray-700 font-medium hover:text-[#ff2e2e]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    English
                  </Link>
                  <Link 
                    href="/" 
                    locale="de"
                    className="text-gray-700 font-medium hover:text-[#ff2e2e]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Deutsch
                  </Link>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;
