// components/layout/Navigation.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Languages, Check } from 'lucide-react';
import Button from '../ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

interface NavigationProps {
  onGetStarted?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onGetStarted }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Determine active section based on scroll position
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
      
      // If at top of page, set to home
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
        const offset = 80; // Height of navbar
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
      // Navigate directly to signup page
      router.push('/signup');
    }
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    router.push('/login');
    setMobileMenuOpen(false);
  };

  const navigationItems = [
    { id: 'features', label: 'Features' },
    { id: 'community', label: 'Community' },
    { id: 'mission', label: 'Mission' },
    { id: 'journey', label: 'How It Works' },
  ];

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
                
                {/* Active indicator line */}
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

            {/* LANGUAGE SWITCHER (DESKTOP) */}
            <div className="flex items-center space-x-3 ml-4">
              <Languages className="w-5 h-5 text-gray-600" />
              <Link 
                href="/" 
                locale="en" 
                className={`font-medium transition-colors ${
                  pathname.includes('/en') ? 'text-[#ff2e2e]' : 'text-gray-700 hover:text-[#ff2e2e]'
                }`}
              >
                EN
              </Link>
              <span className="text-gray-400">|</span>
              <Link 
                href="/" 
                locale="de" 
                className={`font-medium transition-colors ${
                  pathname.includes('/de') ? 'text-[#ff2e2e]' : 'text-gray-700 hover:text-[#ff2e2e]'
                }`}
              >
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

              {/* LANGUAGE SWITCHER (MOBILE) */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-3 px-4">Select Language</p>
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    href="/" 
                    locale="en"
                    className={`py-3 px-4 rounded-lg text-center font-medium transition-all ${
                      pathname.includes('/en') 
                        ? 'bg-red-50 text-[#ff2e2e] border-2 border-[#ff2e2e]' 
                        : 'text-gray-700 hover:text-[#ff2e2e] hover:bg-gray-50 border-2 border-transparent'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>English</span>
                      {pathname.includes('/en') && (
                        <Check className="w-4 h-4" />
                      )}
                    </div>
                  </Link>
                  <Link 
                    href="/" 
                    locale="de"
                    className={`py-3 px-4 rounded-lg text-center font-medium transition-all ${
                      pathname.includes('/de') 
                        ? 'bg-red-50 text-[#ff2e2e] border-2 border-[#ff2e2e]' 
                        : 'text-gray-700 hover:text-[#ff2e2e] hover:bg-gray-50 border-2 border-transparent'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>Deutsch</span>
                      {pathname.includes('/de') && (
                        <Check className="w-4 h-4" />
                      )}
                    </div>
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