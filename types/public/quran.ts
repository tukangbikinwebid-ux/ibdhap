// Tipe data untuk daftar Surah (List)
export interface Surah {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: string;
  total_verses: number;
}

// Tipe data untuk Ayat (Verse)
export interface Verse {
  id: number;
  text: string;
  translation: string;
}

// Tipe data untuk Audio
export interface AudioReciter {
  reciter: string;
  url: string;
  originalUrl: string;
  type: string;
}

// Tipe data untuk Detail Surah (termasuk ayat & audio)
export interface SurahDetail extends Surah {
  language: string;
  verses: Verse[];
  audio: Record<string, AudioReciter>; // Key-nya string angka ("1", "2", dst)
}

// Response Wrapper untuk List Surah
export interface SurahListResponse {
  code: number;
  message: string;
  data: Surah[];
}

// Response Wrapper untuk Detail Surah
export interface SurahDetailResponse {
  code: number;
  message: string;
  data: SurahDetail;
}

// Params untuk query
export interface GetSurahsParams {
  lang?: string;
}

export interface GetSurahDetailParams {
  surat: number | string; // Bisa ID (1) atau nama/slug jika API mendukung
  lang?: string;
}
