import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementModal from "@/components/AnnouncementModal";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EntertainmentBusiness",
  name: "The MNH Wonder Rides",
  description:
    "Electric animal rides for kids at malls in Long Island, NY. Birthday parties, private sessions, and walk-up rides available.",
  url: "https://themnhwonderrides.com",
  telephone: "+1-516-316-2819",
  email: "themnhwonderrides@gmail.com",
  image: "https://themnhwonderrides.com/favicon.jpg",
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "1500 Old Country Rd, Samanea Mall 2nd Floor",
      addressLocality: "Westbury",
      addressRegion: "NY",
      postalCode: "11590",
      addressCountry: "US",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "522 Broadway Mall",
      addressLocality: "Hicksville",
      addressRegion: "NY",
      postalCode: "11801",
      addressCountry: "US",
    },
  ],
  sameAs: ["https://www.instagram.com/themnhwonderrides"],
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnnouncementModal />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
