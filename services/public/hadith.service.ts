import { apiSlice } from "@/services/base-query";

// --- TYPES ---
export interface Translation {
  id: number;
  hadith_book_id?: number;
  hadith_id?: number;
  locale: string;
  name?: string; // For Book
  translation?: string; // For Hadith
  description?: string; // HTML String for Book
  created_at: string;
  updated_at: string;
}

export interface HadithBook {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  translations: Translation[];
  available: number; // Note: API response doesn't show 'available', adding as optional or assuming mock if not present
}

export interface Hadith {
  id: number;
  hadith_book_id: number;
  number: number;
  arabic_text: string; // HTML String
  latin_text: string; // HTML String
  created_at: string;
  updated_at: string;
  translations: Translation[];
}

// Response Wrapper for List Books
interface HadithBookListResponse {
  code: number;
  message: string;
  data: {
    current_page: number;
    data: HadithBook[];
    total: number;
    // ... pagination other fields
  };
}

// Response Wrapper for Hadith Detail (List of Hadiths in a Book)
interface HadithDetailResponse {
  code: number;
  message: string;
  data: {
    current_page: number;
    data: Hadith[];
    total: number;
  };
}

export const hadithApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 📚 Get Hadith Books List
    // Endpoint: /public/hadith/books
    getHadithBooks: builder.query<HadithBook[], void>({
      query: () => ({
        url: "/public/hadith/books",
        method: "GET",
      }),
      transformResponse: (response: HadithBookListResponse) => {
        if (response.code === 200) {
          // Mapping to ensure 'available' property exists if API doesn't provide it directly in list
          return response.data.data.map((book) => ({
            ...book,
            available: 7000, // Mock count as API response example didn't have 'available' count
          }));
        }
        throw new Error(
          response.message || "Gagal mengambil daftar buku hadits.",
        );
      },
      providesTags: ["HadithBooks"],
    }),

    // 📖 Get Hadith List by Book ID
    // Endpoint: /public/hadith/books/:bookId
    getHadithListByBook: builder.query<
      { hadiths: Hadith[]; total: number },
      { bookId: number; page?: number }
    >({
      query: ({ bookId, page = 1 }) => ({
        url: `/public/hadith/books/${bookId}`,
        method: "GET",
        params: { page },
      }),
      transformResponse: (response: HadithDetailResponse) => {
        if (response.code === 200) {
          return {
            hadiths: response.data.data,
            total: response.data.total,
          };
        }
        throw new Error(response.message || "Gagal mengambil data hadits.");
      },
      providesTags: (result, error, { bookId }) => [
        { type: "HadithList", id: bookId },
      ],
    }),
  }),
});

export const { useGetHadithBooksQuery, useGetHadithListByBookQuery } =
  hadithApi;