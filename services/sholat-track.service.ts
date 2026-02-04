import { apiSlice } from "@/services/base-query";
import {
  GetSholatParams,
  SholatDetailResponse,
  SholatListResponse,
  SholatPaginationData,
  SholatRecord,
  ToggleSholatRequest,
} from "@/types/sholat-track";

export const sholatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🕌 1. GET User Sholat List (History/Tracking)
    // URL: /user/sholat
    getUserSholatList: builder.query<SholatPaginationData, GetSholatParams>({
      query: (params) => ({
        url: "/user/sholat",
        method: "GET",
        params: {
          page: params.page ?? 1,
        },
      }),
      transformResponse: (response: SholatListResponse) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil riwayat sholat.");
      },
      providesTags: ["UserSholat"],
    }),

    // 🕌 2. GET User Sholat By ID
    // URL: /user/sholat/:id
    getUserSholatById: builder.query<SholatRecord, number>({
      query: (id) => ({
        url: `/user/sholat/${id}`,
        method: "GET",
      }),
      transformResponse: (response: SholatDetailResponse) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil detail sholat.");
      },
      providesTags: (result, error, id) => [{ type: "UserSholat", id }],
    }),

    // ✅ 3. POST Toggle User Sholat (Checklist)
    // URL: /user/sholat/toggle (pastikan backend menggunakan 'toggle' atau 'toogle')
    toggleSholat: builder.mutation<void, ToggleSholatRequest>({
      query: (payload) => ({
        url: "/user/sholat/toogle",
        method: "POST",
        body: payload,
      }),
      // Invalidates 'UserSholat' agar list otomatis refresh setelah update
      invalidatesTags: ["UserSholat"],
    }),
  }),
});

export const {
  useGetUserSholatListQuery,
  useGetUserSholatByIdQuery,
  useToggleSholatMutation,
} = sholatApi;