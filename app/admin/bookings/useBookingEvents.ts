import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";

export type Booking = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  start_time: string;
  end_time: string;
  customer_name: string;
  customer_phone: string;
  child_name?: string;
  child_age?: string;
  package_type?: string;
  notes?: string;
};

function formatEvents(data: Booking[]) {
  return data.map((b) => ({
    ...b,
    title: `${b.customer_name} (${b.package_type || "Party"})`,
    start: new Date(b.start_time),
    end: new Date(b.end_time),
  }));
}

export function useBookingEvents() {
  const [events, setEvents] = useState<Booking[]>([]);
  const loadingRef = useRef(false);

  const refreshEvents = async (signal?: AbortSignal) => {
    loadingRef.current = true;
    try {
      const start = dayjs().subtract(3, "month").toISOString();
      const end = dayjs().add(3, "month").toISOString();

      const res = await fetch(`/api/admin/bookings?start=${start}&end=${end}`, {
        signal,
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(formatEvents(data));
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Failed to fetch bookings", error);
      }
    } finally {
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    refreshEvents(controller.signal);
    return () => controller.abort();
  }, []);

  return { events, refreshEvents };
}
