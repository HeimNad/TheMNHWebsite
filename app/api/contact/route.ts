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
    const { firstName, lastName, email, message, captchaToken } = body;

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
      CREATE TABLE IF NOT EXISTS messages (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'ignored'))
      );
    `;

    await db.sql`
      INSERT INTO messages (first_name, last_name, email, message, status)
      VALUES (${firstName}, ${lastName}, ${email}, ${message}, 'unread')
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