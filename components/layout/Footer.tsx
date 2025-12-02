// components/layout/Footer.tsx
'use client';

import React from 'react';
import { Heart, Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#1a1a1a] text-white pt-24 pb-12 px-4 overflow-hidden">
      {/* Wave SVG */}
      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block w-full h-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d="M0,50 C200,100 400,0 600,50 C800,100 1000,0 1200,50 C1400,100 1440,50 1440,50 L1440,0 L0,0 Z"
            fill="#ffffff"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-3 mb-6">
            <Image
                src="/assets/logo.png"
                alt="TabooTalks Logo"
                width={240}
                height={140}
                className=""
              />
            </div>

            <p className="text-gray-300 mb-6">
              Making meaningful connections, one chat at a time. Our platform brings people together through engaging conversations.
            </p>

            <div className="flex space-x-4 mb-6">
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.2, y: -5 }}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Facebook className="w-5 h-5 text-white" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.2, y: -5 }}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Instagram className="w-5 h-5 text-white" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.2, y: -5 }}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Twitter className="w-5 h-5 text-white" />
              </motion.a>
            </div>

            <div className="flex space-x-2 mt-6">
              <img src="/assets/visa.png" alt="Visa" className="h-8" />
              <img src="/assets/mastercard.png" alt="Mastercard" className="h-8" />
              <img src="/assets/amex.png" alt="Amex" className="h-8" />
              <img src="/assets/pal.png" alt="PayPal" className="h-8" />
            </div>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-bold mb-6 text-white text-xl">ABOUT</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white hover:translate-x-1 transition-all flex items-center">
                  <span className="h-1 w-0 bg-[#ff2e2e] rounded mr-0 transition-all duration-200 group-hover:w-3 group-hover:mr-2"></span>
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:translate-x-1 transition-all flex items-center">
                  <span className="h-1 w-0 bg-[#ff2e2e] rounded mr-0 transition-all duration-200 group-hover:w-3 group-hover:mr-2"></span>
                  Safety Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:translate-x-1 transition-all flex items-center">
                  <span className="h-1 w-0 bg-[#ff2e2e] rounded mr-0 transition-all duration-200 group-hover:w-3 group-hover:mr-2"></span>
                  Community Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:translate-x-1 transition-all flex items-center">
                  <span className="h-1 w-0 bg-[#ff2e2e] rounded mr-0 transition-all duration-200 group-hover:w-3 group-hover:mr-2"></span>
                  Become a Top User
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:translate-x-1 transition-all flex items-center">
                  <span className="h-1 w-0 bg-[#ff2e2e] rounded mr-0 transition-all duration-200 group-hover:w-3 group-hover:mr-2"></span>
                  Become a Partner
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Legal Terms */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-bold mb-6 text-white text-xl">LEGAL TERMS</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white hover:translate-x-1 transition-all flex items-center">
                  <span className="h-1 w-0 bg-[#ff2e2e] rounded mr-0 transition-all duration-200 group-hover:w-3 group-hover:mr-2"></span>
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:translate-x-1 transition-all flex items-center">
                  <span className="h-1 w-0 bg-[#ff2e2e] rounded mr-0 transition-all duration-200 group-hover:w-3 group-hover:mr-2"></span>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:translate-x-1 transition-all flex items-center">
                  <span className="h-1 w-0 bg-[#ff2e2e] rounded mr-0 transition-all duration-200 group-hover:w-3 group-hover:mr-2"></span>
                  Payment Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:translate-x-1 transition-all flex items-center">
                  <span className="h-1 w-0 bg-[#ff2e2e] rounded mr-0 transition-all duration-200 group-hover:w-3 group-hover:mr-2"></span>
                  Cookie Policy
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact & Support */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h4 className="font-bold mb-6 text-white text-xl">GET IN TOUCH</h4>
            <p className="text-gray-300 mb-4">
              We&apos;d love to hear from you! Reach out to us for any questions or support.
            </p>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <a href="mailto:support@tabootalks.com" className="text-gray-300 hover:text-white transition">
                support@tabootalks.com
              </a>
            </div>

            <form className="mt-6">
              <div className="mb-4">
                <input 
                  type="email" 
                  placeholder="Subscribe to our newsletter"
                  className="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-[#ff2e2e] transition"
                />
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb] rounded-lg text-white font-medium hover:shadow-lg transition">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} TabooTalks. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;