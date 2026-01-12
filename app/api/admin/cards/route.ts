import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

// POST /api/admin/cards - Issue a new punch card
export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const operatorName = 
      (user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` :
      user.firstName ? user.firstName :
      user.username ? user.username :
      user.emailAddresses[0]?.emailAddress || 'Unknown Staff';

    const body = await request.json();
    const {
      code,
      initial_punches,
      card_type,
      customer_name,
      customer_phone,
      customer_email,
      child_name,
      child_birth_month,
      notes,
      valid_from
    } = body;

    if (!code || !initial_punches || !card_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isWeeklyPass = card_type.startsWith('weekly');

    const client = await db.connect();

    try {
      await client.sql`BEGIN`;

      const existingCard = await client.sql`
        SELECT id FROM punch_cards WHERE code = ${code} LIMIT 1
      `;

      if ((existingCard.rowCount ?? 0) > 0) {
        await client.sql`ROLLBACK`;
        return NextResponse.json({ error: 'Card code already exists' }, { status: 409 });
      }

      const result = await client.sql`
        INSERT INTO punch_cards (
          code, balance, initial_punches, card_type,
          customer_name, customer_phone, customer_email,
          child_name, child_birth_month, notes, status,
          valid_from, used_dates
        ) VALUES (
          ${code}, ${initial_punches}, ${initial_punches}, ${card_type},
          ${customer_name || null}, ${customer_phone || null}, ${customer_email || null},
          ${child_name || null}, ${child_birth_month || null}, ${notes || null}, 'active',
          ${isWeeklyPass ? valid_from : null}, ${isWeeklyPass ? '[]' : null}
        )
        RETURNING *
      `;

      const newCard = result.rows[0];

      // Record Audit Log
      const auditDetails = isWeeklyPass
        ? { type: card_type, from: valid_from }
        : { init: initial_punches };
      await client.sql`
        INSERT INTO audit_logs (action, performed_by, target_id, details)
        VALUES ('ISSUE', ${operatorName}, ${newCard.id}, ${JSON.stringify(auditDetails)})
      `;

      await client.sql`COMMIT`;
      return NextResponse.json(newCard);
    } catch (err) {
      await client.sql`ROLLBACK`;
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Failed to issue card:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET /api/admin/cards - Search cards
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  try {
    const client = await db.connect();
    try {
      if (query) {
        const result = await client.sql`
          SELECT * FROM punch_cards 
          WHERE code = ${query} OR customer_phone = ${query}
          ORDER BY created_at DESC
        `;
        return NextResponse.json(result.rows);
      } else {
        const result = await client.sql`
          SELECT * FROM punch_cards ORDER BY created_at DESC LIMIT 50
        `;
        return NextResponse.json(result.rows);
      }
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}