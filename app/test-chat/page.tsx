// app/test-chat/page.tsx - For testing the function
'use client';

import { useState } from 'react';
import { sendChatMessage } from '@/lib/chat/chatService';

export default function TestChatPage() {
  const [userId, setUserId] = useState('');
  const [botProfileId, setBotProfileId] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [fullResponse, setFullResponse] = useState('');
  const [error, setError] = useState('');

  const handleTest = async () => {
    if (!userId || !botProfileId || !message) {
      alert('Please fill all fields');
      return;
    }

    setIsLoading(true);
    setStreamingText('');
    setFullResponse('');
    setError('');

    const result = await sendChatMessage(
      userId,
      botProfileId,
      message,
      undefined,
      (chunk, fullText) => {
        setStreamingText(fullText);
      }
    );

    setIsLoading(false);
    
    if (result.success) {
      setFullResponse(result.response || '');
      alert(`Success! Conversation: ${result.conversationId}`);
    } else {
      setError(result.response || 'Unknown error');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Cloud Function</h1>
      
      <div className="space-y-4 mb-8">
        <div>
          <label className="block mb-1">User ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter user ID from users collection"
          />
        </div>
        
        <div>
          <label className="block mb-1">Bot Profile ID</label>
          <input
            type="text"
            value={botProfileId}
            onChange={(e) => setBotProfileId(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter bot ID from persona collection"
          />
        </div>
        
        <div>
          <label className="block mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded h-24"
            placeholder="Type your test message..."
          />
        </div>
        
        <button
          onClick={handleTest}
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Streaming...' : 'Test Cloud Function'}
        </button>
      </div>

      {/* Streaming Display */}
      {streamingText && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Streaming Response:</h3>
          <div className="bg-gray-100 p-4 rounded-lg min-h-[100px]">
            {streamingText}
          </div>
        </div>
      )}

      {/* Final Response */}
      {fullResponse && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Final Response:</h3>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            {fullResponse}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-red-600">Error:</h3>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            {error}
          </div>
        </div>
      )}

      {/* Sample IDs */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Need test IDs?</h3>
        <p className="text-sm text-gray-600">
          1. Go to Appwrite Console → Collections → &quot;users&quot; → Copy any $id<br/>
          2. Go to &quot;persona&quot; collection → Copy any $id for bot profile<br/>
          3. Make sure user has credits (update in console if needed)
        </p>
      </div>
    </div>
  );
}