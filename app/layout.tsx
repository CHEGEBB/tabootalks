import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import Script from "next/script";

const dmSans = localFont({
  src: [
    {
      path: '../public/fonts/DMSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/DMSans-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/DMSans-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/DMSans-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/DMSans-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "TabooTalks",
  description: "Making meaningful connections, one chat at a time.",
  keywords: 'adult conversations, taboo topics chat, premium chat app, adult conversations',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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
      </head>
      <body className={dmSans.className}>
        {children}
      </body>
    </html>
  );
}