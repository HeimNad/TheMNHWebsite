import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Auth is handled by middleware
// GET /api/admin/cards/history?target_id=...
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetId = searchParams.get('target_id');

  if (!targetId) {
    return NextResponse.json({ error: 'Target ID required' }, { status: 400 });
  }

  try {
    const result = await db.sql`
      SELECT * FROM audit_logs
      WHERE target_id = ${targetId}
      ORDER BY created_at DESC
    `;
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
