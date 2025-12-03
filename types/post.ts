export interface Post {
    id: number;
    username: string;
    age: number;
    location: string;
    imageUrl: string;
    likes: number;
    comments: number;
    caption: string;
    isFollowing: boolean;
    isLiked: boolean;
  }
  
  export interface User {
    id: number;
    username: string;
    age: number;
    location: string;
    imageUrl: string;
    isFollowing: boolean;
  }