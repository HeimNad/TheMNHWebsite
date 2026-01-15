"use client";

import { useEffect, useState, useRef } from "react";
import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import SignatureCanvas from "react-signature-canvas";
import { X, Eye, RefreshCw, FileText, Search } from "lucide-react";
import { Pagination } from "@/components/ui/pagination-control";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedWaiver, setSelectedWaiver] = useState<Waiver | null>(null);
  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const pdfSigCanvasRef = useRef<SignatureCanvas>(null);

  // Pagination & Search State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // Input value
  const [activeSearch, setActiveSearch] = useState(""); // Value used for fetching

  useEffect(() => {
    if (isSignedIn) {
      fetchWaivers(currentPage, pageSize, false, activeSearch);
    }
  }, [isSignedIn, currentPage, pageSize, activeSearch]);

  // Effect to handle signature display when modal opens
  useEffect(() => {
    if (selectedWaiver && selectedWaiver.signature_data && sigCanvasRef.current) {
      // Need a small timeout to ensure canvas is ready
      const timeoutId = setTimeout(() => {
        sigCanvasRef.current?.fromData(selectedWaiver.signature_data);
        sigCanvasRef.current?.off(); // Make it read-only
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedWaiver]);

  const fetchWaivers = async (page: number, limit: number, isManualRefresh = false, search = "") => {
    if (isManualRefresh) setIsRefreshing(true);
    else setLoading(true);

    try {
      const response = await fetch(`/api/admin/waivers?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
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
      setIsRefreshing(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setActiveSearch(searchQuery);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const downloadPDF = (waiver: Waiver) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 15;

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("WAIVER AND RELEASE OF LIABILITY", pageWidth / 2, yPos, { align: "center" });
    yPos += 8;
    
    doc.setFontSize(14);
    doc.setTextColor(236, 72, 153); // Pink color
    doc.text("The MNH Wonder Rides", pageWidth / 2, yPos, { align: "center" });
    doc.setTextColor(0, 0, 0); // Reset to black
    yPos += 12;

    // Introduction Text
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const introText = "This document confirms the participant's agreement to the terms and conditions set forth by The MNH Wonder Rides.";
    doc.text(introText, 14, yPos);
    yPos += 8;

    // Participant Details Table
    autoTable(doc, {
      startY: yPos,
      head: [['Field', 'Details']],
      body: [
        ['Participant Name', waiver.name],
        ['Child\'s Name', waiver.child_name || "N/A"],
        ['Date of Event', new Date(waiver.date).toLocaleDateString()],
        ['Location', waiver.location],
        ['Submission Timestamp', new Date(waiver.created_at).toLocaleString()],
        ['Waiver ID', waiver.id],
      ],
      theme: 'grid',
      headStyles: { fillColor: [236, 72, 153], textColor: 255, fontStyle: 'bold', fontSize: 10 },
      styles: { fontSize: 10, cellPadding: 4 }, // Tighter table
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
    });

    // Get Y position after table
    yPos = (doc as any).lastAutoTable.finalY + 12;

    // Legal Agreement Section
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Agreement & Release", 14, yPos);
    yPos += 8;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60);
    const legalText = `I, the undersigned, acknowledge that I have read and fully understand the "Waiver and Release of Liability" agreement provided by The MNH Wonder Rides. 

I voluntarily assume all risks associated with the use of the electric animal rides and agree to release, discharge, and hold harmless The MNH Company LLC, its owners, and staff from any and all claims, liabilities, or damages arising from my participation or the participation of the minor listed above.

I confirm that I am at least 18 years of age or am the legal guardian of the participant.`;
    
    const splitText = doc.splitTextToSize(legalText, pageWidth - 28);
    doc.text(splitText, 14, yPos);
    
    // Calculate text height roughly (lines * line height)
    const textHeight = splitText.length * 4; 
    yPos += textHeight + 15;

    // Check for page break before Signature
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 20;
    }

    // Signature Section
    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Signature", 14, yPos);
    yPos += 6;

    // Draw box for signature
    doc.setDrawColor(200);
    doc.rect(14, yPos, 150, 75); // Increased box width and height

    // Render signature inside the box
    if (pdfSigCanvasRef.current && waiver.signature_data) {
      pdfSigCanvasRef.current.fromData(waiver.signature_data);
      const signatureImg = pdfSigCanvasRef.current.toDataURL("image/png");
      // Add image with some padding inside the rect (maintaining aspect ratio)
      // Canvas original aspect ratio is 600/300 = 2.
      // Target width in PDF is 140 (150 - 2*5 padding).
      const imgWidth = 140; 
      const imgHeight = imgWidth / 2; // maintain 2:1 aspect ratio
      doc.addImage(signatureImg, "PNG", 19, yPos + 2, imgWidth, imgHeight);
    } else {
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text("[Signature Data Not Available]", 18, yPos + 20);
    }

    // Footer (on the current page)
    const footerY = pageHeight - 10;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, footerY, { align: "center" });

    const url = doc.output('bloburl');
    window.open(url, '_blank');
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
      {/* Hidden Canvas for PDF Generation */}
      <div
        style={{
          position: "absolute",
          top: "-10000px",
          left: "-10000px",
          visibility: "hidden",
        }}
      >
        <SignatureCanvas
          ref={pdfSigCanvasRef}
          penColor="#000000"
          canvasProps={{ width: 600, height: 300 }}
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Waivers</h1>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 flex-1 md:flex-none"
          >
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-600 transition-colors"
              >
                <Search size={16} />
              </button>
            </div>
          </form>

          <button
            onClick={() =>
              fetchWaivers(currentPage, pageSize, true, activeSearch)
            }
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
                  Child&rsquo;s Name
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
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading waivers...
                  </td>
                </tr>
              ) : waivers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No waivers found.
                  </td>
                </tr>
              ) : (
                waivers.map((waiver) => (
                  <tr
                    key={waiver.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(waiver.created_at).toLocaleDateString()} <br />
                      <span className="text-xs text-gray-500">
                        {new Date(waiver.created_at).toLocaleTimeString()}
                      </span>
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
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedWaiver(waiver)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-pink-600 hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                          title="View Details"
                        >
                          <Eye size={16} /> View
                        </button>
                        <button
                          onClick={() => downloadPDF(waiver)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          title="Download PDF"
                        >
                          <FileText size={16} /> PDF
                        </button>
                      </div>
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
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <h3 className="text-xl font-bold text-pink-900 mb-4">
              Waiver Details
            </h3>

            <div className="space-y-4 text-gray-800 mb-6">
              <p>
                <strong>Signed By:</strong> {selectedWaiver.name}
              </p>
              {selectedWaiver.child_name && (
                <p>
                  <strong>Child&rsquo;s Name:</strong> {selectedWaiver.child_name}
                </p>
              )}
              <p>
                <strong>Date of Waiver:</strong>{" "}
                {new Date(selectedWaiver.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Location:</strong> {selectedWaiver.location}
              </p>
              <p>
                <strong>Signed At:</strong>{" "}
                {new Date(selectedWaiver.created_at).toLocaleString()}
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
