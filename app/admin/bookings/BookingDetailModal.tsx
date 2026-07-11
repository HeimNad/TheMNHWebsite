import dayjs from "dayjs";
import { X, User, Phone, Baby } from "lucide-react";
import type { Booking } from "./useBookingEvents";

export function BookingDetailModal({
  event,
  onClose,
  onCancel,
}: {
  event: Booking;
  onClose: () => void;
  onCancel: (id: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <h3 className="text-xl font-bold text-gray-900 mb-1">
          {event.package_type || "Party Booking"}
        </h3>
        <p className="text-pink-600 font-medium mb-6">
          {dayjs(event.start).format("MMM D, YYYY")} •{" "}
          {dayjs(event.start).format("h:mm A")} -{" "}
          {dayjs(event.end).format("h:mm A")}
        </p>

        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex items-start gap-3">
            <User className="text-gray-400 mt-0.5" size={18} />
            <div>
              <p className="font-semibold">{event.customer_name}</p>
              <p className="text-gray-500">Contact</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="text-gray-400 mt-0.5" size={18} />
            <div>
              <p className="font-semibold">{event.customer_phone}</p>
              <p className="text-gray-500">Phone</p>
            </div>
          </div>
          {(event.child_name || event.child_age) && (
            <div className="flex items-start gap-3">
              <Baby className="text-gray-400 mt-0.5" size={18} />
              <div>
                <p className="font-semibold">
                  {event.child_name || "Child"} ({event.child_age || "?"})
                </p>
                <p className="text-gray-500">Birthday Child</p>
              </div>
            </div>
          )}
          {event.notes && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                Notes
              </p>
              <p>{event.notes}</p>
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={() => onCancel(event.id)}
            className="flex-1 bg-red-50 text-red-600 font-medium py-2.5 rounded-lg hover:bg-red-100 transition-colors"
          >
            Cancel Booking
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-900 font-medium py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
