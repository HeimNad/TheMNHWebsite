import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

// POST /api/admin/cards/redeem - Redeem a ride
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
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
    }

    const client = await db.connect();

    try {
      await client.sql`BEGIN`;

      const cardResult = await client.sql`
        SELECT * FROM punch_cards WHERE id = ${id} FOR UPDATE
      `;

      if ((cardResult.rowCount ?? 0) === 0) {
        await client.sql`ROLLBACK`;
        return NextResponse.json({ error: 'Card not found' }, { status: 404 });
      }

      const card = cardResult.rows[0];

      if (card.status !== 'active' || card.balance <= 0) {
        await client.sql`ROLLBACK`;
        return NextResponse.json({ error: 'Card is not active or has no balance' }, { status: 400 });
      }

      const newBalance = card.balance - 1;
      const newStatus = newBalance === 0 ? 'completed' : 'active';

      const updateResult = await client.sql`
        UPDATE punch_cards 
        SET balance = ${newBalance}, status = ${newStatus}, last_used_at = NOW(), updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;

      // Record Audit Log
      await client.sql`
        INSERT INTO audit_logs (action, performed_by, target_id, details)
        VALUES ('REDEEM', ${operatorName}, ${id}, ${JSON.stringify({ 
          balance: newBalance 
        })})
      `;

      await client.sql`COMMIT`;
      return NextResponse.json(updateResult.rows[0]);
    } catch (err) {
      await client.sql`ROLLBACK`;
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Failed to redeem card:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}