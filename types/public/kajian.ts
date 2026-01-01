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