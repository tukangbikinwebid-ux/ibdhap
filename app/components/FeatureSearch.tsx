"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FeatureSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function FeatureSearch({
  onSearch,
  placeholder = "Cari fitur...",
}: FeatureSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Call onSearch when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-awqaf-foreground-secondary" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 bg-background border-awqaf-border-light focus:border-awqaf-primary focus:ring-awqaf-primary/20 font-comfortaa"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
          >
            <X className="w-4 h-4 text-awqaf-foreground-secondary hover:text-awqaf-primary transition-colors duration-200" />
          </Button>
        )}
      </div>
    </div>
  );
}
