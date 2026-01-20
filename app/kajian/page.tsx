"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Play,
  Clock,
  Users,
  RefreshCw,
  GraduationCap,
  Loader2,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
// Import Services & Types
import {
  useGetUstadzListQuery,
  useGetKajianListQuery,
} from "@/services/public/kajian.service";

// Loading Skeleton Component
const KajianSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-xl bg-gray-100 animate-pulse"
        >
          <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default function KajianPage() {
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [selectedUstadzId, setSelectedUstadzId] = useState<number | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 1. Fetch Ustadz List (untuk filter dropdown)
  const { data: ustadzData, isLoading: isLoadingUstadz } =
    useGetUstadzListQuery({
      page: 1,
      paginate: 100, // Ambil semua ustadz
    });

  // 2. Fetch Kajian List
  const {
    data: kajianData,
    isLoading: isLoadingKajian,
    refetch,
  } = useGetKajianListQuery({
    page: 1,
    paginate: 50, // Increase pagination untuk lebih banyak data
    ustadz_id: selectedUstadzId,
  });

  // Filter & Sort Logic (Client-side filtering dan sorting)
  const filteredKajian = useMemo(() => {
    if (!kajianData?.data) return [];

    let list = [...kajianData.data];

    // Filter by search query
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      list = list.filter(
        (k) =>
          k.title.toLowerCase().includes(query) ||
          k.description?.toLowerCase().includes(query) ||
          k.ustadz?.name.toLowerCase().includes(query)
      );
    }

    // Sort by date
    list.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return list;
  }, [kajianData, sortBy, debouncedSearchQuery]);

  // Helper formatting
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const resetFilters = () => {
    setSortBy("newest");
    setSelectedUstadzId(undefined);
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedUstadzId !== undefined ||
    sortBy !== "newest" ||
    searchQuery !== "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <h1 className="text-xl font-bold text-awqaf-primary font-comfortaa text-center">
              Kajian Islam
            </h1>
            <p className="text-sm text-awqaf-foreground-secondary font-comfortaa text-center mt-1">
              Belajar dan memperdalam ilmu agama
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Banner */}
        <Card className="border-awqaf-border-light bg-gradient-to-r from-accent-100 to-accent-200 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/60 rounded-full flex items-center justify-center border border-awqaf-border-light">
                <GraduationCap className="w-6 h-6 text-awqaf-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-awqaf-primary font-comfortaa">
                  Kajian Islam Terbaru
                </h2>
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  Dengarkan kajian pilihan dari para ustadz
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Bar */}
        <Card className="border-awqaf-border-light mb-4">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-awqaf-foreground-secondary" />
              <Input
                type="text"
                placeholder="Cari kajian, ustadz, atau topik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 border-awqaf-border-light bg-background text-awqaf-foreground placeholder-awqaf-foreground-secondary font-comfortaa focus-visible:ring-2 focus-visible:ring-awqaf-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-awqaf-foreground-secondary hover:text-awqaf-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {/* Sort select */}
              <div className="flex-1">
                <label className="block text-xs mb-1 text-awqaf-foreground-secondary font-comfortaa">
                  Urutkan
                </label>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "newest" | "oldest")
                  }
                  className="w-full h-10 px-3 rounded-md border border-awqaf-border-light bg-background text-sm font-comfortaa focus:outline-none focus:ring-2 focus:ring-awqaf-primary"
                >
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                </select>
              </div>

              {/* Ustadz select */}
              <div className="flex-1">
                <label className="block text-xs mb-1 text-awqaf-foreground-secondary font-comfortaa">
                  Ustadz
                </label>
                <select
                  value={selectedUstadzId || ""}
                  onChange={(e) =>
                    setSelectedUstadzId(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="w-full h-10 px-3 rounded-md border border-awqaf-border-light bg-background text-sm font-comfortaa focus:outline-none focus:ring-2 focus:ring-awqaf-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoadingUstadz}
                >
                  <option value="">Semua Ustadz</option>
                  {ustadzData?.data.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-3">
                <button
                  onClick={resetFilters}
                  className="px-3 py-2 rounded-md text-sm border bg-background border-awqaf-border-light hover:bg-accent-50 hover:text-awqaf-primary transition-colors duration-200 flex items-center gap-2 font-comfortaa"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset Filter
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Kajian List */}
        <Card className="border-awqaf-border-light mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-card-foreground font-comfortaa">
                Daftar Kajian
              </h3>
              {!isLoadingKajian && filteredKajian.length > 0 && (
                <span className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                  {filteredKajian.length} kajian
                </span>
              )}
            </div>

            {isLoadingKajian ? (
              <KajianSkeleton />
            ) : filteredKajian.length > 0 ? (
              <div className="space-y-3">
                {filteredKajian.map((k) => (
                  <Link key={k.id} href={`/kajian/${k.id}`}>
                    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-accent-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-awqaf-border-light">
                      <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-accent-200 transition-colors duration-200">
                        <Play className="w-5 h-5 text-awqaf-primary ml-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-card-foreground font-comfortaa text-sm line-clamp-2 mb-1">
                          {k.title}
                        </h4>
                        <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mb-2">
                          {k.ustadz?.name || "Ustadz"}
                        </p>
                        <div className="flex items-center gap-4 text-[10px] text-awqaf-foreground-secondary font-comfortaa">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(k.duration)}
                          </div>
                          <div>
                            {new Date(k.created_at).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          {/* Views simulation since API doesn't provide it yet */}
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />{" "}
                            {((k.id * 123) % 1000).toLocaleString("id-ID")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-awqaf-foreground-secondary font-comfortaa text-sm mb-2">
                  {searchQuery || selectedUstadzId
                    ? "Tidak ada kajian yang sesuai dengan filter"
                    : "Belum ada kajian ditemukan"}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-awqaf-primary hover:underline font-comfortaa text-sm"
                  >
                    Reset filter
                  </button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Card className="border-awqaf-border-light bg-gradient-to-r from-accent-100 to-accent-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h4 className="font-semibold text-awqaf-primary font-comfortaa mb-2">
                Akses Cepat
              </h4>
              <p className="text-awqaf-foreground-secondary text-sm font-comfortaa">
                Dapatkan notifikasi kajian terbaru dan jadwal live streaming
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}