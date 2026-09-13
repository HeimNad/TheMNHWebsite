import { db } from "@/lib/db";
import { TABS, type BookingRequest, type TabKey } from "./types";
import { RequestsPageClient } from "./RequestsPageClient";

export const dynamic = "force-dynamic";

const STATUS_BY_TAB: Record<TabKey, string> = {
  pending: "pending",
  confirmed: "confirmed",
  declined: "cancelled",
};

export default async function BookingRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: tabParam } = await searchParams;
  const tab = (TABS.find((t) => t.key === tabParam)?.key ?? "pending") as TabKey;
  const status = STATUS_BY_TAB[tab];

  // Pending requests read best oldest-first (act on them); history newest-first.
  const [result, countsResult] = await Promise.all([
    tab === "pending"
      ? db.sql`
          SELECT * FROM bookings
          WHERE source = 'website' AND status = ${status}
          ORDER BY start_time ASC
        `
      : db.sql`
          SELECT * FROM bookings
          WHERE source = 'website' AND status = ${status}
          ORDER BY start_time DESC
          LIMIT 100
        `,
    db.sql`
      SELECT status, COUNT(*) AS count FROM bookings
      WHERE source = 'website'
      GROUP BY status
    `,
  ]);

  const byStatus = Object.fromEntries(
    countsResult.rows.map((row) => [row.status, Number(row.count)])
  );

  return (
    <RequestsPageClient
      requests={result.rows as BookingRequest[]}
      tab={tab}
      counts={{
        pending: byStatus.pending ?? 0,
        confirmed: byStatus.confirmed ?? 0,
        declined: byStatus.cancelled ?? 0,
      }}
    />
  );
}
