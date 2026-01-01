import { apiSlice } from "@/services/base-query"; // Sesuaikan path import base-query
import { PaginatedResponse } from "@/types/pagination";
import {
  Ustadz,
  Kajian,
  GetUstadzParams,
  GetKajianParams,
} from "@/types/public/kajian";

export const kajianApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 👳 Get Ustadz List
    // Endpoint: /public/ustadz?paginate=10&page=1
    getUstadzList: builder.query<
      PaginatedResponse<Ustadz>["data"],
      GetUstadzParams
    >({
      query: (params) => ({
        url: "/public/ustadz",
        method: "GET",
        params: {
          page: params.page ?? 1,
          paginate: params.paginate ?? 10,
        },
      }),
      transformResponse: (response: PaginatedResponse<Ustadz>) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil daftar ustadz.");
      },
      providesTags: ["UstadzList"],
    }),

    // 🎙️ Get Kajian List (by Ustadz)
    // Endpoint: /public/ustadz/kajian?paginate=10&page=1&ustadz_id=1
    getKajianList: builder.query<
      PaginatedResponse<Kajian>["data"],
      GetKajianParams
    >({
      query: (params) => {
        // Build params object
        const queryParams: Record<string, string | number> = {
          page: params.page ?? 1,
          paginate: params.paginate ?? 10,
        };

        if (params.ustadz_id) {
          queryParams.ustadz_id = params.ustadz_id;
        }

        return {
          url: "/public/ustadz/kajian",
          method: "GET",
          params: queryParams,
        };
      },
      transformResponse: (response: PaginatedResponse<Kajian>) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil daftar kajian.");
      },
      providesTags: ["KajianList"],
    }),
  }),
});

export const { useGetUstadzListQuery, useGetKajianListQuery } = kajianApi;