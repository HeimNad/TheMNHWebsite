import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function PartyBookingCTA() {
  return (
    <>
      {/* Party flyer — shown whole (it's mostly text), never cropped */}
      <div className="bg-white p-3 rounded-3xl shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-500">
        <Image
          src="/party-poster.jpg"
          alt="The MNH Wonder Rides birthday party flyer: Animal Rides Party from $399, DIY Craft Party from $299, Animal Rides + DIY Party from $649, each up to 10 children, with party essentials included. 522 Broadway Mall, Hicksville, NY."
          width={1024}
          height={1536}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="w-full h-auto rounded-2xl"
        />
      </div>

      {/* Booking CTA Card */}
      <div className="bg-pink-900 text-white rounded-3xl p-8 shadow-2xl text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Book?</h2>
        <p className="mb-8 text-pink-100">
          Secure your preferred date and time today to ensure an unforgettable
          celebration!
        </p>

        <Link
          href="/party/book"
          className="group relative inline-flex items-center justify-center gap-3 bg-white text-pink-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-100 transition-all w-full sm:w-auto shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          <span>Book Your Party Now</span>
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>

        <p className="mt-6 text-xs text-pink-300">
          Have questions? Message us on WhatsApp @themnhwonderrides
        </p>
      </div>
    </>
  );
}
