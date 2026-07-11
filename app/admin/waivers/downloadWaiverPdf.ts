import type SignatureCanvas from "react-signature-canvas";
import type { Waiver } from "./types";

export async function downloadWaiverPdf(
  waiver: Waiver,
  pdfSigCanvasRef: React.RefObject<SignatureCanvas | null>
) {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
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
}
