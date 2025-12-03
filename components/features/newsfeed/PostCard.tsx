import React, { useState } from 'react';
import { Heart, MessageCircle, MoreVertical, Star, Search } from 'lucide-react';

interface PostCardProps {
  post: {
    id: string;
    profileId: string;
    profileName: string;
    profileAge: number;
    profileImage: string;
    imageUrl: string;
    caption: string;
    likes: number;
    timestamp: string;
    isLiked: boolean;
    isFollowing: boolean;
  };
  onLike: (postId: string) => void;
  onFollow: (profileId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike, onFollow }) => {
  const [imageExpanded, setImageExpanded] = useState(false);

  return (
    <>
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-hidden hover:border-[#5e17eb] transition-all">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={post.profileImage}
                alt={post.profileName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#10b981] border-2 border-[#0a0a0a] rounded-full" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-white font-semibold">{post.profileName}</h3>
                <span className="text-[#9ca3af] text-sm">{post.profileAge}</span>
              </div>
              <p className="text-[#9ca3af] text-sm">{post.timestamp}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onFollow(post.profileId)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-full transition-all ${
                post.isFollowing
                  ? 'bg-[#1a1a1a] text-[#9ca3af]'
                  : 'bg-[#5e17eb] text-white hover:bg-[#7c3aed]'
              }`}
            >
              <Star className={`w-4 h-4 ${post.isFollowing ? '' : 'fill-white'}`} />
              <span className="text-sm font-medium">{post.isFollowing ? 'Following' : 'Follow'}</span>
            </button>
            <button className="text-[#9ca3af] hover:text-white p-2">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div 
          className="relative cursor-pointer group"
          onClick={() => setImageExpanded(true)}
        >
          <img
            src={post.imageUrl}
            alt="Post"
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
            <Search className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all" />
          </div>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-white">{post.caption}</p>
          
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                post.isLiked
                  ? 'bg-[#ff2e2e] text-white'
                  : 'bg-[#1a1a1a] text-[#9ca3af] hover:bg-[#5e17eb] hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-white' : ''}`} />
              <span className="font-medium">{post.likes}</span>
            </button>
            
            <button className="flex items-center space-x-2 px-6 py-2 bg-[#5e17eb] text-white rounded-lg hover:bg-[#7c3aed] transition-all">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Chat</span>
            </button>
          </div>
        </div>
      </div>

      {imageExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={() => setImageExpanded(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={post.imageUrl}
              alt="Post expanded"
              className="max-w-full max-h-screen object-contain rounded-lg"
            />
            <button
              className="absolute top-4 right-4 bg-[#0a0a0a] text-white rounded-full p-2 hover:bg-[#1a1a1a] w-10 h-10 flex items-center justify-center text-2xl font-bold"
              onClick={() => setImageExpanded(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};