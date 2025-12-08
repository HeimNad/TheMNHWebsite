import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, child_name, date, location, signature_data } = body;

    // Basic validation
    if (!name || !date || !location || !signature_data) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Ensure the table exists (this is a safety check, ideally run migration separately)
    await db.sql`
      CREATE TABLE IF NOT EXISTS waivers (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        name TEXT NOT NULL,
        child_name TEXT,
        date DATE NOT NULL,
        location TEXT NOT NULL,
        signature_data JSONB NOT NULL
      );
    `;

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
