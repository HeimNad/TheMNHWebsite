export type IssueCardFormData = {
  code: string;
  type: string;
  customer_name: string;
  customer_phone: string;
  child_name: string;
  child_birth_month: string;
  valid_from: string;
  weeklyMode: "gift" | "scheduled";
};

export type Card = {
  id: string;
  code: string;
  balance: number;
  initial_punches: number;
  card_type: string;
  customer_name?: string;
  customer_phone?: string;
  child_name?: string;
  child_birth_month?: string;
  status: "active" | "completed" | "void";
  created_at: string;
  valid_from?: string;
  used_dates?: number[];
};
