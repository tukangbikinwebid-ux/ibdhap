"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Star, Filter } from "lucide-react";
import Link from "next/link";
import LocationSelector from "./components/LocationSelector";
import RestaurantCard from "./components/RestaurantCard";
import MenuCard from "./components/MenuCard";
import SearchFilter from "./components/SearchFilter";
import {
  restaurants,
  getRestaurantsByCity,
  searchRestaurants,
  Restaurant as RestaurantData,
  MenuItem,
} from "./data/restaurants";
import { useI18n } from "@/app/hooks/useI18n";

interface City {
  id: string;
  name: string;
  province: string;
  latitude: number;
  longitude: number;
}

interface FilterOptions {
  searchQuery: string;
  minRating: number;
  maxDistance: number;
  categories: string[];
  priceRange: string[];
  sortBy: "rating" | "distance" | "price" | "name";
}

export default function HalalPage() {
  const { t } = useI18n();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [filteredRestaurants, setFilteredRestaurants] = useState<
    RestaurantData[]
  >([]);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantData | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: "",
    minRating: 0,
    maxDistance: 10,
    categories: [],
    priceRange: [],
    sortBy: "rating",
  });
  const [activeTab, setActiveTab] = useState<"restaurants" | "menu">(
    "restaurants"
  );

  // Load restaurants when city changes
  useEffect(() => {
    if (selectedCity) {
      const cityRestaurants = getRestaurantsByCity(selectedCity.id);
      setFilteredRestaurants(cityRestaurants);
    }
  }, [selectedCity]);

  // Apply filters
  useEffect(() => {
    if (selectedCity) {
      let filtered = getRestaurantsByCity(selectedCity.id);

      // Apply search query
      if (filters.searchQuery) {
        filtered = searchRestaurants(filters.searchQuery, selectedCity.id);
      }

      // Apply rating filter
      if (filters.minRating > 0) {
        filtered = filtered.filter(
          (restaurant) => restaurant.rating >= filters.minRating
        );
      }

      // Apply distance filter
      if (filters.maxDistance < 10) {
        filtered = filtered.filter(
          (restaurant) => restaurant.distance <= filters.maxDistance
        );
      }

      // Apply category filter
      if (filters.categories.length > 0) {
        filtered = filtered.filter((restaurant) =>
          filters.categories.includes(restaurant.category)
        );
      }

      // Apply price range filter
      if (filters.priceRange.length > 0) {
        filtered = filtered.filter((restaurant) =>
          filters.priceRange.includes(restaurant.priceRange)
        );
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case "rating":
            return b.rating - a.rating;
          case "distance":
            return a.distance - b.distance;
          case "price":
            return a.priceRange.length - b.priceRange.length;
          case "name":
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });

      setFilteredRestaurants(filtered);
    }
  }, [selectedCity, filters]);

  const handleLocationChange = (location: City | null) => {
    setSelectedCity(location);
  };

  const handleCurrentLocationChange = (location: City | null) => {
    setSelectedCity(location);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  };

  const handleRestaurantFavoriteToggle = (restaurantId: string) => {
    setFilteredRestaurants((prev) =>
      prev.map((restaurant) =>
        restaurant.id === restaurantId
          ? { ...restaurant, isFavorite: !restaurant.isFavorite }
          : restaurant
      )
    );
  };

  const handleRestaurantShare = (restaurant: RestaurantData) => {
    if (navigator.share) {
      navigator.share({
        title: restaurant.name,
        text: restaurant.description,
        url: window.location.href,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(
        `${restaurant.name} - ${restaurant.address}`
      );
    }
  };

  const handleViewMenu = (restaurantId: string) => {
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    if (restaurant) {
      setSelectedRestaurant(restaurant);
      setActiveTab("menu");
    }
  };

  const handleMenuFavoriteToggle = (menuItemId: string) => {
    if (selectedRestaurant) {
      const updatedMenu = selectedRestaurant.menu.map((item) =>
        item.id === menuItemId
          ? { ...item, isFavorite: !item.isFavorite }
          : item
      );
      setSelectedRestaurant({ ...selectedRestaurant, menu: updatedMenu });
    }
  };

  const handleMenuShare = (menuItem: MenuItem) => {
    if (navigator.share) {
      navigator.share({
        title: menuItem.name,
        text: menuItem.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(
        `${menuItem.name} - ${menuItem.description}`
      );
    }
  };

  const handleAddToCart = (menuItem: MenuItem, quantity: number) => {
    // In a real app, this would add to cart
    console.log(`Added ${quantity}x ${menuItem.name} to cart`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 p-0 rounded-full bg-accent-100 hover:bg-accent-200 hover:text-awqaf-primary transition-colors duration-200"
                  >
                    <ArrowLeft className="w-5 h-5 text-awqaf-primary" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                    {t("halal.title")}
                  </h1>
                  <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                    {t("halal.subtitle")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-success text-white text-xs px-2 py-1">
                  {t("halal.halalCertified")}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Location Selector */}
        <LocationSelector
          onLocationChange={handleLocationChange}
          onCurrentLocationChange={handleCurrentLocationChange}
        />

        {/* Search and Filter */}
        <SearchFilter
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />

        {/* Results Summary */}
        {selectedCity && (
          <Card className="border-awqaf-border-light bg-gradient-to-r from-accent-100 to-accent-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-awqaf-primary" />
                  <span className="text-sm font-medium text-awqaf-primary font-comfortaa">
                    {filteredRestaurants.length} {t("halal.restaurantsFound")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-warning" />
                  <span className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                    {t("halal.in")} {selectedCity.name}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab Navigation */}
        <div className="flex bg-accent-100 rounded-lg p-1">
          <Button
            variant={activeTab === "restaurants" ? "default" : "ghost"}
            size="sm"
            className={`flex-1 font-comfortaa ${
              activeTab === "restaurants"
                ? "bg-awqaf-primary text-white"
                : "text-awqaf-foreground-secondary hover:text-awqaf-primary"
            }`}
            onClick={() => setActiveTab("restaurants")}
          >
            {t("halal.restaurants")}
          </Button>
          <Button
            variant={activeTab === "menu" ? "default" : "ghost"}
            size="sm"
            className={`flex-1 font-comfortaa ${
              activeTab === "menu"
                ? "bg-awqaf-primary text-white"
                : "text-awqaf-foreground-secondary hover:text-awqaf-primary"
            }`}
            onClick={() => setActiveTab("menu")}
            disabled={!selectedRestaurant}
          >
            {t("halal.menu")}
          </Button>
        </div>

        {/* Restaurants Tab */}
        {activeTab === "restaurants" && (
          <div className="space-y-4">
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onFavoriteToggle={handleRestaurantFavoriteToggle}
                  onShare={handleRestaurantShare}
                  onViewMenu={handleViewMenu}
                />
              ))
            ) : (
              <Card className="border-awqaf-border-light">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="w-8 h-8 text-awqaf-foreground-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-awqaf-foreground-secondary font-comfortaa mb-2">
                    {t("halal.noRestaurantsFound")}
                  </h3>
                  <p className="text-sm text-awqaf-foreground-tertiary font-comfortaa">
                    {t("halal.tryDifferentFilter")}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === "menu" && selectedRestaurant && (
          <div className="space-y-4">
            {/* Restaurant Info */}
            <Card className="border-awqaf-border-light bg-gradient-to-r from-accent-100 to-accent-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Star className="w-6 h-6 text-awqaf-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-awqaf-primary text-sm font-comfortaa">
                      {selectedRestaurant.name}
                    </h3>
                    <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                      {selectedRestaurant.menu.length} {t("halal.menuAvailable")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Menu Items */}
            <div className="space-y-3">
              {selectedRestaurant.menu.map((menuItem) => (
                <MenuCard
                  key={menuItem.id}
                  menuItem={menuItem}
                  onAddToCart={handleAddToCart}
                  onFavoriteToggle={handleMenuFavoriteToggle}
                  onShare={handleMenuShare}
                />
              ))}
            </div>
          </div>
        )}

        {/* Motivational Quote */}
        <Card className="border-awqaf-border-light bg-gradient-to-r from-accent-100 to-accent-200">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-awqaf-foreground-secondary font-comfortaa mb-2">
              &quot;{t("halal.motivationalQuote")}&quot;
            </p>
            <p className="text-xs text-awqaf-primary font-tajawal">
              - QS. Al-Baqarah: 172
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
