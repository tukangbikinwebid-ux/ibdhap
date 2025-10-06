"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Star, MapPin } from "lucide-react";

interface FilterOptions {
  searchQuery: string;
  minRating: number;
  maxDistance: number;
  categories: string[];
  priceRange: string[];
  sortBy: "rating" | "distance" | "price" | "name";
}

interface SearchFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  onSearch: (query: string) => void;
}

const categories = [
  "Restoran",
  "Warung",
  "Kafe",
  "Fast Food",
  "Bakery",
  "Dessert",
  "Minuman",
  "Street Food",
];

const priceRanges = [
  { label: "Rp", value: "budget" },
  { label: "Rp Rp", value: "moderate" },
  { label: "Rp Rp Rp", value: "expensive" },
];

const sortOptions = [
  { label: "Rating Tertinggi", value: "rating" },
  { label: "Jarak Terdekat", value: "distance" },
  { label: "Harga Terendah", value: "price" },
  { label: "Nama A-Z", value: "name" },
];

export default function SearchFilter({
  onFilterChange,
  onSearch,
}: SearchFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: "",
    minRating: 0,
    maxDistance: 10,
    categories: [],
    priceRange: [],
    sortBy: "rating",
  });

  const handleSearchChange = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
    onSearch(query);
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];

    handleFilterChange({ categories: newCategories });
  };

  const handlePriceRangeToggle = (priceRange: string) => {
    const newPriceRange = filters.priceRange.includes(priceRange)
      ? filters.priceRange.filter((p) => p !== priceRange)
      : [...filters.priceRange, priceRange];

    handleFilterChange({ priceRange: newPriceRange });
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterOptions = {
      searchQuery: "",
      minRating: 0,
      maxDistance: 10,
      categories: [],
      priceRange: [],
      sortBy: "rating",
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.minRating > 0) count++;
    if (filters.maxDistance < 10) count++;
    if (filters.categories.length > 0) count++;
    if (filters.priceRange.length > 0) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Card className="border-awqaf-border-light">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-awqaf-foreground-secondary" />
              <input
                type="text"
                placeholder="Cari restoran halal..."
                value={filters.searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-awqaf-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-awqaf-primary focus:border-transparent font-comfortaa text-sm"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="relative border-awqaf-primary text-awqaf-primary hover:bg-awqaf-primary hover:text-white"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
              {getActiveFiltersCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-error text-white text-xs w-5 h-5 p-0 flex items-center justify-center">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filter Panel */}
      {isFilterOpen && (
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-card-foreground text-sm font-comfortaa">
                  Filter & Urutkan
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-awqaf-foreground-secondary hover:text-awqaf-primary text-xs"
                >
                  <X className="w-3 h-3 mr-1" />
                  Reset
                </Button>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground font-comfortaa">
                  Urutkan berdasarkan:
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

              {/* Rating Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground font-comfortaa">
                  Rating minimum:
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
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-card-foreground font-comfortaa min-w-[40px]">
                    {filters.minRating}+
                  </span>
                </div>
              </div>

              {/* Distance Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground font-comfortaa">
                  Jarak maksimal:
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-awqaf-primary" />
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={filters.maxDistance}
                    onChange={(e) =>
                      handleFilterChange({
                        maxDistance: parseInt(e.target.value),
                      })
                    }
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-card-foreground font-comfortaa min-w-[50px]">
                    {filters.maxDistance} km
                  </span>
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground font-comfortaa">
                  Kategori:
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={
                        filters.categories.includes(category)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handleCategoryToggle(category)}
                      className={`text-xs font-comfortaa ${
                        filters.categories.includes(category)
                          ? "bg-awqaf-primary text-white"
                          : "border-awqaf-border-light text-awqaf-foreground-secondary hover:border-awqaf-primary hover:text-awqaf-primary"
                      }`}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground font-comfortaa">
                  Rentang harga:
                </label>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((range) => (
                    <Button
                      key={range.value}
                      variant={
                        filters.priceRange.includes(range.value)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handlePriceRangeToggle(range.value)}
                      className={`text-xs font-comfortaa ${
                        filters.priceRange.includes(range.value)
                          ? "bg-awqaf-primary text-white"
                          : "border-awqaf-border-light text-awqaf-foreground-secondary hover:border-awqaf-primary hover:text-awqaf-primary"
                      }`}
                    >
                      {range.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.minRating > 0 && (
            <Badge className="bg-warning text-white text-xs px-2 py-1">
              Rating {filters.minRating}+
            </Badge>
          )}
          {filters.maxDistance < 10 && (
            <Badge className="bg-info text-white text-xs px-2 py-1">
              &lt; {filters.maxDistance} km
            </Badge>
          )}
          {filters.categories.map((category) => (
            <Badge
              key={category}
              className="bg-success text-white text-xs px-2 py-1"
            >
              {category}
            </Badge>
          ))}
          {filters.priceRange.map((range) => (
            <Badge
              key={range}
              className="bg-error text-white text-xs px-2 py-1"
            >
              {priceRanges.find((p) => p.value === range)?.label}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
