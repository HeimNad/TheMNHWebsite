import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 20;
  const offset = (page - 1) * limit;

  try {
    const client = await db.connect();
    
    try {
      // Get total count
      const countResult = await client.sql`SELECT COUNT(*) FROM audit_logs`;
      const total = Number(countResult.rows[0].count);

      // Get logs with joined card info if possible (optional, but nice)
      // For now, simple select
      const result = await client.sql`
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
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
