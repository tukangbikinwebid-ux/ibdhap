"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Plus, Minus, Heart, Share2 } from "lucide-react";
import { useState } from "react";
import ImageWithFallback from "./ImageWithFallback";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  isPopular?: boolean;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  isHalal?: boolean;
  ingredients: string[];
  allergens: string[];
  isFavorite?: boolean;
}

interface MenuCardProps {
  menuItem: MenuItem;
  onAddToCart?: (menuItem: MenuItem, quantity: number) => void;
  onFavoriteToggle?: (menuItemId: string) => void;
  onShare?: (menuItem: MenuItem) => void;
}

export default function MenuCard({
  menuItem,
  onAddToCart,
  onFavoriteToggle,
  onShare,
}: MenuCardProps) {
  const [quantity, setQuantity] = useState(1);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < Math.floor(rating)
            ? "text-warning fill-warning"
            : "text-awqaf-border-light"
        }`}
      />
    ));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    onAddToCart?.(menuItem, quantity);
  };

  return (
    <Card className="border-awqaf-border-light hover:shadow-md transition-all duration-200 overflow-hidden group">
      <div className="flex">
        {/* Menu Image */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <ImageWithFallback
            src={menuItem.image}
            alt={menuItem.name}
            fill
            className="object-cover"
          />

          {/* Popular Badge */}
          {menuItem.isPopular && (
            <Badge className="absolute top-1 left-1 bg-warning text-white text-xs px-1.5 py-0.5">
              Populer
            </Badge>
          )}
        </div>

        {/* Menu Content */}
        <CardContent className="p-3 flex-1">
          <div className="space-y-2">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-card-foreground text-sm font-comfortaa leading-tight">
                  {menuItem.name}
                </h3>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa line-clamp-2 mt-1">
                  {menuItem.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFavoriteToggle?.(menuItem.id)}
                  className={`w-6 h-6 p-0 ${
                    menuItem.isFavorite
                      ? "text-error hover:text-error/80"
                      : "text-awqaf-foreground-secondary hover:text-error"
                  }`}
                >
                  <Heart
                    className={`w-3 h-3 ${
                      menuItem.isFavorite ? "fill-current" : ""
                    }`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onShare?.(menuItem)}
                  className="w-6 h-6 p-0 text-awqaf-foreground-secondary hover:text-awqaf-primary"
                >
                  <Share2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                {renderStars(menuItem.rating)}
              </div>
              <span className="text-xs font-medium text-card-foreground font-comfortaa">
                {menuItem.rating}
              </span>
              <span className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                ({menuItem.reviewCount})
              </span>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-1">
              {menuItem.isSpicy && (
                <Badge className="bg-error text-white text-xs px-1.5 py-0.5">
                  Pedas
                </Badge>
              )}
              {menuItem.isVegetarian && (
                <Badge className="bg-success text-white text-xs px-1.5 py-0.5">
                  Vegetarian
                </Badge>
              )}
              {/* {menuItem.isHalal && (
                <Badge className="bg-info text-white text-xs px-1.5 py-0.5">
                  Halal
                </Badge>
              )} */}
            </div>

            {/* Price and Quantity */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-awqaf-primary font-comfortaa">
                  {formatPrice(menuItem.price)}
                </span>
                {quantity > 1 && (
                  <span className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                    Total: {formatPrice(menuItem.price * quantity)}
                  </span>
                )}
              </div>

              {/* Quantity Controls */}
              {/* <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-accent-100 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="w-6 h-6 p-0 text-awqaf-foreground-secondary hover:text-awqaf-primary"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="text-sm font-medium text-card-foreground font-comfortaa min-w-[20px] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="w-6 h-6 p-0 text-awqaf-foreground-secondary hover:text-awqaf-primary"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>

                <Button
                  variant="default"
                  size="sm"
                  onClick={handleAddToCart}
                  className="bg-awqaf-primary text-white hover:bg-awqaf-primary/90 text-xs px-3 py-1 font-comfortaa"
                >
                  Tambah
                </Button>
              </div> */}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
