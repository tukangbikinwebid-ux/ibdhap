import { PaginatedResponse } from "@/types/pagination";
import { SingleResponse } from "./public/article";

// --- Public Data Types ---
export interface DailyTarget {
  id: number;
  name: string;
  description: string; // HTML string
  status: number; // 1 = active?
  created_at: string;
  updated_at: string;
}

// --- User Data Types ---
export interface UserDailyTarget {
  id: number;
  daily_target_id: number;
  user_id: number;
  date: string; // ISO Date string
  status: boolean; // true = completed/checked
  created_at: string;
  updated_at: string;
  daily_target: DailyTarget;
}

// --- Params & Payloads ---
export interface GetPublicDailyTargetParams {
  type?: "umrah" | "haji" | "ramadhan" | string; // Opsional
}

export interface GetUserDailyTargetParams {
  page?: number;
  paginate?: number;
  date?: string; // Opsional: biasanya kita filter user target berdasarkan tanggal
}

export interface ToggleDailyTargetRequest {
  daily_target_id: number;
  date: string; // YYYY-MM-DD
  status: boolean;
}

// --- Responses ---
export interface PublicDailyTargetResponse {
  code: number;
  message: string;
  data: DailyTarget[];
}

export type UserDailyTargetListResponse = PaginatedResponse<UserDailyTarget>;
export type UserDailyTargetDetailResponse = SingleResponse<UserDailyTarget>;