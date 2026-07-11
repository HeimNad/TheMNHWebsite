import { db } from "@/lib/db";
import type { Message } from "./types";
import { MessagesPageClient } from "./MessagesPageClient";

export const dynamic = "force-dynamic";

const DEFAULT_PAGE_SIZE = 10;

export default async function MessagesPage({
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
  let messages: Message[];

  if (search) {
    const searchPattern = `%${search}%`;

    const [countResult, result] = await Promise.all([
      db.sql`
        SELECT COUNT(*) FROM messages
        WHERE first_name ILIKE ${searchPattern}
           OR last_name ILIKE ${searchPattern}
           OR email ILIKE ${searchPattern}
      `,
      db.sql`
        SELECT * FROM messages
        WHERE first_name ILIKE ${searchPattern}
           OR last_name ILIKE ${searchPattern}
           OR email ILIKE ${searchPattern}
        ORDER BY created_at DESC
        LIMIT ${pageSize} OFFSET ${offset}
      `,
    ]);
    totalItems = Number(countResult.rows[0].count);
    messages = result.rows as Message[];
  } else {
    const [countResult, result] = await Promise.all([
      db.sql`SELECT COUNT(*) FROM messages`,
      db.sql`
        SELECT * FROM messages
        ORDER BY created_at DESC
        LIMIT ${pageSize} OFFSET ${offset}
      `,
    ]);
    totalItems = Number(countResult.rows[0].count);
    messages = result.rows as Message[];
  }

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <MessagesPageClient
      messages={messages}
      currentPage={currentPage}
      pageSize={pageSize}
      totalItems={totalItems}
      totalPages={totalPages}
      search={search}
    />
  );
}
