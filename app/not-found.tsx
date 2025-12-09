"use client";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-8">Page Not Found</h2>
      <p className="text-lg mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <button
        onClick={() => window.history.back()}
        className="px-6 py-3 bg-pink-600 text-white rounded-md text-lg hover:bg-pink-700 transition duration-300"
      >
        Go previous page
      </button>
    </div>
  );
}
