import { X, CreditCard, Calendar, Clock } from "lucide-react";
import type { Card } from "./types";

export function CardDetailModal({
  card,
  onClose,
}: {
  card: Card;
  onClose: () => void;
}) {
  const isTimeBased =
    card.card_type.startsWith("weekly") || card.card_type.startsWith("monthly");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-in zoom-in-95 flex flex-col">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="mb-6 border-b border-gray-100 pb-4 shrink-0">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="text-pink-600" size={24} />
            Card Details
          </h3>
        </div>

        <div className="space-y-6 overflow-y-auto pr-2 flex-1 custom-scrollbar">
          <div
            className={`p-4 rounded-xl border flex justify-between items-center ${
              isTimeBased
                ? "bg-indigo-50 border-indigo-100"
                : "bg-gray-50 border-gray-100"
            }`}
          >
            <div>
              <span className="block text-xs text-gray-500 uppercase font-semibold">
                Card Code
              </span>
              <span className="text-3xl font-mono font-bold text-gray-900 tracking-wider">
                {card.code}
              </span>
            </div>
            <div className="text-right">
              <span
                className={`block text-3xl font-bold ${
                  isTimeBased ? "text-indigo-600" : "text-pink-600"
                }`}
              >
                {card.balance}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                / {card.initial_punches} {isTimeBased ? "Days" : "Rides"}
              </span>
            </div>
          </div>

          {/* Time-Based Pass Period */}
          {isTimeBased &&
            (card.valid_from ? (
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                <span className="block text-xs text-indigo-600 uppercase font-semibold mb-2">
                  Valid Period
                </span>
                <div className="flex items-center gap-2 text-indigo-900 font-medium">
                  <Calendar size={16} />
                  <span>
                    {new Date(card.valid_from).toLocaleDateString()} →{" "}
                    {new Date(
                      new Date(card.valid_from).getTime() +
                        (card.card_type.startsWith("monthly") ? 29 : 6) *
                          24 *
                          60 *
                          60 *
                          1000
                    ).toLocaleDateString()}
                  </span>
                </div>
                {card.used_dates && card.used_dates.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-indigo-200">
                    <span className="block text-xs text-indigo-600 mb-2">
                      Days Used: {card.used_dates.length} / {card.initial_punches}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-amber-700 font-medium">
                  <Clock size={16} />
                  <span>Not Activated</span>
                </div>
                <p className="text-xs text-amber-600 mt-2">
                  The {card.card_type.startsWith("monthly") ? "30" : "7"}-day
                  period will start when this card is first used.
                </p>
              </div>
            ))}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-xs text-gray-500 uppercase font-semibold mb-1">
                Status
              </span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${
                  card.status === "active"
                    ? "bg-green-100 text-green-700"
                    : card.status === "completed"
                    ? "bg-gray-200 text-gray-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {card.status}
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 uppercase font-semibold mb-1">
                Type
              </span>
              <span className="text-gray-900 font-medium">
                {card.card_type === "weekly_7"
                  ? "WEEKLY PASS"
                  : card.card_type === "monthly_30"
                  ? "MONTHLY PASS"
                  : card.card_type.replace(/_/g, " ").toUpperCase()}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-1">
              Member Info
            </h4>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-xs text-gray-500 uppercase font-semibold">
                  Parent
                </span>
                <span className="text-gray-900">{card.customer_name || "-"}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 uppercase font-semibold">
                  Phone
                </span>
                <span className="text-gray-900">{card.customer_phone || "-"}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 uppercase font-semibold">
                  Child
                </span>
                <span className="text-gray-900">{card.child_name || "-"}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 uppercase font-semibold">
                  Child DOB
                </span>
                <span className="text-gray-900">
                  {card.child_birth_month || "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock size={14} />
              <span>Created: {new Date(card.created_at).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
