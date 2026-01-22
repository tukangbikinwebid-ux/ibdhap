// services/public/places.service.ts

import { apiSlice } from "@/services/base-query"; // Sesuaikan path base-query Anda
import { GetPlacesParams, Place, PlacesResponse } from "@/types/public/places";

export const placesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 📍 Get Nearby Places
    // Endpoint: /public/places?latitude=...&longitude=...&radius=...
    getPlaces: builder.query<Place[], GetPlacesParams>({
      query: (params) => ({
        url: "/public/places",
        method: "GET",
        params: {
          latitude: params.latitude,
          longitude: params.longitude,
          radius: params.radius,
        },
      }),
      transformResponse: (response: PlacesResponse) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(
          response.message || "Gagal mengambil data tempat sekitar.",
        );
      },
      providesTags: ["Places"],
    }),
  }),
});

export const { useGetPlacesQuery } = placesApi;