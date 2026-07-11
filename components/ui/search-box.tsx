"use client";

import { useState } from "react";
import { Search } from "lucide-react";

// Keyed by `initialValue` (the URL's current search param) so this component
// remounts and re-syncs its local text whenever that value changes externally
// (e.g. browser back/forward), instead of holding a stale copy forever.
export function SearchBox({
  initialValue,
  placeholder,
  onSearch,
  ringColorClass = "focus:ring-pink-500",
  iconColorClass = "hover:text-pink-600",
}: {
  initialValue: string;
  placeholder: string;
  onSearch: (value: string) => void;
  ringColorClass?: string;
  iconColorClass?: string;
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(value);
      }}
      className="flex items-center gap-2 flex-1 md:flex-none"
    >
      <div className="relative flex-1 md:w-64">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 ${ringColorClass} focus:border-transparent`}
        />
        <button
          type="submit"
          aria-label="Search"
          className={`absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 ${iconColorClass} transition-colors`}
        >
          <Search size={16} />
        </button>
      </div>
    </form>
  );
}
