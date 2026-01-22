"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Share2, Navigation } from "lucide-react";
import ImageWithFallback from "./ImageWithFallback";
import { Place } from "@/types/public/places";

interface RestaurantCardProps {
  place: Place;
  localizedContent: {
    name: string;
    description: string;
  };
}

export default function RestaurantCard({
  place,
  localizedContent,
}: RestaurantCardProps) {
  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating);
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(numRating)
            ? "text-warning fill-warning"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
    window.open(url, "_blank");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: localizedContent.name,
        text: localizedContent.description,
        url: window.location.href,
      });
    }
  };

  return (
    <Card className="border-awqaf-border-light hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={place.image}
          alt={localizedContent.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className="bg-success text-white text-xs px-2 py-1">
            Restoran
          </Badge>
        </div>

        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="w-8 h-8 p-0 rounded-full bg-white/80 text-gray-600 hover:bg-white backdrop-blur-sm"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-card-foreground text-lg font-comfortaa leading-tight mb-1">
              {localizedContent.name}
            </h3>
            <div
              className="text-sm text-awqaf-foreground-secondary font-comfortaa line-clamp-2"
              dangerouslySetInnerHTML={{ __html: localizedContent.description }}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {renderStars(place.rating)}
            </div>
            <span className="text-sm font-medium text-card-foreground font-comfortaa">
              {place.rating}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-awqaf-foreground-secondary">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="font-comfortaa line-clamp-1">Jarak sekitar</span>
            <span className="text-xs bg-accent-100 px-2 py-1 rounded-full font-comfortaa font-bold">
              {place.distance.toFixed(2)} km
            </span>
          </div>

          {place.facilities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {place.facilities.slice(0, 3).map((facility, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600"
                >
                  {facility}
                </Badge>
              ))}
              {place.facilities.length > 3 && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-2 py-0.5 bg-gray-100"
                >
                  +{place.facilities.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="pt-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleNavigate}
              className="w-full bg-awqaf-primary text-white hover:bg-awqaf-primary/90 font-comfortaa"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Petunjuk Arah
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}