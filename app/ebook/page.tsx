"use client";

import { useState, useEffect } from "react";
import {
  BookMarked,
  Download,
  Star,
  Clock,
  BookA,
  ArrowRight,
  Languages,
  Loader2,
  Library,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  useGetEbookCategoriesQuery,
  useGetEbookByCategoryQuery,
} from "@/services/public/e-book.service";

export default function EBookPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  // 1. Fetch Categories
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetEbookCategoriesQuery({
      page: 1,
      paginate: 10,
    });

  // Set default category
  useEffect(() => {
    if (
      categoriesData?.data &&
      categoriesData.data.length > 0 &&
      selectedCategoryId === null
    ) {
      setSelectedCategoryId(categoriesData.data[0].id);
    }
  }, [categoriesData, selectedCategoryId]);

  // 2. Fetch Books by Category
  const {
    data: booksData,
    isLoading: isLoadingBooks,
    isFetching: isFetchingBooks,
  } = useGetEbookByCategoryQuery(
    {
      category: selectedCategoryId || 0,
      page: 1,
      paginate: 10,
    },
    {
      skip: selectedCategoryId === null,
    }
  );

  // Helper untuk mendapatkan nama kategori
  const getCategoryName = (id: number | null) => {
    return (
      categoriesData?.data.find((cat) => cat.id === id)?.name ||
      "Kategori Pilihan"
    );
  };

  const handleOpenPdf = (url: string) => {
    window.open(url, "_blank");
  };

  // Helper untuk simulasi rating & downloads (karena API belum menyediakan)
  const getBookMeta = (id: number) => {
    // Generate random but deterministic values based on ID
    const rating = (4 + (id % 10) / 10).toFixed(1);
    const downloads = `${(10 + (id % 50)).toFixed(1)}K`;
    const pages = 100 + ((id * 10) % 500);
    return { rating, downloads, pages };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md shadow-sm border-b border-awqaf-border-light sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-awqaf-primary font-comfortaa">
            E-Book Islam
          </h1>
          <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
            Koleksi buku digital Islam
          </p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Categories Grid (Loading State) */}
        {isLoadingCategories ? (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-4 h-24 animate-pulse bg-gray-200"
              />
            ))}
          </div>
        ) : (
          /* Categories Grid (Data) */
          <div className="grid grid-cols-2 gap-4 mb-6">
            {categoriesData?.data.map((category) => (
              <div
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className={`bg-card rounded-2xl shadow-sm p-4 text-center hover:shadow-md transition-all duration-200 border cursor-pointer active:scale-95 ${
                  selectedCategoryId === category.id
                    ? "border-awqaf-primary ring-1 ring-awqaf-primary bg-accent-50"
                    : "border-awqaf-border-light"
                }`}
              >
                {/* Ikon dinamis sederhana berdasarkan ID ganjil/genap untuk variasi */}
                {category.id % 2 !== 0 ? (
                  <BookMarked className="w-8 h-8 text-awqaf-primary mx-auto mb-2" />
                ) : (
                  <Star className="w-8 h-8 text-warning mx-auto mb-2" />
                )}
                <h3 className="font-semibold text-card-foreground text-sm font-comfortaa line-clamp-1">
                  {category.name}
                </h3>
                <div
                  className="text-xs text-awqaf-foreground-secondary mt-1 font-comfortaa line-clamp-1"
                  dangerouslySetInnerHTML={{ __html: category.description }}
                />
              </div>
            ))}
          </div>
        )}

        {/* --- BANNER KAMUS ISTILAH --- */}
        <Link href="/kamus-istilah" className="block mb-4">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-4 text-white shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
            {/* Decorative BG */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-110 transition-transform duration-500"></div>

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <BookA className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold font-comfortaa text-sm">
                    Kamus Istilah
                  </h3>
                  <p className="text-xs text-white/80 font-comfortaa">
                    Cari definisi kata dalam Islam
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>

        {/* --- BANNER BAHASA ARAB --- */}
        <Link href="/bahasa-arab" className="block mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-4 text-white shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
            {/* Decorative BG */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-110 transition-transform duration-500"></div>

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Languages className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold font-comfortaa text-sm">
                    Bahasa Arab
                  </h3>
                  <p className="text-xs text-white/80 font-comfortaa">
                    Pelajari kosa kata harian & travel
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>

        {/* Books List Section */}
        <div className="bg-card rounded-2xl shadow-sm p-6 border border-awqaf-border-light mb-6 min-h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-card-foreground font-comfortaa">
              {getCategoryName(selectedCategoryId)}
            </h3>
            {isLoadingBooks || isFetchingBooks ? (
              <Loader2 className="w-4 h-4 animate-spin text-awqaf-primary" />
            ) : null}
          </div>

          {isLoadingBooks ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-xl border border-gray-100"
                >
                  <div className="w-12 h-16 bg-gray-200 rounded animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : booksData?.data.length === 0 ? (
            <div className="text-center py-10">
              <Library className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-comfortaa">
                Belum ada buku di kategori ini.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {booksData?.data.map((book) => {
                const meta = getBookMeta(book.id);
                return (
                  <div
                    key={book.id}
                    onClick={() => handleOpenPdf(book.pdf)}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-accent-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-accent-100"
                  >
                    {/* Cover Image */}
                    <div className="w-16 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden relative">
                      {book.cover ? (
                        <Image
                          src={book.cover}
                          alt={book.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-accent-100">
                          <BookMarked className="w-6 h-6 text-awqaf-primary" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-card-foreground font-comfortaa text-sm line-clamp-2">
                        {book.title}
                      </h4>
                      <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mt-1">
                        {book.author}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-warning fill-current" />
                          <span className="text-[10px] text-awqaf-foreground-secondary font-comfortaa">
                            {meta.rating}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3 text-awqaf-foreground-secondary" />
                          <span className="text-[10px] text-awqaf-foreground-secondary font-comfortaa">
                            {meta.downloads}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-awqaf-foreground-secondary" />
                          <span className="text-[10px] text-awqaf-foreground-secondary font-comfortaa">
                            {meta.pages} hlm
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Download Status */}
        <div className="bg-gradient-to-r from-accent-100 to-accent-200 rounded-2xl p-6 border border-accent-200">
          <div className="text-center">
            <h4 className="font-semibold text-awqaf-primary font-comfortaa mb-2">
              Download Gratis
            </h4>
            <p className="text-awqaf-foreground-secondary text-sm font-comfortaa">
              Semua e-book tersedia gratis untuk pembelajaran dan dakwah
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}