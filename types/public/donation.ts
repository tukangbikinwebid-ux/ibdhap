import { PaginatedResponse } from "@/types/pagination";
import { User } from "../user";

// Payment interface
export interface Payment {
  id: number;
  driver: string;
  payable_type: string;
  payable_id: number;
  order_id: string;
  transaction_id: string;
  payment_type: string;
  account_number: string | null; // Ini penting
  account_code: string | null;
  channel: string;
  expired_at: string;
  paid_at: string | null;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface CampaignDonation {
  id: number;
  campaign_id: number;
  user_id: number | null;
  donor_name: string;
  donor_email: string | null;
  donor_phone: string | null;
  description: string | null;
  amount: number;
  status: number;
  created_at: string;
  updated_at: string;
  payment: Payment; // Nested object
  user: User | null;
}
// Params untuk Get Campaign Donations
export interface GetCampaignDonationsParams {
  campaign: number;
  page?: number;
  paginate?: number;
}

// Body untuk Create Donation
export interface CreateDonationBody {
  user_id?: number | null;
  donor_name: string;
  donor_email?: string | null;
  donor_phone?: string | null;
  description?: string | null;
  payment_method: "qris" | "bank_transfer" | "card";
  payment_channel: "bca" | "bni" | "bri" | "cimb" | "qris" | "card";
  card_token?: string; // required if payment_method is card
  amount: number; // min: 10000
}

export interface PaymentInfo {
  id: number;
  driver: string;
  transaction_id: string;
  payment_type: string;
  account_number: string | null;
  channel: string;
  amount: number;
}

interface DonationData {
  id: number;
  campaign_id: number;
  donor_name: string;
  amount: number;
  payment: PaymentInfo;
  created_at: string;
  // Tambahkan field lain dari 'CampaignDonation' jika perlu
}

// Wrapper Response API (PENTING!)
export interface ApiResponse {
  code: number;
  message: string;
  data: DonationData;
}