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
