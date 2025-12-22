/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Call your Appwrite function from server-side (no CORS issues)
    const response = await fetch('https://693bd0b100117232836e.fra.appwrite.run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to trigger AI response', status: response.status },
        { status: response.status }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'AI response triggered' 
    });
    
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}