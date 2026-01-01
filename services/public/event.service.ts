// services/event.service.ts
import { apiSlice } from "@/services/base-query"; // Sesuaikan path import base-query
import { PaginatedResponse } from "@/types/pagination";
import { Event, GetEventsParams } from "@/types/public/event";

export const eventApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 📅 Get Events List (Public)
    // Endpoint: /public/events?paginate=10&page=1
    getEvents: builder.query<PaginatedResponse<Event>["data"], GetEventsParams>(
      {
        query: (params) => ({
          url: "/public/events",
          method: "GET",
          params: {
            page: params.page ?? 1,
            paginate: params.paginate ?? 10,
          },
        }),
        transformResponse: (response: PaginatedResponse<Event>) => {
          if (response.code === 200) {
            return response.data;
          }
          throw new Error(response.message || "Gagal mengambil daftar event.");
        },
        providesTags: ["Events"],
      }
    ),
  }),
});

export const { useGetEventsQuery } = eventApi;