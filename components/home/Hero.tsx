"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { useMemo } from "react";

// ── Rainbow ──────────────────────────────────────────────────────────────────
// Bands are spaced exactly one stroke-width apart (no gaps), center sits at
// the bottom edge of the SVG so only the upper half arc is visible.
function Rainbow({
  width = 920,
  opacity = 0.55,
}: {
  width?: number;
  opacity?: number;
}) {
  const bands = [
    "#FF6F91",
    "#FFA552",
    "#FFCD3A",
    "#7BD389",
    "#5BB7E0",
    "#9E7BD3",
  ];
  const stroke = width / 18;
  const cx = width / 2;
  const cy = width / 2;
  const h = width / 2 + stroke;

  return (
    <svg
      width={width}
      height={h}
      viewBox={`0 0 ${width} ${h}`}
      fill="none"
      style={{ opacity }}
      aria-hidden="true"
    >
      {bands.map((color, i) => {
        const r = width / 2 - stroke / 2 - i * stroke;
        if (r <= 0) return null;
        return (
          <path
            key={i}
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

// ── Cloud ────────────────────────────────────────────────────────────────────
function Cloud({ width = 120 }: { width?: number }) {
  return (
    <svg
      width={width}
      height={width * 0.55}
      viewBox="0 0 120 66"
      fill="white"
      aria-hidden="true"
    >
      <path d="M30 50c-11 0-18-7-18-16s7-15 16-15c2-9 10-15 19-15 11 0 19 7 22 17 9 0 17 7 17 16s-8 16-17 16H30z" />
    </svg>
  );
}

// ── Confetti ─────────────────────────────────────────────────────────────────
function ConfettiField({ count = 40 }: { count?: number }) {
  const items = useMemo(() => {
    const palette = [
      "#FF7BAA",
      "#FFCD3A",
      "#7BD389",
      "#5BB7E0",
      "#9E7BD3",
      "#FFA552",
    ];
    const shapes = ["heart", "star", "dot", "ribbon"] as const;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: (i * 100) / count + Math.sin(i * 1.7) * 4,
      delay: -(i * 0.52) % 20,
      dur: 14 + ((i * 7) % 12),
      drift: (((i % 3) - 1) * 30).toFixed(1),
      size: 10 + (i % 14),
      rotFrom: (i * 47) % 360,
      rotTo: ((i * 47) % 360) + (i % 2 === 0 ? 540 : -360),
      color: palette[i % palette.length],
      shape: shapes[i % shapes.length],
    }));
  }, [count]);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {items.map((p) => (
        <div
          key={p.id}
          className="confetti-item"
          style={{
            left: `${p.left}%`,
            top: 0,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            ["--drift" as string]: `${p.drift}vw`,
            ["--rot-from" as string]: `${p.rotFrom}deg`,
            ["--rot-to" as string]: `${p.rotTo}deg`,
          }}
        >
          {p.shape === "heart" && (
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 20 20"
              fill={p.color}
            >
              <path d="M10 17S2 11.5 2 6.5A4.5 4.5 0 0 1 10 4a4.5 4.5 0 0 1 8 2c0 5-8 11-8 11z" />
            </svg>
          )}
          {p.shape === "star" && (
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 20 20"
              fill={p.color}
            >
              <path d="M10 1l2.4 6.6H20l-5.7 4.1 2.2 6.6L10 14.4l-6.5 3.9 2.2-6.6L0 7.6h7.6z" />
            </svg>
          )}
          {p.shape === "dot" && (
            <div
              style={{
                width: p.size * 0.6,
                height: p.size * 0.6,
                borderRadius: "50%",
                background: p.color,
              }}
            />
          )}
          {p.shape === "ribbon" && (
            <div
              style={{
                width: p.size,
                height: p.size * 0.35,
                background: p.color,
                borderRadius: 999,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
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
    <section className="relative overflow-hidden pt-16 min-h-screen flex flex-col">
      {/* Confetti particles */}
      <ConfettiField count={48} />

      {/* Background: rainbow + floating clouds */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute" style={{ bottom: "15%", right: "-8%" }}>
          <Rainbow width={920} opacity={0.55} />
        </div>
        <div
          className="hero-cloud"
          style={{ top: "22%", left: "8%", animationDelay: "0s" }}
        >
          <Cloud width={220} />
        </div>
        <div
          className="hero-cloud"
          style={{
            top: "60%",
            right: "6%",
            animationDelay: "-3s",
            opacity: 0.9,
          }}
        >
          <Cloud width={160} />
        </div>
        <div
          className="hero-cloud"
          style={{
            top: "12%",
            left: "42%",
            animationDelay: "-5s",
            opacity: 0.7,
          }}
        >
          <Cloud width={130} />
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 lg:py-0 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8 text-center lg:text-left z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-pink-700 leading-tight">
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
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-500 aspect-video z-10">
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
