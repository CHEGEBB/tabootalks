/* eslint-disable @typescript-eslint/no-explicit-any */
// app/main/chats/test/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { getUserConversations, sendChatMessage } from '@/lib/chat/chatService';
import { checkUserCredits } from '@/lib/chat/creditService';

export default function TestPage() {
  const { profile: userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    const testEverything = async () => {
      if (!userProfile) return;
      
      setLoading(true);
      setError('');
      
      try {
        const userId = userProfile.$id || userProfile.userId;
        console.log('🧪 TEST START - User ID:', userId);
        
        // Ensure userId is a string
        if (!userId) {
          throw new Error('User ID is required');
        }

        // 1. Test Credits
        console.log('🧪 Testing credits...');
        const credits = await checkUserCredits(userId);
        console.log('💰 Credits result:', credits);
        
        // 2. Test Conversations
        console.log('🧪 Testing conversations...');
        const convs = await getUserConversations(userId);
        console.log('📱 Conversations result:', convs);
        
        // 3. Test Message Send (to a known bot)
        console.log('🧪 Testing message send...');
        const botId = 'bot_id_here'; // Replace with an actual bot ID from your DB
        const sendTest = await sendChatMessage(userId, botId, 'Test message');
        console.log('📤 Send result:', sendTest);
        
        setData({
          credits,
          conversations: convs,
          sendTest
        });
        
        setTestResult('✅ All tests passed!');
        
      } catch (err: any) {
        console.error('❌ TEST FAILED:', err);
        setError(err.message);
        setTestResult('❌ Tests failed');
      } finally {
        setLoading(false);
      }
    };
    
    testEverything();
  }, [userProfile]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🧪 Chat System Test</h1>
      
      {loading ? (
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          <p>Running tests...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="font-bold text-red-700 mb-2">❌ Error</h3>
          <p className="text-red-600">{error}</p>
          <div className="mt-4">
            <h4 className="font-bold text-gray-900">Debug Steps:</h4>
            <ol className="list-decimal pl-5 mt-2 space-y-1 text-gray-700">
              <li>Open Browser Developer Tools (F12)</li>
              <li>Go to Console tab</li>
              <li>Check for errors in red</li>
              <li>Look for &quot;🧪 TEST START&quot; logs</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-bold text-green-700">{testResult}</h3>
          </div>
          
          {data && (
            <>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold mb-2">Credits:</h4>
                <pre className="text-sm bg-white p-2 rounded overflow-auto">
                  {JSON.stringify(data.credits, null, 2)}
                </pre>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold mb-2">Conversations ({data.conversations.length}):</h4>
                <pre className="text-sm bg-white p-2 rounded overflow-auto max-h-60">
                  {JSON.stringify(data.conversations, null, 2)}
                </pre>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold mb-2">Send Message Test:</h4>
                <pre className="text-sm bg-white p-2 rounded overflow-auto">
                  {JSON.stringify(data.sendTest, null, 2)}
                </pre>
              </div>
            </>
          )}
        </div>
      )}
      
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-bold text-yellow-800 mb-2">Quick Fix for White Screen:</h4>
        <p className="text-yellow-700 mb-2">Replace your entire <code>app/main/chats/[id]/page.tsx</code> with this SIMPLE version:</p>
        <button
          onClick={() => navigator.clipboard.writeText(`
            'use client';
            import { useState, useEffect } from 'react';
            import { useParams, useRouter } from 'next/navigation';
            import { useAuth } from '@/lib/hooks/useAuth';
            import LayoutController from '@/components/layout/LayoutController';
            
            export default function SimpleChatPage() {
              const params = useParams();
              const router = useRouter();
              const { profile: userProfile } = useAuth();
              const [message, setMessage] = useState('');
              
              if (!userProfile) {
                return (
                  <div className="min-h-screen bg-white">
                    <LayoutController />
                    <div className="p-6">
                      <h1>Please login</h1>
                    </div>
                  </div>
                );
              }
              
              return (
                <div className="min-h-screen bg-white">
                  <LayoutController />
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Simple Chat</h1>
                    <p>Chat with: {params.id}</p>
                    <div className="mt-4">
                      <input 
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="border p-2 rounded"
                        placeholder="Type a message..."
                      />
                      <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          `)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Copy Simple Fix Code
        </button>
      </div>
    </div>
  );
}