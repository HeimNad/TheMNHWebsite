import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { WAIVER_TERMS_TEXT } from '@/app/(public)/waiver/waiverTerms';

const MIN_SUBMIT_TIME_MS = 3000; // Minimum 3 seconds to fill form

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      child_name,
      date,
      location,
      signature_data,
      terms_accepted,
      age_confirmed,
      _hp,
      _ts,
    } = body;

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

    // Both boxes are required client-side too, but the waiver is only worth
    // anything as evidence if the server itself can attest they were checked.
    if (terms_accepted !== true || age_confirmed !== true) {
      return NextResponse.json(
        { error: 'Terms must be accepted and age confirmed' },
        { status: 400 }
      );
    }

    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip_address = forwardedFor ? forwardedFor.split(',')[0].trim() : null;
    const user_agent = request.headers.get('user-agent');

    // Insert data
    await db.sql`
      INSERT INTO waivers (
        name, child_name, date, location, signature_data,
        terms_accepted, age_confirmed, waiver_text, ip_address, user_agent
      )
      VALUES (
        ${name}, ${child_name}, ${date}, ${location}, ${JSON.stringify(signature_data)},
        ${terms_accepted}, ${age_confirmed}, ${WAIVER_TERMS_TEXT}, ${ip_address}, ${user_agent}
      )
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
