"use client";

import { useState } from "react";
import dayjs from "dayjs";
import {
  Baby,
  CalendarClock,
  Camera,
  Mail,
  MessageSquare,
  Phone,
  Pizza,
  Plus,
  User,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import type { BookingRequest } from "./types";

function Detail({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof User;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="text-gray-400 mt-0.5 shrink-0" size={16} />
      <div className="min-w-0">
        <p className="text-gray-900 font-medium break-words">{children}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export function RequestDetailModal({
  request,
  readOnly,
  onClose,
  onConfirmed,
  onError,
  onDecline,
}: {
  request: BookingRequest;
  readOnly: boolean;
  onClose: () => void;
  onConfirmed: (message: string) => void;
  onError: (message: string) => void;
  onDecline: (id: string) => void;
}) {
  // Staff often agree a different slot on the phone, so the requested time is
  // editable here; the party keeps its original length.
  const [date, setDate] = useState(dayjs(request.start_time).format("YYYY-MM-DD"));
  const [time, setTime] = useState(dayjs(request.start_time).format("HH:mm"));
  const [saving, setSaving] = useState(false);

  const durationMinutes = dayjs(request.end_time).diff(request.start_time, "minute");
  const start = dayjs(`${date} ${time}`);
  const moved = start.isValid() && !start.isSame(dayjs(request.start_time));

  const confirm = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/bookings?id=${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_time: start.toISOString(),
          end_time: start.add(durationMinutes, "minute").toISOString(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to confirm");
      onConfirmed(
        `${request.customer_name}'s party is confirmed for ${start.format(
          "MMM D, h:mm A"
        )}.`
      );
    } catch (error) {
      onError(
        error instanceof Error ? error.message : "Failed to confirm booking."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <h3 className="text-xl font-bold text-gray-900 mb-1 pr-8">
          {request.package_type || "Party Booking"}
          {readOnly ? (
            <span className="ml-2 align-middle text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full">
              Handled
            </span>
          ) : (
            <span className="ml-2 align-middle text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
              Awaiting deposit
            </span>
          )}
        </h3>
        <p className="text-pink-600 font-medium mb-6">
          {readOnly ? "Party" : "Requested"}:{" "}
          {dayjs(request.start_time).format("dddd, MMM D, YYYY")} ·{" "}
          {dayjs(request.start_time).format("h:mm A")} –{" "}
          {dayjs(request.end_time).format("h:mm A")}
        </p>

        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <Detail icon={User} label="Parent">
            {request.customer_name}
          </Detail>
          <Detail icon={Phone} label="Phone">
            <a href={`tel:${request.customer_phone}`} className="hover:underline">
              {request.customer_phone}
            </a>
          </Detail>
          {request.customer_email && (
            <Detail icon={Mail} label="Email">
              <a
                href={`mailto:${request.customer_email}`}
                className="text-pink-600 hover:underline break-all"
              >
                {request.customer_email}
              </a>
            </Detail>
          )}
          {(request.child_name || request.child_age) && (
            <Detail icon={Baby} label="Birthday child">
              {request.child_name || "Child"} ({request.child_age || "?"})
            </Detail>
          )}
          {request.child_count != null && (
            <Detail icon={Users} label="Estimated children">
              {request.child_count}
            </Detail>
          )}
          {!!request.add_ons?.length && (
            <Detail icon={Plus} label="Add-ons">
              {request.add_ons.join(", ")}
            </Detail>
          )}
          {!!request.food_options?.length && (
            <Detail icon={UtensilsCrossed} label="Food">
              {request.food_options.join(" · ")}
            </Detail>
          )}
          {(request.pizza_count || request.pizza_preference) && (
            <Detail icon={Pizza} label="Pizza order">
              {request.pizza_count ?? "?"} × {request.pizza_preference ?? "?"}{" "}
              (large)
            </Detail>
          )}
          {request.photo_permission != null && (
            <Detail icon={Camera} label="Photo & video permission">
              <span
                className={
                  request.photo_permission ? "text-green-700" : "text-red-600"
                }
              >
                {request.photo_permission ? "Granted" : "Declined"}
              </span>
            </Detail>
          )}
          {request.special_requests && (
            <div className="sm:col-span-2">
              <Detail icon={MessageSquare} label="Special requests">
                <span className="font-normal whitespace-pre-line">
                  {request.special_requests}
                </span>
              </Detail>
            </div>
          )}
        </div>

        {readOnly ? (
          <div className="mt-6 flex">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-900 font-medium py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                <CalendarClock size={14} /> Slot to confirm
                {moved && (
                  <span className="text-amber-600 normal-case font-medium">
                    (moved from{" "}
                    {dayjs(request.start_time).format("MMM D, h:mm A")})
                  </span>
                )}
              </p>
              <div className="flex flex-wrap items-end gap-3">
                <label className="text-sm">
                  <span className="block text-gray-500 mb-1">Date</span>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 outline-none"
                  />
                </label>
                <label className="text-sm">
                  <span className="block text-gray-500 mb-1">Start</span>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 outline-none"
                  />
                </label>
                <p className="text-sm text-gray-500 pb-2.5">
                  Ends{" "}
                  {start.isValid()
                    ? start.add(durationMinutes, "minute").format("h:mm A")
                    : "--"}{" "}
                  ({durationMinutes} min)
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={confirm}
                disabled={saving || !start.isValid()}
                className="flex-1 min-w-[14rem] bg-green-600 text-white font-medium py-2.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
              >
                {saving ? "Confirming..." : "Deposit received — confirm"}
              </button>
              <button
                type="button"
                onClick={() => onDecline(request.id)}
                className="flex-1 bg-red-50 text-red-600 font-medium py-2.5 rounded-lg hover:bg-red-100 transition-colors"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-900 font-medium py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
