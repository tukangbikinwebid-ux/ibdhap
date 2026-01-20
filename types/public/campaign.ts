import { PaginatedResponse } from "@/types/pagination";

// Campaign interface sesuai response API
export interface Campaign {
  id: number;
  title: string;
  category: string;
  target_amount: number;
  raised_amount: number;
  start_date: string;
  end_date: string;
  description: string;
  created_at: string;
  updated_at: string;
  image: string;
  translations: any[]; // Bisa di-define lebih detail jika diperlukan
}

// Params untuk Get Campaigns
export interface GetCampaignsParams {
  page?: number;
  paginate?: number;
}
