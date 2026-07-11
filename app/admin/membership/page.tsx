"use client";

import { useState, useRef } from "react";
import { Search, Plus, Loader2, X } from "lucide-react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { AlertModal } from "@/components/ui/alert-modal";
import type { Card } from "./types";
import { MemberCard } from "./MemberCard";
import { CardDetailModal } from "./CardDetailModal";
import { IssueCardModal } from "./IssueCardModal";

export default function MembershipPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchAbortRef = useRef<AbortController | null>(null);

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

    // Cancel previous search request
    searchAbortRef.current?.abort();
    searchAbortRef.current = new AbortController();

    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(
        `/api/admin/cards?query=${encodeURIComponent(searchQuery)}`,
        { signal: searchAbortRef.current.signal }
      );
      if (res.ok) {
        const data = await res.json();
        setCards(data);
      } else {
        setCards([]);
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error("Search failed", error);
        setCards([]);
      }
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
                aria-label="Search"
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
            type="button"
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
              type="button"
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
                <MemberCard
                  key={card.id}
                  card={card}
                  onView={setViewCard}
                  onRedeem={initiateRedeem}
                />
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
        <CardDetailModal card={viewCard} onClose={() => setViewCard(null)} />
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
