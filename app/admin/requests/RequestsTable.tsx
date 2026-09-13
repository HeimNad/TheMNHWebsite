import dayjs from "dayjs";
import { Eye, Inbox, Pizza } from "lucide-react";
import { LocalTime } from "@/components/ui/local-time";
import type { BookingRequest, TabKey } from "./types";

const EMPTY_TEXT: Record<TabKey, string> = {
  pending: "New party bookings from the website land here.",
  confirmed: "Requests you confirm show up here.",
  declined: "Requests you decline show up here.",
};

export function RequestsTable({
  requests,
  tab,
  onView,
}: {
  requests: BookingRequest[];
  tab: TabKey;
  onView: (request: BookingRequest) => void;
}) {
  const isHistory = tab !== "pending";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Submitted",
                isHistory ? "Party Slot" : "Requested Slot",
                "Parent",
                "Package",
                "Kids",
                "Actions",
              ].map(
                (heading) => (
                  <th
                    key={heading}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <Inbox className="mx-auto text-gray-300" size={40} />
                  <p className="mt-3 font-medium text-gray-900">
                    Nothing here
                  </p>
                  <p className="text-gray-500 text-sm">{EMPTY_TEXT[tab]}</p>
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr
                  key={request.id}
                  onClick={() => onView(request)}
                  className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                    isHistory ? "text-gray-500" : "bg-amber-50/30"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <LocalTime date={request.created_at} format="date" />
                    <br />
                    <span className="text-xs text-gray-500">
                      <LocalTime date={request.created_at} format="time" />
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`font-medium ${
                        isHistory ? "text-gray-600" : "text-gray-900"
                      }`}
                    >
                      {dayjs(request.start_time).format("ddd, MMM D")}
                    </span>
                    <br />
                    <span className="text-xs text-gray-500">
                      {dayjs(request.start_time).format("h:mm A")} –{" "}
                      {dayjs(request.end_time).format("h:mm A")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`font-medium ${
                        isHistory ? "text-gray-600" : "text-gray-900"
                      }`}
                    >
                      {request.customer_name}
                    </span>
                    <br />
                    <span className="text-xs text-gray-500">
                      {request.customer_phone}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <span className="block truncate">
                      {request.package_type || "-"}
                    </span>
                    {!!request.add_ons?.length && (
                      <span className="text-xs text-pink-600">
                        +{request.add_ons.length} add-on
                        {request.add_ons.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.child_count ?? "-"}
                    {!!request.pizza_count && (
                      <span
                        className="ml-2 inline-flex items-center gap-1 text-xs text-orange-600"
                        title={`${request.pizza_count} × ${request.pizza_preference}`}
                      >
                        <Pizza size={14} />
                        {request.pizza_count}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(request);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      title="View Details"
                    >
                      <Eye size={16} /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
