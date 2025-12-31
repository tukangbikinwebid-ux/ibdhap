// Tipe Data untuk Kategori Artikel
export interface ArticleCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// Tipe Data untuk Artikel
export interface Article {
  id: number;
  article_category_id: number;
  title: string;
  slug: string;
  published_at: string;
  content: string;
  created_at: string;
  updated_at: string;
  image: string;
  category: ArticleCategory;
}

// Params untuk Get Categories
export interface GetArticleCategoriesParams {
  page?: number;
  paginate?: number;
}

// Params untuk Get Articles
export interface GetArticlesParams {
  page?: number;
  paginate?: number;
  category_id?: number;
}

// Response standar wrapper untuk single data
export interface SingleResponse<T> {
  code: number;
  message: string;
  data: T;
}