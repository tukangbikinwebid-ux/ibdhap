// services/ebook.service.ts
import { apiSlice } from "@/services/base-query";
import { PaginatedResponse } from "@/types/pagination";
import {
  Ebook,
  EbookCategory,
  GetEbookCategoriesParams,
  GetEbookByCategoryParams,
} from "@/types/public/e-book";

export const ebookApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 📚 Get Ebook Categories List
    // Endpoint: /public/ebook/categories?paginate=10&page=1
    getEbookCategories: builder.query<
      PaginatedResponse<EbookCategory>["data"],
      GetEbookCategoriesParams
    >({
      query: (params) => ({
        url: "/public/ebook/categories",
        method: "GET",
        params: {
          page: params.page ?? 1,
          paginate: params.paginate ?? 10,
        },
      }),
      transformResponse: (response: PaginatedResponse<EbookCategory>) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil kategori e-book.");
      },
      providesTags: ["EbookCategories"],
    }),

    // 📖 Get Ebook List by Category
    // Endpoint: /public/ebook/categories/:category?paginate=10&page=1
    getEbookByCategory: builder.query<
      PaginatedResponse<Ebook>["data"],
      GetEbookByCategoryParams
    >({
      query: ({ category, page, paginate }) => ({
        url: `/public/ebook/categories/${category}`,
        method: "GET",
        params: {
          page: page ?? 1,
          paginate: paginate ?? 10,
        },
      }),
      transformResponse: (response: PaginatedResponse<Ebook>) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil daftar e-book.");
      },
      providesTags: (result, error, arg) => [
        { type: "EbookList", id: arg.category },
      ],
    }),
  }),
});

export const { useGetEbookCategoriesQuery, useGetEbookByCategoryQuery } =
  ebookApi;