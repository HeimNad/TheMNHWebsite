"use client";

import { useState } from "react";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Patrick_Hand } from "next/font/google";
import { Menu, X, User, LayoutDashboard } from "lucide-react"; // Import User icon
import Image from "next/image";

const patrickHand = Patrick_Hand({
  variable: "--font-patrick-hand",
  subsets: ["latin"],
  weight: "400",
});

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/30 border-b border-white/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          {/* Logo & Title */}
          <div className="shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center">
                <Image
                  src="/favicon.jpg"
                  alt="The MNH Logo"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </div>
              <span
                className={`font-bold text-3xl tracking-tight text-pink-900 ${patrickHand.className}`}
              >
                <span className="xl:hidden">The MNH</span>
                <span className="hidden xl:inline">The MNH Wonder Rides</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center space-x-8">
            <Link
              href="/"
              className="text-pink-900/80 hover:text-pink-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/party"
              className="text-pink-900/80 hover:text-pink-600 font-medium transition-colors"
            >
              Parties
            </Link>
            <Link
              href="/wavier"
              className="text-pink-900/80 hover:text-pink-600 font-medium transition-colors"
            >
              Disclaimer
            </Link>
            <Link
              href="/contact"
              className="text-pink-900/80 hover:text-pink-600 font-medium transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  className="p-2 rounded-full hover:bg-pink-100 transition-colors"
                  aria-label="Sign In"
                >
                  <User size={24} className="text-pink-900" />
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 border-2 border-pink-200",
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="Dashboard"
                    labelIcon={<LayoutDashboard size={15} />}
                    href="/admin"
                  />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-pink-900 hover:text-pink-600 p-2 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-pink-50/95 backdrop-blur-xl border-b border-pink-200 shadow-lg flex flex-col p-4 space-y-4">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-pink-900/80 hover:text-pink-600 font-medium transition-colors block px-2 py-1"
          >
            Home
          </Link>
          <Link
            href="/party"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-pink-900/80 hover:text-pink-600 font-medium transition-colors block px-2 py-1"
          >
            Parties
          </Link>
          <Link
            href="/disclaimer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-pink-900/80 hover:text-pink-600 font-medium transition-colors block px-2 py-1"
          >
            Disclaimer
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-pink-900/80 hover:text-pink-600 font-medium transition-colors block px-2 py-1"
          >
            Contact
          </Link>

          <div className="border-t border-pink-200 pt-4 flex flex-col gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-full text-center border border-pink-300 rounded-lg py-2 text-pink-900 font-medium hover:bg-pink-100 transition-colors cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex justify-center py-2">
                <UserButton
                  showName
                  appearance={{
                    elements: {
                      userButtonBox: "flex-row-reverse",
                      userButtonOuterIdentifier: "text-pink-900 font-medium",
                    },
                  }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="Dashboard"
                      labelIcon={<LayoutDashboard size={15} />}
                      href="/admin"
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  );
}
