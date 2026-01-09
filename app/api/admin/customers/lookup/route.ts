import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/admin/customers/lookup?phone=...
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');

  if (!phone) {
    return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
  }

  try {
    const client = await db.connect();
    try {
      // Search in punch_cards (most reliable for member info)
      // We order by created_at DESC to get the latest info
      const cardResult = await client.sql`
        SELECT customer_name, child_name, child_birth_month 
        FROM punch_cards 
        WHERE customer_phone = ${phone} 
        ORDER BY created_at DESC 
        LIMIT 1
      `;

      if (cardResult.rowCount && cardResult.rowCount > 0) {
        return NextResponse.json(cardResult.rows[0]);
      }

      // Fallback: Search in bookings
      const bookingResult = await client.sql`
        SELECT customer_name, child_name, child_age 
        FROM bookings 
        WHERE customer_phone = ${phone} 
        ORDER BY created_at DESC 
        LIMIT 1
      `;

      if (bookingResult.rowCount && bookingResult.rowCount > 0) {
        // Map booking fields to standard format (child_age -> child_birth_month might be tricky, just return what we have)
        return NextResponse.json({
          customer_name: bookingResult.rows[0].customer_name,
          child_name: bookingResult.rows[0].child_name,
          child_birth_month: null // Bookings store age, not DOB usually
        });
      }

      return NextResponse.json(null); // Not found
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Failed to lookup customer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
