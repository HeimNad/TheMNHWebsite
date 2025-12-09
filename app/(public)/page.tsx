"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { Star, ShieldCheck, Heart, MapPin, Smile } from "lucide-react";

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
                href="/about#locations"
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

      {/* New Gallery Section */}
      <section className="py-16 bg-white/50">
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
    </div>
  );
}