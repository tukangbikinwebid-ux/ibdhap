"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, BookOpen, BookA } from "lucide-react";
import Link from "next/link";

// --- 1. TIPE DATA ---
interface IslamicTerm {
  id: string;
  term: string;
  definition: string;
  alphabet_index: string; // A, B, C...
}

// --- 2. DATA DUMMY (Sample Data) ---
const TERMS: IslamicTerm[] = [
  {
    id: "1",
    term: "Adzan",
    definition: "Panggilan untuk melaksanakan shalat bagi umat Islam.",
    alphabet_index: "A",
  },
  {
    id: "2",
    term: "Aqidah",
    definition: "Kepercayaan atau keyakinan yang kuat dalam hati (iman).",
    alphabet_index: "A",
  },
  {
    id: "3",
    term: "Akhlak",
    definition: "Tingkah laku atau budi pekerti seseorang.",
    alphabet_index: "A",
  },
  {
    id: "4",
    term: "Barakah",
    definition: "Bertambahnya kebaikan atau karunia dari Allah.",
    alphabet_index: "B",
  },
  {
    id: "5",
    term: "Bid'ah",
    definition:
      "Perbuatan baru dalam agama yang tidak ada contohnya dari Nabi.",
    alphabet_index: "B",
  },
  {
    id: "6",
    term: "Fardhu",
    definition:
      "Status hukum wajib dalam Islam (misal: Fardhu Ain, Fardhu Kifayah).",
    alphabet_index: "F",
  },
  {
    id: "7",
    term: "Fiqih",
    definition: "Pemahaman mendalam tentang hukum-hukum syariat Islam.",
    alphabet_index: "F",
  },
  {
    id: "8",
    term: "Gharar",
    definition: "Ketidakpastian dalam transaksi yang dilarang dalam muamalah.",
    alphabet_index: "G",
  },
  {
    id: "9",
    term: "Hijrah",
    definition:
      "Perpindahan dari satu tempat ke tempat lain, atau meninggalkan keburukan menuju kebaikan.",
    alphabet_index: "H",
  },
  {
    id: "10",
    term: "Ihsan",
    definition: "Beribadah kepada Allah seakan-akan melihat-Nya.",
    alphabet_index: "I",
  },
  {
    id: "11",
    term: "Istiqomah",
    definition: "Konsisten atau teguh pendirian dalam ketaatan.",
    alphabet_index: "I",
  },
  {
    id: "12",
    term: "Jihad",
    definition: "Bersungguh-sungguh mencurahkan tenaga/harta di jalan Allah.",
    alphabet_index: "J",
  },
  {
    id: "13",
    term: "Khusyu",
    definition:
      "Ketenangan hati dan anggota badan serta ketundukan saat beribadah.",
    alphabet_index: "K",
  },
  {
    id: "14",
    term: "Muamalah",
    definition: "Hubungan antar manusia dalam interaksi sosial dan ekonomi.",
    alphabet_index: "M",
  },
  {
    id: "15",
    term: "Qada",
    definition: "Ketetapan Allah sejak zaman azali.",
    alphabet_index: "Q",
  },
  {
    id: "16",
    term: "Riba",
    definition:
      "Tambahan nilai dalam transaksi pinjam-meminjam yang diharamkan.",
    alphabet_index: "R",
  },
  {
    id: "17",
    term: "Sunnah",
    definition:
      "Segala sesuatu yang bersumber dari Nabi SAW (ucapan, perbuatan, persetujuan).",
    alphabet_index: "S",
  },
  {
    id: "18",
    term: "Syariah",
    definition: "Hukum atau aturan yang ditetapkan Allah bagi hamba-Nya.",
    alphabet_index: "S",
  },
  {
    id: "19",
    term: "Tauhid",
    definition:
      "Mengesakan Allah SWT dalam rububiyah, uluhiyah, dan asma wa sifat.",
    alphabet_index: "T",
  },
  {
    id: "20",
    term: "Taqwa",
    definition: "Menjalankan perintah Allah dan menjauhi larangan-Nya.",
    alphabet_index: "T",
  },
  {
    id: "21",
    term: "Ukhuwah",
    definition: "Persaudaraan (biasanya Ukhuwah Islamiyah).",
    alphabet_index: "U",
  },
  {
    id: "22",
    term: "Wara'",
    definition:
      "Sikap hati-hati meninggalkan hal syubhat (meragukan) karena takut haram.",
    alphabet_index: "W",
  },
  {
    id: "23",
    term: "Zakat",
    definition:
      "Harta tertentu yang wajib dikeluarkan oleh umat Islam untuk diberikan kepada golongan yang berhak.",
    alphabet_index: "Z",
  },
];

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function KamusPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string>("ALL");

  // 1. Filter Logic
  const filteredTerms = TERMS.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLetter =
      selectedLetter === "ALL" || item.alphabet_index === selectedLetter;

    return matchesSearch && matchesLetter;
  });

  // 2. Grouping Logic (Group by Alphabet)
  const groupedTerms = filteredTerms.reduce((acc, item) => {
    const letter = item.alphabet_index;
    if (!acc[letter]) {
      acc[letter] = [];
    }
    acc[letter].push(item);
    return acc;
  }, {} as Record<string, IslamicTerm[]>);

  // Sort keys alphabetically
  const sortedKeys = Object.keys(groupedTerms).sort();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 -ml-2 rounded-full h-8 w-8 p-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <BookA className="w-6 h-6" />
              <h1 className="text-xl font-bold font-comfortaa">Kamus Islam</h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari istilah (cth: Taqwa)..."
              className="pl-9 h-10 bg-white text-gray-800 border-none rounded-full font-comfortaa focus-visible:ring-2 focus-visible:ring-teal-300 placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Alphabet Navigation */}
        <div className="bg-white p-2 rounded-xl border border-awqaf-border-light shadow-sm sticky top-[100px] z-20">
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide items-center">
            <Button
              size="sm"
              variant={selectedLetter === "ALL" ? "default" : "ghost"}
              className={`h-8 px-3 rounded-lg text-xs font-bold font-mono transition-colors ${
                selectedLetter === "ALL"
                  ? "bg-teal-600 hover:bg-teal-700 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setSelectedLetter("ALL")}
            >
              ALL
            </Button>
            <div className="w-px h-4 bg-gray-200 mx-1 flex-shrink-0"></div>
            {ALPHABETS.map((char) => (
              <Button
                key={char}
                size="sm"
                variant={selectedLetter === char ? "default" : "ghost"}
                className={`h-8 w-8 p-0 rounded-lg text-xs font-bold font-mono flex-shrink-0 transition-colors ${
                  selectedLetter === char
                    ? "bg-teal-600 hover:bg-teal-700 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedLetter(char)}
              >
                {char}
              </Button>
            ))}
          </div>
        </div>

        {/* Terms List */}
        <div className="space-y-6">
          {sortedKeys.length > 0 ? (
            sortedKeys.map((letter) => (
              <div
                key={letter}
                className="scroll-mt-24"
                id={`section-${letter}`}
              >
                {/* Letter Header */}
                <div className="flex items-center gap-2 mb-3 px-2">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold font-mono text-sm border border-teal-200">
                    {letter}
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-teal-200 to-transparent"></div>
                </div>

                {/* Terms Cards */}
                <div className="space-y-3">
                  {groupedTerms[letter].map((item) => (
                    <Card
                      key={item.id}
                      className="border-awqaf-border-light hover:border-teal-200 transition-colors group"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-800 text-lg font-comfortaa mb-1 group-hover:text-teal-600 transition-colors">
                            {item.term}
                          </h3>
                          <Badge
                            variant="outline"
                            className="text-[10px] font-mono text-gray-400"
                          >
                            {item.alphabet_index}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 font-comfortaa leading-relaxed">
                          {item.definition}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-gray-900 font-bold font-comfortaa">
                Istilah tidak ditemukan
              </h3>
              <p className="text-sm text-gray-500 font-comfortaa">
                Coba cari dengan kata kunci lain.
              </p>
            </div>
          )}
        </div>

        <div className="text-center py-6">
          <p className="text-xs text-gray-400 font-comfortaa">
            Menampilkan {filteredTerms.length} istilah
          </p>
        </div>
      </main>
    </div>
  );
}