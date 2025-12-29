"use client";

import { CheckCircle, AlertCircle } from "lucide-react";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "success" | "error";
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = "success",
}: AlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-70 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 relative animate-in zoom-in-95">
        <div className="flex flex-col items-center text-center">
          <div
            className={`p-3 rounded-full mb-4 ${
              type === "success"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {type === "success" ? (
              <CheckCircle size={32} />
            ) : (
              <AlertCircle size={32} />
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 mb-6">{message}</p>
          <button
            onClick={onClose}
            className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
}
