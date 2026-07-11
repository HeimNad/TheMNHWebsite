import { Bike, Clock, Users, CheckCircle, AlertCircle } from "lucide-react";

export function PrivateRideSession() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-indigo-100 relative overflow-hidden">
      <h2 className="text-3xl font-bold text-indigo-900 mb-4 flex items-center gap-3">
        <span className="bg-indigo-100 p-2 rounded-full text-indigo-600">
          <Bike size={32} />
        </span>
        Private Ride Session
        <span className="text-base font-normal text-indigo-500 ml-2">
          (Ride Only)
        </span>
      </h2>

      <p className="text-gray-600 mb-6">
        Just want to ride? Book a private session for pure ride fun — no
        party setup needed!
      </p>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 text-indigo-600 font-semibold bg-indigo-50 px-4 py-2 rounded-full">
          <Clock size={20} />
          <span>1 hour</span>
        </div>
        <div className="flex items-center gap-2 text-indigo-600 font-semibold bg-indigo-50 px-4 py-2 rounded-full">
          <Users size={20} />
          <span>Up to 10 children</span>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-indigo-400/50 text-white p-6 rounded-2xl text-center mb-6 shadow-md transform hover:scale-105 transition-transform duration-300">
        <p className="text-sm uppercase tracking-wide opacity-90 mb-1">
          Pricing
        </p>
        <div className="flex justify-center items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold">Weekday: $250/hr</span>
          <span className="text-2xl opacity-80">|</span>
          <span className="text-3xl font-bold">Weekend: $350/hr</span>
        </div>
        <p className="text-sm font-medium bg-white/20 inline-block px-3 py-1 rounded-full">
          Up to 10 children
        </p>
      </div>

      {/* Includes */}
      <div className="space-y-4 mb-6">
        <h3 className="font-bold text-indigo-900 text-lg">Includes:</h3>
        <div className="space-y-3">
          {[
            "Exclusive access to all animal rides",
            "Private ride time for up to 10 children",
            "On-site staff assistance",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <CheckCircle
                className="text-green-500 shrink-0 mt-1"
                size={20}
              />
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
        <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
          <AlertCircle size={18} className="text-amber-500" />
          Please Note
        </h3>
        <ul className="space-y-1 text-amber-900 text-sm">
          <li>• Ride time only (no party setup, food, or cake)</li>
          <li>• Not valid for birthday parties or special events</li>
          <li>• Non-transferable</li>
          <li className="text-xs text-amber-700 mt-2 italic">
            Management reserves the right of final interpretation
          </li>
        </ul>
      </div>
    </div>
  );
}
