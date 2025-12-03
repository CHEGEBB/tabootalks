import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TabooTalks - Adult Dating & Chat Platform',
  description: 'Connect with AI-powered profiles for meaningful conversations',
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-[#0a0a0a]">
          {children}
        </div>
      </body>
    </html>
  );
}