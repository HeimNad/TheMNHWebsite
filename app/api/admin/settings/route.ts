import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Auth is handled by middleware
// GET /api/admin/settings?key=business_hours
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: 'Key required' }, { status: 400 });
  }

  try {
    const client = await db.connect();
    try {
      const result = await client.sql`
        SELECT value FROM settings WHERE key = ${key}
      `;
      
      if ((result.rowCount ?? 0) === 0) {
        return NextResponse.json(null); // No setting found
      }
      
      return NextResponse.json(result.rows[0].value);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/admin/settings
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || !value) {
      return NextResponse.json({ error: 'Key and Value required' }, { status: 400 });
    }

    const client = await db.connect();
    try {
      // Upsert (Insert or Update)
      await client.sql`
        INSERT INTO settings (key, value, updated_at)
        VALUES (${key}, ${JSON.stringify(value)}, NOW())
        ON CONFLICT (key) 
        DO UPDATE SET value = ${JSON.stringify(value)}, updated_at = NOW();
      `;
      
      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Failed to save settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
