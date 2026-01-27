import { apiSlice } from "@/services/base-query";

// --- Types ---
export interface SirahTranslation {
  id: number;
  sirah_id: number;
  locale: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface SirahItem {
  id: number;
  category: string;
  title: string;
  content: string; // HTML String
  created_at: string;
  updated_at: string;
  translations: SirahTranslation[];
}

export interface SirahResponse {
  code: number;
  message: string;
  data: {
    current_page: number;
    data: SirahItem[];
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
export const publicSirahApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🌍 Get Public Sirah
    getSirah: builder.query<SirahResponse, { page?: number; locale?: string }>({
      query: ({ page = 1, locale = "id" }) => ({
        url: "/public/sirah",
        method: "GET",
        params: { page, locale },
      }),
      transformResponse: (response: SirahResponse) => {
        if (response.code === 200) {
          return response;
        }
        throw new Error(response.message || "Gagal mengambil data Sirah.");
      },
      providesTags: ["PublicSirah"],
    }),
  }),
});

export const { useGetSirahQuery } = publicSirahApi;