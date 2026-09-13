export const TABS = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "declined", label: "Declined" },
] as const;

export type TabKey = (typeof TABS)[number]["key"];

export type BookingRequest = {
  id: string;
  created_at: string;
  start_time: string;
  end_time: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  child_name?: string;
  child_age?: string;
  child_count?: number;
  package_type?: string;
  add_ons?: string[];
  food_options?: string[];
  pizza_preference?: string;
  pizza_count?: number;
  special_requests?: string;
  photo_permission?: boolean;
  notes?: string;
};
