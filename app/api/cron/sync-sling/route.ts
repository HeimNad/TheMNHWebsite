import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Vercel automatically injects CRON_SECRET and sends it as
// "Authorization: Bearer <secret>" on every scheduled invocation.
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Delegate to the existing manual-sync handler
  const origin = new URL(request.url).origin;
  const res = await fetch(`${origin}/api/admin/settings/sync-sling`, {
    method: 'POST',
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
