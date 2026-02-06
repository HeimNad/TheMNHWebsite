import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Birthday Parties & Private Ride Sessions",
  description:
    "Book a private birthday party or ride session at The MNH Wonder Rides. Packages start at $250 with exclusive access to all electric animal rides.",
  alternates: { canonical: "/party" },
};

export default function PartyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
