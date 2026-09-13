"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { AlertModal } from "@/components/ui/alert-modal";
import { TABS, type BookingRequest, type TabKey } from "./types";
import { RequestsTable } from "./RequestsTable";
import { RequestDetailModal } from "./RequestDetailModal";

export function RequestsPageClient({
  requests,
  tab,
  counts,
}: {
  requests: BookingRequest[];
  tab: TabKey;
  counts: Record<TabKey, number>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<BookingRequest | null>(null);
  const [declineId, setDeclineId] = useState<string | null>(null);
  const [declining, setDeclining] = useState(false);
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error";
  }>({ isOpen: false, title: "", message: "", type: "success" });

  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" = "success"
  ) => setAlertState({ isOpen: true, title, message, type });

  const confirmDecline = async () => {
    if (!declineId) return;
    setDeclining(true);
    try {
      const res = await fetch(`/api/admin/bookings?id=${declineId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to decline");
      setDeclineId(null);
      setSelected(null);
      showAlert("Declined", "The request has been cancelled.");
      startTransition(() => router.refresh());
    } catch {
      setDeclineId(null);
      showAlert("Error", "Failed to decline the request.", "error");
    } finally {
      setDeclining(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Requests</h1>
          <p className="text-gray-500 text-sm mt-1">
            Party forms from the website. A request holds no slot — confirming
            it is what puts it on the calendar.
          </p>
        </div>

        <button
          type="button"
          onClick={() => startTransition(() => router.refresh())}
          disabled={isPending}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60"
        >
          <RefreshCw size={16} className={isPending ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => router.push(`/admin/requests?tab=${key}`)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === key
                ? "border-pink-500 text-pink-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {label}
            <span
              className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                tab === key
                  ? "bg-pink-100 text-pink-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      <RequestsTable requests={requests} tab={tab} onView={setSelected} />

      {selected && (
        <RequestDetailModal
          request={selected}
          readOnly={tab !== "pending"}
          onClose={() => setSelected(null)}
          onConfirmed={(message) => {
            setSelected(null);
            showAlert("Confirmed", message);
            startTransition(() => router.refresh());
          }}
          onError={(message) => showAlert("Error", message, "error")}
          onDecline={setDeclineId}
        />
      )}

      {declineId && (
        <ConfirmationModal
          isOpen
          title="Decline this request?"
          message="The booking will be cancelled and removed from this list."
          confirmLabel="Decline"
          variant="danger"
          isLoading={declining}
          onConfirm={confirmDecline}
          onCancel={() => setDeclineId(null)}
        />
      )}

      <AlertModal
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        onClose={() => setAlertState((s) => ({ ...s, isOpen: false }))}
      />
    </div>
  );
}
