import { useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { X } from "lucide-react";
import { LocalTime } from "@/components/ui/local-time";
import type { Waiver } from "./types";

export function WaiverDetailModal({
  waiver,
  onClose,
}: {
  waiver: Waiver;
  onClose: () => void;
}) {
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  useEffect(() => {
    if (waiver.signature_data && sigCanvasRef.current) {
      // Need a small timeout to ensure canvas is ready
      const timeoutId = setTimeout(() => {
        sigCanvasRef.current?.fromData(waiver.signature_data);
        sigCanvasRef.current?.off(); // Make it read-only
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [waiver]);

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

        <h3 className="text-xl font-bold text-pink-900 mb-4">
          Waiver Details
        </h3>

        <div className="space-y-4 text-gray-800 mb-6">
          <p>
            <strong>Signed By:</strong> {waiver.name}
          </p>
          {waiver.child_name && (
            <p>
              <strong>Child&rsquo;s Name:</strong> {waiver.child_name}
            </p>
          )}
          <p>
            <strong>Date of Waiver:</strong>{" "}
            <LocalTime date={waiver.date} format="date" />
          </p>
          <p>
            <strong>Location:</strong> {waiver.location}
          </p>
          <p>
            <strong>Signed At:</strong>{" "}
            <LocalTime date={waiver.created_at} format="datetime" />
          </p>
        </div>

        <h4 className="text-lg font-semibold text-pink-900 mb-2">
          Signature
        </h4>
        <div className="border border-pink-200 rounded-lg bg-pink-50/20 overflow-auto h-60">
          <SignatureCanvas
            ref={sigCanvasRef}
            penColor="#831843"
            canvasProps={{
              width: 800,
              height: 400,
              className: "block bg-white", // block to respect dimensions, bg-white for visibility
            }}
          />
        </div>

        <div className="mt-6 flex justify-end">
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
