// Tipe Data untuk Template Letter
export interface TemplateLetter {
  id: number;
  title: string;
  category: string;
  slug: string;
  description: string | null;
  image: string; // URL gambar preview/thumbnail
  attachment: string; // URL file download (doc/pdf)
  created_at: string;
  updated_at: string;
}

// Params untuk Get Template Letter List
export interface GetTemplateLettersParams {
  page?: number;
  paginate?: number;
  search?: string; // Optional: jika API mendukung pencarian
}