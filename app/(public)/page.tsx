import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Gallery from "@/components/home/Gallery";
import Link from "next/link";
import { Star, ShieldCheck, MapPin, Smile, Clock } from "lucide-react";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Kids' Animal Rides for Parties & Events",
  description:
    "The MNH Wonder Rides brings joy to children with safe electric animal rides at Samanea Mall and Broadway Commons in Long Island, NY.",
  alternates: { canonical: "/" },
};

// Ensure dynamic fetching for settings
export const dynamic = "force-dynamic";

// Default hours fallback
const DEFAULT_HOURS = {
  samanea: {
    Mon: "Closed",
    Tue: "Closed",
    Wed: "Closed",
    Thu: "Closed",
    Fri: "3:00 PM - 9:00 PM",
    Sat: "11:00 AM - 8:00 PM",
    Sun: "11:00 AM - 8:00 PM",
  },
  broadway: {
    Mon: "3:00 PM - 8:00 PM",
    Tue: "3:00 PM - 8:00 PM",
    Wed: "3:00 PM - 8:00 PM",
    Thu: "3:00 PM - 8:00 PM",
    Fri: "3:00 PM - 8:00 PM",
    Sat: "11:00 AM - 8:00 PM",
    Sun: "12:00 AM - 7:00 PM",
  },
};

const DAYS_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function groupHours(hoursMap: Record<string, string>) {
  const groups: { days: string[]; time: string }[] = [];
  
  DAYS_ORDER.forEach((day) => {
    const time = hoursMap[day] || "Closed";
    const lastGroup = groups[groups.length - 1];

    if (lastGroup && lastGroup.time === time) {
      lastGroup.days.push(day);
    } else {
      groups.push({ days: [day], time });
    }
  });

  return groups.map((g) => {
    const dayLabel = g.days.length > 1 
      ? `${g.days[0]} - ${g.days[g.days.length - 1]}` 
      : g.days[0];
    return { label: dayLabel, time: g.time };
  });
}

export default async function Home() {
  // Fetch dynamic hours
  let hoursData = DEFAULT_HOURS;
  try {
    const settingsResult = await db.sql`SELECT value FROM settings WHERE key = 'business_hours'`;
    if ((settingsResult.rowCount ?? 0) > 0) {
      hoursData = settingsResult.rows[0].value;
    }
  } catch (e) {
    console.error("Failed to fetch business hours", e);
  }

  const samaneaHours = groupHours(hoursData.samanea);
  const broadwayHours = groupHours(hoursData.broadway);

  return (
    <div className="bg-pink-50 min-h-screen">
      <Hero />

      {/* Mission Content */}
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

      <Gallery />

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

      {/* Locations Section (Dynamic) */}
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
                    {samaneaHours.map((h, i) => (
                      <li key={i} className="flex justify-between max-w-xs">
                        <span className="font-medium">{h.label}:</span>
                        <span>{h.time}</span>
                      </li>
                    ))}
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
                    {broadwayHours.map((h, i) => (
                      <li key={i} className="flex justify-between max-w-xs">
                        <span className="font-medium">{h.label}:</span>
                        <span>{h.time}</span>
                      </li>
                    ))}
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