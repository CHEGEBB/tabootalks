import React from 'react';
import { PostCard } from './PostCard';
import { useAppStore } from '../../../store/appStore';

interface FeedListProps {
  filter: string;
}

export const FeedList: React.FC<FeedListProps> = ({ filter }) => {
  const { posts, user, toggleLike, toggleFollow } = useAppStore();
  
  const filteredPosts = filter === 'following'
    ? posts.filter(post => user.following.includes(post.profileId))
    : posts;

  return (
    <div className="space-y-6">
      {filteredPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={toggleLike}
          onFollow={toggleFollow}
        />
      ))}
    </div>
  );
};
