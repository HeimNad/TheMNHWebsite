import { CheckCircle } from "lucide-react";

export function WaiverSuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle size={32} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Waiver Submitted Successfully!
      </h3>
      <p className="text-gray-600 mb-6">
        Thank you for completing the waiver. You are now ready to ride!
      </p>
      <button
        type="button"
        onClick={onReset}
        className="text-pink-600 hover:text-pink-700 font-medium transition-colors"
      >
        Sign another waiver
      </button>
    </div>
  );
}
