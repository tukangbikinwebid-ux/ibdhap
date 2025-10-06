"use client";

import { useState } from "react";
import Image from "next/image";
import { Utensils } from "lucide-react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div
        className={`bg-accent-100 flex items-center justify-center ${className}`}
        style={fill ? {} : { width, height }}
      >
        <Utensils className="w-8 h-8 text-awqaf-foreground-secondary" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      onError={() => setImageError(true)}
    />
  );
}
