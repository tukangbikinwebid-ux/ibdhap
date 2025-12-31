// Tipe Data untuk Kategori E-Book
export interface EbookCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// Tipe Data untuk E-Book (Buku)
export interface Ebook {
  id: number;
  ebook_category_id: number;
  title: string;
  slug: string;
  author: string;
  publisher: string;
  publication_year: string;
  isbn: string;
  description: string;
  is_free: number; // 1 = true, 0 = false usually
  created_at: string;
  updated_at: string;
  cover: string;
  pdf: string;
  category: EbookCategory;
}

// Params untuk Get Categories List
export interface GetEbookCategoriesParams {
  page?: number;
  paginate?: number;
}

// Params untuk Get Ebook List by Category
export interface GetEbookByCategoryParams {
  category: string | number; // Bisa slug atau ID kategori
  page?: number;
  paginate?: number;
}