import React, { useState, useEffect } from 'react';
import { Star, MessageCircle } from 'lucide-react';
import { useMediaQuery } from '../../lib/hooks/useMediaQuery';
import { useAppStore } from '../../store/appStore';
import { generateMockData } from '../../data/mockData';
import DesktopNav from '../../components/layout/DesktopNav';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { MobileHeader } from '../../components/layout/MobileHeader';
import { FeedList } from '../../components/features/newsfeed/FeedList';

const TabooTalksApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [feedFilter, setFeedFilter] = useState('all');
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const { user, setPosts, setProfiles } = useAppStore();

  useEffect(() => {
    const { profiles, posts } = generateMockData();
    setProfiles(profiles);
    setPosts(posts);
  }, [setPosts, setProfiles]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {isMobile ? (
        <>
          <MobileHeader credits={user.credits} />
          <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </>
      ) : (
        <DesktopNav activeTab={activeTab} setActiveTab={setActiveTab} credits={user.credits} />
      )}

      <main className={`max-w-2xl mx-auto px-4 ${isMobile ? 'pt-20 pb-20' : 'pt-24 pb-8'}`}>
        {activeTab === 'home' && (
          <>
            <div className="flex items-center space-x-2 mb-6">
              <button
                onClick={() => setFeedFilter('all')}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                  feedFilter === 'all'
                    ? 'bg-[#5e17eb] text-white'
                    : 'bg-[#1a1a1a] text-[#9ca3af] hover:bg-[#2a2a2a]'
                }`}
              >
                All Posts
              </button>
              <button
                onClick={() => setFeedFilter('following')}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                  feedFilter === 'following'
                    ? 'bg-[#5e17eb] text-white'
                    : 'bg-[#1a1a1a] text-[#9ca3af] hover:bg-[#2a2a2a]'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>Following</span>
              </button>
            </div>

            <FeedList filter={feedFilter} />
          </>
        )}

        {activeTab !== 'home' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center">
              <MessageCircle className="w-10 h-10 text-[#5e17eb]" />
            </div>
            <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
            <p className="text-[#9ca3af] text-center max-w-md">
              We&apos;re working hard to bring you amazing features. Stay tuned!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default TabooTalksApp;