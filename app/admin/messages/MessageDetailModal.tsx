import { X } from "lucide-react";
import { LocalTime } from "@/components/ui/local-time";
import type { Message } from "./types";

export function MessageDetailModal({
  message,
  onClose,
  onStatusChange,
}: {
  message: Message;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
          <div className="col-span-2">
            <h3 className="text-xl font-bold text-gray-900">
              {message.first_name} {message.last_name}
            </h3>
          </div>

          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold">
              Email
            </span>
            <span className="text-gray-900">{message.email}</span>
          </div>

          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold">
              Phone
            </span>
            <span className="text-gray-900">{message.phone || "-"}</span>
          </div>

          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold">
              Child Age
            </span>
            <span className="text-gray-900">{message.child_age || "-"}</span>
          </div>

          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold">
              Preferred Contact
            </span>
            <span className="text-gray-900 capitalize">
              {message.preferred_contact || "-"}
            </span>
          </div>

          <div className="col-span-2">
            <span className="block text-xs text-gray-500 uppercase font-semibold">
              Date
            </span>
            <span className="text-gray-900">
              <LocalTime date={message.created_at} format="datetime" />
            </span>
          </div>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <span className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Subject
          </span>
          <p className="text-gray-900 font-medium">
            {message.subject || "General Inquiry"}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 min-h-[100px] max-h-[300px] overflow-y-auto">
          <p className="text-gray-800 whitespace-pre-wrap">{message.message}</p>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Status:</span>
            <select
              value={message.status}
              onChange={(e) => onStatusChange(message.id, e.target.value)}
              aria-label="Status"
              className="block w-32 pl-3 pr-10 py-2 text-sm border border-gray-300 bg-white focus:outline-none focus:ring-pink-500 focus:border-pink-500 rounded-md shadow-sm"
            >
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="ignored">Ignored</option>
            </select>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="bg-pink-100 hover:bg-pink-200 text-pink-900 font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
