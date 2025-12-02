'use client';

import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-b from-[#5e17eb] to-[#4a12c4] text-white overflow-hidden">
      {/* Cloud Wave SVG at top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden" style={{ marginTop: '-1px' }}>
        <svg
          className="relative block w-full h-32 sm:h-40"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <motion.path
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            d="M0,60 Q60,90 120,75 Q180,60 240,80 Q300,100 360,75 Q420,50 480,70 Q540,90 600,65 Q660,40 720,60 Q780,80 840,55 Q900,30 960,65 Q1020,100 1080,70 Q1140,40 1200,75 Q1260,110 1320,80 Q1380,50 1440,85 L1440,0 L0,0 Z"
            fill="#ffffff"
          />
        </svg>
      </div>

      {/* LEFT SIDE - Shape balloon */}
      <div className="absolute left-4 sm:left-10 bottom-32 sm:bottom-48 hidden md:block">
        <Image
          src="/assets/shape.png"
          alt=""
          width={480}
          height={80}
        />
      </div>

      {/* RIGHT SIDE - Heart balloon */}
      <div className="absolute right-4 sm:right-10 bottom-20 sm:bottom-32 hidden md:block">
        <Image
          src="/assets/heart.png"
          alt=""
          width={380}
          height={100}
        />
      </div>

      <div className="relative pt-32 pb-12 px-4">
        {/* Newsletter Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 mb-6 relative"
          >
            <Mail className="w-10 h-10 text-white" />
          </motion.div>
          <h3 className="text-xl sm:text-2xl font-bold mb-6">Sign up to receive a monthly email on the latest news!</h3>
          <div className="max-w-md mx-auto relative">
            <input
              type="email"
              placeholder="Your Email Address"
              className="w-full px-6 py-4 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 text-white placeholder-white/70 focus:outline-none focus:border-white/60 transition pr-16"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center hover:scale-110 transition-transform">
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Horizontal Dividing Line */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Our Information */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h4 className="font-bold mb-6 text-white text-base sm:text-lg">OUR INFORMATION</h4>
              <ul className="space-y-3 text-sm text-white/80">
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ About Us</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Contact Us</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Customer Reviews</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Success Stories</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Business License</a></li>
              </ul>
            </motion.div>

            {/* My Account */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="font-bold mb-6 text-white text-base sm:text-lg">MY ACCOUNT</h4>
              <ul className="space-y-3 text-sm text-white/80">
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Manage Account</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Safety Tips</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Account Verification</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Safety & Security</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Membership Level</a></li>
              </ul>
            </motion.div>

            {/* Help Center */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="font-bold mb-6 text-white text-base sm:text-lg">HELP CENTER</h4>
              <ul className="space-y-3 text-sm text-white/80">
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Help centre</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ FAQ</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Quick Start Guide</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Tutorials</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Associate Blog</a></li>
              </ul>
            </motion.div>

            {/* Legal */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="font-bold mb-6 text-white text-base sm:text-lg">LEGAL</h4>
              <ul className="space-y-3 text-sm text-white/80">
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Privacy policy</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ End User Agreements</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Refund Policy</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Cookie policy</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Report abuse</a></li>
              </ul>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <Image src="/assets/visa.png" alt="Visa" width={50} height={32} className="h-8 w-auto " />
              <Image src="/assets/mastercard.png" alt="Mastercard" width={50} height={32} className="h-8 w-auto " />
              <Image src="/assets/amex.png" alt="Amex" width={50} height={32} className="h-8 w-auto " />
              <Image src="/assets/pal.png" alt="PayPal" width={50} height={32} className="h-8 w-auto " />
            </div>

            <div className="flex space-x-4">
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.2, y: -5 }}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                <Facebook className="w-5 h-5 text-white" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.2, y: -5 }}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                <Instagram className="w-5 h-5 text-white" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.2, y: -5 }}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                <Twitter className="w-5 h-5 text-white" />
              </motion.a>
            </div>

            <div className="text-center text-white/70 text-sm">
              <p>© {new Date().getFullYear()} TabooTalks. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;