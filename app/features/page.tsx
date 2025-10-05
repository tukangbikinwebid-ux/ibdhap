"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FeatureSearch from "@/app/components/FeatureSearch";
import FeatureList from "@/app/components/FeatureList";

export default function FeaturesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md shadow-sm border-b border-awqaf-border-light sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-awqaf-primary hover:text-awqaf-primary transition-colors duration-200" />
              </Button>
            </Link>

            {/* Search Bar */}
            <div className="flex-1">
              <FeatureSearch onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <FeatureList searchQuery={searchQuery} />
      </main>
    </div>
  );
}
