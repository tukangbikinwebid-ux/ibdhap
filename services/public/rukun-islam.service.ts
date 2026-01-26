import { apiSlice } from "@/services/base-query";

// --- Types ---
export interface RukunIslamTranslation {
  id: number;
  rukun_islam_id: number;
  locale: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface RukunIslamItem {
  id: number;
  title: string;
  description: string; // HTML String
  order: number;
  created_at: string;
  updated_at: string;
  image: string;
  translations: RukunIslamTranslation[];
}

export interface RukunIslamResponse {
  code: number;
  message: string;
  data: {
    current_page: number;
    data: RukunIslamItem[];
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
export const publicRukunIslamApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🌍 Get Public Rukun Islam
    getRukunIslam: builder.query<
      RukunIslamResponse,
      { page?: number; locale?: string }
    >({
      query: ({ page = 1, locale = "id" }) => ({
        url: "/public/rukun/islam",
        method: "GET",
        params: { page, locale }, // Kirim parameter jika backend mendukung filter locale
      }),
      transformResponse: (response: RukunIslamResponse) => {
        if (response.code === 200) {
          return response;
        }
        throw new Error(
          response.message || "Gagal mengambil data Rukun Islam.",
        );
      },
      providesTags: ["PublicRukunIslam"],
    }),
  }),
});

export const { useGetRukunIslamQuery } = publicRukunIslamApi;