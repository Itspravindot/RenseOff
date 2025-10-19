import { NextResponse } from 'next/server';

// In a real application, this would connect to a database
// and use a proper OTP generation and storage mechanism
const otpStore: Record<string, { otp: string, expires: number }> = {};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 5-minute expiration
    otpStore[phone] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    };

    // In a real application, you would send the OTP via SMS
    console.log(`OTP for ${phone}: ${otp}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}