import { apiSlice } from "@/services/base-query";
import { Place, GetPlacesParams, PlacesResponse } from "@/types/public/place";

export const placesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🌍 Get Public Places by Radius
    getPublicPlaces: builder.query<Place[], GetPlacesParams>({
      query: (params) => ({
        url: "/public/places",
        method: "GET",
        params: {
          latitude: params.latitude,
          longitude: params.longitude,
          radius: params.radius,
        },
      }),
      // Transform response untuk langsung mengambil array data
      transformResponse: (response: PlacesResponse) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil data tempat.");
      },
      providesTags: ["PublicPlaces"],
    }),
  }),
});

export const { useGetPublicPlacesQuery } = placesApi;