/* eslint-disable react-hooks/set-state-in-effect */
// components/layout/Navigation.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Check } from 'lucide-react';
import Button from '../ui/Button';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

interface NavigationProps {
  onGetStarted?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onGetStarted }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [currentLang, setCurrentLang] = useState<'en' | 'de'>('en');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check current language from cookie
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return '';
    };

    const googtrans = getCookie('googtrans');
    if (googtrans && googtrans.includes('/de')) {
      setCurrentLang('de');
    } else {
      setCurrentLang('en');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      const sections = ['features', 'community', 'mission', 'journey'];
      const scrollPosition = window.scrollY + 100;
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
      
      if (scrollPosition < 100) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
    setMobileMenuOpen(false);
    setActiveSection(sectionId);
  };

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      router.push('/signup');
    }
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    router.push('/login');
    setMobileMenuOpen(false);
  };

  const switchLanguage = (lang: 'en' | 'de') => {
    // Set cookie for Google Translate
    const cookieValue = `/auto/${lang}`;
    document.cookie = `googtrans=${cookieValue}; path=/`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
    
    setCurrentLang(lang);
    // Reload page to apply translation
    window.location.reload();
  };

  const navigationItems = [
    { id: 'features', label: 'Features' },
    { id: 'community', label: 'Community' },
    { id: 'mission', label: 'Mission' },
    { id: 'journey', label: 'Journey' },
  ];

  return (
    <>
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px' }}></div>

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
                onClick={() => {
                  scrollToSection('home');
                  setActiveSection('home');
                }}
              >
                <Image
                  src="/assets/logo2.png"
                  alt="TabooTalks Logo"
                  width={240}
                  height={140}
                  className=""
                />
                {activeSection === 'home' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-[#ff2e2e] rounded-full"
                  />
                )}
              </motion.div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <motion.div 
                  key={item.id}
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <button 
                    onClick={() => scrollToSection(item.id)} 
                    className={`font-medium transition-all duration-300 flex items-center space-x-2 ${
                      activeSection === item.id 
                        ? 'text-[#ff2e2e] font-semibold' 
                        : 'text-gray-700 hover:text-[#ff2e2e]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {activeSection === item.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center"
                      >
                        <Check className="w-4 h-4" />
                      </motion.div>
                    )}
                  </button>
                  
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#ff2e2e] rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              ))}
              
              <motion.button 
                className={`px-6 py-2 transition-colors font-medium rounded-lg ${
                  pathname === '/login' 
                    ? 'text-[#ff2e2e] border-2 border-[#ff2e2e]' 
                    : 'text-gray-700 hover:text-[#ff2e2e] hover:border-[#ff2e2e] border-2 border-transparent'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogin}
              >
                Login
              </motion.button>
              
              <Button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-[#ff2e2e] to-[#ff5e2e] text-white hover:shadow-lg hover:shadow-red-200 transition-all duration-300"
              >
                Get Started
              </Button>

              {/* SLEEK LANGUAGE SWITCHER (DESKTOP) */}
              <div className="flex items-center space-x-1 ml-4 bg-gray-100 rounded-lg p-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => switchLanguage('en')}
                  className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                    currentLang === 'en'
                      ? 'bg-white text-[#ff2e2e] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  EN
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => switchLanguage('de')}
                  className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                    currentLang === 'de'
                      ? 'bg-white text-[#ff2e2e] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  DE
                </motion.button>
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
              className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navigationItems.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => scrollToSection(item.id)} 
                    className={`block w-full text-left py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-between ${
                      activeSection === item.id 
                        ? 'bg-red-50 text-[#ff2e2e] font-semibold border-l-4 border-[#ff2e2e]' 
                        : 'text-gray-700 hover:text-[#ff2e2e] hover:bg-gray-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {activeSection === item.id && (
                      <motion.div
                        initial={{ rotate: -180, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Check className="w-5 h-5" />
                      </motion.div>
                    )}
                  </button>
                ))}
                
                <button 
                  onClick={handleLogin} 
                  className={`block w-full text-left py-3 px-4 rounded-lg transition-all duration-200 ${
                    pathname === '/login' 
                      ? 'bg-red-50 text-[#ff2e2e] font-semibold border-l-4 border-[#ff2e2e]' 
                      : 'text-gray-700 hover:text-[#ff2e2e] hover:bg-gray-50'
                  }`}
                >
                  Login
                </button>
                
                <div className="pt-2">
                  <Button 
                    onClick={handleGetStarted}
                    className="w-full bg-gradient-to-r from-[#ff2e2e] to-[#ff5e2e] text-white hover:shadow-lg hover:shadow-red-200 transition-all duration-300"
                  >
                    Get Started
                  </Button>
                </div>

                {/* SLEEK LANGUAGE SWITCHER (MOBILE) */}
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2 px-4 uppercase tracking-wide">Language</p>
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => switchLanguage('en')}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                        currentLang === 'en'
                          ? 'bg-gradient-to-r from-[#ff2e2e] to-[#ff5e2e] text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      English
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => switchLanguage('de')}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                        currentLang === 'de'
                          ? 'bg-gradient-to-r from-[#ff2e2e] to-[#ff5e2e] text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Deutsch
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navigation;