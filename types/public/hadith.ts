// types/hadith.ts

// Tipe untuk Buku Hadith
export interface HadithBook {
  name: string;
  id: string;
  available: number;
}

// Tipe untuk Satu Hadith
export interface Hadith {
  number: number;
  arab: string;
  id: string;
}

// Tipe untuk Detail Buku Hadith (dengan range)
export interface HadithBookDetail {
  name: string;
  id: string;
  available: number;
  requested: number;
  hadiths: Hadith[];
}

// Response Wrapper untuk List Books
export interface HadithBookListResponse {
  code: number;
  message: string;
  data: HadithBook[];
}

// Response Wrapper untuk Detail Book (Chapter)
export interface HadithBookDetailResponse {
  code: number;
  message: string;
  data: HadithBookDetail;
}

// Params untuk Detail Book
export interface GetHadithBookDetailParams {
  book: string;
  from: number;
  to: number;
}