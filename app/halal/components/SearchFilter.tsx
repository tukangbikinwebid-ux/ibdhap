"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Star, MapPin } from "lucide-react";
import { useI18n } from "@/app/hooks/useI18n";

export interface FilterOptions {
  searchQuery: string;
  minRating: number;
  maxDistance: number;
  sortBy: "rating" | "distance" | "name";
}

interface SearchFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  onSearch: (query: string) => void;
}

// --- TYPES & TRANSLATIONS ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

const FILTER_TEXT: Record<
  LocaleCode,
  {
    searchPlaceholder: string;
    filter: string;
    title: string;
    reset: string;
    sortBy: string;
    sortRating: string;
    sortDistance: string;
    sortName: string;
    minRating: string;
    searchRadius: string;
  }
> = {
  id: {
    searchPlaceholder: "Cari restoran halal...",
    filter: "Filter",
    title: "Filter & Urutkan",
    reset: "Reset",
    sortBy: "Urutkan berdasarkan:",
    sortRating: "Rating Tertinggi",
    sortDistance: "Jarak Terdekat",
    sortName: "Nama A-Z",
    minRating: "Rating minimum:",
    searchRadius: "Radius Pencarian:",
  },
  en: {
    searchPlaceholder: "Search halal restaurants...",
    filter: "Filter",
    title: "Filter & Sort",
    reset: "Reset",
    sortBy: "Sort by:",
    sortRating: "Highest Rating",
    sortDistance: "Nearest Distance",
    sortName: "Name A-Z",
    minRating: "Minimum rating:",
    searchRadius: "Search Radius:",
  },
  ar: {
    searchPlaceholder: "بحث عن مطاعم حلال...",
    filter: "تصفية",
    title: "تصفية وترتيب",
    reset: "إعادة تعيين",
    sortBy: "ترتيب حسب:",
    sortRating: "أعلى تقييم",
    sortDistance: "أقرب مسافة",
    sortName: "الاسم أ-ي",
    minRating: "الحد الأدنى للتقييم:",
    searchRadius: "نطاق البحث:",
  },
  fr: {
    searchPlaceholder: "Rechercher restaurants halal...",
    filter: "Filtrer",
    title: "Filtrer et Trier",
    reset: "Réinitialiser",
    sortBy: "Trier par :",
    sortRating: "Meilleure Note",
    sortDistance: "Distance la plus proche",
    sortName: "Nom A-Z",
    minRating: "Note minimum :",
    searchRadius: "Rayon de recherche :",
  },
  kr: {
    searchPlaceholder: "할랄 식당 검색...",
    filter: "필터",
    title: "필터 및 정렬",
    reset: "초기화",
    sortBy: "정렬 기준:",
    sortRating: "최고 평점",
    sortDistance: "최단 거리",
    sortName: "이름순",
    minRating: "최소 평점:",
    searchRadius: "검색 반경:",
  },
  jp: {
    searchPlaceholder: "ハラールレストランを検索...",
    filter: "フィルター",
    title: "フィルターと並べ替え",
    reset: "リセット",
    sortBy: "並べ替え:",
    sortRating: "最高評価",
    sortDistance: "最短距離",
    sortName: "名前順",
    minRating: "最低評価:",
    searchRadius: "検索範囲:",
  },
};

export default function SearchFilter({
  onFilterChange,
  onSearch,
}: SearchFilterProps) {
  const { locale } = useI18n();
  const safeLocale = (
    FILTER_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = FILTER_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: "",
    minRating: 0,
    maxDistance: 10,
    sortBy: "distance",
  });

  const sortOptions = [
    { label: t.sortRating, value: "rating" },
    { label: t.sortDistance, value: "distance" },
    { label: t.sortName, value: "name" },
  ];

  const handleSearchChange = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
    onSearch(query);
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterOptions = {
      searchQuery: "",
      minRating: 0,
      maxDistance: 10,
      sortBy: "distance",
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.minRating > 0) count++;
    if (filters.maxDistance !== 10) count++;
    return count;
  };

  return (
    <div className="space-y-4" dir={isRtl ? "rtl" : "ltr"}>
      <Card className="border-awqaf-border-light">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search
                className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-awqaf-foreground-secondary ${
                  isRtl ? "right-3" : "left-3"
                }`}
              />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={filters.searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className={`w-full py-2 border border-awqaf-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-awqaf-primary focus:border-transparent font-comfortaa text-sm ${
                  isRtl ? "pr-10 pl-4" : "pl-10 pr-4"
                }`}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="relative border-awqaf-primary text-awqaf-primary hover:bg-awqaf-primary hover:text-white"
            >
              <Filter className={`w-4 h-4 ${isRtl ? "ml-2" : "mr-2"}`} />
              {t.filter}
              {getActiveFiltersCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-error text-white text-xs w-5 h-5 p-0 flex items-center justify-center">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isFilterOpen && (
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-card-foreground text-sm font-comfortaa">
                  {t.title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-awqaf-foreground-secondary hover:text-awqaf-primary text-xs"
                >
                  <X className={`w-3 h-3 ${isRtl ? "ml-1" : "mr-1"}`} />
                  {t.reset}
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground font-comfortaa">
                  {t.sortBy}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {sortOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={
                        filters.sortBy === option.value ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        handleFilterChange({
                          sortBy: option.value as FilterOptions["sortBy"],
                        })
                      }
                      className={`text-xs font-comfortaa ${
                        filters.sortBy === option.value
                          ? "bg-awqaf-primary text-white"
                          : "border-awqaf-border-light text-awqaf-foreground-secondary hover:border-awqaf-primary hover:text-awqaf-primary"
                      }`}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground font-comfortaa">
                  {t.minRating}
                </label>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-warning" />
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={filters.minRating}
                    onChange={(e) =>
                      handleFilterChange({
                        minRating: parseFloat(e.target.value),
                      })
                    }
                    className="flex-1 accent-awqaf-primary"
                  />
                  <span className="text-sm font-medium text-card-foreground font-comfortaa min-w-[40px]">
                    {filters.minRating}+
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground font-comfortaa">
                  {t.searchRadius}
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-awqaf-primary" />
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={filters.maxDistance}
                    onChange={(e) =>
                      handleFilterChange({
                        maxDistance: parseInt(e.target.value),
                      })
                    }
                    className="flex-1 accent-awqaf-primary"
                  />
                  <span className="text-sm font-medium text-card-foreground font-comfortaa min-w-[50px]">
                    {filters.maxDistance} km
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}