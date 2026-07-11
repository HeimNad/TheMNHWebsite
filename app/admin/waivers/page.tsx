import { db } from "@/lib/db";
import type { Waiver } from "./types";
import { WaiversPageClient } from "./WaiversPageClient";

export const dynamic = "force-dynamic";

const DEFAULT_PAGE_SIZE = 10;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
}) {
  const { page: pageParam, limit: limitParam, search: searchParam } =
    await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);
  const pageSize = Math.min(Number(limitParam) || DEFAULT_PAGE_SIZE, 100);
  const search = searchParam || "";
  const offset = (currentPage - 1) * pageSize;

  let totalItems: number;
  let waivers: Waiver[];

  if (search) {
    const searchPattern = `%${search}%`;
    const [countResult, result] = await Promise.all([
      db.sql`
        SELECT COUNT(*) FROM waivers
        WHERE name ILIKE ${searchPattern}
      `,
      db.sql`
        SELECT * FROM waivers
        WHERE name ILIKE ${searchPattern}
        ORDER BY created_at DESC
        LIMIT ${pageSize} OFFSET ${offset}
      `,
    ]);
    totalItems = Number(countResult.rows[0].count);
    waivers = result.rows as Waiver[];
  } else {
    const [countResult, result] = await Promise.all([
      db.sql`SELECT COUNT(*) FROM waivers`,
      db.sql`
        SELECT * FROM waivers
        ORDER BY created_at DESC
        LIMIT ${pageSize} OFFSET ${offset}
      `,
    ]);
    totalItems = Number(countResult.rows[0].count);
    waivers = result.rows as Waiver[];
  }

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <WaiversPageClient
      waivers={waivers}
      currentPage={currentPage}
      pageSize={pageSize}
      totalItems={totalItems}
      totalPages={totalPages}
      search={search}
    />
  );
}
