import { apiSlice } from "@/services/base-query"; // Sesuaikan path import base-query Anda
import { PaginatedResponse } from "@/types/pagination";
import {
  Article,
  ArticleCategory,
  GetArticleCategoriesParams,
  GetArticlesParams,
  SingleResponse,
} from "@/types/public/article";

export const publicArticleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 📂 Get Public Article Categories
    getArticleCategories: builder.query<
      PaginatedResponse<ArticleCategory>["data"],
      GetArticleCategoriesParams
    >({
      query: (params) => ({
        url: "/public/article/categories",
        method: "GET",
        params: {
          page: params.page ?? 1,
          paginate: params.paginate ?? 10,
        },
      }),
      transformResponse: (response: PaginatedResponse<ArticleCategory>) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(
          response.message || "Gagal mengambil kategori artikel."
        );
      },
      providesTags: ["PublicArticleCategories"],
    }),

    // 📝 Get Public Articles (List)
    getArticles: builder.query<
      PaginatedResponse<Article>["data"],
      GetArticlesParams
    >({
      query: (params) => {
        const queryParams: Record<string, string | number> = {
          page: params.page ?? 1,
          paginate: params.paginate ?? 10,
        };

        if (params.category_id) {
          queryParams.category_id = params.category_id;
        }

        return {
          url: "/public/article",
          method: "GET",
          params: queryParams,
        };
      },
      transformResponse: (response: PaginatedResponse<Article>) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil data artikel.");
      },
      providesTags: ["PublicArticles"],
    }),

    // 📄 Get Public Article Detail (By ID)
    getArticleById: builder.query<Article, number>({
      query: (id) => ({
        url: `/public/article/${id}`,
        method: "GET",
      }),
      transformResponse: (response: SingleResponse<Article>) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil detail artikel.");
      },
      providesTags: (result, error, id) => [{ type: "PublicArticles", id }],
    }),
  }),
});

export const {
  useGetArticleCategoriesQuery,
  useGetArticlesQuery,
  useGetArticleByIdQuery,
} = publicArticleApi;