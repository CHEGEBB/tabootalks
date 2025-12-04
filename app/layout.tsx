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

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return (
    <html lang={locale}>
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
        
        {/* Hide Google Translate UI */}
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