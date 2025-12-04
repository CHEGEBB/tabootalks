export interface Message {
    id: string;
    sender: 'user' | string;
    text: string;
    time: string;
    isRead: boolean;
    type?: 'text' | 'image' | 'gift';
    imageUrl?: string;
    giftId?: string;
  }
  
  export interface Chat {
    id: string;
    userId: number;
    username: string;
    age: number;
    location: string;
    profileImage: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    isOnline: boolean;
    isVerified: boolean;
    messages: Message[];
  }
  
  export interface ConnectionRequest {
    id: string;
    userId: number;
    username: string;
    age: number;
    location: string;
    profileImage: string;
    requestTime: string;
    message: string;
    status: 'pending' | 'accepted' | 'declined';
  }
  
  export interface ChatState {
    chats: Chat[];
    activeChat: Chat | null;
    requests: ConnectionRequest[];
    unreadCount: number;
    isTyping: boolean;
    currentUserCredits: number;
  }
  
  export interface SendMessagePayload {
    chatId: string;
    text: string;
    type?: 'text' | 'image' | 'gift';
    imageUrl?: string;
    giftId?: string;
  }