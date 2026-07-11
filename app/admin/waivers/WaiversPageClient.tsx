"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import SignatureCanvas from "react-signature-canvas";
import { RefreshCw } from "lucide-react";
import { SearchBox } from "@/components/ui/search-box";
import type { Waiver } from "./types";
import { downloadWaiverPdf } from "./downloadWaiverPdf";
import { WaiversTable } from "./WaiversTable";
import { WaiverDetailModal } from "./WaiverDetailModal";

export function WaiversPageClient({
  waivers,
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  search,
}: {
  waivers: Waiver[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  search: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedWaiver, setSelectedWaiver] = useState<Waiver | null>(null);
  const pdfSigCanvasRef = useRef<SignatureCanvas>(null);

  const navigate = (params: { page?: number; limit?: number; search?: string }) => {
    const query = new URLSearchParams();
    query.set("page", String(params.page ?? currentPage));
    query.set("limit", String(params.limit ?? pageSize));
    const nextSearch = params.search ?? search;
    if (nextSearch) query.set("search", nextSearch);
    router.push(`/admin/waivers?${query.toString()}`);
  };

  return (
    <div>
      {/* Hidden Canvas for PDF Generation */}
      <div
        style={{
          position: "absolute",
          top: "-10000px",
          left: "-10000px",
          visibility: "hidden",
        }}
      >
        <SignatureCanvas
          ref={pdfSigCanvasRef}
          penColor="#000000"
          canvasProps={{ width: 600, height: 300 }}
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Waivers</h1>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <SearchBox
            key={search}
            initialValue={search}
            placeholder="Search by name..."
            onSearch={(value) => navigate({ page: 1, search: value })}
          />

          <button
            type="button"
            onClick={() => startTransition(() => router.refresh())}
            aria-label="Refresh data"
            className="p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-pink-500"
            title="Refresh data"
            disabled={isPending}
          >
            <RefreshCw size={20} className={isPending ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <WaiversTable
        waivers={waivers}
        loading={isPending}
        onView={setSelectedWaiver}
        onDownloadPdf={(waiver) => downloadWaiverPdf(waiver, pdfSigCanvasRef)}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={(page) => navigate({ page })}
        onPageSizeChange={(limit) => navigate({ page: 1, limit })}
      />

      {/* Waiver Details Modal */}
      {selectedWaiver && (
        <WaiverDetailModal
          waiver={selectedWaiver}
          onClose={() => setSelectedWaiver(null)}
        />
      )}
    </div>
  );
}
