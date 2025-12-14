// types/message.ts
export interface Message {
  $id: string;
  id?: string; // Optional for temporary messages
  conversationId: string; // ADD THIS LINE
  userId: string;
  botProfileId: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string | Date;
  creditsUsed?: number;
  $createdAt?: string;
  $updatedAt?: string;
  // Other fields from your database schema
  createdAt?: string;
  updatedAt?: string;
}

// Optional: Create a simpler type for UI messages
export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
  conversationId?: string; // Optional for UI
}