import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let fetchHistory = false;
  try {
    const { searchParams } = new URL(request.url);
    fetchHistory = searchParams.get('history') === 'true';

    if (fetchHistory) {
      const { rows } = await db.sql`
        SELECT * FROM announcements 
        ORDER BY created_at DESC 
        LIMIT 10
      `;
      return NextResponse.json(rows);
    }

    const { rows } = await db.sql`
      SELECT message, is_active FROM announcements 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    return NextResponse.json(rows[0] || { message: '', is_active: false });
  } catch (error: any) {
    if (error.code === '42P01') {
      return NextResponse.json(fetchHistory ? [] : { message: '', is_active: false });
    }
    console.error('Error fetching admin announcement:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { message, is_active } = body;

    // Ensure table exists
    await db.sql`
      CREATE TABLE IF NOT EXISTS announcements (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        message TEXT NOT NULL,
        is_active BOOLEAN DEFAULT FALSE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      );
    `;

    // Fetch the latest announcement to decide whether to update or insert
    const { rows } = await db.sql`
      SELECT id, message FROM announcements 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    const latest = rows[0];

    if (latest && latest.message === message) {
      // Message content hasn't changed, just update the status
      await db.sql`
        UPDATE announcements 
        SET is_active = ${is_active}
        WHERE id = ${latest.id}
      `;
    } else {
      // New message content (or first record), insert new history entry
      
      await db.sql`
        INSERT INTO announcements (message, is_active)
        VALUES (${message}, ${is_active})
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    await db.sql`DELETE FROM announcements WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
