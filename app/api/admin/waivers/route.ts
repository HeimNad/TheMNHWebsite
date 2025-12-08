import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure table exists (in case admin page is accessed before any submissions)
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

    // Fetch waivers sorted by creation date (newest first)
    const { rows } = await db.sql`
      SELECT * FROM waivers ORDER BY created_at DESC
    `;

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching waivers:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
