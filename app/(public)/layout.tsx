import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementModal from "@/components/AnnouncementModal";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementModal />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
