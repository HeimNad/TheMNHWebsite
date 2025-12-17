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
      const searchPattern = `%${search}%`;
      
      const countResult = await db.sql`
        SELECT COUNT(*) FROM messages 
        WHERE first_name ILIKE ${searchPattern} 
           OR last_name ILIKE ${searchPattern} 
           OR email ILIKE ${searchPattern}
      `;
      total = Number(countResult.rows[0].count);

      const result = await db.sql`
        SELECT * FROM messages 
        WHERE first_name ILIKE ${searchPattern} 
           OR last_name ILIKE ${searchPattern} 
           OR email ILIKE ${searchPattern}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      rows = result.rows;
    } else {
      const countResult = await db.sql`SELECT COUNT(*) FROM messages`;
      total = Number(countResult.rows[0].count);

      const result = await db.sql`
        SELECT * FROM messages 
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
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await db.sql`
      UPDATE messages
      SET status = ${status}
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
