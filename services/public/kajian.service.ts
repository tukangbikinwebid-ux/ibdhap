import { apiSlice } from "@/services/base-query";
import { PaginatedResponse } from "@/types/pagination";
import {
  Ustadz,
  Kajian,
  QnAUstadz,
  GetUstadzParams,
  GetKajianParams,
  GetQnAParams,
} from "@/types/public/kajian";

// --- TYPES FOR CREATE QNA ---
export interface CreateQnABody {
  ustadz_id: number;
  name: string;
  question: string;
  is_public: boolean;
}

export const kajianApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 👳 Get Ustadz List
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

    // 🎙️ Get Kajian List
    getKajianList: builder.query<
      PaginatedResponse<Kajian>["data"],
      GetKajianParams
    >({
      query: (params) => {
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

    // ❓ Get Ustadz QnA
    getUstadzQnA: builder.query<
      PaginatedResponse<QnAUstadz>["data"],
      GetQnAParams
    >({
      query: (params) => {
        const queryParams: Record<string, string | number> = {
          page: params.page ?? 1,
          paginate: params.paginate ?? 10,
          is_public: params.is_public ?? 1,
        };
        if (params.ustadz_id) {
          queryParams.ustadz_id = params.ustadz_id;
        }
        return {
          url: "/public/ustadz/qna",
          method: "GET",
          params: queryParams,
        };
      },
      transformResponse: (response: PaginatedResponse<QnAUstadz>) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(
          response.message || "Gagal mengambil daftar tanya jawab.",
        );
      },
      providesTags: ["UstadzQnA"],
    }),

    // 🆕 POST Create QnA
    createQnA: builder.mutation<void, CreateQnABody>({
      query: (body) => ({
        url: "/public/ustadz/qna",
        method: "POST",
        body,
      }),
      invalidatesTags: ["UstadzQnA"],
    }),
  }),
});

export const {
  useGetUstadzListQuery,
  useGetKajianListQuery,
  useGetUstadzQnAQuery,
  useCreateQnAMutation,
} = kajianApi;