"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { Star, ShieldCheck, MapPin, Smile, Clock } from "lucide-react";

export default function Home() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  const slides = [
    { color: "bg-pink-200", text: "Magical Unicorns" },
    { color: "bg-purple-200", text: "Friendly Dinosaurs" },
    { color: "bg-blue-200", text: "Zooming Zebras" },
    { color: "bg-green-200", text: "Happy Pandas" },
    { color: "bg-yellow-200", text: "Speedy Tigers" },
  ];

  const galleryImages = [
    { color: "bg-pink-100", emoji: "🦄", label: "Unicorns" },
    { color: "bg-blue-100", emoji: "🦕", label: "Dinos" },
    { color: "bg-yellow-100", emoji: "🦁", label: "Lions" },
    { color: "bg-green-100", emoji: "🐼", label: "Pandas" },
  ];

  return (
    <div className="bg-pink-50 min-h-screen">
      {/* Hero Section with Carousel */}
      <section className="relative overflow-hidden pt-16">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-pink-900 leading-tight">
              Spark Joy with <br />
              <span className="text-pink-500">Every Ride!</span>
            </h1>
            <p className="text-lg text-pink-700 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Create safe and fun electric riding companions for children of all
              ages! From glowing unicorns to singing dinosaur cars, our animal
              electric vehicles are designed for endless fun.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/#locations"
                className="bg-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-600 transition-colors shadow-lg hover:shadow-pink-200/50 flex items-center justify-center gap-2"
              >
                View Our Locations <MapPin size={20} />
              </Link>
              <Link
                href="/disclaimer"
                className="bg-white text-pink-600 border-2 border-pink-100 px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-50 transition-colors flex items-center justify-center"
              >
                Sign Waiver
              </Link>
            </div>
          </div>

          {/* Right Carousel */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-500 aspect-square sm:aspect-video lg:aspect-square">
            <div className="embla overflow-hidden bg-white h-full" ref={emblaRef}>
              <div className="flex h-full">
                {slides.map((slide, index) => (
                  <div
                    className="embla__slide flex-[0_0_100%] min-w-0 relative h-full"
                    key={index}
                  >
                    <div
                      className={`w-full h-full ${slide.color} flex items-center justify-center`}
                    >
                      {/* Placeholder for actual images */}
                      <div className="text-center">
                        <div className="text-8xl mb-6">🎠</div>
                        <h3 className="text-3xl font-bold text-white drop-shadow-sm">
                          {slide.text}
                        </h3>
                        <p className="text-white/80 mt-2">Image Placeholder</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Content (Moved from About) */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="prose prose-lg prose-pink mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold text-pink-900 mb-8">About Us</h2>
            <p className="leading-relaxed text-pink-800">
              Founded in 2025,{" "}
              <span className="font-semibold text-pink-900">
                The MNH Wonder Rides
              </span>{" "}
              brings joy and excitement to children and families by setting up
              electric fluffy animal rides in malls. Our mission is simple: we
              believe every child deserves a wonderful childhood filled with fun,
              laughter, and unforgettable moments with their loved ones.
            </p>
            <p className="leading-relaxed text-pink-800">
              With our safe, entertaining, and adorable animal rides, we create
              magical experiences that turn ordinary shopping trips into cherished
              family memories. Whether it&rsquo;s a quick ride or an entire
              afternoon of fun, we&rsquo;re here to make every moment special.
            </p>
            <p className="font-medium text-xl text-pink-500 pt-4">
              Come ride with us and let the adventure begin!
            </p>
          </div>
        </div>
      </section>

      {/* New Gallery Section */}
      <section className="py-16 bg-pink-50">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-pink-900 mb-4">Meet Our Friends</h2>
               <p className="text-pink-600 max-w-2xl mx-auto">See some of our most popular rides waiting for you!</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {galleryImages.map((item, idx) => (
                  <div key={idx} className={`${item.color} rounded-2xl aspect-square flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 shadow-sm cursor-pointer`}>
                     <span className="text-6xl mb-2">{item.emoji}</span>
                     <span className="font-bold text-pink-900">{item.label}</span>
                     <span className="text-xs text-pink-500/70 mt-1">Placeholder</span>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Features / Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-pink-900 mb-4">
              Why Parents Love Us
            </h2>
            <p className="text-pink-600 max-w-2xl mx-auto">
              Accompanying every family&rsquo;s joyful growth time with safety
              and fun at the core.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-pink-50 p-8 rounded-2xl text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-pink-500">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-pink-900 mb-3">
                Safety First
              </h3>
              <p className="text-pink-700">
                Our vehicles are designed with rigorous safety standards,
                allowing children to enjoy exploration while parents feel at
                ease.
              </p>
            </div>

            <div className="bg-pink-50 p-8 rounded-2xl text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-pink-500">
                <Star size={32} />
              </div>
              <h3 className="text-xl font-bold text-pink-900 mb-3">
                Magical Variety
              </h3>
              <p className="text-pink-700">
                From glowing unicorns to singing dinosaur cars, we have a
                companion for every child&rsquo;s imagination.
              </p>
            </div>

            <div className="bg-pink-50 p-8 rounded-2xl text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-pink-500">
                <Smile size={32} />
              </div>
              <h3 className="text-xl font-bold text-pink-900 mb-3">
                Joyful Growth
              </h3>
              <p className="text-pink-700">
                We are dedicated to creating cherished family memories and
                accompanying every child&rsquo;s joyful growth time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section (Moved from About) */}
      <section className="bg-pink-50 py-16" id="locations">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-pink-900">
            Visit Our Store
          </h2>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Location 1: Samanea New York */}
            <div className="bg-white border border-pink-100 rounded-2xl overflow-hidden shadow-sm flex flex-col">
              <div className="h-64 w-full bg-pink-100 relative">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.742748037766!2d-73.59904021712222!3d40.74568579761597!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c287543271f59b%3A0x3477f7fea9700b5f!2sSamanea%20New%20York%20Mall!5e0!3m2!1sen!2sus!4v1765148954844!5m2!1sen!2sus"
                  title="Samanea New York Map"
                  className="absolute inset-0"
                ></iframe>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-pink-900">
                  <MapPin className="text-pink-500" /> Samanea Mall 2nd Floor
                </h3>
                <p className="text-pink-700 mb-6 pl-8">
                  1500 Old Country Rd,
                  <br />
                  Westbury, NY 11590
                </p>

                <div className="mt-auto pl-8">
                  <h4 className="font-semibold flex items-center gap-2 mb-2 text-pink-900">
                    <Clock size={18} className="text-pink-500" /> Business Hours
                  </h4>
                  <ul className="text-sm text-pink-700 space-y-1">
                    <li className="flex justify-between max-w-xs">
                      <span>Fri - Sat:</span>
                      <span>10:00 AM - 9:00 PM</span>
                    </li>
                    <li className="flex justify-between max-w-xs">
                      <span>Sun:</span>
                      <span>11:00 AM - 7:00 PM</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Location 2: Broadway Commons */}
            <div className="bg-white border border-pink-100 rounded-2xl overflow-hidden shadow-sm flex flex-col">
              <div className="h-64 w-full bg-pink-100 relative">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.5394533954764!2d-73.53181769999999!3d40.7721531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c281f6223ed62b%3A0xf32ebdfcbf4b87c3!2sThe%20MNH%20Wonder%20Rides!5e0!3m2!1sen!2sus!4v1765148871451!5m2!1sen!2sus"
                  title="Broadway Commons Map"
                  className="absolute inset-0"
                ></iframe>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-pink-900">
                  <MapPin className="text-pink-500" /> Broadway Commons
                </h3>
                <p className="text-pink-700 mb-6 pl-8">
                  522 Broadway Mall,
                  <br />
                  Hicksville, NY 11801
                </p>

                <div className="mt-auto pl-8">
                  <h4 className="font-semibold flex items-center gap-2 mb-2 text-pink-900">
                    <Clock size={18} className="text-pink-500" /> Business Hours
                  </h4>
                  <ul className="text-sm text-pink-700 space-y-1">
                    <li className="flex justify-between max-w-xs">
                      <span>Mon - Sat:</span>
                      <span>10:00 AM - 9:00 PM</span>
                    </li>
                    <li className="flex justify-between max-w-xs">
                      <span>Sun:</span>
                      <span>11:00 AM - 7:00 PM</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
