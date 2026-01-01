"use client";

import { useMemo, useState } from "react";
import {
  Play,
  Clock,
  Users,
  RefreshCw,
  GraduationCap,
  Loader2,
} from "lucide-react";
import Link from "next/link";
// Import Services & Types
import {
  useGetUstadzListQuery,
  useGetKajianListQuery,
} from "@/services/public/kajian.service";

export default function KajianPage() {
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [selectedUstadzId, setSelectedUstadzId] = useState<number | undefined>(
    undefined
  );

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
    paginate: 20,
    ustadz_id: selectedUstadzId,
  });

  // Filter & Sort Logic (Client-side sorting pada batch yang di-load)
  const filteredKajian = useMemo(() => {
    if (!kajianData?.data) return [];

    const list = [...kajianData.data];

    list.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return list;
  }, [kajianData, sortBy]);

  // Helper formatting
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const resetFilters = () => {
    setSortBy("newest");
    setSelectedUstadzId(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md shadow-sm border-b border-awqaf-border-light sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-awqaf-primary font-comfortaa">
            Kajian Islam
          </h1>
          <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
            Belajar dan memperdalam ilmu agama
          </p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-accent-100 to-accent-200 rounded-2xl p-6 border border-accent-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/60 rounded-full flex items-center justify-center border border-awqaf-border-light">
              <GraduationCap className="w-6 h-6 text-awqaf-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-awqaf-primary font-comfortaa">
                Kajian Islam Terbaru
              </h2>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                Dengarkan kajian pilihan dari para ustadz.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-3">
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
                className="w-full h-10 px-3 rounded-md border border-awqaf-border-light bg-background text-sm font-comfortaa"
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
                className="w-full h-10 px-3 rounded-md border border-awqaf-border-light bg-background text-sm font-comfortaa"
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

          {(selectedUstadzId || sortBy !== "newest") && (
            <div className="mt-3">
              <button
                className="px-3 py-2 rounded-md text-sm border bg-background border-awqaf-border-light flex items-center gap-1"
                onClick={resetFilters}
              >
                <RefreshCw className="w-4 h-4" /> Reset
              </button>
            </div>
          )}
        </div>

        {/* Kajian List */}
        <div className="bg-card rounded-2xl shadow-sm p-6 border border-awqaf-border-light mb-6 min-h-[300px]">
          <h3 className="font-semibold text-card-foreground mb-4 font-comfortaa">
            Daftar Kajian
          </h3>

          {isLoadingKajian ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-awqaf-primary" />
            </div>
          ) : filteredKajian.length > 0 ? (
            <div className="space-y-3">
              {filteredKajian.map((k) => (
                <Link key={k.id} href={`/kajian/${k.id}`}>
                  <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-accent-50 transition-all duration-200 cursor-pointer">
                    <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Play className="w-5 h-5 text-awqaf-primary ml-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-card-foreground font-comfortaa text-sm line-clamp-2">
                        {k.title}
                      </h4>
                      <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mt-1">
                        {k.ustadz?.name || "Ustadz"}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-[10px] text-awqaf-foreground-secondary font-comfortaa">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />{" "}
                          {formatDuration(k.duration)}
                        </div>
                        <div>
                          {new Date(k.created_at).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        {/* Views simulation since API doesn't provide it yet */}
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {(k.id * 123) % 1000}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 font-comfortaa text-sm">
              Belum ada kajian ditemukan.
            </div>
          )}
        </div>

        {/* Quick Access */}
        <div className="bg-gradient-to-r from-accent-100 to-accent-200 rounded-2xl p-6 border border-accent-200">
          <div className="text-center">
            <h4 className="font-semibold text-awqaf-primary font-comfortaa mb-2">
              Akses Cepat
            </h4>
            <p className="text-awqaf-foreground-secondary text-sm font-comfortaa">
              Dapatkan notifikasi kajian terbaru dan jadwal live streaming
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}