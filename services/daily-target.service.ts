import { apiSlice } from "@/services/base-query";
import {
  GetPublicDailyTargetParams,
  GetUserDailyTargetParams,
  PublicDailyTargetResponse,
  ToggleDailyTargetRequest,
  UserDailyTarget,
  UserDailyTargetDetailResponse,
  UserDailyTargetListResponse,
} from "@/types/daily-target";

export const dailyTargetApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🌍 1. GET Public Daily Targets (Master Data)
    // URL: /public/daily-targets?type=...
    getPublicDailyTargets: builder.query<
      PublicDailyTargetResponse["data"],
      GetPublicDailyTargetParams
    >({
      query: (params) => ({
        url: "/public/daily-targets",
        method: "GET",
        params: params, // type is optional here
      }),
      transformResponse: (response: PublicDailyTargetResponse) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(
          response.message || "Gagal mengambil data target harian.",
        );
      },
      providesTags: ["PublicDailyTargets"],
    }),

    // 👤 2. GET User Daily Targets (History/Tracking)
    // URL: /user/daily-targets
    getUserDailyTargets: builder.query<
      UserDailyTargetListResponse["data"],
      GetUserDailyTargetParams
    >({
      query: (params) => ({
        url: "/user/daily-targets",
        method: "GET",
        params: {
          page: params.page ?? 1,
          ...params,
        },
      }),
      transformResponse: (response: UserDailyTargetListResponse) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(
          response.message || "Gagal mengambil riwayat target pengguna.",
        );
      },
      providesTags: ["UserDailyTargets"],
    }),

    // 👤 3. GET User Daily Target By ID
    // URL: /user/daily-targets/:id
    getUserDailyTargetById: builder.query<UserDailyTarget, number>({
      query: (id) => ({
        url: `/user/daily-targets/${id}`,
        method: "GET",
      }),
      transformResponse: (response: UserDailyTargetDetailResponse) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil detail target.");
      },
      providesTags: (result, error, id) => [{ type: "UserDailyTargets", id }],
    }),

    // ✅ 4. POST Toggle User Daily Target (Checklist)
    // URL: /user/daily-targets/toggle
    toggleDailyTarget: builder.mutation<void, ToggleDailyTargetRequest>({
      query: (payload) => ({
        url: "/user/daily-targets/toggle",
        method: "POST",
        body: payload,
      }),
      // Invalidates 'UserDailyTargets' to refresh the list/UI status automatically
      invalidatesTags: ["UserDailyTargets"],
    }),
  }),
});

export const {
  useGetPublicDailyTargetsQuery,
  useGetUserDailyTargetsQuery,
  useGetUserDailyTargetByIdQuery,
  useToggleDailyTargetMutation,
} = dailyTargetApi;