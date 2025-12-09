"use client";

import { useEffect, useState } from "react";
import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import { X, Eye, Ban, RefreshCw } from "lucide-react";
import { Pagination } from "@/components/ui/pagination-control";

interface Message {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subject?: string;
  message: string;
  status: "unread" | "read" | "ignored";
  created_at: string;
}

export default function MessagesPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showIgnored, setShowIgnored] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (isSignedIn) {
      fetchMessages(currentPage, pageSize);
    }
  }, [isSignedIn, currentPage, pageSize]);

  const fetchMessages = async (
    page: number,
    limit: number,
    isManualRefresh = false
  ) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/messages?page=${page}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      setMessages(data.data || []);
      setTotalItems(data.pagination.total);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      // Update local state
      setMessages(
        messages.map((msg) =>
          msg.id === id ? { ...msg, status: newStatus as any } : msg
        )
      );

      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus as any });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (!isLoaded) return <div className="p-8 text-center">Loading...</div>;

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  const filteredMessages = messages.filter((msg) =>
    showIgnored ? true : msg.status !== "ignored"
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <button
            onClick={() => fetchMessages(currentPage, pageSize, true)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Refresh data"
            disabled={loading || isRefreshing}
          >
            <RefreshCw
              size={20}
              className={`${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showIgnored}
              onChange={(e) => setShowIgnored(e.target.checked)}
              className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
            />
            <span>Show Ignored</span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading messages...
                  </td>
                </tr>
              ) : filteredMessages.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No messages found on this page.
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      msg.status === "unread" ? "bg-pink-50/30" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(msg.created_at).toLocaleDateString()} <br />
                      <span className="text-xs text-gray-500">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {msg.first_name} {msg.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                      {msg.subject || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {msg.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${
                          msg.status === "unread"
                            ? "bg-green-100 text-green-800"
                            : msg.status === "ignored"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {msg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-1">
                      <button
                        onClick={() => {
                          setSelectedMessage(msg);
                          if (msg.status === "unread")
                            updateStatus(msg.id, "read");
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        title="View Details"
                      >
                        <Eye size={16} /> View
                      </button>
                      {msg.status !== "ignored" && (
                        <button
                          onClick={() => updateStatus(msg.id, "ignored")}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          title="Ignore Message"
                        >
                          <Ban size={16} /> Ignore
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Control */}
        {!loading && messages.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {selectedMessage.first_name} {selectedMessage.last_name}
              </h3>
              <p className="text-sm text-gray-500">{selectedMessage.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(selectedMessage.created_at).toLocaleString()}
              </p>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject</span>
              <p className="text-gray-900 font-medium">{selectedMessage.subject || "General Inquiry"}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 min-h-[100px] max-h-[300px] overflow-y-auto">
              <p className="text-gray-800 whitespace-pre-wrap">
                {selectedMessage.message}
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              {selectedMessage.status !== "ignored" && (
                <button
                  onClick={() => {
                    updateStatus(selectedMessage.id, "ignored");
                    setSelectedMessage(null);
                  }}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                >
                  Ignore Message
                </button>
              )}
              <button
                onClick={() => setSelectedMessage(null)}
                className="bg-pink-100 hover:bg-pink-200 text-pink-900 font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
