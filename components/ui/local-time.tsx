"use client";

type Format = "time" | "date" | "datetime";

interface LocalTimeProps {
  date: string | Date;
  format?: Format;
}

export function LocalTime({ date, format = "time" }: LocalTimeProps) {
  const d = new Date(date);

  switch (format) {
    case "date":
      return <>{d.toLocaleDateString()}</>;
    case "datetime":
      return <>{d.toLocaleString()}</>;
    case "time":
    default:
      return <>{d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</>;
  }
}
