// services/hadith.service.ts
import { apiSlice } from "@/services/base-query";
import {
  HadithBook,
  HadithBookDetail,
  HadithBookListResponse,
  HadithBookDetailResponse,
  GetHadithBookDetailParams,
} from "@/types/public/hadith";

export const hadithApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 📚 Get Hadith Books List
    // Endpoint: /public/hadith/books
    getHadithBooks: builder.query<HadithBook[], void>({
      query: () => ({
        url: "/public/hadith/books",
        method: "GET",
      }),
      transformResponse: (response: HadithBookListResponse) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(
          response.message || "Gagal mengambil daftar buku hadits."
        );
      },
      providesTags: ["HadithBooks"],
    }),

    // 📖 Get Hadith Range from a Book
    // Endpoint: /public/hadith/books/:book?from=1&to=15
    getHadithBookDetail: builder.query<
      HadithBookDetail,
      GetHadithBookDetailParams
    >({
      query: ({ book, from, to }) => ({
        url: `/public/hadith/books/${book}`,
        method: "GET",
        params: {
          from,
          to,
        },
      }),
      transformResponse: (response: HadithBookDetailResponse) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil data hadits.");
      },
      providesTags: (result, error, { book }) => [
        { type: "HadithBookDetail", id: book },
      ],
    }),
  }),
});

export const { useGetHadithBooksQuery, useGetHadithBookDetailQuery } =
  hadithApi;