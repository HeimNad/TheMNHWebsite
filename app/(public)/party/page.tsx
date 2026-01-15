"use client";

import Link from "next/link";
import Image from "next/image";
import {
  PartyPopper,
  Clock,
  CheckCircle,
  Calendar,
  Star,
  Music,
  ArrowRight,
  Info,
  Bike,
  Users,
  AlertCircle,
} from "lucide-react";

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
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-pink-900 leading-tight">
            Celebrate Your Child&rsquo;s Special Day <br />
            <span className="text-pink-500">at MNH Wonder Rides!</span>
          </h1>
          <p className="text-lg md:text-xl text-pink-700 max-w-3xl mx-auto leading-relaxed">
            We make your child&rsquo;s birthday unforgettable with exclusive
            access to our adorable electric animal rides and fun play
            activities. Our staff will guide the experience so you can relax,
            enjoy, and celebrate your child&rsquo;s special day!
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Package Details */}
          <div className="space-y-10">
            {/* Private Birthday Party Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-pink-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-yellow-400 text-pink-900 font-bold px-6 py-2 rounded-bl-2xl shadow-sm">
                Best Value!
              </div>

              <h2 className="text-3xl font-bold text-pink-900 mb-4 flex items-center gap-3">
                <span className="bg-pink-100 p-2 rounded-full text-pink-600">
                  <PartyPopper size={32} />
                </span>
                Private Birthday Party
              </h2>

              <p className="text-gray-600 mb-6">
                The complete birthday experience with rides, games, celebration
                area, and all party supplies included!
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2 text-pink-600 font-semibold bg-pink-50 px-4 py-2 rounded-full">
                  <Clock size={20} />
                  <span>2 hours</span>
                </div>
                <div className="flex items-center gap-2 text-pink-600 font-semibold bg-pink-50 px-4 py-2 rounded-full">
                  <Users size={20} />
                  <span>Up to 10 kids (ages 2+)</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-pink-400/50 text-white p-6 rounded-2xl text-center mb-6 shadow-md transform hover:scale-105 transition-transform duration-300">
                <p className="text-sm uppercase tracking-wide opacity-90 mb-1">
                  Pricing
                </p>
                <div className="flex justify-center items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold">Weekday: $449</span>
                  <span className="text-2xl opacity-80">|</span>
                  <span className="text-3xl font-bold">Weekend: $549</span>
                </div>
                <p className="text-sm font-medium bg-white/20 inline-block px-3 py-1 rounded-full">
                  Up to 10 kids (ages 2+)
                </p>
              </div>

              {/* Includes */}
              <div className="space-y-4 mb-6">
                <h3 className="font-bold text-pink-900 text-lg">Includes:</h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle
                      className="text-green-500 shrink-0 mt-1"
                      size={20}
                    />
                    <div>
                      <span className="font-semibold text-gray-700">
                        Private use of the entire play area for 2 hours
                      </span>
                      <ul className="mt-2 ml-4 space-y-1 text-sm text-gray-600 border-l-2 border-pink-100 pl-4">
                        <li>• 50 minutes of animal ride time</li>
                        <li>• 90 minutes of game play (blocks, games & interactive zone)</li>
                        <li>• 30 minutes for celebration</li>
                      </ul>
                    </div>
                  </div>

                  {[
                    "Exclusive use of all 10 electric animal rides",
                    "On-site staff assistance throughout the party",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle
                        className="text-green-500 shrink-0 mt-1"
                        size={20}
                      />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}

                  <div className="flex items-start gap-3">
                    <CheckCircle
                      className="text-green-500 shrink-0 mt-1"
                      size={20}
                    />
                    <div>
                      <span className="text-gray-700">
                        Designated celebration area for cake & food
                      </span>
                      <p className="text-xs text-gray-500 mt-1 italic">
                        (No refrigeration or heating available on-site)
                      </p>
                    </div>
                  </div>

                  {[
                    "Water bottles provided for all kids",
                    "Small gift for each child",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle
                        className="text-green-500 shrink-0 mt-1"
                        size={20}
                      />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}

                  <div className="flex items-start gap-3">
                    <CheckCircle
                      className="text-green-500 shrink-0 mt-1"
                      size={20}
                    />
                    <div>
                      <span className="text-gray-700">
                        Basic post-party cleaning included
                      </span>
                      <p className="text-xs text-gray-500 mt-1 italic">
                        (Excessive waste or special setups may incur a fee)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle
                      className="text-green-500 shrink-0 mt-1"
                      size={20}
                    />
                    <div>
                      <span className="font-semibold text-gray-700">
                        All party paper products included
                      </span>
                      <ul className="mt-2 ml-4 space-y-1 text-sm text-gray-600 border-l-2 border-pink-100 pl-4">
                        <li>• Theme plates, napkins & utensils</li>
                        <li className="text-pink-600 italic">
                          (Cups not included — we provide water bottles instead)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add-on */}
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                <h3 className="font-bold text-yellow-800 mb-1 flex items-center gap-2">
                  <Star size={18} className="fill-yellow-500 text-yellow-500" />
                  Add-on Option
                </h3>
                <p className="text-yellow-900 text-sm">
                  <strong>Additional child sharing ride time: +$35</strong>
                  <br />
                  (Up to 14 kids total. Ride time may be rotated.)
                </p>
              </div>
            </div>

            {/* Private Ride Session Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-indigo-100 relative overflow-hidden">
              <h2 className="text-3xl font-bold text-indigo-900 mb-4 flex items-center gap-3">
                <span className="bg-indigo-100 p-2 rounded-full text-indigo-600">
                  <Bike size={32} />
                </span>
                Private Ride Session
                <span className="text-base font-normal text-indigo-500 ml-2">
                  (Ride Only)
                </span>
              </h2>

              <p className="text-gray-600 mb-6">
                Just want to ride? Book a private session for pure ride fun —
                no party setup needed!
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2 text-indigo-600 font-semibold bg-indigo-50 px-4 py-2 rounded-full">
                  <Clock size={20} />
                  <span>1 hour</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-600 font-semibold bg-indigo-50 px-4 py-2 rounded-full">
                  <Users size={20} />
                  <span>Up to 10 children</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-indigo-400/50 text-white p-6 rounded-2xl text-center mb-6 shadow-md transform hover:scale-105 transition-transform duration-300">
                <p className="text-sm uppercase tracking-wide opacity-90 mb-1">
                  Pricing
                </p>
                <div className="flex justify-center items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold">Weekday: $250/hr</span>
                  <span className="text-2xl opacity-80">|</span>
                  <span className="text-3xl font-bold">Weekend: $350/hr</span>
                </div>
                <p className="text-sm font-medium bg-white/20 inline-block px-3 py-1 rounded-full">
                  Up to 10 children
                </p>
              </div>

              {/* Includes */}
              <div className="space-y-4 mb-6">
                <h3 className="font-bold text-indigo-900 text-lg">Includes:</h3>
                <div className="space-y-3">
                  {[
                    "Exclusive access to all animal rides",
                    "Private ride time for up to 10 children",
                    "On-site staff assistance",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle
                        className="text-green-500 shrink-0 mt-1"
                        size={20}
                      />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                  <AlertCircle size={18} className="text-amber-500" />
                  Please Note
                </h3>
                <ul className="space-y-1 text-amber-900 text-sm">
                  <li>• Ride time only (no party setup, food, or cake)</li>
                  <li>• Not valid for birthday parties or special events</li>
                  <li>• Non-transferable</li>
                  <li className="text-xs text-amber-700 mt-2 italic">
                    Management reserves the right of final interpretation
                  </li>
                </ul>
              </div>
            </div>

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
              <h3 className="text-xl font-bold text-pink-900 mb-4 flex items-center gap-2">
                <Info size={24} className="text-pink-500" /> Notes for All Party
                Packages
              </h3>
              <ul className="space-y-3 text-pink-800 text-sm">
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
                    Guests may bring their own cake and food.
                    <span className="block text-xs text-pink-600 mt-1 font-medium bg-pink-100 w-fit px-2 py-0.5 rounded">
                      (No refrigeration or heating available on site)
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: CTA & Visuals */}
          <div className="space-y-8 lg:sticky lg:top-24">
            {/* Image Placeholder Area - Simulating the Poster Image */}
            <div className="bg-white p-4 rounded-3xl shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-4/3 bg-linear-to-br from-pink-100 to-purple-100 rounded-2xl overflow-hidden relative group">
                {/* You can replace this div with an actual <Image /> component */}
                {/* <div className="absolute inset-0 flex items-center justify-center text-pink-300">
                  <div className="text-center">
                    <p className="text-6xl mb-2">🎈🎂🎉</p>
                    <p className="font-bold text-xl text-pink-400">
                      Party Zone Photo
                    </p>
                  </div>
                </div> */}
                <Image
                  src="/party.png"
                  alt="Party Zone Photo"
                  fill
                  className="object-cover"
                />

                {/* Overlay Text */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md p-4 text-white">
                  <p className="font-bold text-lg">Safe & Exciting Space</p>
                  <p className="text-sm opacity-90">
                    Interactive play zone with blocks & games
                  </p>
                </div>
              </div>
            </div>

            {/* Booking CTA Card */}
            <div className="bg-pink-900 text-white rounded-3xl p-8 shadow-2xl text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Book?</h2>
              <p className="mb-8 text-pink-100">
                Secure your preferred date and time today to ensure an
                unforgettable celebration!
              </p>

              <Link
                href="/contact?subject=Party Inquiry#contact-form"
                className="group relative inline-flex items-center justify-center gap-3 bg-white text-pink-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-100 transition-all w-full sm:w-auto shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <span>Book Your Party Now</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <p className="mt-6 text-xs text-pink-300">
                Have questions? Call us at (516) 423-6988
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
