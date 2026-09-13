import dayjs from "dayjs";
import { X, User, Phone, Baby, Mail, Users, Plus, UtensilsCrossed, Camera, MessageSquare, Pizza } from "lucide-react";
import type { Booking } from "./useBookingEvents";

function Row({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof User;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="text-gray-400 mt-0.5 shrink-0" size={18} />
      <div>
        <p className="font-semibold">{children}</p>
        <p className="text-gray-500">{label}</p>
      </div>
    </div>
  );
}

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
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
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
          <Row icon={User} label="Contact">
            {event.customer_name}
          </Row>
          <Row icon={Phone} label="Phone">
            <a href={`tel:${event.customer_phone}`} className="hover:underline">
              {event.customer_phone}
            </a>
          </Row>
          {event.customer_email && (
            <Row icon={Mail} label="Email">
              <a
                href={`mailto:${event.customer_email}`}
                className="text-pink-600 hover:underline break-all"
              >
                {event.customer_email}
              </a>
            </Row>
          )}
          {(event.child_name || event.child_age) && (
            <Row icon={Baby} label="Birthday Child">
              {event.child_name || "Child"} ({event.child_age || "?"})
            </Row>
          )}
          {event.child_count != null && (
            <Row icon={Users} label="Estimated children">
              {event.child_count}
            </Row>
          )}
          {!!event.add_ons?.length && (
            <Row icon={Plus} label="Add-ons">
              <span className="flex flex-wrap gap-1.5">
                {event.add_ons.map((addon) => (
                  <span
                    key={addon}
                    className="bg-pink-50 text-pink-700 border border-pink-100 rounded-full px-2 py-0.5 text-xs"
                  >
                    {addon}
                  </span>
                ))}
              </span>
            </Row>
          )}
          {!!event.food_options?.length && (
            <Row icon={UtensilsCrossed} label="Food">
              {event.food_options.join(" · ")}
            </Row>
          )}
          {(event.pizza_count || event.pizza_preference) && (
            <Row icon={Pizza} label="Pizza order">
              {event.pizza_count ?? "?"} × {event.pizza_preference ?? "?"} (large)
            </Row>
          )}
          {event.photo_permission != null && (
            <Row icon={Camera} label="Photo & video permission">
              <span
                className={
                  event.photo_permission ? "text-green-700" : "text-red-600"
                }
              >
                {event.photo_permission ? "Granted" : "Declined"}
              </span>
            </Row>
          )}
          {event.special_requests && (
            <Row icon={MessageSquare} label="Special requests">
              <span className="font-normal whitespace-pre-line">
                {event.special_requests}
              </span>
            </Row>
          )}
          {event.notes && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                Notes
              </p>
              <p className="whitespace-pre-line">{event.notes}</p>
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
