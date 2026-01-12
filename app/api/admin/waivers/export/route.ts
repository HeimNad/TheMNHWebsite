import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Auth is handled by middleware
export async function GET() {
  try {
    const { rows } = await db.sql`
      SELECT name, child_name, date, location, created_at
      FROM waivers
      ORDER BY created_at DESC
    `;

    // CSV Header
    const csvHeader = 'Name,Child Name,Date on Waiver,Location,Timestamp\n';

    // CSV Rows
    const csvRows = rows.map(row => {
      // Helper to escape CSV fields
      const escape = (field: any) => {
        if (field === null || field === undefined) return '';
        const stringField = String(field);
        // If field contains comma, quote, or newline, wrap in quotes and escape quotes
        if (stringField.search(/("|,|\n)/g) >= 0) {
          return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
      };

      const name = escape(row.name);
      const childName = escape(row.child_name);
      // Format dates nicely
      const date = row.date ? escape(new Date(row.date).toLocaleDateString()) : '';
      const location = escape(row.location);
      const createdAt = row.created_at ? escape(new Date(row.created_at).toLocaleString()) : '';

      return `${name},${childName},${date},${location},${createdAt}`;
    }).join('\n');

    const csvContent = csvHeader + csvRows;

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="waivers_export_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting waivers:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
