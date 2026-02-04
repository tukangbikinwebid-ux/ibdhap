// types/sholat.ts

export interface SholatRecord {
  id: number;
  user_id: number;
  date: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  created_at: string;
  updated_at: string;
}

export interface SholatPaginationData {
  current_page: number;
  data: SholatRecord[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
    page: number | null;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Response Wrapper untuk Get All
export interface SholatListResponse {
  code: number;
  message: string;
  data: SholatPaginationData;
}

// Response Wrapper untuk Get By ID
export interface SholatDetailResponse {
  code: number;
  message: string;
  data: SholatRecord;
}

// Request Body untuk Toggle
export interface ToggleSholatRequest {
  date: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

// Params untuk Get All
export interface GetSholatParams {
  page?: number;
}