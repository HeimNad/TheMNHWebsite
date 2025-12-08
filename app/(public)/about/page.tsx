import { MapPin, Clock } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-pink-50 min-h-screen pt-16 pb-16">
      {/* Hero Section */}
      <section className="bg-pink-100/50 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-pink-500 mb-6">
            About Us
          </h1>
          <p className="text-lg sm:text-xl text-pink-700 max-w-2xl mx-auto">
            Creating magical moments, one ride at a time.
          </p>
        </div>
      </section>

      {/* Mission Content */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="prose prose-lg prose-pink mx-auto text-center space-y-8">
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
      </section>

      {/* Locations Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2
          className="text-3xl font-bold text-center mb-12 text-pink-900"
          id="locations"
        >
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
      </section>
    </div>
  );
}
