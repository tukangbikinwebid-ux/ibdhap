// Tipe Data untuk Kategori Doa
export interface DoaCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// Tipe Data untuk Doa
export interface Doa {
  id: number;
  doa_category_id: number;
  title: string;
  slug: string;
  arabic_text: string;
  transliteration: string;
  translation_id: string;
  translation_en: string;
  audio: string | null;
  created_at: string;
  updated_at: string;
  category: DoaCategory;
}

// Params untuk Get Categories List
export interface GetDoaCategoriesParams {
  page?: number;
  paginate?: number;
}

// Params untuk Get Doa List by Category
export interface GetDoaByCategoryParams {
  category: string | number; // Bisa slug atau ID kategori
  page?: number;
  paginate?: number;
}