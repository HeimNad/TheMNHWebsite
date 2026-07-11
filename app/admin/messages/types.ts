export interface Message {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  child_age?: string;
  preferred_contact?: string;
  subject?: string;
  message: string;
  status: "unread" | "read" | "ignored" | "replied";
  created_at: string;
}
