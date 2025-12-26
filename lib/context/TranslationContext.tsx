'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Script from 'next/script';

type Language = 'English' | 'German';

interface TranslationContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
  isReady: boolean;
}

const TranslationContext = createContext<TranslationContextType>({
  language: 'English',
  changeLanguage: () => {},
  isReady: false,
});

export const useTranslation = () => useContext(TranslationContext);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('English');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for Google Translate to load with setTimeout
    setTimeout(() => {
      const selectElement = document.querySelector('#google_translate_element select') as HTMLSelectElement;
      if (selectElement) {
        setIsReady(true);
        
        // Apply saved language
        const savedLang = localStorage.getItem('preferredLanguage') as Language;
        const savedCode = localStorage.getItem('preferredLanguageCode');
        
        if (savedLang && savedCode && savedCode !== 'en') {
          selectElement.value = savedCode;
          selectElement.dispatchEvent(new Event('change'));
          setLanguage(savedLang);
        }
      }
    }, 1000); // Wait 1 second for Google Translate to fully load
  }, []);

  const changeLanguage = (lang: Language) => {
    const targetLang = lang === 'German' ? 'de' : 'en';
    
    // Find the select element
    const selectElement = document.querySelector('#google_translate_element select') as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = targetLang;
      selectElement.dispatchEvent(new Event('change'));
      
      localStorage.setItem('preferredLanguage', lang);
      localStorage.setItem('preferredLanguageCode', targetLang);
      
      setLanguage(lang);
    }
  };

  return (
    <>
      {/* Google Translate Initialization */}
      <Script
        id="google-translate-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            function TranslateInit() {
              if (typeof google !== 'undefined' && google.translate) {
                new google.translate.TranslateElement({
                  pageLanguage: 'en',
                  includedLanguages: 'en,de',
                  layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                  autoDisplay: false
                }, 'google_translate_element');
              }
            }
          `,
        }}
      />
      
      {/* Google Translate Script */}
      <Script
        src="//translate.google.com/translate_a/element.js?cb=TranslateInit"
        strategy="afterInteractive"
      />
      
      {/* Hide Google Translate UI and ALL hover effects */}
      <style 
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `
            /* Hide Google Translate banner and branding */
            .goog-te-banner-frame.skiptranslate {
              display: none !important;
            }
            
            body {
              top: 0 !important;
              position: static !important;
            }
            
            .goog-te-gadget-icon {
              display: none !important;
            }
            
            .goog-logo-link {
              display: none !important;
            }
            
            .goog-te-gadget {
              color: transparent !important;
            }
            
            #google_translate_element {
              display: none;
            }
            
            /* Hide the Google Translate iframe */
            iframe.skiptranslate {
              visibility: hidden !important;
            }
            
            /* COMPLETELY DISABLE ALL HOVER EFFECTS AND TOOLTIPS */
            .goog-tooltip {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
            }
            
            .goog-tooltip:hover {
              display: none !important;
            }
            
            /* Remove ALL highlight and shadow effects */
            .goog-text-highlight {
              background-color: transparent !important;
              box-shadow: none !important;
              background: none !important;
              border: none !important;
            }
            
            /* Disable the translation popup bubble */
            div[id^="goog-gt-"] {
              display: none !important;
              visibility: hidden !important;
            }
            
            /* Remove ALL styling from translated font elements */
            font[style],
            font {
              background-color: transparent !important;
              background: none !important;
              box-shadow: none !important;
              text-shadow: none !important;
              border: none !important;
              outline: none !important;
            }
            
            /* Disable pointer events only on tooltip elements */
            .goog-tooltip,
            .goog-tooltip *,
            div[id^="goog-gt-"],
            div[id^="goog-gt-"] * {
              pointer-events: none !important;
            }
            
            /* Re-enable pointer events for interactive elements */
            body, body *, button, a, input, select, textarea {
              pointer-events: auto !important;
            }
            
            /* CRITICAL: Remove ALL hover effects on translated text */
            .translated-ltr font:hover,
            .translated-rtl font:hover,
            font:hover {
              background-color: transparent !important;
              background: none !important;
              box-shadow: none !important;
              text-shadow: none !important;
              cursor: inherit !important;
              border: none !important;
              outline: none !important;
            }
            
            /* Disable hover on ALL Google Translate elements */
            [class*="goog-"]:hover,
            [id*="goog-"]:hover {
              background: none !important;
              box-shadow: none !important;
              border: none !important;
            }
            
            /* Force remove any inline styles that create shadows/highlights */
            span[style*="background"],
            font[style*="background"],
            span[style*="box-shadow"],
            font[style*="box-shadow"] {
              background: transparent !important;
              box-shadow: none !important;
            }
          `
        }} 
      />
      
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" style={{ display: 'none' }} />
      
      <TranslationContext.Provider value={{ language, changeLanguage, isReady }}>
        {children}
      </TranslationContext.Provider>
    </>
  );
}