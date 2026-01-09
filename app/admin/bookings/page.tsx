"use client";

import { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Loader2, Plus, X, User, Phone, Baby, Clock } from "lucide-react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { AlertModal } from "@/components/ui/alert-modal";

// Setup the localizer
const localizer = momentLocalizer(moment);

type Booking = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  customer_name: string;
  customer_phone: string;
  child_name?: string;
  child_age?: string;
  package_type?: string;
  notes?: string;
  resource?: any;
};

export default function BookingsPage() {
  const [events, setEvents] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Booking | null>(null);

  // Alert & Confirm States
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
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setAlertState({ isOpen: true, title, message, type });
  };

  // Fetch events for current view
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const start = moment().subtract(3, "months").toISOString();
      const end = moment().add(3, "months").toISOString();

      const res = await fetch(`/api/admin/bookings?start=${start}&end=${end}`);
      if (res.ok) {
        const data = await res.json();
        const formattedEvents = data.map((b: any) => ({
          ...b,
          title: `${b.customer_name} (${b.package_type || "Party"})`,
          start: new Date(b.start_time),
          end: new Date(b.end_time),
        }));
        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedSlot({ start, end });
    setIsCreateModalOpen(true);
  };

  const handleSelectEvent = (event: Booking) => {
    setSelectedEvent(event);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    showAlert("Success", "Reservation created successfully!");
    fetchEvents();
  };

  const initiateCancel = (id: string) => {
    setCancelId(id);
  };

  const confirmCancel = async () => {
    if (!cancelId) return;
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/admin/bookings?id=${cancelId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCancelId(null);
        setSelectedEvent(null);
        showAlert("Cancelled", "Booking has been cancelled.", "success");
        fetchEvents();
      } else {
        throw new Error("Failed to cancel");
      }
    } catch (err) {
      setCancelId(null);
      showAlert("Error", "Failed to cancel booking.", "error");
    } finally {
      setIsCancelling(false);
    }
  };

  // Custom Event Component
  const CustomEvent = ({ event }: { event: Booking }) => (
    <div className="text-[10px] sm:text-xs leading-tight space-y-0.5 h-full overflow-hidden">
      {/* Line 1: Time (Always Visible) */}
      <div className="font-bold flex items-center gap-1 shrink-0 whitespace-nowrap">
        <Clock size={10} className="hidden sm:block" />
        {moment(event.start).format("h:mma")} -{" "}
        {moment(event.end).format("h:mma")}
      </div>

      {/* Line 2: Child Name (Hidden on very small mobile, visible on small+) */}
      <div className="truncate font-semibold text-white hidden xs:block">
        {event.child_name ? `Kid: ${event.child_name}` : event.customer_name}
      </div>

      {/* Line 3: Package (Visible on medium screens and up) */}
      <div className="truncate opacity-90 italic hidden md:block">
        {event.package_type}
      </div>

      {/* Line 4: Notes (Visible on large screens and up) */}
      {event.notes && (
        <div className="truncate opacity-80 border-t border-white/20 mt-0.5 pt-0.5 hidden lg:block">
          {event.notes}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <button
          onClick={() => {
            setSelectedSlot({
              start: new Date(),
              end: moment().add(2, "hours").toDate(),
            });
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          New Booking
        </button>
      </div>

      <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-200 min-h-0">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          defaultView={Views.MONTH}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          components={{
            event: CustomEvent,
          }}
          eventPropGetter={() => ({
            style: {
              backgroundColor: "#EC4899", // Pink-500
              borderRadius: "6px",
              border: "none",
              color: "white",
              display: "block",
              padding: "4px 6px",
              minHeight: "60px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            },
          })}
        />
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <CreateBookingModal
          slot={selectedSlot}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {/* Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-in zoom-in-95">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {selectedEvent.package_type || "Party Booking"}
            </h3>
            <p className="text-pink-600 font-medium mb-6">
              {moment(selectedEvent.start).format("MMM D, YYYY")} •{" "}
              {moment(selectedEvent.start).format("h:mm A")} -{" "}
              {moment(selectedEvent.end).format("h:mm A")}
            </p>

            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <User className="text-gray-400 mt-0.5" size={18} />
                <div>
                  <p className="font-semibold">{selectedEvent.customer_name}</p>
                  <p className="text-gray-500">Contact</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-gray-400 mt-0.5" size={18} />
                <div>
                  <p className="font-semibold">
                    {selectedEvent.customer_phone}
                  </p>
                  <p className="text-gray-500">Phone</p>
                </div>
              </div>
              {(selectedEvent.child_name || selectedEvent.child_age) && (
                <div className="flex items-start gap-3">
                  <Baby className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <p className="font-semibold">
                      {selectedEvent.child_name || "Child"} (
                      {selectedEvent.child_age || "?"})
                    </p>
                    <p className="text-gray-500">Birthday Child</p>
                  </div>
                </div>
              )}
              {selectedEvent.notes && (
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                    Notes
                  </p>
                  <p>{selectedEvent.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => initiateCancel(selectedEvent.id)}
                className="flex-1 bg-red-50 text-red-600 font-medium py-2.5 rounded-lg hover:bg-red-100 transition-colors"
              >
                Cancel Booking
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="flex-1 bg-gray-100 text-gray-900 font-medium py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!cancelId}
        title="Cancel Reservation"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmLabel="Yes, Cancel Booking"
        variant="danger"
        onConfirm={confirmCancel}
        onCancel={() => setCancelId(null)}
        isLoading={isCancelling}
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        onClose={() => setAlertState({ ...alertState, isOpen: false })}
      />
    </div>
  );
}

function CreateBookingModal({
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

  // Form State
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    child_name: "",
    child_age: "",
    package_type: "Weekday Package ($449)",
    notes: "",
    date: slot ? moment(slot.start).format("YYYY-MM-DD") : "",
    start_time: slot ? moment(slot.start).format("HH:mm") : "10:00",
    end_time: slot ? moment(slot.end).format("HH:mm") : "12:00",
  });

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

    try {
      const startDateTime = moment(
        `${formData.date} ${formData.start_time}`
      ).toDate();
      const endDateTime = moment(
        `${formData.date} ${formData.end_time}`
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
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-2 rounded-full hover:bg-gray-100"
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
              <label className={labelClass}>Date</label>
              <input
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
                <label className={labelClass}>Start Time</label>
                <input
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
                <label className={labelClass}>End Time</label>
                <input
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
            <label className={labelClass}>Package Type</label>
            <select
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
              <label className={labelClass}>
                Parent Name <span className="text-red-500">*</span>
              </label>
              <input
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
              <label className={labelClass}>
                Phone Number <span className="text-red-500">*</span>
                {isLookingUp && (
                  <Loader2
                    size={12}
                    className="animate-spin text-pink-500 inline ml-2"
                  />
                )}
              </label>
              <input
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
              <label className={labelClass}>Child Name</label>
              <input
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
              <label className={labelClass}>Age</label>
              <input
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
            <label className={labelClass}>Notes</label>
            <textarea
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
