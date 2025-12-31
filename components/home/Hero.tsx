"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";

export default function Hero() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  const slides = [
    { image: "/home/home-5.jpg", alt: "Samana Store Full" },
    { image: "/home/home-4.jpg", alt: "BoardWay Commons Store Full" },
    { image: "/home/home-6.jpg", alt: "Samana Store Animals" },
    { image: "/home/home-1.jpg", alt: "BoardWay Commons Store Left Side" },
    { image: "/home/home-2.jpg", alt: "BoardWay Commons Store Right Side" },
  ];

  return (
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
              href="/waiver"
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
                  <div className="relative w-full h-full">
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
