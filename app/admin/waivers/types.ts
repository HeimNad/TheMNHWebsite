export interface Waiver {
  id: string;
  name: string;
  child_name: string | null;
  date: string;
  location: string;
  signature_data: any[]; // JSON data for signature
  created_at: string;
}
