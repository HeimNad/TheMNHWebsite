"use client";

import { useState } from "react";
import {
  Search,
  CreditCard,
  Plus,
  Loader2,
  Phone,
  User,
  Baby,
  X,
  CheckCircle,
  AlertCircle,
  Eye,
  Clock,
  Calendar,
} from "lucide-react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

type Card = {
  id: string;
  code: string;
  balance: number;
  initial_punches: number;
  card_type: string;
  customer_name?: string;
  customer_phone?: string;
  child_name?: string;
  child_birth_month?: string;
  status: "active" | "completed" | "void";
  created_at: string;
  valid_from?: string;
  used_dates?: number[];
};

// Generic Alert Modal for Success/Error messages
function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = "success",
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "success" | "error";
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 relative animate-in zoom-in-95">
        <div className="flex flex-col items-center text-center">
          <div
            className={`p-3 rounded-full mb-4 ${
              type === "success"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {type === "success" ? (
              <CheckCircle size={32} />
            ) : (
              <AlertCircle size={32} />
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 mb-6">{message}</p>
          <button
            onClick={onClose}
            className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MembershipPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Modal States
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [viewCard, setViewCard] = useState<Card | null>(null);

  const [redeemModal, setRedeemModal] = useState<{
    isOpen: boolean;
    cardId: string | null;
    balance: number;
    isActivation: boolean;
  }>({
    isOpen: false,
    cardId: null,
    balance: 0,
    isActivation: false,
  });
  const [isRedeeming, setIsRedeeming] = useState(false);

  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setAlertState({ isOpen: true, title, message, type });
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(
        `/api/admin/cards?query=${encodeURIComponent(searchQuery)}`
      );
      if (res.ok) {
        const data = await res.json();
        setCards(data);
      } else {
        setCards([]);
      }
    } catch (error) {
      console.error("Search failed", error);
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  const initiateRedeem = (cardId: string, currentBalance: number) => {
    const card = cards.find((c) => c.id === cardId);
    const isTimeBased = card?.card_type.startsWith("weekly") || card?.card_type.startsWith("monthly");
    const isActivation = isTimeBased && !card?.valid_from;
    setRedeemModal({ isOpen: true, cardId, balance: currentBalance, isActivation: isActivation || false });
  };

  const confirmRedeem = async () => {
    if (!redeemModal.cardId) return;

    setIsRedeeming(true);
    try {
      const res = await fetch("/api/admin/cards/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: redeemModal.cardId }),
      });

      if (res.ok) {
        const updatedCard = await res.json();
        const wasActivation = updatedCard.activated === true;
        // Update local state with server response
        setCards(
          cards.map((card) => {
            if (card.id === redeemModal.cardId) {
              return {
                ...card,
                balance: updatedCard.balance,
                status: updatedCard.status,
                used_dates: updatedCard.used_dates,
                valid_from: updatedCard.valid_from,
              };
            }
            return card;
          })
        );
        setRedeemModal({ ...redeemModal, isOpen: false });
        const card = cards.find((c) => c.id === redeemModal.cardId);
        const isWeekly = card?.card_type.startsWith("weekly");
        showAlert(
          wasActivation ? "Activated!" : "Redeemed!",
          wasActivation
            ? "Weekly pass is now active. You can now redeem today's ride."
            : isWeekly
            ? "Today's ride has been successfully recorded."
            : "One ride has been successfully deducted.",
          "success"
        );
      } else {
        const error = await res.json();
        setRedeemModal({ ...redeemModal, isOpen: false });
        showAlert("Error", error.error || "Failed to redeem", "error");
      }
    } catch (err) {
      setRedeemModal({ ...redeemModal, isOpen: false });
      showAlert("Error", "Failed to connect to server.", "error");
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Membership</h1>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 flex-1 md:flex-none"
          >
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search code or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-600 transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Search size={16} />
                )}
              </button>
            </div>
          </form>

          {/* Issue Button */}
          <button
            className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors shadow-sm text-sm font-medium whitespace-nowrap"
            onClick={() => setIsIssueModalOpen(true)}
          >
            <Plus size={18} />
            <span>Issue Card</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[400px] p-6">
        {!hasSearched ? (
          // Empty State (Initial)
          <div className="flex flex-col items-center justify-center h-full py-20 text-center text-gray-500">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <Search size={48} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Search for a Member
            </h3>
            <p className="max-w-xs mx-auto">
              Enter a card code (e.g. 8823) or phone number above to find and
              manage memberships.
            </p>
          </div>
        ) : cards.length === 0 ? (
          // Empty State (No Results)
          <div className="flex flex-col items-center justify-center h-full py-20 text-center text-gray-500">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <X size={48} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No Cards Found
            </h3>
            <p>We couldn&apos;t find any cards matching &quot;{searchQuery}&quot;.</p>
            <button
              onClick={() => setIsIssueModalOpen(true)}
              className="mt-4 text-pink-600 font-medium hover:underline"
            >
              Issue a new card instead?
            </button>
          </div>
        ) : (
          // Results Grid
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Found {cards.length} Card{cards.length !== 1 && "s"}
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {cards.map((card) => (
                <div
                  key={card.id}
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
                      <span className={`block text-3xl font-bold leading-none ${
                        card.card_type.startsWith("weekly") || card.card_type.startsWith("monthly") ? "text-indigo-600" : "text-pink-600"
                      }`}>
                        {card.balance}
                      </span>
                      <span className="text-xs text-gray-400 font-medium mt-1 block">
                        {card.card_type.startsWith("weekly") || card.card_type.startsWith("monthly") ? "Days Left" : "Rides Left"}
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
                  {(card.card_type.startsWith("weekly") || card.card_type.startsWith("monthly")) && (
                    card.valid_from ? (
                      <div className="flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg mb-4">
                        <Calendar size={14} />
                        <span>
                          {new Date(card.valid_from).toLocaleDateString()} →{" "}
                          {new Date(new Date(card.valid_from).getTime() + (card.card_type.startsWith("monthly") ? 29 : 6) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mb-4">
                        <Clock size={14} />
                        <span>Not Activated</span>
                      </div>
                    )
                  )}

                  <div className="space-y-2 mb-6">
                    {card.customer_name ? (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <User size={14} className="text-gray-400" />
                        <span className="font-medium">
                          {card.customer_name}
                        </span>
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
                      onClick={() => setViewCard(card)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors flex justify-center items-center gap-2"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    {card.status === "active" && card.balance > 0 ? (
                      <button
                        className={`flex-3 py-2.5 rounded-lg font-medium transition-colors flex justify-center items-center gap-2 shadow-sm hover:shadow ${
                          (card.card_type.startsWith("weekly") || card.card_type.startsWith("monthly")) && !card.valid_from
                            ? "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700"
                            : card.card_type.startsWith("weekly") || card.card_type.startsWith("monthly")
                            ? "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800"
                            : "bg-pink-600 text-white hover:bg-pink-700 active:bg-pink-800"
                        }`}
                        onClick={() => initiateRedeem(card.id, card.balance)}
                      >
                        <CreditCard size={18} />
                        {(card.card_type.startsWith("weekly") || card.card_type.startsWith("monthly")) && !card.valid_from
                          ? "Activate"
                          : "Redeem"}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex-3 bg-gray-100 text-gray-400 py-2.5 rounded-lg font-medium cursor-not-allowed flex justify-center items-center gap-2"
                      >
                        {card.status === "completed"
                          ? "Completed"
                          : "Unavailable"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Redeem/Activate */}
      <ConfirmationModal
        isOpen={redeemModal.isOpen}
        title={redeemModal.isActivation ? "Activate Weekly Pass" : "Redeem Ride"}
        message={
          redeemModal.isActivation
            ? "This will activate the weekly pass starting from today. The 7-day countdown begins now. Continue?"
            : "Are you sure you want to deduct 1 ride from this card? This action cannot be undone."
        }
        confirmLabel={redeemModal.isActivation ? "Yes, Activate" : "Yes, Redeem"}
        onConfirm={confirmRedeem}
        onCancel={() => setRedeemModal({ ...redeemModal, isOpen: false })}
        isLoading={isRedeeming}
      />

      {/* Generic Alert Modal */}
      <AlertModal
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        onClose={() => setAlertState({ ...alertState, isOpen: false })}
      />

      {/* View Card Detail Modal */}
      {viewCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-in zoom-in-95 flex flex-col">
            <button
              onClick={() => setViewCard(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
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
              <div className={`p-4 rounded-xl border flex justify-between items-center ${
                viewCard.card_type.startsWith("weekly") || viewCard.card_type.startsWith("monthly")
                  ? "bg-indigo-50 border-indigo-100"
                  : "bg-gray-50 border-gray-100"
              }`}>
                <div>
                  <span className="block text-xs text-gray-500 uppercase font-semibold">
                    Card Code
                  </span>
                  <span className="text-3xl font-mono font-bold text-gray-900 tracking-wider">
                    {viewCard.code}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`block text-3xl font-bold ${
                    viewCard.card_type.startsWith("weekly") || viewCard.card_type.startsWith("monthly") ? "text-indigo-600" : "text-pink-600"
                  }`}>
                    {viewCard.balance}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    / {viewCard.initial_punches} {viewCard.card_type.startsWith("weekly") || viewCard.card_type.startsWith("monthly") ? "Days" : "Rides"}
                  </span>
                </div>
              </div>

              {/* Time-Based Pass Period */}
              {(viewCard.card_type.startsWith("weekly") || viewCard.card_type.startsWith("monthly")) && (
                viewCard.valid_from ? (
                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                    <span className="block text-xs text-indigo-600 uppercase font-semibold mb-2">
                      Valid Period
                    </span>
                    <div className="flex items-center gap-2 text-indigo-900 font-medium">
                      <Calendar size={16} />
                      <span>
                        {new Date(viewCard.valid_from).toLocaleDateString()} →{" "}
                        {new Date(new Date(viewCard.valid_from).getTime() + (viewCard.card_type.startsWith("monthly") ? 29 : 6) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </span>
                    </div>
                    {viewCard.used_dates && viewCard.used_dates.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-indigo-200">
                        <span className="block text-xs text-indigo-600 mb-2">
                          Days Used: {viewCard.used_dates.length} / {viewCard.initial_punches}
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
                      The {viewCard.card_type.startsWith("monthly") ? "30" : "7"}-day period will start when this card is first used.
                    </p>
                  </div>
                )
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-xs text-gray-500 uppercase font-semibold mb-1">
                    Status
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${
                      viewCard.status === "active"
                        ? "bg-green-100 text-green-700"
                        : viewCard.status === "completed"
                        ? "bg-gray-200 text-gray-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {viewCard.status}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 uppercase font-semibold mb-1">
                    Type
                  </span>
                  <span className="text-gray-900 font-medium">
                    {viewCard.card_type === "weekly_7"
                      ? "WEEKLY PASS"
                      : viewCard.card_type === "monthly_30"
                      ? "MONTHLY PASS"
                      : viewCard.card_type.replace(/_/g, " ").toUpperCase()}
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
                    <span className="text-gray-900">
                      {viewCard.customer_name || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 uppercase font-semibold">
                      Phone
                    </span>
                    <span className="text-gray-900">
                      {viewCard.customer_phone || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 uppercase font-semibold">
                      Child
                    </span>
                    <span className="text-gray-900">
                      {viewCard.child_name || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 uppercase font-semibold">
                      Child DOB
                    </span>
                    <span className="text-gray-900">
                      {viewCard.child_birth_month || "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock size={14} />
                  <span>
                    Created: {new Date(viewCard.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => setViewCard(null)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Issue Card Modal */}
      {isIssueModalOpen && (
        <IssueCardModal
          onClose={() => setIsIssueModalOpen(false)}
          onSuccess={(code) => {
            setIsIssueModalOpen(false);
            showAlert(
              "Success",
              `Card ${code} has been issued successfully!`,
              "success"
            );
            if (
              searchQuery &&
              (searchQuery === code || searchQuery.includes(code))
            ) {
              handleSearch();
            }
          }}
        />
      )}
    </div>
  );
}

function IssueCardModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (code: string) => void;
}) {
  const [formData, setFormData] = useState({
    code: "",
    type: "5_plus_1",
    customer_name: "",
    customer_phone: "",
    child_name: "",
    child_birth_month: "",
    valid_from: "",
    weeklyMode: "gift" as "gift" | "scheduled",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [error, setError] = useState("");

  const handlePhoneBlur = async () => {
    if (!formData.customer_phone || formData.customer_phone.length < 4) return;
    
    setIsLookingUp(true);
    try {
      const res = await fetch(`/api/admin/customers/lookup?phone=${encodeURIComponent(formData.customer_phone)}`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setFormData(prev => ({
            ...prev,
            customer_name: data.customer_name || prev.customer_name,
            child_name: data.child_name || prev.child_name,
            child_birth_month: data.child_birth_month || prev.child_birth_month
          }));
        }
      }
    } catch (err) {
      console.error("Lookup failed", err);
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Determine initial punches based on type
    const isTimeBased = formData.type === "weekly_7" || formData.type === "monthly_30";
    const initial_punches =
      formData.type === "weekly_7" ? 7 :
      formData.type === "monthly_30" ? 30 :
      formData.type === "5_plus_1" ? 6 :
      formData.type === "10_plus_1" ? 11 : 13;

    // Validate scheduled mode requires date
    if (isTimeBased && formData.weeklyMode === "scheduled" && !formData.valid_from) {
      setError("Please select a start date");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          initial_punches,
          card_type: formData.type,
          valid_from: isTimeBased && formData.weeklyMode === "scheduled" ? formData.valid_from : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to issue card");
      }

      onSuccess(formData.code);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-70 p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-pink-50 shrink-0">
          <h3 className="font-bold text-lg text-pink-900">Issue New Card</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {/* Card Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number (Code) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 outline-none uppercase font-mono tracking-wider"
                placeholder="e.g. 8823"
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Type
              </label>
              <div className="space-y-3">
                {/* Row 1: 5+1, 10+3 */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className={`px-3 py-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                      formData.type === "5_plus_1"
                        ? "border-pink-500 bg-pink-50 text-pink-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, type: "5_plus_1", valid_from: "" })
                    }
                  >
                    5 + 1 Free
                    <span className="block text-xs font-normal mt-1 text-gray-500">
                      6 Rides
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                      formData.type === "10_plus_3"
                        ? "border-pink-500 bg-pink-50 text-pink-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, type: "10_plus_3", valid_from: "" })
                    }
                  >
                    10 + 3 Free
                    <span className="block text-xs font-normal mt-1 text-gray-500">
                      13 Rides
                    </span>
                  </button>
                </div>
                {/* Row 2: 10+1 */}
                <button
                  type="button"
                  className={`w-full px-3 py-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                    formData.type === "10_plus_1"
                      ? "border-pink-500 bg-pink-50 text-pink-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, type: "10_plus_1", valid_from: "" })
                  }
                >
                  10 + 1 Free
                  <span className="block text-xs font-normal mt-1 text-gray-500">
                    11 Rides
                  </span>
                </button>
                {/* Row 3: Weekly, Monthly */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className={`px-3 py-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                      formData.type === "weekly_7"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, type: "weekly_7" })
                    }
                  >
                    Weekly Pass
                    <span className="block text-xs font-normal mt-1 text-gray-500">
                      7 Days
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                      formData.type === "monthly_30"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, type: "monthly_30" })
                    }
                  >
                    Monthly Pass
                    <span className="block text-xs font-normal mt-1 text-gray-500">
                      30 Days
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Weekly/Monthly Pass Options */}
            {(formData.type === "weekly_7" || formData.type === "monthly_30") && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Activation Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className={`px-3 py-3 rounded-lg border-2 text-sm font-semibold transition-all text-left ${
                      formData.weeklyMode === "gift"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, weeklyMode: "gift", valid_from: "" })
                    }
                  >
                    Gift Card
                    <span className="block text-xs font-normal mt-1 text-gray-500">
                      Activate on first use
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-3 rounded-lg border-2 text-sm font-semibold transition-all text-left ${
                      formData.weeklyMode === "scheduled"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, weeklyMode: "scheduled" })
                    }
                  >
                    Scheduled
                    <span className="block text-xs font-normal mt-1 text-gray-500">
                      Set start date now
                    </span>
                  </button>
                </div>

                {formData.weeklyMode === "scheduled" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none"
                      value={formData.valid_from}
                      onChange={(e) =>
                        setFormData({ ...formData, valid_from: e.target.value })
                      }
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Optional Customer Info
              </span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 flex justify-between">
                Phone Number
                {isLookingUp && <Loader2 size={12} className="animate-spin text-pink-500" />}
              </label>
              <input 
                type="tel" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-200 outline-none"
                placeholder="Required for membership"
                value={formData.customer_phone}
                onChange={e => setFormData({...formData, customer_phone: e.target.value})}
                onBlur={handlePhoneBlur}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Parent Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-200 outline-none"
                placeholder="John Doe"
                value={formData.customer_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customer_name: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Child Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-200 outline-none"
                placeholder="Leo"
                value={formData.child_name}
                onChange={(e) =>
                  setFormData({ ...formData, child_name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Child DOB
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-200 outline-none"
                placeholder="MM/DD"
                value={formData.child_birth_month}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    child_birth_month: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold hover:bg-pink-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Issue Card"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}