export type DayHours = Record<
  "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun",
  string
>;

export interface BusinessHours {
  samanea: DayHours;
  broadway: DayHours;
}
