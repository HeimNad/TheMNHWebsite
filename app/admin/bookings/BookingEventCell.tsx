import dayjs from "dayjs";
import { Clock } from "lucide-react";
import type { Booking } from "./useBookingEvents";

export function BookingEventCell({ event }: { event: Booking }) {
  return (
    <div className="text-[10px] sm:text-xs leading-tight space-y-0.5 h-full overflow-hidden">
      {/* Line 1: Time (Always Visible) */}
      <div className="font-bold flex items-center gap-1 shrink-0 whitespace-nowrap">
        <Clock size={10} className="hidden sm:block" />
        {dayjs(event.start).format("h:mma")} -{" "}
        {dayjs(event.end).format("h:mma")}
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
}
