import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Waiver and Release of Liability",
  description:
    "Sign the waiver and release of liability form before riding at The MNH Wonder Rides.",
  alternates: { canonical: "/waiver" },
};

export default function WaiverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
