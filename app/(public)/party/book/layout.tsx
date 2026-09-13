import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Party Booking Form",
  description:
    "Book a birthday party at The MNH Wonder Rides — choose your package, date and add-ons, and secure your time slot with a deposit.",
  alternates: { canonical: "/party/book" },
};

export default function PartyBookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
