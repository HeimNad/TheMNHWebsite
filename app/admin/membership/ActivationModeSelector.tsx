import type { IssueCardFormData } from "./types";

const modeClass = (active: boolean) =>
  `px-3 py-3 rounded-lg border-2 text-sm font-semibold transition-all text-left ${
    active
      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
      : "border-gray-200 text-gray-600 hover:border-gray-300"
  }`;

export function ActivationModeSelector({
  weeklyMode,
  validFrom,
  onChange,
}: {
  weeklyMode: "gift" | "scheduled";
  validFrom: string;
  onChange: (updates: Partial<IssueCardFormData>) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="block text-sm font-medium text-gray-700">
        Activation Mode
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className={modeClass(weeklyMode === "gift")}
          onClick={() => onChange({ weeklyMode: "gift", valid_from: "" })}
        >
          Gift Card
          <span className="block text-xs font-normal mt-1 text-gray-500">
            Activate on first use
          </span>
        </button>
        <button
          type="button"
          className={modeClass(weeklyMode === "scheduled")}
          onClick={() => onChange({ weeklyMode: "scheduled" })}
        >
          Scheduled
          <span className="block text-xs font-normal mt-1 text-gray-500">
            Set start date now
          </span>
        </button>
      </div>

      {weeklyMode === "scheduled" && (
        <div>
          <label
            htmlFor="issue-card-valid-from"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            id="issue-card-valid-from"
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none"
            value={validFrom}
            onChange={(e) => onChange({ valid_from: e.target.value })}
          />
        </div>
      )}
    </div>
  );
}
