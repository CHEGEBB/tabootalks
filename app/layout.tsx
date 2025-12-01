import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import  localFont from "next/font/local";



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
      <body
        className={dmSans.className}
      >
        {children}
      </body>
    </html>
  );
}
