export interface HariBesar {
  id: string;
  name: string;
  description: string;
  date: {
    month: number; // 1-12 (Muharram - Dzulhijjah)
    day: number; // 1-30
  };
  type: "wajib" | "sunnah" | "sejarah" | "peringatan";
  color: string;
  icon: string;
}

export const hariBesarData: HariBesar[] = [
  // Muharram (Bulan 1)
  {
    id: "1",
    name: "Tahun Baru Hijriyah",
    description:
      "Hari pertama tahun baru dalam kalender Hijriyah, menandai hijrahnya Nabi Muhammad SAW dari Mekkah ke Madinah pada tahun 622 M.",
    date: { month: 1, day: 1 },
    type: "sejarah",
    color: "bg-blue-500",
    icon: "📅",
  },
  {
    id: "2",
    name: "Hari Asyura",
    description:
      "Hari ke-10 Muharram, hari bersejarah dimana Nabi Musa AS diselamatkan dari Firaun. Dianjurkan berpuasa sunnah.",
    date: { month: 1, day: 10 },
    type: "sunnah",
    color: "bg-green-500",
    icon: "🌊",
  },

  // Rabiul Awal (Bulan 3)
  {
    id: "3",
    name: "Maulid Nabi Muhammad SAW",
    description:
      "Hari kelahiran Nabi Muhammad SAW pada 12 Rabiul Awal. Hari yang penuh berkah untuk memperbanyak sholawat dan amal shalih.",
    date: { month: 3, day: 12 },
    type: "sunnah",
    color: "bg-purple-500",
    icon: "🕌",
  },

  // Rajab (Bulan 7)
  {
    id: "4",
    name: "Isra' Mi'raj",
    description:
      "Peristiwa agung dimana Nabi Muhammad SAW melakukan perjalanan dari Masjidil Haram ke Masjidil Aqsa, kemudian naik ke langit ke-7.",
    date: { month: 7, day: 27 },
    type: "sejarah",
    color: "bg-indigo-500",
    icon: "🌙",
  },

  // Sya'ban (Bulan 8)
  {
    id: "5",
    name: "Nisfu Sya'ban",
    description:
      "Pertengahan bulan Sya'ban, malam yang penuh berkah dimana Allah mengampuni dosa-dosa hamba-Nya yang bertaubat.",
    date: { month: 8, day: 15 },
    type: "sunnah",
    color: "bg-pink-500",
    icon: "✨",
  },

  // Ramadhan (Bulan 9)
  {
    id: "6",
    name: "Awal Ramadhan",
    description:
      "Bulan suci Ramadhan dimulai. Bulan penuh berkah dimana umat Islam diwajibkan berpuasa dan memperbanyak ibadah.",
    date: { month: 9, day: 1 },
    type: "wajib",
    color: "bg-emerald-500",
    icon: "🌙",
  },
  {
    id: "7",
    name: "Lailatul Qadar",
    description:
      "Malam yang lebih baik dari seribu bulan, biasanya terjadi pada 10 malam terakhir Ramadhan. Malam turunnya Al-Quran.",
    date: { month: 9, day: 27 },
    type: "sunnah",
    color: "bg-yellow-500",
    icon: "⭐",
  },

  // Syawal (Bulan 10)
  {
    id: "8",
    name: "Hari Raya Idul Fitri",
    description:
      "Hari raya umat Islam setelah menunaikan ibadah puasa Ramadhan. Hari kemenangan dan kegembiraan.",
    date: { month: 10, day: 1 },
    type: "wajib",
    color: "bg-green-600",
    icon: "🎉",
  },
  {
    id: "9",
    name: "Puasa Syawal",
    description:
      "Puasa sunnah 6 hari di bulan Syawal setelah Idul Fitri. Pahalanya setara dengan puasa setahun penuh.",
    date: { month: 10, day: 2 },
    type: "sunnah",
    color: "bg-green-400",
    icon: "🌱",
  },

  // Dzulhijjah (Bulan 12)
  {
    id: "10",
    name: "Hari Arafah",
    description:
      "Hari ke-9 Dzulhijjah, hari wukuf di Arafah bagi jamaah haji. Dianjurkan berpuasa sunnah bagi yang tidak berhaji.",
    date: { month: 12, day: 9 },
    type: "sunnah",
    color: "bg-orange-500",
    icon: "🏔️",
  },
  {
    id: "11",
    name: "Hari Raya Idul Adha",
    description:
      "Hari raya kurban, memperingati kesabaran Nabi Ibrahim AS dan Nabi Ismail AS. Hari berkurban dan berbagi.",
    date: { month: 12, day: 10 },
    type: "wajib",
    color: "bg-red-500",
    icon: "🐑",
  },
  {
    id: "12",
    name: "Hari Tasyrik",
    description:
      "Hari-hari Tasyrik (11, 12, 13 Dzulhijjah) adalah hari-hari yang dilarang berpuasa. Waktu untuk menyantap daging kurban.",
    date: { month: 12, day: 11 },
    type: "sunnah",
    color: "bg-red-400",
    icon: "🍖",
  },
];

// Nama-nama bulan Hijriyah
export const namaBulanHijriyah = [
  "Muharram",
  "Safar",
  "Rabiul Awal",
  "Rabiul Akhir",
  "Jumadil Awal",
  "Jumadil Akhir",
  "Rajab",
  "Sya'ban",
  "Ramadhan",
  "Syawal",
  "Dzulqa'dah",
  "Dzulhijjah",
];

// Nama-nama hari dalam bahasa Indonesia
export const namaHari = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

// Fungsi untuk mengkonversi tanggal Masehi ke Hijriyah (approximate)
export function toHijriyah(date: Date): {
  year: number;
  month: number;
  day: number;
} {
  // Ini adalah konversi approximate, untuk akurasi yang lebih tinggi perlu library khusus
  const hijriEpoch = new Date(622, 6, 16); // 16 Juli 622 M
  const diffTime = date.getTime() - hijriEpoch.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // 1 tahun Hijriyah = 354.37 hari (rata-rata)
  const hijriYear = Math.floor(diffDays / 354.37) + 1;
  const remainingDays = diffDays % 354.37;

  // Approximate bulan (29.5 hari per bulan)
  const hijriMonth = Math.floor(remainingDays / 29.5) + 1;
  const hijriDay = Math.floor(remainingDays % 29.5) + 1;

  return {
    year: hijriYear,
    month: Math.min(12, Math.max(1, hijriMonth)),
    day: Math.min(30, Math.max(1, hijriDay)),
  };
}

// Fungsi untuk mendapatkan hari besar berdasarkan tanggal Hijriyah
export function getHariBesar(month: number, day: number): HariBesar | null {
  return (
    hariBesarData.find(
      (hari) => hari.date.month === month && hari.date.day === day
    ) || null
  );
}
