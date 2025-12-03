import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  credits: number;
  following: string[];
}

interface Post {
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
}

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  online: boolean;
  imageUrl: string;
}

interface AppState {
  user: User;
  posts: Post[];
  profiles: Profile[];
  setPosts: (posts: Post[]) => void;
  setProfiles: (profiles: Profile[]) => void;
  toggleLike: (postId: string) => void;
  toggleFollow: (profileId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: {
    id: 'user_1',
    name: 'John',
    credits: 45,
    following: ['profile_2', 'profile_5']
  },
  posts: [],
  profiles: [],
  setPosts: (posts) => set({ posts }),
  setProfiles: (profiles) => set({ profiles }),
  toggleLike: (postId) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    )
  })),
  toggleFollow: (profileId) => set((state) => ({
    user: {
      ...state.user,
      following: state.user.following.includes(profileId)
        ? state.user.following.filter(id => id !== profileId)
        : [...state.user.following, profileId]
    },
    posts: state.posts.map(post =>
      post.profileId === profileId
        ? { ...post, isFollowing: !post.isFollowing }
        : post
    )
  }))
}));