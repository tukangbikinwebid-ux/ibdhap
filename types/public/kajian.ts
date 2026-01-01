import { User } from "../user";

// Tipe Data untuk Ustadz
export interface Ustadz {
  id: number;
  name: string;
  specialization: string;
  description: string;
  created_at: string;
  updated_at: string;
  image?: string; // Optional jika ada di masa depan (tidak ada di contoh, tapi common)
}

// Tipe Data untuk Kajian (Audio/Video)
export interface Kajian {
  id: number;
  ustadz_id: number;
  title: string;
  slug: string;
  duration: number; // Dalam detik atau menit (sesuai API)
  description: string;
  created_at: string;
  updated_at: string;
  audio: string; // URL audio file
  ustadz: Ustadz; // Nested relation
}

// Params untuk Get Ustadz List
export interface GetUstadzParams {
  page?: number;
  paginate?: number;
}

// Params untuk Get Kajian List (bisa filter by ustadz)
export interface GetKajianParams {
  ustadz_id?: number;
  page?: number;
  paginate?: number;
}

export interface QnAUstadz {
  id: number;
  user_id: number | null;
  ustadz_id: number;
  name: string;
  question: string;
  answer: string | null;
  status: number; // 0 = pending, 1 = answered maybe
  is_public: number; // 1 = public
  created_at: string;
  updated_at: string;
  ustadz: Ustadz;
  user: User | null; // Adjust based on your user type definition
}

// Params untuk Get QnA List
export interface GetQnAParams {
  page?: number;
  paginate?: number;
  ustadz_id?: number;
  is_public?: number;
}