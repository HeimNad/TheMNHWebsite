import { Loader2 } from "lucide-react";
import type { IssueCardFormData } from "./types";

export function CustomerLookupFields({
  formData,
  isLookingUp,
  onPhoneBlur,
  onChange,
}: {
  formData: IssueCardFormData;
  isLookingUp: boolean;
  onPhoneBlur: () => void;
  onChange: (updates: Partial<IssueCardFormData>) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label
          htmlFor="issue-card-phone"
          className="block text-xs font-medium text-gray-700 mb-1 flex justify-between"
        >
          Phone Number
          {isLookingUp && (
            <Loader2 size={12} className="animate-spin text-pink-500" />
          )}
        </label>
        <input
          id="issue-card-phone"
          type="tel"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-200 outline-none"
          placeholder="Required for membership"
          value={formData.customer_phone}
          onChange={(e) => onChange({ customer_phone: e.target.value })}
          onBlur={onPhoneBlur}
        />
      </div>
      <div>
        <label htmlFor="issue-card-parent-name" className="block text-xs font-medium text-gray-700 mb-1">
          Parent Name
        </label>
        <input
          id="issue-card-parent-name"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-200 outline-none"
          placeholder="John Doe"
          value={formData.customer_name}
          onChange={(e) => onChange({ customer_name: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="issue-card-child-name" className="block text-xs font-medium text-gray-700 mb-1">
          Child Name
        </label>
        <input
          id="issue-card-child-name"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-200 outline-none"
          placeholder="Leo"
          value={formData.child_name}
          onChange={(e) => onChange({ child_name: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="issue-card-child-dob" className="block text-xs font-medium text-gray-700 mb-1">
          Child DOB
        </label>
        <input
          id="issue-card-child-dob"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-200 outline-none"
          placeholder="MM/DD"
          value={formData.child_birth_month}
          onChange={(e) => onChange({ child_birth_month: e.target.value })}
        />
      </div>
    </div>
  );
}
