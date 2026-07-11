"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { SearchBox } from "@/components/ui/search-box";
import type { Message } from "./types";
import { MessagesTable } from "./MessagesTable";
import { MessageDetailModal } from "./MessageDetailModal";

export function MessagesPageClient({
  messages,
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  search,
}: {
  messages: Message[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  search: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showIgnored, setShowIgnored] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const navigate = (params: { page?: number; limit?: number; search?: string }) => {
    const query = new URLSearchParams();
    query.set("page", String(params.page ?? currentPage));
    query.set("limit", String(params.limit ?? pageSize));
    const nextSearch = params.search ?? search;
    if (nextSearch) query.set("search", nextSearch);
    router.push(`/admin/messages?${query.toString()}`);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus as any });
      }
      startTransition(() => router.refresh());
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredMessages = messages.filter((msg) =>
    showIgnored ? true : msg.status !== "ignored"
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showIgnored}
              onChange={(e) => setShowIgnored(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Show Ignored</span>
          </label>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <SearchBox
            key={search}
            initialValue={search}
            placeholder="Search name or email..."
            onSearch={(value) => navigate({ page: 1, search: value })}
            ringColorClass="focus:ring-blue-500"
            iconColorClass="hover:text-blue-600"
          />

          <button
            type="button"
            onClick={() => startTransition(() => router.refresh())}
            aria-label="Refresh data"
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Refresh data"
            disabled={isPending}
          >
            <RefreshCw size={20} className={isPending ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <MessagesTable
        messages={filteredMessages}
        hasResults={messages.length > 0}
        loading={isPending}
        onView={(msg) => {
          setSelectedMessage(msg);
          if (msg.status === "unread") updateStatus(msg.id, "read");
        }}
        onStatusChange={updateStatus}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={(page) => navigate({ page })}
        onPageSizeChange={(limit) => navigate({ page: 1, limit })}
      />

      {/* Message Modal */}
      {selectedMessage && (
        <MessageDetailModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onStatusChange={updateStatus}
        />
      )}
    </div>
  );
}
