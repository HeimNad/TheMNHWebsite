"use client";

import { useRouter } from "next/navigation";
import { Pagination } from "@/components/ui/pagination-control";

export function AuditPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
}: {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}) {
  const router = useRouter();

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      pageSize={pageSize}
      totalItems={totalItems}
      onPageChange={(page) => router.push(`/admin/audit?page=${page}`)}
      onPageSizeChange={() => {}} // Fixed page size for now
    />
  );
}
