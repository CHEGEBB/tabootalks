/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/credits/check/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Your credit function URL
    const FUNCTION_URL = 'https://693bd2ed00102f4a9a90.fra.appwrite.run';
    
    // Forward the request
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Credit check proxy error:', error);
    return NextResponse.json(
      { success: false, error: error.message, credits: 0 },
      { status: 500 }
    );
  }
}