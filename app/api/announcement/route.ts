import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch the latest active announcement
    // We check if the table exists first to avoid 500 errors on fresh installs
    // Ideally, this check shouldn't be here every time, but for safety in this env:
    
    const { rows } = await db.sql`
      SELECT message, is_active FROM announcements 
      WHERE is_active = true 
      ORDER BY created_at DESC 
      LIMIT 1
    `;

    return NextResponse.json(rows[0] || null);
  } catch (error: any) {
    // If table doesn't exist, return null gracefully
    if (error.code === '42P01') { // Postgres "undefined_table" code
        return NextResponse.json(null);
    }
    console.error('Error fetching announcement:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
