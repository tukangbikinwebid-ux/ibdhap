// services/quran.service.ts
import { apiSlice } from "@/services/base-query";
import {
  Surah,
  SurahDetail,
  SurahListResponse,
  SurahDetailResponse,
  GetSurahsParams,
  GetSurahDetailParams,
} from "@/types/public/quran";

// Daftar bahasa yang didukung oleh API (sesuai list Anda)
const SUPPORTED_API_LANGUAGES = [
  "ar",
  "bn",
  "en",
  "es",
  "fr",
  "id",
  "ru",
  "sv",
  "tr",
  "ur",
  "zh",
  "transliteration",
];

// Jika user memilih 'jp' atau 'kr' (yang tidak ada di API), akan fallback ke 'en' atau 'id'
const getValidApiLang = (lang?: string): string => {
  if (!lang) return "id";
  return SUPPORTED_API_LANGUAGES.includes(lang) ? lang : "en";
};

export const quranApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 📖 Get List of Surahs
    getSurahs: builder.query<Surah[], GetSurahsParams>({
      query: (params) => ({
        url: "/public/quran/surahs",
        method: "GET",
        params: {
          // Gunakan helper validasi
          lang: getValidApiLang(params.lang),
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

    // 📖 Get Surah Detail
    getSurahDetail: builder.query<SurahDetail, GetSurahDetailParams>({
      query: ({ surat, lang }) => ({
        url: `/public/quran/surahs/${surat}`,
        method: "GET",
        params: {
          // Gunakan helper validasi
          lang: getValidApiLang(lang),
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