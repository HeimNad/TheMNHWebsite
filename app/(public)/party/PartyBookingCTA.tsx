import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function PartyBookingCTA() {
  return (
    <>
      {/* Image Placeholder Area - Simulating the Poster Image */}
      <div className="bg-white p-4 rounded-3xl shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-500">
        <div className="aspect-4/3 bg-linear-to-br from-pink-100 to-purple-100 rounded-2xl overflow-hidden relative group">
          <Image
            src="/party.png"
            alt="Party Zone Photo"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
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
          Secure your preferred date and time today to ensure an unforgettable
          celebration!
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
    </>
  );
}
