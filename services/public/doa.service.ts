import { apiSlice } from "@/services/base-query"; // Sesuaikan path import base-query
import { PaginatedResponse } from "@/types/pagination";
import {
  Doa,
  DoaCategory,
  GetDoaCategoriesParams,
  GetDoaByCategoryParams,
} from "@/types/public/doa";

export const doaApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 📂 Get Doa Categories List
    // Endpoint: /public/doa/categories?paginate=10&page=1
    getDoaCategories: builder.query<
      PaginatedResponse<DoaCategory>["data"],
      GetDoaCategoriesParams
    >({
      query: (params) => ({
        url: "/public/doa/categories",
        method: "GET",
        params: {
          page: params.page ?? 1,
          paginate: params.paginate ?? 10,
        },
      }),
      transformResponse: (response: PaginatedResponse<DoaCategory>) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil kategori doa.");
      },
      providesTags: ["DoaCategories"],
    }),

    // 🤲 Get Doa List by Category
    // Endpoint: /public/doa/categories/:category?paginate=10&page=1
    getDoaByCategory: builder.query<
      PaginatedResponse<Doa>["data"],
      GetDoaByCategoryParams
    >({
      query: ({ category, page, paginate }) => ({
        url: `/public/doa/categories/${category}`,
        method: "GET",
        params: {
          page: page ?? 1,
          paginate: paginate ?? 10,
        },
      }),
      transformResponse: (response: PaginatedResponse<Doa>) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil daftar doa.");
      },
      providesTags: (result, error, arg) => [
        { type: "DoaList", id: arg.category },
      ],
    }),
  }),
});

export const { useGetDoaCategoriesQuery, useGetDoaByCategoryQuery } = doaApi;