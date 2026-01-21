import { apiSlice } from "@/services/base-query";
import { Locale, LocaleResponse } from "@/types/public/locale";

export const publicLocaleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🌍 Get Public Locales
    getLocales: builder.query<Locale[], void>({
      query: () => ({
        url: "/public/locales",
        method: "GET",
      }),
      transformResponse: (response: LocaleResponse) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil data locale.");
      },
      providesTags: ["PublicLocales"],
    }),
  }),
});

export const { useGetLocalesQuery } = publicLocaleApi;