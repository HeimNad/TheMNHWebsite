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

      const isWeeklyPass = card.card_type.startsWith('weekly');
      const isMonthlyPass = card.card_type.startsWith('monthly');
      const isTimeBased = isWeeklyPass || isMonthlyPass;
      const passDuration = isMonthlyPass ? 29 : 6; // 30 days or 7 days (0-indexed)
      const newBalance = card.balance - 1;
      let auditDetails: Record<string, unknown> = { balance: newBalance };

      if (isTimeBased) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split('T')[0];

        // Check if this is first activation (no valid_from set)
        if (!card.valid_from) {
          // Activate the pass - only set start date, don't redeem yet
          const updateResult = await client.sql`
            UPDATE punch_cards
            SET valid_from = ${todayStr}, updated_at = NOW()
            WHERE id = ${id}
            RETURNING *
          `;

          // Record Audit Log
          await client.sql`
            INSERT INTO audit_logs (action, performed_by, target_id, details)
            VALUES ('ACTIVATE', ${operatorName}, ${id}, ${JSON.stringify({ from: todayStr })})
          `;

          await client.sql`COMMIT`;
          return NextResponse.json({ ...updateResult.rows[0], activated: true });
        }

        // Already activated - normal redemption
        const validFrom = new Date(card.valid_from);
        validFrom.setHours(0, 0, 0, 0);
        const validUntil = new Date(validFrom);
        validUntil.setDate(validUntil.getDate() + passDuration);

        // Check if within valid period
        if (today < validFrom || today > validUntil) {
          await client.sql`ROLLBACK`;
          return NextResponse.json({ error: 'Pass has expired' }, { status: 400 });
        }

        // Calculate day offset
        const dayOffset = Math.floor((today.getTime() - validFrom.getTime()) / (1000 * 60 * 60 * 24));
        const usedDates: number[] = card.used_dates || [];

        // Check if today already used
        if (usedDates.includes(dayOffset)) {
          await client.sql`ROLLBACK`;
          return NextResponse.json({ error: 'Already redeemed today' }, { status: 400 });
        }

        // Add today to used dates
        usedDates.push(dayOffset);
        auditDetails = { balance: newBalance, day: dayOffset };

        const newStatus = newBalance === 0 ? 'completed' : 'active';
        const updateResult = await client.sql`
          UPDATE punch_cards
          SET balance = ${newBalance}, status = ${newStatus}, last_used_at = NOW(), updated_at = NOW(),
              used_dates = ${JSON.stringify(usedDates)}
          WHERE id = ${id}
          RETURNING *
        `;

        // Record Audit Log
        await client.sql`
          INSERT INTO audit_logs (action, performed_by, target_id, details)
          VALUES ('REDEEM', ${operatorName}, ${id}, ${JSON.stringify(auditDetails)})
        `;

        await client.sql`COMMIT`;
        return NextResponse.json(updateResult.rows[0]);
      }

      // Regular punch card logic
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
        VALUES ('REDEEM', ${operatorName}, ${id}, ${JSON.stringify(auditDetails)})
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