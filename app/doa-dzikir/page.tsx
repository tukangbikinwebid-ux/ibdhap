"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Search,
  Sun,
  Moon,
  Heart,
  Share2,
  Copy,
  CheckCircle,
  Navigation,
  RefreshCw,
  Clock,
  BookMarked,
  Home,
  Utensils,
  Car,
  Bed,
} from "lucide-react";
import Link from "next/link";

interface DoaDzikir {
  id: string;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  category: string;
  time?: "morning" | "evening" | "anytime";
  isFavorite?: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
}

const categories: Category[] = [
  {
    id: "morning",
    name: "Dzikir Pagi",
    description: "Dzikir dan doa di waktu pagi",
    icon: Sun,
    count: 15,
  },
  {
    id: "evening",
    name: "Dzikir Petang",
    description: "Dzikir dan doa di waktu petang",
    icon: Moon,
    count: 15,
  },
  {
    id: "daily",
    name: "Doa Sehari-hari",
    description: "Doa untuk aktivitas sehari-hari",
    icon: Clock,
    count: 25,
  },
  {
    id: "home",
    name: "Doa Rumah",
    description: "Doa untuk rumah dan keluarga",
    icon: Home,
    count: 12,
  },
  {
    id: "food",
    name: "Doa Makan",
    description: "Doa sebelum dan sesudah makan",
    icon: Utensils,
    count: 8,
  },
  {
    id: "travel",
    name: "Doa Perjalanan",
    description: "Doa untuk bepergian",
    icon: Car,
    count: 10,
  },
  {
    id: "sleep",
    name: "Doa Tidur",
    description: "Doa sebelum dan bangun tidur",
    icon: Bed,
    count: 6,
  },
  {
    id: "worship",
    name: "Doa Ibadah",
    description: "Doa dalam ibadah",
    icon: BookMarked,
    count: 18,
  },
];

