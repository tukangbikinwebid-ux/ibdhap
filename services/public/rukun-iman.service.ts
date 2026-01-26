import { apiSlice } from "@/services/base-query";

// --- Types ---
export interface RukunImanTranslation {
  id: number;
  rukun_iman_id: number;
  locale: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface RukunImanItem {
  id: number;
  title: string;
  description: string; // HTML String
  order: number;
  created_at: string;
  updated_at: string;
  image: string;
  translations: RukunImanTranslation[];
}

export interface RukunImanResponse {
  code: number;
  message: string;
  data: {
    current_page: number;
    data: RukunImanItem[];
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
export const publicRukunImanApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🌍 Get Public Rukun Iman
    getRukunIman: builder.query<
      RukunImanResponse,
      { page?: number; locale?: string }
    >({
      query: ({ page = 1, locale = "id" }) => ({
        url: "/public/rukun/iman",
        method: "GET",
        params: { page, locale },
      }),
      transformResponse: (response: RukunImanResponse) => {
        if (response.code === 200) {
          return response;
        }
        throw new Error(response.message || "Gagal mengambil data Rukun Iman.");
      },
      providesTags: ["PublicRukunIman"],
    }),
  }),
});

export const { useGetRukunImanQuery } = publicRukunImanApi;