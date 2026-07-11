import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import type { IssueCardFormData } from "./types";
import { PackageTypeSelector } from "./PackageTypeSelector";
import { ActivationModeSelector } from "./ActivationModeSelector";
import { CustomerLookupFields } from "./CustomerLookupFields";

export function IssueCardModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (code: string) => void;
}) {
  const [formData, setFormData] = useState<IssueCardFormData>({
    code: "",
    type: "5_plus_1",
    customer_name: "",
    customer_phone: "",
    child_name: "",
    child_birth_month: "",
    valid_from: "",
    weeklyMode: "gift",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [error, setError] = useState("");

  const updateFormData = (updates: Partial<IssueCardFormData>) =>
    setFormData((prev) => ({ ...prev, ...updates }));

  const handlePhoneBlur = async () => {
    if (!formData.customer_phone || formData.customer_phone.length < 4) return;

    setIsLookingUp(true);
    try {
      const res = await fetch(
        `/api/admin/customers/lookup?phone=${encodeURIComponent(
          formData.customer_phone
        )}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setFormData((prev) => ({
            ...prev,
            customer_name: data.customer_name || prev.customer_name,
            child_name: data.child_name || prev.child_name,
            child_birth_month:
              data.child_birth_month || prev.child_birth_month,
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
    const isTimeBased =
      formData.type === "weekly_7" || formData.type === "monthly_30";
    const initial_punches =
      formData.type === "weekly_7"
        ? 7
        : formData.type === "monthly_30"
        ? 30
        : formData.type === "5_plus_1"
        ? 6
        : formData.type === "10_plus_1"
        ? 11
        : 13;

    // Validate scheduled mode requires date
    if (
      isTimeBased &&
      formData.weeklyMode === "scheduled" &&
      !formData.valid_from
    ) {
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
          valid_from:
            isTimeBased && formData.weeklyMode === "scheduled"
              ? formData.valid_from
              : undefined,
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

  const isTimeBased =
    formData.type === "weekly_7" || formData.type === "monthly_30";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-70 p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-pink-50 shrink-0">
          <h3 className="font-bold text-lg text-pink-900">Issue New Card</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto flex-1"
        >
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="issue-card-code"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Card Number (Code) <span className="text-red-500">*</span>
              </label>
              <input
                id="issue-card-code"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 outline-none uppercase font-mono tracking-wider"
                placeholder="e.g. 8823"
                value={formData.code}
                onChange={(e) =>
                  updateFormData({ code: e.target.value.toUpperCase() })
                }
              />
            </div>

            <PackageTypeSelector type={formData.type} onChange={updateFormData} />

            {isTimeBased && (
              <ActivationModeSelector
                weeklyMode={formData.weeklyMode}
                validFrom={formData.valid_from}
                onChange={updateFormData}
              />
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

          <CustomerLookupFields
            formData={formData}
            isLookingUp={isLookingUp}
            onPhoneBlur={handlePhoneBlur}
            onChange={updateFormData}
          />

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold hover:bg-pink-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Issue Card"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