const doaDzikirData: DoaDzikir[] = [
  // Dzikir Pagi
  {
    id: "1",
    title: "Dzikir Pagi - Istighfar",
    arabic:
      "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
    latin:
      "Astaghfirullahal 'adzim alladzi la ilaha illa huwal hayyul qayyum wa atubu ilaih",
    translation:
      "Aku memohon ampun kepada Allah Yang Maha Agung, yang tiada Tuhan selain Dia, Yang Maha Hidup dan Maha Berdiri Sendiri, dan aku bertaubat kepada-Nya.",
    category: "morning",
    time: "morning",
  },
  {
    id: "2",
    title: "Dzikir Pagi - Tasbih",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ",
    latin: "Subhanallahi wa bihamdihi subhanallahil 'adzim",
    translation:
      "Maha Suci Allah dan dengan memuji-Nya, Maha Suci Allah Yang Maha Agung.",
    category: "morning",
    time: "morning",
  },
  {
    id: "3",
    title: "Dzikir Pagi - Tahlil",
    arabic:
      "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    latin:
      "La ilaha illallah wahdahu la syarika lah, lahul mulku wa lahul hamdu wa huwa 'ala kulli syai'in qadir",
    translation:
      "Tiada Tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya, bagi-Nya kerajaan dan bagi-Nya segala puji, dan Dia Maha Kuasa atas segala sesuatu.",
    category: "morning",
    time: "morning",
  },
  // Dzikir Petang
  {
    id: "4",
    title: "Dzikir Petang - Istighfar",
    arabic:
      "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
    latin:
      "Astaghfirullahal 'adzim alladzi la ilaha illa huwal hayyul qayyum wa atubu ilaih",
    translation:
      "Aku memohon ampun kepada Allah Yang Maha Agung, yang tiada Tuhan selain Dia, Yang Maha Hidup dan Maha Berdiri Sendiri, dan aku bertaubat kepada-Nya.",
    category: "evening",
    time: "evening",
  },
  {
    id: "5",
    title: "Dzikir Petang - Ayat Kursi",
    arabic:
      "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ",
    latin:
      "Allahu la ilaha illa huwal hayyul qayyum, la ta'khudzuhu sinatun wa la naum, lahu ma fis samawati wa ma fil ard",
    translation:
      "Allah, tiada Tuhan selain Dia, Yang Maha Hidup dan Maha Berdiri Sendiri, tidak mengantuk dan tidak tidur, milik-Nya apa yang di langit dan di bumi.",
    category: "evening",
    time: "evening",
  },
  // Doa Sehari-hari
  {
    id: "6",
    title: "Doa Keluar Rumah",
    arabic:
      "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    latin: "Bismillahi tawakkaltu 'alallah, la haula wa la quwwata illa billah",
    translation:
      "Dengan nama Allah, aku bertawakal kepada Allah, tiada daya dan upaya kecuali dengan pertolongan Allah.",
    category: "daily",
    time: "anytime",
  },
  {
    id: "7",
    title: "Doa Masuk Rumah",
    arabic:
      "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا",
    latin:
      "Allahumma inni as'aluka khairal mauliji wa khairal makhraji, bismillahi walajna wa bismillahi kharajna",
    translation:
      "Ya Allah, aku memohon kepada-Mu kebaikan tempat masuk dan kebaikan tempat keluar, dengan nama Allah kami masuk dan dengan nama Allah kami keluar.",
    category: "daily",
    time: "anytime",
  },
  {
    id: "8",
    title: "Doa Naik Kendaraan",
    arabic:
      "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    latin:
      "Subhanalladzi sakhkhara lana hadza wa ma kunna lahu muqrinin, wa inna ila rabbina lamunqalibun",
    translation:
      "Maha Suci Allah yang telah menundukkan kendaraan ini untuk kami, padahal kami sebelumnya tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Tuhan kami.",
    category: "travel",
    time: "anytime",
  },
  // Doa Makan
  {
    id: "9",
    title: "Doa Sebelum Makan",
    arabic:
      "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
    latin: "Allahumma barik lana fima razaqtana wa qina 'adzaban nar",
    translation:
      "Ya Allah, berikanlah berkah kepada kami pada apa yang telah Engkau rezekikan kepada kami dan lindungilah kami dari azab neraka.",
    category: "food",
    time: "anytime",
  },
  {
    id: "10",
    title: "Doa Sesudah Makan",
    arabic:
      "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    latin: "Alhamdulillahil ladzi ath'amana wa saqana wa ja'alana muslimin",
    translation:
      "Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami muslim.",
    category: "food",
    time: "anytime",
  },
  // Doa Tidur
  {
    id: "11",
    title: "Doa Sebelum Tidur",
    arabic:
      "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ إِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ",
    latin:
      "Bismika rabbi wada'tu janbi wa bika arfa'uh, in amsakta nafsi farhamha, wa in arsaltaha fahfazha bima tahfazu bihi 'ibadakas shalihin",
    translation:
      "Dengan nama-Mu, ya Rabbku, aku meletakkan lambungku, dan dengan-Mu aku mengangkatnya. Jika Engkau menahan jiwaku, maka rahmatilah ia, dan jika Engkau melepaskannya, maka peliharalah ia sebagaimana Engkau memelihara hamba-hamba-Mu yang shalih.",
    category: "sleep",
    time: "anytime",
  },
  {
    id: "12",
    title: "Doa Bangun Tidur",
    arabic:
      "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    latin: "Alhamdulillahil ladzi ahyana ba'da ma amatana wa ilaihin nushur",
    translation:
      "Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan kepada-Nya kami dibangkitkan.",
    category: "sleep",
    time: "anytime",
  },
  // Doa Rumah
  {
    id: "13",
    title: "Doa Masuk Kamar Mandi",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
    latin: "Allahumma inni a'udzu bika minal khubutsi wal khaba'its",
    translation:
      "Ya Allah, aku berlindung kepada-Mu dari setan laki-laki dan setan perempuan.",
    category: "home",
    time: "anytime",
  },
  {
    id: "14",
    title: "Doa Keluar Kamar Mandi",
    arabic:
      "غُفْرَانَكَ الْحَمْدُ لِلَّهِ الَّذِي أَذْهَبَ عَنِّي الْأَذَى وَعَافَانِي",
    latin: "Ghufranaka, alhamdulillahil ladzi adzhaba 'anni al-adza wa 'afani",
    translation:
      "Ampunan-Mu, segala puji bagi Allah yang telah menghilangkan kotoran dariku dan telah menyembuhkanku.",
    category: "home",
    time: "anytime",
  },
  // Doa Ibadah
  {
    id: "15",
    title: "Doa Setelah Wudhu",
    arabic:
      "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    latin:
      "Asyhadu an la ilaha illallah wahdahu la syarika lah, wa asyhadu anna muhammadan 'abduhu wa rasuluh",
    translation:
      "Aku bersaksi bahwa tiada Tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya.",
    category: "worship",
    time: "anytime",
  },
  {
    id: "16",
    title: "Doa Masuk Masjid",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    latin: "Allahummaftah li abwaba rahmatik",
    translation: "Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.",
    category: "worship",
    time: "anytime",
  },
];

