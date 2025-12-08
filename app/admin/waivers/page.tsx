"use client";

import { useEffect, useState, useRef } from "react";
import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import SignatureCanvas from "react-signature-canvas";
import { X, Eye } from "lucide-react";
import { Pagination } from "@/components/ui/pagination-control";

interface Waiver {
  id: string;
  name: string;
  child_name: string | null;
  date: string;
  location: string;
  signature_data: any[]; // JSON data for signature
  created_at: string;
}

export default function AdminPage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const [waivers, setWaivers] = useState<Waiver[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWaiver, setSelectedWaiver] = useState<Waiver | null>(null);
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (isSignedIn) {
      fetchWaivers(currentPage, pageSize);
    }
  }, [isSignedIn, currentPage, pageSize]);

  // Effect to handle signature display when modal opens
  useEffect(() => {
    if (selectedWaiver && selectedWaiver.signature_data && sigCanvasRef.current) {
      // Need a small timeout to ensure canvas is ready
      setTimeout(() => {
        sigCanvasRef.current?.fromData(selectedWaiver.signature_data);
        sigCanvasRef.current?.off(); // Make it read-only
      }, 100);
    }
  }, [selectedWaiver]);

  const fetchWaivers = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/waivers?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch waivers');
      }
      const data = await response.json();
      setWaivers(data.data || []);
      setTotalItems(data.pagination.total);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error("Error fetching waivers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  if (!isLoaded) return <div className="p-8 text-center">Loading...</div>;

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  // Optional: Check for specific admin emails
  // if (user.primaryEmailAddress?.emailAddress !== "your-admin-email@example.com") {
  //   return <div>Unauthorized access.</div>;
  // }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Waiver Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Signed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Child's Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Loading waivers...
                  </td>
                </tr>
              ) : waivers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No waivers found.
                  </td>
                </tr>
              ) : (
                waivers.map((waiver) => (
                  <tr key={waiver.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(waiver.created_at).toLocaleDateString()} <br/>
                      <span className="text-xs text-gray-500">{new Date(waiver.created_at).toLocaleTimeString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {waiver.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {waiver.child_name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {waiver.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedWaiver(waiver)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-pink-600 hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                        title="View Details"
                      >
                        <Eye size={16} /> View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Control */}
        {!loading && waivers.length > 0 && (
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

      {/* Waiver Details Modal */}
      {selectedWaiver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedWaiver(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-xl font-bold text-pink-900 mb-4">Waiver Details</h3>
            
            <div className="space-y-4 text-gray-800 mb-6">
              <p><strong>Signed By:</strong> {selectedWaiver.name}</p>
              {selectedWaiver.child_name && <p><strong>Child's Name:</strong> {selectedWaiver.child_name}</p>}
              <p><strong>Date of Waiver:</strong> {new Date(selectedWaiver.date).toLocaleDateString()}</p>
              <p><strong>Location:</strong> {selectedWaiver.location}</p>
              <p><strong>Signed At:</strong> {new Date(selectedWaiver.created_at).toLocaleString()}</p>
            </div>

            <h4 className="text-lg font-semibold text-pink-900 mb-2">Signature</h4>
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
                onClick={() => setSelectedWaiver(null)}
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