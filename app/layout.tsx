import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Fredoka, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://themnhwonderrides.com"),
  title: {
    template: "%s | The MNH Wonder Rides",
    default: "The MNH Wonder Rides",
  },
  description: "MNH Animal Ride for Kids' Parties and Events",
  icons: "/favicon.ico",
  openGraph: {
    siteName: "The MNH Wonder Rides",
    type: "website",
    locale: "en_US",
    images: [{ url: "/favicon.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fredoka.variable} ${geistMono.variable} antialiased font-[family-name:var(--font-fredoka)]`}
      ><ClerkProvider>
          {children}
          <SpeedInsights />
          <Analytics />
        </ClerkProvider></body>
      <GoogleAnalytics gaId="G-J6CX55ZMLD" />
    </html>
  );
}
