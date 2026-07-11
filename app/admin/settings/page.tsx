import { db } from "@/lib/db";
import { SettingsPageClient } from "./SettingsPageClient";
import type { BusinessHours } from "./types";

export const dynamic = "force-dynamic";

const DEFAULT_HOURS: BusinessHours = {
  samanea: {
    Mon: "Closed",
    Tue: "Closed",
    Wed: "Closed",
    Thu: "Closed",
    Fri: "3:00 PM - 9:00 PM",
    Sat: "11:00 AM - 8:00 PM",
    Sun: "11:00 AM - 8:00 PM",
  },
  broadway: {
    Mon: "3:00 PM - 8:00 PM",
    Tue: "3:00 PM - 8:00 PM",
    Wed: "3:00 PM - 8:00 PM",
    Thu: "3:00 PM - 8:00 PM",
    Fri: "3:00 PM - 8:00 PM",
    Sat: "11:00 AM - 8:00 PM",
    Sun: "12:00 AM - 7:00 PM",
  },
};

async function getBusinessHours(): Promise<BusinessHours> {
  try {
    const result = await db.sql`
      SELECT value FROM settings WHERE key = 'business_hours'
    `;
    if ((result.rowCount ?? 0) === 0) return DEFAULT_HOURS;
    return result.rows[0].value as BusinessHours;
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return DEFAULT_HOURS;
  }
}

export default async function SettingsPage() {
  const hours = await getBusinessHours();

  return <SettingsPageClient initialHours={hours} />;
}
