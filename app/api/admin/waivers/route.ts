import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    let total;
    let rows;

    if (search) {
      // Search mode
      const searchPattern = `%${search}%`;
      const countResult = await db.sql`
        SELECT COUNT(*) FROM waivers 
        WHERE name ILIKE ${searchPattern}
      `;
      total = Number(countResult.rows[0].count);

      const result = await db.sql`
        SELECT * FROM waivers 
        WHERE name ILIKE ${searchPattern}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      rows = result.rows;
    } else {
      // Default mode
      const countResult = await db.sql`SELECT COUNT(*) FROM waivers`;
      total = Number(countResult.rows[0].count);

      const result = await db.sql`
        SELECT * FROM waivers 
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      rows = result.rows;
    }

    return NextResponse.json({
      data: rows,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching waivers:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
