export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "needs_more_info";

export interface SellerProfile {
  user_id: string;
  full_name: string;
  company_name: string;
  whatsapp: string;
  email: string;
  country: string;
  city: string;
  product_types: string;
  estimated_daily_orders: number | null;
}

export interface SellerApplication {
  id: string;
  user_id: string;
  status: ApplicationStatus;
  message: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}
