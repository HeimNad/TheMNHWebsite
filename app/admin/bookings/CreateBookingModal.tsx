import { useState, useRef } from "react";
import dayjs from "dayjs";
import { Loader2, X } from "lucide-react";

export function CreateBookingModal({
  slot,
  onClose,
  onSuccess,
}: {
  slot: { start: Date; end: Date } | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [error, setError] = useState("");
  const lookupAbortRef = useRef<AbortController | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    child_name: "",
    child_age: "",
    package_type: "Weekday Package ($449)",
    notes: "",
    date: slot ? dayjs(slot.start).format("YYYY-MM-DD") : "",
    start_time: slot ? dayjs(slot.start).format("HH:mm") : "10:00",
    end_time: slot ? dayjs(slot.end).format("HH:mm") : "12:00",
  });

  const handlePhoneBlur = async () => {
    if (!formData.customer_phone || formData.customer_phone.length < 4) return;

    // Cancel previous lookup request
    lookupAbortRef.current?.abort();
    lookupAbortRef.current = new AbortController();

    setIsLookingUp(true);
    try {
      const res = await fetch(
        `/api/admin/customers/lookup?phone=${encodeURIComponent(
          formData.customer_phone
        )}`,
        { signal: lookupAbortRef.current.signal }
      );
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setFormData((prev) => ({
            ...prev,
            customer_name: data.customer_name || prev.customer_name,
            child_name: data.child_name || prev.child_name,
          }));
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error("Lookup failed", err);
      }
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const startDateTime = dayjs(
        `${formData.date}T${formData.start_time}`
      ).toDate();
      const endDateTime = dayjs(
        `${formData.date}T${formData.end_time}`
      ).toDate();

      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_time: startDateTime,
          end_time: endDateTime,
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          child_name: formData.child_name,
          child_age: formData.child_age,
          package_type: formData.package_type,
          notes: formData.notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create booking");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 outline-none text-sm transition-all";
  const labelClass =
    "block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide";

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">New Reservation</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100 flex items-center gap-2">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-pink-50/50 p-4 rounded-xl border border-pink-100 space-y-4">
            <div>
              <label htmlFor="booking-date" className={labelClass}>Date</label>
              <input
                id="booking-date"
                type="date"
                required
                className={`${inputClass} bg-white`}
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="booking-start-time" className={labelClass}>Start Time</label>
                <input
                  id="booking-start-time"
                  type="time"
                  required
                  className={`${inputClass} bg-white`}
                  value={formData.start_time}
                  onChange={(e) =>
                    setFormData({ ...formData, start_time: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="booking-end-time" className={labelClass}>End Time</label>
                <input
                  id="booking-end-time"
                  type="time"
                  required
                  className={`${inputClass} bg-white`}
                  value={formData.end_time}
                  onChange={(e) =>
                    setFormData({ ...formData, end_time: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="booking-package-type" className={labelClass}>Package Type</label>
            <select
              id="booking-package-type"
              className={`${inputClass} bg-white`}
              value={formData.package_type}
              onChange={(e) =>
                setFormData({ ...formData, package_type: e.target.value })
              }
            >
              <option>Weekday Package ($449)</option>
              <option>Weekend Package ($549)</option>
              <option>Custom Event</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="booking-customer-name" className={labelClass}>
                Parent Name <span className="text-red-500">*</span>
              </label>
              <input
                id="booking-customer-name"
                type="text"
                required
                className={inputClass}
                placeholder="John Doe"
                value={formData.customer_name}
                onChange={(e) =>
                  setFormData({ ...formData, customer_name: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="booking-customer-phone" className={labelClass}>
                Phone Number <span className="text-red-500">*</span>
                {isLookingUp && (
                  <Loader2
                    size={12}
                    className="animate-spin text-pink-500 inline ml-2"
                  />
                )}
              </label>
              <input
                id="booking-customer-phone"
                type="tel"
                required
                className={inputClass}
                placeholder="(555) 123-4567"
                value={formData.customer_phone}
                onChange={(e) =>
                  setFormData({ ...formData, customer_phone: e.target.value })
                }
                onBlur={handlePhoneBlur}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="booking-child-name" className={labelClass}>Child Name</label>
              <input
                id="booking-child-name"
                type="text"
                className={inputClass}
                placeholder="Leo"
                value={formData.child_name}
                onChange={(e) =>
                  setFormData({ ...formData, child_name: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="booking-child-age" className={labelClass}>Age</label>
              <input
                id="booking-child-age"
                type="text"
                className={inputClass}
                placeholder="5"
                value={formData.child_age}
                onChange={(e) =>
                  setFormData({ ...formData, child_age: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label htmlFor="booking-notes" className={labelClass}>Notes</label>
            <textarea
              id="booking-notes"
              className={`${inputClass} min-h-20 resize-none`}
              placeholder="Special requests, allergies, etc."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-pink-600 text-white font-bold py-3.5 rounded-xl hover:bg-pink-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Create Reservation"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
