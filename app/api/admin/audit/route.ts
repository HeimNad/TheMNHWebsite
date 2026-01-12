import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Auth is handled by middleware
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 20;
  const offset = (page - 1) * limit;

  try {
    const countResult = await db.sql`SELECT COUNT(*) FROM audit_logs`;
    const total = Number(countResult.rows[0].count);

    const result = await db.sql`
      SELECT
        a.*,
        p.code as target_code
      FROM audit_logs a
      LEFT JOIN punch_cards p ON a.target_id = p.id
      ORDER BY a.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return NextResponse.json({
      data: result.rows,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit
      }
    });
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