export default function DoaDzikirPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("doa-dzikir-favorites");
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem(
      "doa-dzikir-favorites",
      JSON.stringify([...favorites])
    );
  }, [favorites]);

  // Filter doa and dzikir based on search and category
  const filteredDoaDzikir = useMemo(() => {
    let filtered = doaDzikirData;

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.arabic.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.translation.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const handleToggleFavorite = (itemId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      return newFavorites;
    });
  };

  const handleCopyDoa = async (item: DoaDzikir) => {
    const text = `${item.title}\n\n${item.arabic}\n\n${item.latin}\n\n${item.translation}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShareDoa = async (item: DoaDzikir) => {
    const text = `${item.title}\n\n${item.arabic}\n\n${item.latin}\n\n${item.translation}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Doa & Dzikir",
          text: text,
        });
      } catch (err) {
        console.error("Failed to share:", err);
      }
    } else {
      // Fallback to copy
      handleCopyDoa(item);
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId);
  };

  const getTimeIcon = (time?: string) => {
    switch (time) {
      case "morning":
        return <Sun className="w-4 h-4 text-yellow-500" />;
      case "evening":
        return <Moon className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTimeText = (time?: string) => {
    switch (time) {
      case "morning":
        return "Pagi";
      case "evening":
        return "Petang";
      default:
        return "Kapan saja";
    }
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
                Doa & Dzikir
              </h1>
              <div className="w-10 h-10"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Search */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-awqaf-foreground-secondary" />
              <Input
                placeholder="Cari doa atau dzikir..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 font-comfortaa"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
            Kategori
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card
                  key={category.id}
                  className={`border-awqaf-border-light hover:shadow-md transition-all duration-200 cursor-pointer ${
                    selectedCategory === category.id
                      ? "ring-2 ring-awqaf-primary"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category.id ? null : category.id
                    )
                  }
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <IconComponent className="w-6 h-6 text-awqaf-primary" />
                    </div>
                    <h3 className="font-semibold text-card-foreground font-comfortaa text-sm">
                      {category.name}
                    </h3>
                    <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mt-1">
                      {category.description}
                    </p>
                    <Badge variant="secondary" className="text-xs mt-2">
                      {category.count} doa
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Doa & Dzikir List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
              {selectedCategory
                ? getCategoryInfo(selectedCategory)?.name
                : "Semua Doa & Dzikir"}
            </h2>
            {selectedCategory && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="text-awqaf-foreground-secondary hover:text-awqaf-primary"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {filteredDoaDzikir.map((item) => (
              <Card key={item.id} className="border-awqaf-border-light">
                <CardContent className="p-4 space-y-4">
                  {/* Title and Time */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-card-foreground font-comfortaa">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      {getTimeIcon(item.time)}
                      <span className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                        {getTimeText(item.time)}
                      </span>
                    </div>
                  </div>

                  {/* Arabic Text */}
                  <div className="bg-accent-50 p-4 rounded-lg">
                    <p className="text-lg font-tajawal text-awqaf-primary text-center leading-relaxed">
                      {item.arabic}
                    </p>
                  </div>

                  {/* Latin Text */}
                  <div className="bg-accent-100/50 p-3 rounded-lg">
                    <p className="text-sm text-awqaf-foreground-secondary font-comfortaa text-center leading-relaxed italic">
                      {item.latin}
                    </p>
                  </div>

                  {/* Translation */}
                  <div>
                    <p className="text-sm text-awqaf-foreground-secondary font-comfortaa leading-relaxed">
                      {item.translation}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleFavorite(item.id)}
                      className="flex-1"
                    >
                      <Heart
                        className={`w-4 h-4 mr-2 ${
                          favorites.has(item.id)
                            ? "fill-red-500 text-red-500"
                            : ""
                        }`}
                      />
                      {favorites.has(item.id) ? "Favorit" : "Favorit"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyDoa(item)}
                    >
                      {copiedId === item.id ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShareDoa(item)}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDoaDzikir.length === 0 && (
            <Card className="border-awqaf-border-light">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-awqaf-foreground-secondary mx-auto mb-4" />
                <h3 className="font-semibold text-card-foreground font-comfortaa mb-2">
                  Tidak ada doa atau dzikir ditemukan
                </h3>
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  Coba ubah kata kunci pencarian atau pilih kategori lain
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
