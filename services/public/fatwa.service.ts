import { apiSlice } from "@/services/base-query";

// --- Types ---
export interface FatwaTranslation {
  id: number;
  fatwa_syaikh_id: number;
  locale: string;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

export interface FatwaItem {
  id: number;
  name: string; // Nama Syaikh
  category: string;
  question: string; // Default Question (Fallback)
  answer: string; // Default Answer (Fallback)
  created_at: string;
  updated_at: string;
  translations: FatwaTranslation[];
}

export interface FatwaResponse {
  code: number;
  message: string;
  data: {
    current_page: number;
    data: FatwaItem[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

// --- API Slice ---
export const publicFatwaSyaikhApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🌍 Get Public Fatwa Syaikh
    getFatwaSyaikh: builder.query<
      FatwaResponse,
      { page?: number; locale?: string }
    >({
      query: ({ page = 1, locale = "id" }) => ({
        url: "/public/fatwa-syaikh",
        method: "GET",
        params: { page, locale },
      }),
      transformResponse: (response: FatwaResponse) => {
        if (response.code === 200) {
          return response;
        }
        throw new Error(
          response.message || "Gagal mengambil data Fatwa Syaikh.",
        );
      },
      providesTags: ["PublicFatwaSyaikh"],
    }),
  }),
});

export const { useGetFatwaSyaikhQuery } = publicFatwaSyaikhApi;