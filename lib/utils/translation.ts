// lib/utils/translation.ts
export const changeLanguage = (lang: 'English' | 'German') => {
    const targetLang = lang === 'German' ? 'de' : 'en';
    
    // Trigger Google Translate
    const translateElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (translateElement) {
      translateElement.value = targetLang;
      translateElement.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Save preference
      localStorage.setItem('preferredLanguage', lang);
      localStorage.setItem('preferredLanguageCode', targetLang);
      
      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang, code: targetLang } }));
      
      console.log(`✅ Language changed to: ${lang}`);
      return true;
    }
    
    console.warn('⚠️ Google Translate not ready yet');
    return false;
  };
  
  export const getCurrentLanguage = (): 'English' | 'German' => {
    const saved = localStorage.getItem('preferredLanguage');
    return (saved as 'English' | 'German') || 'English';
  };
  
  export const initializeLanguage = () => {
    const savedLang = getCurrentLanguage();
    if (savedLang !== 'English') {
      // Wait for Google Translate to load
      const checkAndApply = () => {
        const translateElement = document.querySelector('.goog-te-combo');
        if (translateElement) {
          changeLanguage(savedLang);
        } else {
          setTimeout(checkAndApply, 300);
        }
      };
      checkAndApply();
    }
  };