"use client";

import { useEffect, useState } from "react";
import { X, Megaphone } from "lucide-react";

interface Announcement {
  message: string;
  is_active: boolean;
}

export default function AnnouncementModal() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const res = await fetch("/api/announcement");
        if (res.ok) {
          const data = await res.json();
          // Check if we have an active announcement
          if (data && data.is_active) {
            // Check if user has already dismissed this specific message (optional, using simple session storage)
            const seen = sessionStorage.getItem("announcement_seen");
            if (seen !== data.message) {
              setAnnouncement(data);
              setIsOpen(true);
            }
          }
        }
      } catch (error) {
        console.error("Error checking announcements");
      }
    };

    fetchAnnouncement();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (announcement) {
      sessionStorage.setItem("announcement_seen", announcement.message);
    }
  };

  if (!isOpen || !announcement) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300 relative">
        <div className="bg-pink-500 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Megaphone className="animate-bounce" />
            <span>Announcement</span>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8">
          <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
            {announcement.message}
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleClose}
              className="bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold px-6 py-2.5 rounded-full transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
