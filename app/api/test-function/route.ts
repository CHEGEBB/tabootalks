/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/test-function/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test if we can reach the function
    const FUNCTION_URL = 'https://693bd0b100117232836e.fra.appwrite.run';
    
    console.log('Testing function at:', FUNCTION_URL);
    
    const testResponse = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: '6936f8c9000e38417faf',
        botProfileId: '693828f58b76aa1a6d8f',
        message: 'Hello',
      }),
    });

    console.log('Function response status:', testResponse.status);
    console.log('Function response headers:', Object.fromEntries(testResponse.headers.entries()));
    
    const responseText = await testResponse.text();
    console.log('Function response text (first 500 chars):', responseText.substring(0, 500));

    return NextResponse.json({
      success: testResponse.ok,
      status: testResponse.status,
      statusText: testResponse.statusText,
      contentType: testResponse.headers.get('content-type'),
      bodyPreview: responseText.substring(0, 500),
    });

  } catch (error: any) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}