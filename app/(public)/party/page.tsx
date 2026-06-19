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
  Palette,
  Sparkles,
} from "lucide-react";

const packages = [
  {
    name: "Animal Rides Party",
    Icon: PartyPopper,
    description:
      "Exclusive animal ride time plus play area fun — the classic MNH birthday experience!",
    weekday: "$399",
    weekend: "$499",
    duration: "1.5 Hours",
    capacity: "Up to 10 Children",
    schedule: [
      ["0:00–0:15", "Guest Arrival & Check-In"],
      ["0:15–1:00", "Animal Rides & Play Area (Approx. 45 mins)"],
      ["1:00–1:25", "Food, Cake & Celebration"],
      ["1:25–1:30", "Photos & Free Play"],
    ],
    includes: [
      "Extended Animal Ride Session",
      "Play Area Access",
      "Party Seating Area",
      "Staff Assistance",
    ],
    addon: "Additional Child: +$35",
    theme: {
      border: "border-pink-100",
      iconBg: "bg-pink-100 text-pink-600",
      title: "text-pink-700",
      priceBg: "bg-pink-400/60",
      chip: "text-pink-600 bg-pink-50",
      header: "bg-pink-500",
      addon: "bg-pink-500",
    },
  },
  {
    name: "DIY Craft Party",
    Icon: Palette,
    description:
      "Paint, create, and take home a one-of-a-kind figure — a hands-on celebration for little artists!",
    weekday: "$299",
    weekend: "$399",
    duration: "1.5 Hours",
    capacity: "Up to 10 Children",
    schedule: [
      ["0:00–0:15", "Guest Arrival & Check-In"],
      ["0:15–1:00", "DIY Painting Activity (Approx. 45 mins)"],
      ["1:00–1:25", "Food, Cake & Celebration"],
      ["1:25–1:30", "Photos & Take Home Creations"],
    ],
    includes: [
      "One DIY Kit Per Child",
      "Paints & Supplies Included",
      "Party Seating Area",
      "Take Home Creation",
    ],
    addon: "Additional DIY Kit: +$30",
    theme: {
      border: "border-teal-100",
      iconBg: "bg-teal-100 text-teal-600",
      title: "text-teal-700",
      priceBg: "bg-teal-400/60",
      chip: "text-teal-600 bg-teal-50",
      header: "bg-teal-500",
      addon: "bg-teal-500",
    },
  },
  {
    name: "Animal Rides + DIY Party",
    Icon: Sparkles,
    description:
      "The ultimate combo! Animal rides, play, and a DIY painting activity all in one extended party.",
    weekday: "$649",
    weekend: "$749",
    duration: "2 Hours",
    capacity: "Up to 10 Children",
    schedule: [
      ["0:00–0:15", "Guest Arrival & Check-In"],
      ["0:15–0:50", "Animal Rides & Play Area (Approx. 35 mins)"],
      ["0:50–1:25", "DIY Painting Activity (Approx. 35 mins)"],
      ["1:25–1:55", "Food, Cake & Celebration"],
      ["1:55–2:00", "Group Photos & Pick Up Creations"],
    ],
    includes: [
      "Animal Ride Session",
      "One DIY Kit Per Child",
      "Paints & Supplies Included",
      "Play Area Access",
      "Party Seating Area",
      "Take Home Creation",
    ],
    addon: "Additional Child + DIY Kit: +$60",
    theme: {
      border: "border-purple-100",
      iconBg: "bg-purple-100 text-purple-600",
      title: "text-purple-700",
      priceBg: "bg-purple-400/60",
      chip: "text-purple-600 bg-purple-50",
      header: "bg-purple-500",
      addon: "bg-purple-500",
    },
  },
];

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
          {packages.map((pkg) => {
            const Icon = pkg.Icon;
            return (
              <div
                key={pkg.name}
                className={`bg-white rounded-3xl p-6 shadow-xl border-4 ${pkg.theme.border} flex flex-col`}
              >
                <h3
                  className={`text-2xl font-bold ${pkg.theme.title} mb-3 flex items-center gap-3`}
                >
                  <span className={`${pkg.theme.iconBg} p-2 rounded-full`}>
                    <Icon size={28} />
                  </span>
                  {pkg.name}
                </h3>

                <p className="text-gray-600 text-sm mb-5">{pkg.description}</p>

                {/* Pricing */}
                <div
                  className={`${pkg.theme.priceBg} text-white p-4 rounded-2xl text-center mb-5 shadow-md`}
                >
                  <div className="flex justify-center items-stretch divide-x divide-white/40">
                    <div className="px-4">
                      <p className="text-xs uppercase tracking-wide opacity-90">
                        Weekday
                      </p>
                      <p className="text-2xl font-bold">{pkg.weekday}</p>
                    </div>
                    <div className="px-4">
                      <p className="text-xs uppercase tracking-wide opacity-90">
                        Weekend
                      </p>
                      <p className="text-2xl font-bold">{pkg.weekend}</p>
                    </div>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <div
                    className={`flex items-center gap-1.5 font-semibold ${pkg.theme.chip} px-3 py-1.5 rounded-full text-sm`}
                  >
                    <Clock size={16} />
                    <span>{pkg.duration}</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 font-semibold ${pkg.theme.chip} px-3 py-1.5 rounded-full text-sm`}
                  >
                    <Users size={16} />
                    <span>{pkg.capacity}</span>
                  </div>
                </div>

                {/* Sample Schedule */}
                <div className="mb-5">
                  <div
                    className={`${pkg.theme.header} text-white text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full inline-block mb-3`}
                  >
                    Sample Schedule ({pkg.duration})
                  </div>
                  <ul className="space-y-2 text-sm">
                    {pkg.schedule.map(([time, activity]) => (
                      <li key={time} className="flex gap-3">
                        <span className="font-semibold text-gray-500 whitespace-nowrap tabular-nums">
                          {time}
                        </span>
                        <span className="text-gray-700">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Includes */}
                <div className="mb-5">
                  <div
                    className={`${pkg.theme.header} text-white text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full inline-block mb-3`}
                  >
                    Includes
                  </div>
                  <ul className="space-y-2">
                    {pkg.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <CheckCircle
                          className="text-green-500 shrink-0 mt-0.5"
                          size={18}
                        />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Add-on (pinned to bottom) */}
                <div
                  className={`${pkg.theme.addon} text-white text-center font-bold py-3 px-4 rounded-2xl mt-auto`}
                >
                  {pkg.addon}
                </div>
              </div>
            );
          })}
        </div>

        {/* DIY Kit callout */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-12 flex items-start gap-4 shadow-sm">
          <span className="bg-yellow-400 text-pink-700 font-bold px-4 py-2 rounded-full shrink-0 text-lg">
            $30 / Kit
          </span>
          <div>
            <h3 className="font-bold text-yellow-800 mb-1 flex items-center gap-2">
              <Palette size={18} className="text-yellow-600" />
              DIY Painting Activity
            </h3>
            <p className="text-yellow-900 text-sm">
              Each DIY kit includes a figure, paints, brushes &amp; a take-home
              creation. Fun for kids of all ages!
            </p>
          </div>
        </div>

        {/* Secondary Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column */}
          <div className="space-y-10">
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
                <Image
                  src="/party.png"
                  alt="Party Zone Photo"
                  fill
                  className="object-cover"
                />

                {/* Overlay Text */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md p-4 text-white">
                  <p className="font-bold text-lg">Safe &amp; Exciting Space</p>
                  <p className="text-sm opacity-90">
                    Interactive play zone with blocks &amp; games
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
                className="group relative inline-flex items-center justify-center gap-3 bg-white text-pink-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-100 transition-all w-full sm:w-auto shadow-lg hover:shadow-xl hover:-translate-y-1"
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
