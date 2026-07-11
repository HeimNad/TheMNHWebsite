"use client";

import { useState } from "react";
import { Loader2, Save, MapPin, Power, RefreshCw } from "lucide-react";
import { AlertModal } from "@/components/ui/alert-modal";
import type { BusinessHours } from "./types";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Generate time options (30 min intervals)
const TIME_OPTIONS: string[] = [];
for (let h = 9; h <= 22; h++) {
  // Limit range from 9 AM to 10 PM for easier scrolling, or do full 24h
  for (let m of [0, 30]) {
    const period = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    const min = m === 0 ? "00" : "30";
    TIME_OPTIONS.push(`${hour}:${min} ${period}`);
  }
}

export function SettingsPageClient({
  initialHours,
}: {
  initialHours: BusinessHours;
}) {
  const [activeTab, setActiveTab] = useState<"samanea" | "broadway">("samanea");
  const [hours, setHours] = useState(initialHours);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [alert, setAlert] = useState({
    isOpen: false,
    type: "success" as "success" | "error",
    message: "",
  });

  const updateDay = (
    day: string,
    type: "start" | "end" | "toggle",
    value?: string
  ) => {
    const currentStr =
      hours[activeTab][day as keyof typeof hours.samanea] || "Closed";
    let isClosed = currentStr === "Closed" || currentStr === "";
    let [start, end] = isClosed
      ? ["10:00 AM", "9:00 PM"]
      : currentStr.split(" - ");

    if (type === "toggle") {
      const newVal = isClosed ? "10:00 AM - 9:00 PM" : "Closed";
      setHours((prev) => ({
        ...prev,
        [activeTab]: { ...prev[activeTab], [day]: newVal },
      }));
      return;
    }

    if (type === "start") start = value || start;
    if (type === "end") end = value || end;

    setHours((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [day]: `${start} - ${end}` },
    }));
  };

  const handleSyncSling = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/settings/sync-sling", { method: "POST" });
      if (!res.ok) throw new Error("Failed to sync");
      const data = await res.json();
      if (data.hours) setHours(data.hours);
      setAlert({ isOpen: true, type: "success", message: "Hours synced from Sling successfully!" });
    } catch {
      setAlert({ isOpen: true, type: "error", message: "Failed to sync from Sling. Check API configuration." });
    } finally {
      setSyncing(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "business_hours", value: hours }),
      });

      if (!res.ok) throw new Error("Failed to save");
      setAlert({
        isOpen: true,
        type: "success",
        message: "Business hours updated successfully!",
      });
    } catch (error) {
      setAlert({
        isOpen: true,
        type: "error",
        message: "Failed to update settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage global website configuration.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSyncSling}
            disabled={syncing || saving}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-70 font-medium text-sm"
          >
            {syncing ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <RefreshCw size={16} />
            )}
            Sync from Sling
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || syncing}
            className="flex items-center gap-2 bg-pink-600 text-white px-6 py-2.5 rounded-xl hover:bg-pink-700 transition-colors shadow-sm disabled:opacity-70 font-medium"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-100 flex">
          <button
            type="button"
            onClick={() => setActiveTab("samanea")}
            className={`flex-1 py-4 text-sm font-medium text-center transition-colors border-b-2 ${
              activeTab === "samanea"
                ? "border-pink-500 text-pink-600 bg-pink-50/30"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            Samanea New York
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("broadway")}
            className={`flex-1 py-4 text-sm font-medium text-center transition-colors border-b-2 ${
              activeTab === "broadway"
                ? "border-pink-500 text-pink-600 bg-pink-50/30"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            Broadway Commons
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-8 p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-100">
            <MapPin size={20} />
            <div>
              <p className="font-bold text-sm">
                Editing:{" "}
                {activeTab === "samanea"
                  ? "Samanea Mall (Westbury)"
                  : "Broadway Mall (Hicksville)"}
              </p>
              <p className="text-xs opacity-80">
                Toggle a day to close/open. Use the copy button to apply hours
                to all days.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {DAYS.map((day) => {
              const val =
                hours[activeTab][day as keyof typeof hours.samanea] || "Closed";
              const isClosed = val === "Closed" || val === "";
              const [start, end] = isClosed
                ? ["10:00 AM", "9:00 PM"]
                : val.split(" - ");

              return (
                <div
                  key={day}
                  className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                    isClosed
                      ? "bg-gray-50 border-gray-100"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="w-12 font-bold text-gray-500 uppercase text-xs">
                    {day}
                  </div>

                  {/* Open/Close Toggle */}
                  <button
                    type="button"
                    onClick={() => updateDay(day, "toggle")}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-colors ${
                      isClosed
                        ? "bg-gray-200 text-gray-500 hover:bg-gray-300"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    <Power size={14} />
                    {isClosed ? "Closed" : "Open"}
                  </button>

                  {!isClosed && (
                    <div className="flex items-center gap-2 flex-1">
                      <select
                        value={start}
                        onChange={(e) =>
                          updateDay(day, "start", e.target.value)
                        }
                        aria-label={`${day} opening time`}
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-pink-200 outline-none"
                      >
                        {TIME_OPTIONS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <span className="text-gray-400 text-xs">TO</span>
                      <select
                        value={end}
                        onChange={(e) => updateDay(day, "end", e.target.value)}
                        aria-label={`${day} closing time`}
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-pink-200 outline-none"
                      >
                        {TIME_OPTIONS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        title={alert.type === "success" ? "Saved" : "Error"}
        message={alert.message}
        type={alert.type}
      />
    </div>
  );
}
