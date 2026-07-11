import { Clock, CheckCircle, Users } from "lucide-react";
import { packages } from "./partyPackages";

export function PackageCard({ pkg }: { pkg: (typeof packages)[number] }) {
  const Icon = pkg.Icon;
  return (
    <div
      className={`bg-white rounded-3xl p-6 shadow-xl border-4 ${pkg.theme.border} flex flex-col`}
    >
      <h3
        className={`text-2xl font-bold ${pkg.theme.title} mb-3 flex items-center gap-3`}
      >
        <span className={`${pkg.theme.iconBg} p-2 rounded-full`}>
          <Icon size={28} />
        </span>
        {pkg.name}
      </h3>

      <p className="text-gray-600 text-sm mb-5">{pkg.description}</p>

      {/* Pricing */}
      <div
        className={`${pkg.theme.priceBg} text-white p-4 rounded-2xl text-center mb-5 shadow-md`}
      >
        <div className="flex justify-center items-stretch divide-x divide-white/40">
          <div className="px-4">
            <p className="text-xs uppercase tracking-wide opacity-90">
              Weekday
            </p>
            <p className="text-2xl font-bold">{pkg.weekday}</p>
          </div>
          <div className="px-4">
            <p className="text-xs uppercase tracking-wide opacity-90">
              Weekend
            </p>
            <p className="text-2xl font-bold">{pkg.weekend}</p>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-2 mb-5">
        <div
          className={`flex items-center gap-1.5 font-semibold ${pkg.theme.chip} px-3 py-1.5 rounded-full text-sm`}
        >
          <Clock size={16} />
          <span>{pkg.duration}</span>
        </div>
        <div
          className={`flex items-center gap-1.5 font-semibold ${pkg.theme.chip} px-3 py-1.5 rounded-full text-sm`}
        >
          <Users size={16} />
          <span>{pkg.capacity}</span>
        </div>
      </div>

      {/* Sample Schedule */}
      <div className="mb-5">
        <div
          className={`${pkg.theme.header} text-white text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full inline-block mb-3`}
        >
          Sample Schedule ({pkg.duration})
        </div>
        <ul className="space-y-2 text-sm">
          {pkg.schedule.map(([time, activity]) => (
            <li key={time} className="flex gap-3">
              <span className="font-semibold text-gray-500 whitespace-nowrap tabular-nums">
                {time}
              </span>
              <span className="text-gray-700">{activity}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Includes */}
      <div className="mb-5">
        <div
          className={`${pkg.theme.header} text-white text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full inline-block mb-3`}
        >
          Includes
        </div>
        <ul className="space-y-2">
          {pkg.includes.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm">
              <CheckCircle
                className="text-green-500 shrink-0 mt-0.5"
                size={18}
              />
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Add-on (pinned to bottom) */}
      <div
        className={`${pkg.theme.addon} text-white text-center font-bold py-3 px-4 rounded-2xl mt-auto`}
      >
        {pkg.addon}
      </div>
    </div>
  );
}
