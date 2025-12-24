// src/lib/services/unreadMessagesService.ts
import { Client, Databases, Query, Account } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);
const account = new Account(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const CONVERSATIONS_COLLECTION = 'conversations'; // adjust if different

class UnreadMessagesService {
  private userId: string | null = null;

  async init() {
    try {
      const user = await account.get();
      this.userId = user.$id;
    } catch (error) {
      console.error('Failed to get user for unread count', error);
      this.userId = null;
    }
  }

  async getTotalUnreadCount(): Promise<number> {
    if (!this.userId) return 0;

    try {
      // Sum messageCount where userId matches and messageCount > 0
      const response = await databases.listDocuments(
        DATABASE_ID,
        CONVERSATIONS_COLLECTION,
        [
          Query.equal('userId', this.userId),
          Query.greaterThan('messageCount', 0),
        ]
      );

      return response.documents.reduce((sum, doc) => sum + (doc.messageCount || 0), 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  // Optional: Subscribe to real-time updates
  subscribe(callback: (count: number) => void) {
    if (!this.userId) return () => {};

    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${CONVERSATIONS_COLLECTION}.documents`,
      (event) => {
       
        interface EventPayload {
          userId?: string;
        }
        
                const payload: EventPayload = event.payload as EventPayload;
                if (payload.userId === this.userId) {
          this.getTotalUnreadCount().then(callback);
        }
      }
    );

    return unsubscribe;
  }
}

export const unreadMessagesService = new UnreadMessagesService();