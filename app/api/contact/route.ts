import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET_KEY || "";

async function verifyHCaptcha(token: string) {
  try {
    const response = await fetch('https://api.hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `response=${token}&secret=${HCAPTCHA_SECRET}`,
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('hCaptcha verification error:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, message, subject, captchaToken } = body;

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!captchaToken) {
      return NextResponse.json(
        { error: 'Missing captcha token' },
        { status: 400 }
      );
    }

    const isHuman = await verifyHCaptcha(captchaToken);
    if (!isHuman) {
      return NextResponse.json(
        { error: 'Captcha verification failed' },
        { status: 400 }
      );
    }

    await db.sql`
      INSERT INTO messages (first_name, last_name, email, subject, message, status)
      VALUES (${firstName}, ${lastName}, ${email}, ${subject || 'General Inquiry'}, ${message}, 'unread')
    `;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error submitting message:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}