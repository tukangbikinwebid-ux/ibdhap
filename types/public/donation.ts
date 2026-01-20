import { PaginatedResponse } from "@/types/pagination";

// Payment interface
export interface Payment {
  id: number;
  driver: string;
  payable_type: string;
  payable_id: number;
  order_id: string;
  transaction_id: string;
  payment_type: string;
  account_number: string | null;
  account_code: string | null;
  channel: string;
  expired_at: string;
  paid_at: string | null;
  amount: number;
  created_at: string;
  updated_at: string;
}

// Campaign Donation interface
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
  payment: Payment;
  user: any | null;
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
