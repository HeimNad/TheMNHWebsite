import { WAIVER_PARAGRAPHS, WAIVER_RULES } from "./waiverTerms";

export function WaiverRulesNotice() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-8 mb-8 space-y-6">
      <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
        <p className="text-pink-700 font-medium text-sm">
          <span className="font-bold">NOTICE:</span> This Waiver and Release
          of Liability Agreement is a legal document that limits and affects
          your rights. Please read carefully before submitting.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-bold text-pink-700 mb-4">
          The MNH Wonder Rides Rules
        </h2>
        <ul className="space-y-2 text-pink-700 list-disc pl-5">
          {WAIVER_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-4 text-pink-700 text-sm leading-relaxed">
        {WAIVER_PARAGRAPHS.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
