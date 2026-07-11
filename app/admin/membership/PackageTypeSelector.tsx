import type { IssueCardFormData } from "./types";

const punchClass = (active: boolean) =>
  `px-3 py-3 rounded-lg border-2 text-sm font-semibold transition-all ${
    active
      ? "border-pink-500 bg-pink-50 text-pink-700"
      : "border-gray-200 text-gray-600 hover:border-gray-300"
  }`;
const passClass = (active: boolean) =>
  `px-3 py-3 rounded-lg border-2 text-sm font-semibold transition-all ${
    active
      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
      : "border-gray-200 text-gray-600 hover:border-gray-300"
  }`;

export function PackageTypeSelector({
  type,
  onChange,
}: {
  type: string;
  onChange: (updates: Partial<IssueCardFormData>) => void;
}) {
  return (
    <div>
      <div className="block text-sm font-medium text-gray-700 mb-1">
        Package Type
      </div>
      <div className="space-y-3">
        {/* Row 1: 5+1, 10+3 */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className={punchClass(type === "5_plus_1")}
            onClick={() => onChange({ type: "5_plus_1", valid_from: "" })}
          >
            5 + 1 Free
            <span className="block text-xs font-normal mt-1 text-gray-500">
              6 Rides
            </span>
          </button>
          <button
            type="button"
            className={punchClass(type === "10_plus_3")}
            onClick={() => onChange({ type: "10_plus_3", valid_from: "" })}
          >
            10 + 3 Free
            <span className="block text-xs font-normal mt-1 text-gray-500">
              13 Rides
            </span>
          </button>
        </div>
        {/* Row 2: 10+1 */}
        <button
          type="button"
          className={`w-full ${punchClass(type === "10_plus_1")}`}
          onClick={() => onChange({ type: "10_plus_1", valid_from: "" })}
        >
          10 + 1 Free
          <span className="block text-xs font-normal mt-1 text-gray-500">
            11 Rides
          </span>
        </button>
        {/* Row 3: Weekly, Monthly */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className={passClass(type === "weekly_7")}
            onClick={() => onChange({ type: "weekly_7" })}
          >
            Weekly Pass
            <span className="block text-xs font-normal mt-1 text-gray-500">
              7 Days
            </span>
          </button>
          <button
            type="button"
            className={passClass(type === "monthly_30")}
            onClick={() => onChange({ type: "monthly_30" })}
          >
            Monthly Pass
            <span className="block text-xs font-normal mt-1 text-gray-500">
              30 Days
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
