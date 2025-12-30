"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Download,
  Search,
  Navigation,
  FileJson,
  FileType,
  Filter,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// 1. Definisi Tipe Data
interface LetterTemplate {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: "docx" | "pdf";
  category: "nikah" | "wakaf" | "masjid" | "umum";
  date_added: string;
}

// 2. Data Dummy (Bisa diganti fetch API nantinya)
const TEMPLATES: LetterTemplate[] = [
  {
    id: "1",
    title: "Surat Ikrar Wakaf",
    description:
      "Format standar surat pernyataan ikrar wakaf tanah untuk keperluan KUA.",
    file_url: "/files/ikrar-wakaf.docx",
    file_type: "docx",
    category: "wakaf",
    date_added: "2024-01-10",
  },
  {
    id: "2",
    title: "Formulir N1 - Pengantar Nikah",
    description: "Formulir surat pengantar nikah dari Kelurahan/Desa.",
    file_url: "/files/form-n1.pdf",
    file_type: "pdf",
    category: "nikah",
    date_added: "2024-01-12",
  },
  {
    id: "3",
    title: "Surat Rekomendasi Nikah",
    description:
      "Surat rekomendasi nikah untuk calon pengantin yang menikah di luar kecamatan.",
    file_url: "/files/rekomendasi-nikah.docx",
    file_type: "docx",
    category: "nikah",
    date_added: "2024-01-15",
  },
  {
    id: "4",
    title: "Proposal Pembangunan Masjid",
    description: "Template proposal pengajuan dana bantuan pembangunan masjid.",
    file_url: "/files/proposal-masjid.docx",
    file_type: "docx",
    category: "masjid",
    date_added: "2024-02-01",
  },
  {
    id: "5",
    title: "Surat Keterangan Tidak Mampu (SKTM)",
    description:
      "Format surat keterangan tidak mampu untuk keperluan administrasi umum.",
    file_url: "/files/sktm.pdf",
    file_type: "pdf",
    category: "umum",
    date_added: "2024-02-05",
  },
  {
    id: "6",
    title: "Sertifikat Wakaf Uang",
    description: "Contoh desain dan format sertifikat wakaf uang tunai.",
    file_url: "/files/sertifikat-wakaf.pdf",
    file_type: "pdf",
    category: "wakaf",
    date_added: "2024-02-10",
  },
];

const CATEGORIES = [
  { id: "all", label: "Semua" },
  { id: "nikah", label: "Pernikahan" },
  { id: "wakaf", label: "Wakaf" },
  { id: "masjid", label: "Masjid" },
  { id: "umum", label: "Umum" },
];

export default function TemplateSuratPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Logic Filtering
  const filteredTemplates = TEMPLATES.filter((item) => {
    const matchCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Helper untuk warna badge kategori
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "nikah":
        return "bg-pink-100 text-pink-700 hover:bg-pink-200 border-pink-200";
      case "wakaf":
        return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
      case "masjid":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200";
    }
  };

  // Helper untuk icon file
  const getFileIcon = (type: "docx" | "pdf") => {
    if (type === "pdf") {
      return <FileType className="w-8 h-8 text-red-500" />;
    }
    return <FileText className="w-8 h-8 text-blue-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
                >
                  <Navigation className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                Template Surat
              </h1>
              <div className="w-10 h-10" /> {/* Spacer untuk centering */}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-6">
        {/* Search & Filter Section */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari surat..."
              className="pl-9 bg-white border-awqaf-border-light font-comfortaa focus-visible:ring-awqaf-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Tabs (Horizontal Scroll) */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.id}
                size="sm"
                variant={selectedCategory === cat.id ? "default" : "outline"}
                className={`rounded-full px-4 font-comfortaa text-xs whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-awqaf-primary hover:bg-awqaf-primary/90"
                    : "bg-white/50 border-awqaf-border-light text-awqaf-foreground-secondary"
                }`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="border-awqaf-border-light hover:shadow-md transition-shadow duration-200 group"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon Container */}
                    <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center shadow-sm shrink-0">
                      {getFileIcon(template.file_type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-gray-800 font-comfortaa line-clamp-2 text-sm leading-tight">
                          {template.title}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 font-comfortaa mt-1 line-clamp-2">
                        {template.description}
                      </p>

                      {/* Footer: Category & Action */}
                      <div className="flex items-center justify-between mt-3">
                        <Badge
                          variant="outline"
                          className={`text-[10px] py-0 h-5 border ${getCategoryColor(
                            template.category
                          )}`}
                        >
                          {template.category.charAt(0).toUpperCase() +
                            template.category.slice(1)}
                        </Badge>

                        <Button
                          size="sm"
                          className="h-7 px-3 text-xs bg-accent-50 text-awqaf-primary hover:bg-accent-100 hover:text-awqaf-primary border border-accent-100 font-comfortaa"
                          onClick={() =>
                            window.open(template.file_url, "_blank")
                          }
                        >
                          <Download className="w-3 h-3 mr-1.5" />
                          Unduh
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Empty State
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileJson className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-medium font-comfortaa">
                Tidak ditemukan
              </p>
              <p className="text-xs text-gray-500 font-comfortaa">
                Coba cari dengan kata kunci lain
              </p>
            </div>
          )}
        </div>

        {/* Promo / Info Banner (Optional aesthetic addition) */}
        <Card className="bg-gradient-to-r from-awqaf-primary to-teal-600 border-none text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10" />
          <CardContent className="p-4 relative z-10">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-sm font-comfortaa">
                  Butuh format lain?
                </p>
                <p className="text-xs text-white/80 font-comfortaa">
                  Hubungi admin untuk request surat.
                </p>
              </div>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}