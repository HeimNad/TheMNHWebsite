import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SLING_BASE = 'https://api.getsling.com/v1';
const TZ = 'America/New_York';

type DayKey = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
type LocationHours = Record<DayKey, string>;

const EMPTY_WEEK: LocationHours = {
  Mon: 'Closed', Tue: 'Closed', Wed: 'Closed', Thu: 'Closed',
  Fri: 'Closed', Sat: 'Closed', Sun: 'Closed',
};

interface SlingShift {
  dtstart: string;
  dtend: string;
  status?: string;
}

// Returns the local date string "YYYY-MM-DD" and weekday "Mon"/"Tue"/… for a given ISO string.
function parseShiftDate(iso: string): { dateKey: string; dayKey: DayKey } {
  const d = new Date(iso);
  const dateKey = d.toLocaleDateString('en-CA', { timeZone: TZ }); // "YYYY-MM-DD"
  const dayKey = d.toLocaleDateString('en-US', { weekday: 'short', timeZone: TZ }) as DayKey;
  return { dateKey, dayKey };
}

function formatTime12(ms: number): string {
  return new Date(ms).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: TZ,
  });
}

// Merge overlapping/adjacent intervals and return the full open span (earliest→latest).
// Two intervals [a,b] and [c,d] are merged if c <= b (overlapping or touching).
function mergeToSpan(intervals: [number, number][]): [number, number] | null {
  if (intervals.length === 0) return null;
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  let min = sorted[0][0];
  let max = sorted[0][1];
  for (let i = 1; i < sorted.length; i++) {
    const [, e] = sorted[i];
    if (e > max) max = e;
  }
  return [min, max];
}

// Returns the Monday of the week containing `date` (Eastern time).
function getWeekStart(date: Date): Date {
  const localDateStr = date.toLocaleDateString('en-CA', { timeZone: TZ }); // "YYYY-MM-DD"
  const [y, m, d] = localDateStr.split('-').map(Number);
  const local = new Date(y, m - 1, d, 12, 0, 0); // noon local to avoid DST edge
  const dow = local.getDay(); // 0=Sun … 6=Sat
  const daysToMon = dow === 0 ? -6 : 1 - dow;
  local.setDate(local.getDate() + daysToMon);
  local.setHours(0, 0, 0, 0);
  return local;
}

// Fetch all published shifts for a location for the 7-day window [weekStart, weekStart+6].
// Returns a map of "YYYY-MM-DD" → list of [start_ms, end_ms] intervals.
async function fetchWeekShifts(
  locationId: string,
  token: string,
  weekStart: Date,
): Promise<Map<string, [number, number][]>> {
  const byDate = new Map<string, [number, number][]>();
  const CHUNK = 3; // Sling max 3 days per request

  for (let day = 0; day < 7; day += CHUNK) {
    const from = new Date(weekStart.getTime() + day * 86400000);
    const to   = new Date(weekStart.getTime() + Math.min(day + CHUNK - 1, 6) * 86400000);
    to.setHours(23, 59, 59, 999);

    const url = new URL(`${SLING_BASE}/reports/roster`);
    url.searchParams.set('dates', `${from.toISOString()}/${to.toISOString()}`);
    url.searchParams.set('locationIds', locationId);

    let data: unknown;
    try {
      const res = await fetch(url.toString(), { headers: { Authorization: token } });
      if (!res.ok) { console.error(`Sling ${res.status}`); continue; }
      data = await res.json();
    } catch (err) {
      console.error('Sling fetch error:', err);
      continue;
    }

    if (!Array.isArray(data)) continue;

    for (const shift of data as SlingShift[]) {
      if (shift.status && shift.status !== 'published') continue;
      const { dateKey } = parseShiftDate(shift.dtstart);
      const start = new Date(shift.dtstart).getTime();
      const end   = new Date(shift.dtend).getTime();
      if (!byDate.has(dateKey)) byDate.set(dateKey, []);
      byDate.get(dateKey)!.push([start, end]);
    }
  }

  return byDate;
}

// Build Mon–Sun hours directly from this week's shift data.
// Days with no shifts → "Closed". No historical fallback.
function buildWeekHours(byDate: Map<string, [number, number][]>): LocationHours {
  const result: LocationHours = { ...EMPTY_WEEK };

  for (const [dateKey, intervals] of byDate.entries()) {
    const { dayKey } = parseShiftDate(`${dateKey}T12:00:00Z`);
    const span = mergeToSpan(intervals);
    if (span) {
      result[dayKey] = `${formatTime12(span[0])} - ${formatTime12(span[1])}`;
    }
  }

  return result;
}

// POST /api/admin/settings/sync-sling
export async function POST() {
  const token     = process.env.SLING_API_TOKEN;
  const samaneaId = process.env.SLING_SAMANEA_GROUP_ID;
  const broadwayId = process.env.SLING_BROADWAY_GROUP_ID;

  if (!token) {
    return NextResponse.json({ error: 'SLING_API_TOKEN not configured' }, { status: 503 });
  }

  const weekStart = getWeekStart(new Date());

  const [samaneaByDate, broadwayByDate] = await Promise.all([
    samaneaId  ? fetchWeekShifts(samaneaId,  token, weekStart) : Promise.resolve(new Map()),
    broadwayId ? fetchWeekShifts(broadwayId, token, weekStart) : Promise.resolve(new Map()),
  ]);

  const hours = {
    samanea:  buildWeekHours(samaneaByDate),
    broadway: buildWeekHours(broadwayByDate),
  };

  await db.sql`
    INSERT INTO settings (key, value, updated_at)
    VALUES ('business_hours', ${JSON.stringify(hours)}, NOW())
    ON CONFLICT (key)
    DO UPDATE SET value = ${JSON.stringify(hours)}, updated_at = NOW()
  `;

  return NextResponse.json({ success: true, hours });
}
