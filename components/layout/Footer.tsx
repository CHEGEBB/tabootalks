'use client';

import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Send } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-[#5e17eb] to-[#4a12c4] text-white overflow-hidden">
      {/* Cloud Wave SVG at top - smaller on mobile */}
      <div className="absolute top-0 left-0 w-full overflow-hidden" style={{ marginTop: '-1px' }}>
        <svg
          className="relative block w-full h-16 sm:h-32 md:h-40"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 Q60,90 120,75 Q180,60 240,80 Q300,100 360,75 Q420,50 480,70 Q540,90 600,65 Q660,40 720,60 Q780,80 840,55 Q900,30 960,65 Q1020,100 1080,70 Q1140,40 1200,75 Q1260,110 1320,80 Q1380,50 1440,85 L1440,0 L0,0 Z"
            fill="#ffffff"
            style={{
              animation: 'fadeIn 1s ease-out'
            }}
          />
        </svg>
      </div>

      {/* LEFT SIDE - Shape balloon with animation */}
      <div 
        className="absolute left-2 sm:left-4 md:left-10 bottom-32 sm:bottom-36 md:bottom-48 z-10"
        style={{
          animation: 'floatUpDown 3s ease-in-out infinite'
        }}
      >
        <Image
          src="/assets/shape.png"
          alt=""
          width={480}
          height={200}
          quality={100}
          className="w-32 h-auto sm:w-48 md:w-64 lg:w-80"
        />
      </div>

      {/* RIGHT SIDE - Heart balloon with animation */}
      <div 
        className="absolute right-2 sm:right-4 md:right-10 bottom-20 sm:bottom-24 md:bottom-32 z-10"
        style={{
          animation: 'floatUpDown 3.5s ease-in-out infinite'
        }}
      >
        <Image
          src="/assets/heart.png"
          alt=""
          width={480}
          height={200}
          quality={100}
          className="w-28 h-auto sm:w-40 md:w-52 lg:w-64"
        />
      </div>

      <div className="relative pt-20 sm:pt-32 pb-12 px-4">
        {/* Newsletter Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 mb-6 relative"
            style={{
              animation: 'scaleIn 0.5s ease-out'
            }}
          >
            <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-6">Sign up to receive a monthly email on the latest news!</h3>
          <div className="max-w-md mx-auto relative">
            <input
              type="email"
              placeholder="Your Email Address"
              className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 text-white placeholder-white/70 focus:outline-none focus:border-white/60 transition pr-14 sm:pr-16"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center hover:scale-110 transition-transform">
              <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Horizontal Dividing Line */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mb-12">
            {/* Our Information */}
            <div style={{ animation: 'slideUp 0.5s ease-out' }}>
              <h4 className="font-bold mb-4 sm:mb-6 text-white text-sm sm:text-base md:text-lg">OUR INFORMATION</h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-white/80">
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ About Us</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Contact Us</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Customer Reviews</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Success Stories</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Business License</a></li>
              </ul>
            </div>

            {/* My Account */}
            <div style={{ animation: 'slideUp 0.5s ease-out 0.1s backwards' }}>
              <h4 className="font-bold mb-4 sm:mb-6 text-white text-sm sm:text-base md:text-lg">MY ACCOUNT</h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-white/80">
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Manage Account</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Safety Tips</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Account Verification</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Safety & Security</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Membership Level</a></li>
              </ul>
            </div>

            {/* Help Center */}
            <div style={{ animation: 'slideUp 0.5s ease-out 0.2s backwards' }}>
              <h4 className="font-bold mb-4 sm:mb-6 text-white text-sm sm:text-base md:text-lg">HELP CENTER</h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-white/80">
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Help centre</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ FAQ</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Quick Start Guide</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Tutorials</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Associate Blog</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div style={{ animation: 'slideUp 0.5s ease-out 0.3s backwards' }}>
              <h4 className="font-bold mb-4 sm:mb-6 text-white text-sm sm:text-base md:text-lg">LEGAL</h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-white/80">
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Privacy policy</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ End User Agreements</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Refund Policy</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Cookie policy</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">≫ Report abuse</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 sm:pt-8 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
              <img src="/assets/visa.png" alt="Visa" className="h-6 sm:h-8 w-auto" />
              <img src="/assets/mastercard.png" alt="Mastercard" className="h-6 sm:h-8 w-auto" />
              <img src="/assets/amex.png" alt="Amex" className="h-6 sm:h-8 w-auto" />
              <img src="/assets/pal.png" alt="PayPal" className="h-6 sm:h-8 w-auto" />
            </div>

            <div className="flex space-x-3 sm:space-x-4">
              <a 
                href="#" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all backdrop-blur-sm hover:scale-110 hover:-translate-y-1"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all backdrop-blur-sm hover:scale-110 hover:-translate-y-1"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all backdrop-blur-sm hover:scale-110 hover:-translate-y-1"
              >
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </a>
            </div>

            <div className="text-center text-white/70 text-xs sm:text-sm">
              <p>© {new Date().getFullYear()} TabooTalks. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes floatUpDown {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;