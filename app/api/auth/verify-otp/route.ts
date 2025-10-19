import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// In a real application, this would connect to a database
// This is a reference to the same store used in send-otp
const otpStore: Record<string, { otp: string, expires: number }> = {};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, otp } = body;

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, error: 'Phone number and OTP are required' },
        { status: 400 }
      );
    }

    const storedData = otpStore[phone];
    
    if (!storedData) {
      return NextResponse.json(
        { success: false, error: 'OTP not found or expired' },
        { status: 400 }
      );
    }

    if (storedData.expires < Date.now()) {
      delete otpStore[phone];
      return NextResponse.json(
        { success: false, error: 'OTP expired' },
        { status: 400 }
      );
    }

    if (storedData.otp !== otp) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // OTP is valid, clear it from store
    delete otpStore[phone];

    // Set authentication cookie
    const cookieStore = cookies();
    cookieStore.set('auth_token', JSON.stringify({ 
      phone,
      authenticated: true,
      authMethod: 'otp'
    }), {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}