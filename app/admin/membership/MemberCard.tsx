import { CreditCard, Phone, User, Baby, Eye, Clock, Calendar } from "lucide-react";
import type { Card } from "./types";

export function MemberCard({
  card,
  onView,
  onRedeem,
}: {
  card: Card;
  onView: (card: Card) => void;
  onRedeem: (cardId: string, currentBalance: number) => void;
}) {
  const isTimeBased =
    card.card_type.startsWith("weekly") || card.card_type.startsWith("monthly");

  return (
    <div
      className={`relative group bg-white border rounded-xl p-5 hover:border-pink-300 transition-all duration-200 ${
        card.status === "completed"
          ? "opacity-75 bg-gray-50 border-gray-200"
          : "border-gray-200 shadow-sm hover:shadow-md"
      }`}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <span
          className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${
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

      <div className="mb-4">
        <span className="block text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">
          Card Code
        </span>
        <span className="block text-2xl font-bold text-gray-900 font-mono tracking-wider">
          {card.code}
        </span>
      </div>

      <div className="flex items-end justify-between mb-6 border-b border-gray-100 pb-4">
        <div>
          <span
            className={`block text-3xl font-bold leading-none ${
              isTimeBased ? "text-indigo-600" : "text-pink-600"
            }`}
          >
            {card.balance}
          </span>
          <span className="text-xs text-gray-400 font-medium mt-1 block">
            {isTimeBased ? "Days Left" : "Rides Left"}
          </span>
        </div>
        <div className="text-right">
          <span className="block text-sm font-medium text-gray-900">
            {card.initial_punches}
          </span>
          <span className="text-xs text-gray-400">Total</span>
        </div>
      </div>

      {/* Time-Based Pass Status */}
      {isTimeBased &&
        (card.valid_from ? (
          <div className="flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg mb-4">
            <Calendar size={14} />
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
        ) : (
          <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mb-4">
            <Clock size={14} />
            <span>Not Activated</span>
          </div>
        ))}

      <div className="space-y-2 mb-6">
        {card.customer_name ? (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <User size={14} className="text-gray-400" />
            <span className="font-medium">{card.customer_name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-400 italic">
            <User size={14} />
            <span>No Name</span>
          </div>
        )}

        {card.customer_phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone size={14} className="text-gray-400" />
            <span>{card.customer_phone}</span>
          </div>
        )}

        {card.child_name && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Baby size={14} className="text-gray-400" />
            <span>Child: {card.child_name}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onView(card)}
          aria-label="View Details"
          className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors flex justify-center items-center gap-2"
          title="View Details"
        >
          <Eye size={18} />
        </button>
        {card.status === "active" && card.balance > 0 ? (
          <button
            type="button"
            className={`flex-3 py-2.5 rounded-lg font-medium transition-colors flex justify-center items-center gap-2 shadow-sm hover:shadow ${
              isTimeBased && !card.valid_from
                ? "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700"
                : isTimeBased
                ? "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800"
                : "bg-pink-600 text-white hover:bg-pink-700 active:bg-pink-800"
            }`}
            onClick={() => onRedeem(card.id, card.balance)}
          >
            <CreditCard size={18} />
            {isTimeBased && !card.valid_from ? "Activate" : "Redeem"}
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="flex-3 bg-gray-100 text-gray-400 py-2.5 rounded-lg font-medium cursor-not-allowed flex justify-center items-center gap-2"
          >
            {card.status === "completed" ? "Completed" : "Unavailable"}
          </button>
        )}
      </div>
    </div>
  );
}
