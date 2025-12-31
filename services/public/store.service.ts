import { apiSlice } from "@/services/base-query";
import { PaginatedResponse } from "@/types/pagination";
import { Store, GetStoresParams } from "@/types/public/store/store";
import { Product, GetProductsParams } from "@/types/public/store/product";

export const publicApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🏪 Get Public Stores
    getPublicStores: builder.query<
      PaginatedResponse<Store>["data"],
      GetStoresParams
    >({
      query: (params) => ({
        url: "/public/stores",
        method: "GET",
        params: {
          page: params.page ?? 1,
          paginate: params.paginate ?? 10,
        },
      }),
      // Transform response: Ambil langsung object "data" yang berisi array items & info pagination
      transformResponse: (response: PaginatedResponse<Store>) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil data toko.");
      },
      providesTags: ["PublicStores"],
    }),

    // 📦 Get Public Products
    getPublicProducts: builder.query<
      PaginatedResponse<Product>["data"],
      GetProductsParams
    >({
      query: (params) => {
        const queryParams: Record<string, string | number> = {
          page: params.page ?? 1,
          paginate: params.paginate ?? 10,
        };

        if (params.store_id) {
          queryParams.store_id = params.store_id;
        }

        return {
          url: "/public/products",
          method: "GET",
          params: queryParams,
        };
      },
      transformResponse: (response: PaginatedResponse<Product>) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil data produk.");
      },
      providesTags: ["PublicProducts"],
    }),
  }),
});

export const { useGetPublicStoresQuery, useGetPublicProductsQuery } = publicApi;