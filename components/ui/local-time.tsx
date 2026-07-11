"use client";

import { useEffect, useState } from "react";

type Format = "time" | "date" | "datetime";

interface LocalTimeProps {
  date: string | Date;
  format?: Format;
}

function formatLocal(date: string | Date, format: Format) {
  const d = new Date(date);
  switch (format) {
    case "date":
      return d.toLocaleDateString();
    case "datetime":
      return d.toLocaleString();
    case "time":
    default:
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
}

// Formats with the browser's locale/timezone, which the server can't know in
// advance, so it's deferred to a post-mount effect to avoid a hydration mismatch.
export function LocalTime({ date, format = "time" }: LocalTimeProps) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    setText(formatLocal(date, format));
  }, [date, format]);

  return <>{text}</>;
}
