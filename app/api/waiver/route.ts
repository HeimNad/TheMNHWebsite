import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const MIN_SUBMIT_TIME_MS = 3000; // Minimum 3 seconds to fill form

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, child_name, date, location, signature_data, _hp, _ts } = body;

    // Honeypot check - if filled, silently accept but don't save (confuse bots)
    if (_hp) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    // Timestamp check - if form submitted too fast, likely a bot
    if (_ts && Date.now() - _ts < MIN_SUBMIT_TIME_MS) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    // Basic validation
    if (!name || !date || !location || !signature_data) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert data
    await db.sql`
      INSERT INTO waivers (name, child_name, date, location, signature_data)
      VALUES (${name}, ${child_name}, ${date}, ${location}, ${JSON.stringify(signature_data)})
    `;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error submitting waiver:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
