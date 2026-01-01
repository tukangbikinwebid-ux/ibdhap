// services/template-letter.service.ts
import { apiSlice } from "@/services/base-query"; // Sesuaikan path import base-query
import { PaginatedResponse } from "@/types/pagination";
import {
  TemplateLetter,
  GetTemplateLettersParams,
} from "@/types/public/template-surat";

export const templateLetterApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 📄 Get Template Letters List (Public)
    // Endpoint: /public/template-letters?paginate=10&page=1
    getTemplateLetters: builder.query<
      PaginatedResponse<TemplateLetter>["data"],
      GetTemplateLettersParams
    >({
      query: (params) => ({
        url: "/public/template-letters",
        method: "GET",
        params: {
          page: params.page ?? 1,
          paginate: params.paginate ?? 10,
          // Tambahkan param search jika API mendukung
          ...(params.search && { search: params.search }),
        },
      }),
      transformResponse: (response: PaginatedResponse<TemplateLetter>) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(
          response.message || "Gagal mengambil daftar template surat."
        );
      },
      providesTags: ["TemplateLetters"],
    }),
  }),
});

export const { useGetTemplateLettersQuery } = templateLetterApi;