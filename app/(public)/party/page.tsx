"use client";

import {
  Star,
  Music,
  PartyPopper,
  Sparkles,
  Palette,
  Calendar,
  Info,
  Gift,
  Heart,
  CheckCircle,
} from "lucide-react";
import { packages, partyEssentials, bringYourOwn } from "./partyPackages";
import { PackageCard } from "./PackageCard";
import { PrivateRideSession } from "./PrivateRideSession";
import { PartyBookingCTA } from "./PartyBookingCTA";

export default function PartyPage() {
  return (
    <div className="bg-pink-50 min-h-screen pt-16 pb-16">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-20 left-10 text-pink-300 opacity-40 animate-bounce">
          <Star size={64} />
        </div>
        <div className="absolute top-40 right-20 text-yellow-300 opacity-40 animate-pulse">
          <Music size={48} />
        </div>
        <div className="absolute bottom-20 left-20 text-blue-300 opacity-40 animate-bounce delay-700">
          <PartyPopper size={56} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-2 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-pink-700 leading-tight">
            Celebrate Your Child&rsquo;s Special Day <br />
            <span className="text-pink-500">at MNH Wonder Rides!</span>
          </h1>
          <p className="text-lg md:text-xl text-pink-700 max-w-3xl mx-auto leading-relaxed">
            Ride, play, create, celebrate! Choose your perfect party below —
            our staff will guide the experience so you can relax, enjoy, and
            celebrate your child&rsquo;s special day!
          </p>
        </div>

        {/* Birthday Packages Heading */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-4xl font-bold text-pink-700 inline-flex items-center gap-3">
            <Sparkles className="text-yellow-400" /> Choose Your Perfect Party!
          </h2>
        </div>

        {/* Package Cards */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch mb-12">
          {packages.map((pkg) => (
            <PackageCard key={pkg.name} pkg={pkg} />
          ))}
        </div>

        {/* DIY activity callout */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-8 flex flex-wrap sm:flex-nowrap items-start gap-4 shadow-sm">
          <span className="bg-yellow-400 text-pink-700 font-bold px-4 py-2 rounded-full shrink-0 text-lg">
            Ages 2+
          </span>
          <div>
            <h3 className="font-bold text-yellow-800 mb-1 flex items-center gap-2">
              <Palette size={18} className="text-yellow-600" />
              DIY Craft Activity
            </h3>
            <p className="text-yellow-900 text-sm">
              Choose <strong>one</strong> activity for your party:{" "}
              <strong>Perler Beads</strong> or <strong>Painting</strong>. All
              supplies included — every child takes their creation home!
            </p>
          </div>
        </div>

        {/* Included with every party / bring your own */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm">
            <h3 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
              <Gift size={22} className="text-orange-500" /> Party Essentials
              Included
            </h3>
            <ul className="space-y-2">
              {partyEssentials.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <CheckCircle
                    className="text-orange-400 shrink-0 mt-0.5"
                    size={18}
                  />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-sm">
            <h3 className="text-xl font-bold text-pink-600 mb-1 flex items-center gap-2">
              <Heart size={22} className="text-pink-500" /> Make It Your Own!
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              You&rsquo;re welcome to bring your own:
            </p>
            <ul className="space-y-2">
              {bringYourOwn.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <CheckCircle
                    className="text-pink-400 shrink-0 mt-0.5"
                    size={18}
                  />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Secondary Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column */}
          <div className="space-y-10">
            <PrivateRideSession />

            {/* Reservation Notice */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl flex items-center gap-4 shadow-sm">
              <Calendar className="text-blue-500 shrink-0" size={32} />
              <div>
                <p className="font-bold text-blue-900">Plan Ahead!</p>
                <p className="text-blue-800">
                  Please reserve at least 2 weeks in advance.
                </p>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-pink-200 shadow-sm">
              <h3 className="text-xl font-bold text-pink-700 mb-4 flex items-center gap-2">
                <Info size={24} className="text-pink-500" /> Notes for All Party
                Packages
              </h3>
              <ul className="space-y-3 text-pink-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">•</span>
                  <span>
                    All party packages include basic cleaning. Excessive waste,
                    food waste, or special setups may incur a cleaning fee of{" "}
                    <strong>$30–$50</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">•</span>
                  <span>
                    No refrigeration or heating is available on site — please
                    plan outside food accordingly.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: CTA & Visuals */}
          <div className="space-y-8 lg:sticky lg:top-24">
            <PartyBookingCTA />
          </div>
        </div>
      </div>
    </div>
  );
}
