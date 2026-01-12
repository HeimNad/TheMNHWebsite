import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Auth is handled by middleware
// GET /api/admin/bookings?start=...&end=...
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  if (!start || !end) {
    return NextResponse.json({ error: 'Start and End dates required' }, { status: 400 });
  }

  try {
    const client = await db.connect();
    try {
      const result = await client.sql`
        SELECT * FROM bookings 
        WHERE start_time >= ${start} AND end_time <= ${end}
        AND status != 'cancelled'
        ORDER BY start_time ASC
      `;
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/admin/bookings
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      start_time, end_time, 
      customer_name, customer_phone, child_name, child_age, 
      package_type, deposit_amount, notes 
    } = body;

    if (!start_time || !end_time || !customer_name || !customer_phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const start = new Date(start_time);
    const end = new Date(end_time);

    if (start >= end) {
      return NextResponse.json({ error: 'Start time must be before end time' }, { status: 400 });
    }

    const client = await db.connect();

    try {
      // Check for conflicts
      const conflictCheck = await client.sql`
        SELECT id FROM bookings 
        WHERE status != 'cancelled'
          AND (
            (start_time < ${end.toISOString()} AND end_time > ${start.toISOString()})
          )
      `;

      if ((conflictCheck.rowCount ?? 0) > 0) {
        return NextResponse.json({ error: 'Time slot overlaps with an existing booking' }, { status: 409 });
      }

      // Create booking
      const result = await client.sql`
        INSERT INTO bookings (
          start_time, end_time, customer_name, customer_phone, 
          child_name, child_age, package_type, deposit_amount, notes, status
        ) VALUES (
          ${start.toISOString()}, ${end.toISOString()}, ${customer_name}, ${customer_phone},
          ${child_name || null}, ${child_age || null}, 
          ${package_type || 'Standard'}, ${deposit_amount || 0}, ${notes || null}, 'confirmed'
        )
        RETURNING *
      `;

      return NextResponse.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Failed to create booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/admin/bookings?id=... (Actually PATCH to cancelled)
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  try {
    const client = await db.connect();
    try {
      await client.sql`
        UPDATE bookings SET status = 'cancelled' WHERE id = ${id}
      `;
      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to cancel' }, { status: 500 });
  }
}
