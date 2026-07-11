import { db } from "@/lib/db";
import type { Announcement } from "./types";
import { AnnouncementsPageClient } from "./AnnouncementsPageClient";

export const dynamic = "force-dynamic";

async function getAnnouncementData(): Promise<{
  current: { message: string; is_active: boolean };
  history: Announcement[];
}> {
  try {
    const [currentResult, historyResult] = await Promise.all([
      db.sql`SELECT message, is_active FROM announcements ORDER BY created_at DESC LIMIT 1`,
      db.sql`SELECT * FROM announcements ORDER BY created_at DESC LIMIT 10`,
    ]);
    return {
      current: (currentResult.rows[0] as { message: string; is_active: boolean }) || {
        message: "",
        is_active: false,
      },
      history: historyResult.rows as Announcement[],
    };
  } catch (error: any) {
    // Table may not exist yet on a fresh install
    if (error.code === "42P01") {
      return { current: { message: "", is_active: false }, history: [] };
    }
    throw error;
  }
}

export default async function AnnouncementsPage() {
  const { current, history } = await getAnnouncementData();

  return (
    <AnnouncementsPageClient
      key={`${current.message}::${current.is_active}`}
      initialMessage={current.message}
      initialIsActive={current.is_active}
      history={history}
    />
  );
}
