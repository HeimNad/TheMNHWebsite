"use client";

import Image from "next/image";

export default function Gallery() {
  const galleryImages = [
    { image: "/home/home-7.jpg", label: "Happy Moments" },
    { image: "/home/home-8.png", label: "Celebrations" },
    { image: "/home/home-3.jpg", label: "Fun with Friends" },
    { image: "/home/home-9.jpg", label: "Joyful Rides" },
  ];

  return (
    <section className="py-16 bg-pink-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-pink-900 mb-4">
            Wonderful Moments
          </h2>
          <p className="text-pink-600 max-w-2xl mx-auto">
            Capturing the joy and laughter of our little riders and their
            families.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {galleryImages.map((item, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl aspect-square overflow-hidden hover:scale-105 transition-transform duration-300 shadow-sm cursor-pointer group"
            >
              <Image
                src={item.image}
                alt={item.label}
                fill
                className="object-cover group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 bg-black/20 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="font-bold text-white text-lg drop-shadow-md">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
