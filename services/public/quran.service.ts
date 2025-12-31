// services/quran.service.ts
import { apiSlice } from "@/services/base-query"; // Sesuaikan path import base-query
import {
  Surah,
  SurahDetail,
  SurahListResponse,
  SurahDetailResponse,
  GetSurahsParams,
  GetSurahDetailParams,
} from "@/types/public/quran";

export const quranApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 📖 Get List of Surahs
    // Endpoint: /public/quran/surahs?lang=en
    getSurahs: builder.query<Surah[], GetSurahsParams>({
      query: (params) => ({
        url: "/public/quran/surahs",
        method: "GET",
        params: {
          lang: params.lang ?? "id", // Default ke 'id' jika tidak ada
        },
      }),
      transformResponse: (response: SurahListResponse) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil daftar surah.");
      },
      providesTags: ["QuranSurahs"],
    }),

    // 📖 Get Surah Detail (Ayat & Audio)
    // Endpoint: /public/quran/surahs/:surat?lang=en
    getSurahDetail: builder.query<SurahDetail, GetSurahDetailParams>({
      query: ({ surat, lang }) => ({
        url: `/public/quran/surahs/${surat}`,
        method: "GET",
        params: {
          lang: lang ?? "id",
        },
      }),
      transformResponse: (response: SurahDetailResponse) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil detail surah.");
      },
      providesTags: (result, error, { surat }) => [
        { type: "QuranSurahDetail", id: surat },
      ],
    }),
  }),
});

export const { useGetSurahsQuery, useGetSurahDetailQuery } = quranApi;