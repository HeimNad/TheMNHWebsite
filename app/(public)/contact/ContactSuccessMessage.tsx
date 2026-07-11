export function ContactSuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Message Sent!
      </h3>
      <p className="text-gray-600 mb-6">
        Thank you for reaching out. We will get back to you shortly.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="text-pink-600 hover:text-pink-700 font-medium"
      >
        Send another message
      </button>
    </div>
  );
}
