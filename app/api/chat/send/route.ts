/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/chat/send/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Your Appwrite function URL
    const FUNCTION_URL = 'https://693bd0b100117232836e.fra.appwrite.run';
    
    // Forward the request to Appwrite function
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': 'tabootalks', // Optional but good
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { success: false, error: `Function error: ${response.status}` },
        { status: response.status }
      );
    }

    // For streaming responses, we need to pass through the stream
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('text/event-stream')) {
      // Create a readable stream to pass through
      const stream = response.body;
      
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // For regular JSON responses
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}