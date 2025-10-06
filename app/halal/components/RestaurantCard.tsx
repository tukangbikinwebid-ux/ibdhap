"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, Phone, Heart, Share2 } from "lucide-react";
import { Restaurant } from "../data/restaurants";
import ImageWithFallback from "./ImageWithFallback";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onFavoriteToggle?: (restaurantId: string) => void;
  onShare?: (restaurant: Restaurant) => void;
  onViewMenu?: (restaurantId: string) => void;
}

export default function RestaurantCard({
  restaurant,
  onFavoriteToggle,
  onShare,
  onViewMenu,
}: RestaurantCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? "text-warning fill-warning"
            : "text-awqaf-border-light"
        }`}
      />
    ));
  };

  const getPriceRangeColor = (priceRange: string) => {
    switch (priceRange) {
      case "Rp":
        return "bg-success text-white";
      case "Rp Rp":
        return "bg-warning text-white";
      case "Rp Rp Rp":
        return "bg-error text-white";
      default:
        return "bg-accent-100 text-awqaf-foreground-secondary";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "restoran":
        return "bg-info text-white";
      case "warung":
        return "bg-success text-white";
      case "kafe":
        return "bg-warning text-white";
      case "fast food":
        return "bg-error text-white";
      default:
        return "bg-accent-100 text-awqaf-foreground-secondary";
    }
  };

  return (
    <Card className="border-awqaf-border-light hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Restaurant Image */}
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={restaurant.image}
          alt={restaurant.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {restaurant.halalCertified && (
            <Badge className="bg-success text-white text-xs px-2 py-1">
              Halal Certified
            </Badge>
          )}
          <Badge
            className={`text-xs px-2 py-1 ${getCategoryColor(
              restaurant.category
            )}`}
          >
            {restaurant.category}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFavoriteToggle?.(restaurant.id)}
            className={`w-8 h-8 p-0 rounded-full backdrop-blur-sm ${
              restaurant.isFavorite
                ? "bg-error text-white hover:bg-error/80"
                : "bg-white/80 text-awqaf-foreground-secondary hover:bg-white"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                restaurant.isFavorite ? "fill-current" : ""
              }`}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare?.(restaurant)}
            className="w-8 h-8 p-0 rounded-full bg-white/80 text-awqaf-foreground-secondary hover:bg-white backdrop-blur-sm"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Price Range */}
        <div className="absolute bottom-3 right-3">
          <Badge
            className={`text-xs px-2 py-1 ${getPriceRangeColor(
              restaurant.priceRange
            )}`}
          >
            {restaurant.priceRange}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Restaurant Info */}
        <div className="space-y-3">
          {/* Name and Rating */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-card-foreground text-lg font-comfortaa leading-tight mb-1">
                {restaurant.name}
              </h3>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa line-clamp-2">
                {restaurant.description}
              </p>
            </div>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {renderStars(restaurant.rating)}
            </div>
            <span className="text-sm font-medium text-card-foreground font-comfortaa">
              {restaurant.rating}
            </span>
            <span className="text-xs text-awqaf-foreground-secondary font-comfortaa">
              ({restaurant.reviewCount} ulasan)
            </span>
          </div>

          {/* Location and Distance */}
          <div className="flex items-center gap-2 text-sm text-awqaf-foreground-secondary">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="font-comfortaa line-clamp-1">
              {restaurant.address}
            </span>
            <span className="text-xs bg-accent-100 px-2 py-1 rounded-full font-comfortaa">
              {restaurant.distance} km
            </span>
          </div>

          {/* Opening Hours */}
          <div className="flex items-center gap-2 text-sm text-awqaf-foreground-secondary">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="font-comfortaa">{restaurant.openingHours}</span>
          </div>

          {/* Features */}
          {restaurant.features.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {restaurant.features.slice(0, 3).map((feature, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs px-2 py-1 bg-accent-50 text-awqaf-foreground-secondary"
                >
                  {feature}
                </Badge>
              ))}
              {restaurant.features.length > 3 && (
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-1 bg-accent-50 text-awqaf-foreground-secondary"
                >
                  +{restaurant.features.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-awqaf-primary border-awqaf-primary hover:bg-awqaf-primary hover:text-white font-comfortaa"
            >
              <Phone className="w-4 h-4 mr-2" />
              Hubungi
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => onViewMenu?.(restaurant.id)}
              className="flex-1 bg-awqaf-primary text-white hover:bg-awqaf-primary/90 font-comfortaa"
            >
              Lihat Menu
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
