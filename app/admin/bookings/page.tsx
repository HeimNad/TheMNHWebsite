"use client";

import { useState } from "react";
import { Calendar, dayjsLocalizer, Views } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Plus } from "lucide-react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { AlertModal } from "@/components/ui/alert-modal";
import { useBookingEvents, type Booking } from "./useBookingEvents";
import { BookingEventCell } from "./BookingEventCell";
import { BookingDetailModal } from "./BookingDetailModal";
import { CreateBookingModal } from "./CreateBookingModal";

// Setup the localizer
const localizer = dayjsLocalizer(dayjs);

export default function BookingsPage() {
  const { events, refreshEvents } = useBookingEvents();

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
    refreshEvents();
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
        refreshEvents();
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

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <button
          type="button"
          onClick={() => {
            setSelectedSlot({
              start: new Date(),
              end: dayjs().add(2, "hour").toDate(),
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
            event: BookingEventCell,
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
        <BookingDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onCancel={initiateCancel}
        />
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
