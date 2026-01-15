"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, MapPin, Power } from "lucide-react";
import { AlertModal } from "@/components/ui/alert-modal";

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
// Add full range if needed, or keep it focused on mall hours

const DEFAULT_HOURS_STR = {
  samanea: {
    Mon: "Closed",
    Tue: "Closed",
    Wed: "Closed",
    Thu: "Closed",
    Fri: "3:00 PM - 9:00 PM",
    Sat: "11:00 AM - 8:00 PM",
    Sun: "11:00 AM - 8:00 PM",
  },
  broadway: {
    Mon: "3:00 PM - 8:00 PM",
    Tue: "3:00 PM - 8:00 PM",
    Wed: "3:00 PM - 8:00 PM",
    Thu: "3:00 PM - 8:00 PM",
    Fri: "3:00 PM - 8:00 PM",
    Sat: "11:00 AM - 8:00 PM",
    Sun: "12:00 AM - 7:00 PM",
  },
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"samanea" | "broadway">("samanea");
  const [hours, setHours] = useState(DEFAULT_HOURS_STR);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({
    isOpen: false,
    type: "success" as "success" | "error",
    message: "",
  });

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/admin/settings?key=business_hours", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data) setHours(data);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') console.error('Failed to fetch settings:', err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

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

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">Loading settings...</div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage global website configuration.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-100 flex">
          <button
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
