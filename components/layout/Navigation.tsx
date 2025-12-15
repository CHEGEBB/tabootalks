/* eslint-disable react-hooks/exhaustive-deps */
// components/layout/Navigation.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isClient, setIsClient] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Detect client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check and update language from cookies
  useEffect(() => {
    if (!isClient) return;

    const checkLanguage = () => {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return '';
      };

      const googtrans = getCookie('googtrans');
      
      // Check if the page has been translated
      const htmlLang = document.documentElement.lang;
      const hasTranslateClass = document.documentElement.classList.contains('translated-ltr');
      
      if (googtrans) {
        if (googtrans.includes('/de')) {
          setCurrentLang('de');
        } else if (googtrans.includes('/en')) {
          setCurrentLang('en');
        }
      } else if (htmlLang === 'de' || hasTranslateClass) {
        // Fallback to checking HTML attributes
        const frameContent = document.querySelector('iframe.skiptranslate');
        if (frameContent) {
          setCurrentLang('de');
        }
      }
    };

    // Check immediately
    checkLanguage();

    // Also check after a delay to catch Google Translate initialization
    const timer = setTimeout(checkLanguage, 500);
    const timer2 = setTimeout(checkLanguage, 1000);
    const timer3 = setTimeout(checkLanguage, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isClient]);

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
    // Close mobile menu first
    setMobileMenuOpen(false);
    
    // Small delay to allow menu to close before scrolling
    setTimeout(() => {
      if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveSection('home');
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
          setActiveSection(sectionId);
        }
      }
    }, 100);
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
    // Close dropdown if open
    setShowLangDropdown(false);
    setMobileMenuOpen(false);
    
    // Clear all existing Google Translate cookies
    const domain = window.location.hostname;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
    
    // Set new language cookie
    const cookieValue = `/auto/${lang}`;
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    
    document.cookie = `googtrans=${cookieValue}; expires=${expiry.toUTCString()}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; expires=${expiry.toUTCString()}; path=/; domain=.${domain}`;
    document.cookie = `googtrans=${cookieValue}; expires=${expiry.toUTCString()}; path=/; domain=${domain}`;
    
    // Update state immediately
    setCurrentLang(lang);
    
    // Reload page to apply translation
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const navigationItems = [
    { id: 'features', label: 'Features' },
    { id: 'community', label: 'Community' },
    { id: 'mission', label: 'Mission' },
    { id: 'journey', label: 'Journey' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showLangDropdown) {
        const target = event.target as HTMLElement;
        if (!target.closest('.language-switcher-container')) {
          setShowLangDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLangDropdown]);

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

              {/* DESKTOP LANGUAGE SWITCHER - Clean Toggle */}
              <div className="language-switcher-container flex items-center space-x-1 ml-4">
                <div className="bg-gray-100 rounded-lg p-1 flex">
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
            </div>

            {/* MOBILE NAVIGATION - Language FIRST, then hamburger */}
            <div className="md:hidden flex items-center space-x-2">
              {/* PROMINENT LANGUAGE SWITCHER - Clear and Visible */}
              <div className="language-switcher-container relative">
                {/* Main Language Button - Clear and Prominent */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                    showLangDropdown
                      ? 'bg-gradient-to-r from-[#ff2e2e] to-[#ff5e2e] text-white shadow-lg shadow-red-300/50'
                      : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 hover:bg-gray-200 border border-gray-300/50'
                  }`}
                >
                  <span className="font-semibold">
                    {currentLang === 'en' ? 'English' : 'Deutsch'}
                  </span>
                  {showLangDropdown ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </motion.button>

                {/* Language Dropdown */}
                <AnimatePresence>
                  {showLangDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-3 z-50 overflow-hidden"
                    >
                      {/* Dropdown Header */}
                      <div className="px-4 py-2 mb-1 bg-gray-50">
                        <p className="text-sm font-medium text-gray-600">Select Language</p>
                      </div>
                      
                      {/* English Option */}
                      <button
                        onClick={() => switchLanguage('en')}
                        className={`flex items-center justify-between w-full px-4 py-4 text-left transition-all duration-200 border-b border-gray-100 last:border-b-0 ${
                          currentLang === 'en'
                            ? 'bg-red-50 text-[#ff2e2e] font-semibold'
                            : 'text-gray-800 hover:bg-gray-50 active:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            currentLang === 'en' 
                              ? 'bg-[#ff2e2e] text-white' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            EN
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">English</span>
                            <span className="text-xs text-gray-500">Switch to English</span>
                          </div>
                        </div>
                        {currentLang === 'en' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center"
                          >
                            <Check className="w-5 h-5" />
                          </motion.div>
                        )}
                      </button>
                      
                      {/* German Option */}
                      <button
                        onClick={() => switchLanguage('de')}
                        className={`flex items-center justify-between w-full px-4 py-4 text-left transition-all duration-200 ${
                          currentLang === 'de'
                            ? 'bg-red-50 text-[#ff2e2e] font-semibold'
                            : 'text-gray-800 hover:bg-gray-50 active:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            currentLang === 'de' 
                              ? 'bg-[#ff2e2e] text-white' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            DE
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">Deutsch</span>
                            <span className="text-xs text-gray-500">Zu Deutsch wechseln</span>
                          </div>
                        </div>
                        {currentLang === 'de' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center"
                          >
                            <Check className="w-5 h-5" />
                          </motion.div>
                        )}
                      </button>
                      
                      {/* Help Text */}
                      <div className="px-4 pt-2 mt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500 text-center">
                          Page will reload after selection
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Hamburger Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-3 rounded-xl transition-all duration-300 focus:outline-none ${
                  mobileMenuOpen 
                    ? 'bg-gradient-to-r from-[#ff2e2e] to-[#ff5e2e] text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
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
                {/* Current Language Display in Menu */}
                <div className="py-3 px-4 mb-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Current Language</p>
                      <p className="text-lg font-bold text-gray-900">
                        {currentLang === 'en' ? 'English' : 'Deutsch'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`px-3 py-1 rounded-full ${
                        currentLang === 'en' 
                          ? 'bg-[#ff2e2e] text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {currentLang === 'en' ? 'EN' : 'DE'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Items */}
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

                {/* Quick Language Change in Menu */}
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-3 px-1">Quick Language Change</p>
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => switchLanguage('en')}
                      className={`py-3 px-4 rounded-xl font-medium transition-all duration-300 flex flex-col items-center justify-center ${
                        currentLang === 'en'
                          ? 'bg-gradient-to-r from-[#ff2e2e] to-[#ff5e2e] text-white shadow-md border-2 border-[#ff2e2e]'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-2 border-transparent'
                      }`}
                    >
                      <span className="font-bold">EN</span>
                      <span className="text-xs mt-1 opacity-90">English</span>
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => switchLanguage('de')}
                      className={`py-3 px-4 rounded-xl font-medium transition-all duration-300 flex flex-col items-center justify-center ${
                        currentLang === 'de'
                          ? 'bg-gradient-to-r from-[#ff2e2e] to-[#ff5e2e] text-white shadow-md border-2 border-[#ff2e2e]'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-2 border-transparent'
                      }`}
                    >
                      <span className="font-bold">DE</span>
                      <span className="text-xs mt-1 opacity-90">Deutsch</span>
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