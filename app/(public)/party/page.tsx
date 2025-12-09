"use client";

import Link from "next/link";
import {
  PartyPopper,
  Gamepad2,
  Music,
  Cake,
  Star,
  ArrowRight,
} from "lucide-react";

export default function PartyPage() {
  const partyFeatures = [
    {
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      title: "Magical Animal Rides",
      description:
        "Unlimited access to our fleet of electric plush animals. From unicorns to dinos, let the kids ride to their hearts' content!",
      color: "bg-yellow-50",
      borderColor: "border-yellow-100",
    },
    {
      icon: <Gamepad2 className="w-8 h-8 text-blue-500" />,
      title: "Gaming Zone",
      description:
        "Challenge friends with Nintendo Switch and motion-sensing games. Dance battles, racing, and sports fun for everyone.",
      color: "bg-blue-50",
      borderColor: "border-blue-100",
    },
    {
      icon: <Cake className="w-8 h-8 text-pink-500" />,
      title: "Birthday Celebration",
      description:
        "We provide a festive atmosphere with birthday decorations. Bring your own cake and snacks to celebrate in style!",
      color: "bg-pink-50",
      borderColor: "border-pink-100",
    },
    {
      icon: <Music className="w-8 h-8 text-purple-500" />,
      title: "Music & Atmosphere",
      description:
        "Keep the energy high with our party playlist system. The rides themselves light up and play fun tunes!",
      color: "bg-purple-50",
      borderColor: "border-purple-100",
    },
  ];

  const galleryImages = [
    { color: "bg-pink-200", label: "Happy Riders", emoji: "🦄" },
    { color: "bg-blue-200", label: "Game Time", emoji: "🎮" },
    { color: "bg-yellow-200", label: "Cake Cutting", emoji: "🎂" },
    { color: "bg-purple-200", label: "Group Photos", emoji: "📸" },
  ];

  return (
    <div className="bg-pink-50 min-h-screen pt-16 pb-16">
      {/* Hero Section */}
      <section className="bg-pink-100/50 py-16 sm:py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-pink-300 opacity-50 animate-bounce">
          <PartyPopper size={48} />
        </div>
        <div className="absolute bottom-10 right-10 text-purple-300 opacity-50 animate-bounce delay-700">
          <Star size={48} />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-pink-900 mb-6">
            Celebrate with{" "}
            <span className="text-pink-500">MNH Wonder Rides!</span>
          </h1>
          <p className="text-lg sm:text-xl text-pink-700 max-w-2xl mx-auto mb-10">
            Make your child&rsquo;s special day unforgettable. Combining the joy
            of riding with gaming fun for the ultimate party experience.
          </p>
          <Link
            href="/contact?subject=Party Inquiry#contact-form"
            className="inline-flex items-center gap-2 bg-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-600 transition-colors shadow-lg hover:shadow-pink-200/50"
          >
            Book Your Party Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-pink-900 mb-12">
          Picture Perfect Moments
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              className={`${img.color} aspect-square rounded-2xl flex flex-col items-center justify-center group hover:scale-105 transition-transform duration-300 shadow-sm`}
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                {img.emoji}
              </div>
              <span className="font-semibold text-pink-900">{img.label}</span>
              <span className="text-xs text-black/40 mt-1">
                Image Placeholder
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-pink-900 mb-4">
              What&rsquo;s Included?
            </h2>
            <p className="text-pink-600 max-w-2xl mx-auto">
              We take care of the entertainment so you can focus on making
              memories.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {partyFeatures.map((feature, idx) => (
              <div
                key={idx}
                className={`flex gap-6 p-8 rounded-2xl border ${feature.borderColor} ${feature.color} transition-all hover:shadow-md`}
              >
                <div className="shrink-0 bg-white p-4 rounded-xl shadow-sm h-fit">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info / How it works */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="bg-pink-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <h2 className="text-3xl font-bold mb-6">Ready to Party?</h2>
          <div className="grid sm:grid-cols-3 gap-8 text-pink-100 mb-10">
            <div>
              <div className="bg-pink-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                1
              </div>
              <h3 className="font-semibold mb-2">Check Availability</h3>
              <p className="text-sm opacity-80">
                Contact us to find the perfect date and time.
              </p>
            </div>
            <div>
              <div className="bg-pink-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                2
              </div>
              <h3 className="font-semibold mb-2">Customize Package</h3>
              <p className="text-sm opacity-80">
                Choose your rides and add-ons.
              </p>
            </div>
            <div>
              <div className="bg-pink-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                3
              </div>
              <h3 className="font-semibold mb-2">Confirm Booking</h3>
              <p className="text-sm opacity-80">
                Secure your spot with a deposit.
              </p>
            </div>
          </div>
          <Link
            href="/contact?subject=Party Inquiry#contact-form"
            className="bg-white text-pink-900 px-8 py-3 rounded-full font-bold hover:bg-pink-100 transition-colors inline-block"
          >
            Inquire About Parties
          </Link>
        </div>
      </section>
    </div>
  );
}
