export interface Waiver {
  id: string;
  name: string;
  child_name: string | null;
  date: string;
  location: string;
  signature_data: any[]; // JSON data for signature
  created_at: string;
  terms_accepted: boolean;
  age_confirmed: boolean;
  waiver_text: string;
  ip_address: string | null;
  user_agent: string | null;
}
