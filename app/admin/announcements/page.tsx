"use client";

import { useState, useEffect } from "react";
import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import {
  Save,
  Loader2,
  History,
  RotateCcw,
  Clock,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

interface Announcement {
  id: string;
  message: string;
  is_active: boolean;
  created_at: string;
}

export default function SettingsPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [history, setHistory] = useState<Announcement[]>([]);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      fetchData();
    }
  }, [isSignedIn]);

  const fetchData = async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setLoading(true);

    try {
      // Parallel fetch
      const [currentRes, historyRes] = await Promise.all([
        fetch("/api/admin/announcement"),
        fetch("/api/admin/announcement?history=true"),
      ]);

      const currentData = await currentRes.json();
      if (currentData) {
        setMessage(currentData.message || "");
        setIsActive(currentData.is_active || false);
      }

      const historyData = await historyRes.json();
      if (Array.isArray(historyData)) {
        setHistory(historyData);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: null, text: "" });

    try {
      const response = await fetch("/api/admin/announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, is_active: isActive }),
      });

      if (!response.ok) throw new Error("Failed to save");

      setStatus({
        type: "success",
        text: "Announcement updated successfully!",
      });
      // Refresh history to show the new one
      const historyRes = await fetch("/api/admin/announcement?history=true");
      const historyData = await historyRes.json();
      if (Array.isArray(historyData)) setHistory(historyData);
    } catch (error) {
      setStatus({ type: "error", text: "Failed to save settings." });
    } finally {
      setSaving(false);
    }
  };

  const handleReuse = (msg: string) => {
    setMessage(msg);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setSaving(true);

    try {
      const response = await fetch("/api/admin/announcement", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteId }),
      });

      if (!response.ok) throw new Error("Failed to delete");

      setHistory((prev) => prev.filter((item) => item.id !== deleteId));
      setStatus({ type: "success", text: "History item deleted." });
    } catch (error) {
      console.error("Failed to delete announcement:", error);
      setStatus({ type: "error", text: "Failed to delete item." });
    } finally {
      setSaving(false);
      setDeleteId(null);
    }
  };

  if (!isLoaded) return <div className="p-8 text-center">Loading...</div>;
  if (!isSignedIn) return <RedirectToSignIn />;

  return (
    <div className="max-w-4xl mx-auto">
      <ConfirmationModal
        isOpen={!!deleteId}
        title="Delete History"
        message="Are you sure you want to delete this announcement from history? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={saving}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Announcement Settings
        </h1>
        <button
          onClick={() => fetchData(true)}
          className="p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-pink-500"
          title="Refresh data"
          disabled={loading || isRefreshing}
        >
          <RefreshCw
            size={20}
            className={`${isRefreshing ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      <div className="space-y-6">
        {/* Editor Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Current Announcement
          </h2>
          <form onSubmit={handleSave} className="space-y-6">
            {status.text && (
              <div
                className={`p-4 rounded-lg text-sm ${
                  status.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {status.text}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Content
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="e.g., We are closed today due to severe weather."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all resize-none"
              />
              <p className="mt-2 text-xs text-gray-500">
                Keep it short and clear. This will appear at the top of the
                website.
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <span className="block text-sm font-medium text-gray-900">
                  Enable Banner
                </span>
                <span className="block text-xs text-gray-500">
                  Toggle visibility on the public site
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving || loading}
                className="flex items-center gap-2 bg-pink-600 text-white px-6 py-2.5 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* History List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
            <History size={18} className="text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-700">
              Recent History
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {history.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No history found.
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-gray-50 transition-colors flex items-start justify-between gap-4 group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium text-sm truncate">
                      {item.message}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          item.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleReuse(item.message)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Reuse this message"
                    >
                      <RotateCcw size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete history"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
