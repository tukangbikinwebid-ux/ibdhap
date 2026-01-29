export interface Donation {
  id: string;
  title: string;
  description: string;
  image: string;
  category: "wakaf" | "zakat" | "kurban" | "infaq";
  targetAmount: number;
  currentAmount: number;
  donorCount: number;
  startDate: string;
  endDate: string;
  isUrgent?: boolean;
  isPopular?: boolean;
  organization: string;
  location: string;
  progress: number;
  status: "active" | "completed" | "paused";
}

export interface DonationCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  totalDonations: number;
  activeCampaigns: number;
}

// Data donasi populer untuk carousel
export const popularDonations: Donation[] = [
  {
    id: "1",
    title: "Pembangunan Masjid Al-Ikhlas",
    description:
      "Membangun masjid di daerah terpencil untuk memfasilitasi ibadah masyarakat",
    image:
      "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&h=400&fit=crop",
    category: "wakaf",
    targetAmount: 500000000,
    currentAmount: 350000000,
    donorCount: 1247,
    startDate: "2024-01-15",
    endDate: "2024-12-31",
    isUrgent: true,
    isPopular: true,
    organization: "Yayasan Wakaf Indonesia",
    location: "Nusa Tenggara Timur",
    progress: 70,
    status: "active",
  },
  {
    id: "2",
    title: "Bantuan Pendidikan Anak Yatim",
    description:
      "Menyediakan beasiswa dan kebutuhan sekolah untuk anak yatim piatu",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
    category: "infaq",
    targetAmount: 200000000,
    currentAmount: 120000000,
    donorCount: 892,
    startDate: "2024-02-01",
    endDate: "2024-08-31",
    isPopular: true,
    organization: "Panti Asuhan Al-Falah",
    location: "Jakarta Selatan",
    progress: 60,
    status: "active",
  },
  {
    id: "3",
    title: "Kurban untuk Keluarga Miskin",
    description: "Menyediakan hewan kurban untuk keluarga yang tidak mampu",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
    category: "kurban",
    targetAmount: 150000000,
    currentAmount: 95000000,
    donorCount: 567,
    startDate: "2024-06-01",
    endDate: "2024-06-15",
    isUrgent: true,
    isPopular: true,
    organization: "Dompet Dhuafa",
    location: "Seluruh Indonesia",
    progress: 63,
    status: "active",
  },
];

// Data kategori donasi
export const donationCategories: DonationCategory[] = [
  {
    id: "wakaf",
    name: "Wakaf",
    description: "Wakaf untuk kemaslahatan umat",
    icon: "🏛️",
    href: "/donasi/wakaf",
    color: "bg-success",
    totalDonations: 2500000000,
    activeCampaigns: 15,
  },
  {
    id: "zakat",
    name: "Zakat",
    description: "Zakat fitrah dan mal",
    icon: "💰",
    href: "/donasi/zakat",
    color: "bg-warning",
    totalDonations: 1800000000,
    activeCampaigns: 8,
  },
  {
    id: "kurban",
    name: "Kurban",
    description: "Hewan kurban untuk Idul Adha",
    icon: "🐄",
    href: "/donasi/kurban",
    color: "bg-error",
    totalDonations: 1200000000,
    activeCampaigns: 12,
  },
  {
    id: "infaq",
    name: "Infaq",
    description: "Infaq untuk kebaikan",
    icon: "🤲",
    href: "/donasi/infaq",
    color: "bg-info",
    totalDonations: 900000000,
    activeCampaigns: 20,
  },
];

// Data rekomendasi donasi
export const recommendedDonations: Donation[] = [
  {
    id: "4",
    title: "Bantuan Korban Bencana Alam",
    description: "Membantu korban banjir dan tanah longsor di Jawa Barat",
    image:
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=250&fit=crop",
    category: "infaq",
    targetAmount: 300000000,
    currentAmount: 180000000,
    donorCount: 445,
    startDate: "2024-03-01",
    endDate: "2024-05-31",
    isUrgent: true,
    organization: "Baznas",
    location: "Jawa Barat",
    progress: 60,
    status: "active",
  },
  {
    id: "5",
    title: "Wakaf Tanah untuk Sekolah",
    description: "Wakaf tanah untuk pembangunan sekolah Islam terpadu",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=250&fit=crop",
    category: "wakaf",
    targetAmount: 800000000,
    currentAmount: 200000000,
    donorCount: 234,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    organization: "Yayasan Pendidikan Islam",
    location: "Sulawesi Selatan",
    progress: 25,
    status: "active",
  },
  {
    id: "6",
    title: "Zakat Fitrah 2024",
    description: "Kumpulan zakat fitrah untuk dibagikan kepada mustahik",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
    category: "zakat",
    targetAmount: 100000000,
    currentAmount: 75000000,
    donorCount: 1234,
    startDate: "2024-03-01",
    endDate: "2024-04-10",
    isUrgent: true,
    organization: "Baznas",
    location: "Seluruh Indonesia",
    progress: 75,
    status: "active",
  },
  {
    id: "7",
    title: "Bantuan Medis untuk Lansia",
    description: "Menyediakan layanan kesehatan gratis untuk lansia dhuafa",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop",
    category: "infaq",
    targetAmount: 150000000,
    currentAmount: 90000000,
    donorCount: 678,
    startDate: "2024-02-15",
    endDate: "2024-08-15",
    organization: "Rumah Sakit Islam",
    location: "Yogyakarta",
    progress: 60,
    status: "active",
  },
  {
    id: "8",
    title: "Kurban untuk Daerah Terpencil",
    description:
      "Menyediakan hewan kurban untuk masyarakat di daerah terpencil",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
    category: "kurban",
    targetAmount: 200000000,
    currentAmount: 120000000,
    donorCount: 345,
    startDate: "2024-05-01",
    endDate: "2024-06-20",
    organization: "Dompet Dhuafa",
    location: "Papua",
    progress: 60,
    status: "active",
  },
  {
    id: "9",
    title: "Wakaf Al-Quran dan Buku Islam",
    description:
      "Menyediakan Al-Quran dan buku-buku Islam untuk masjid dan pesantren",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
    category: "wakaf",
    targetAmount: 50000000,
    currentAmount: 35000000,
    donorCount: 456,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    organization: "Yayasan Wakaf Al-Quran",
    location: "Seluruh Indonesia",
    progress: 70,
    status: "active",
  },
];

// Helper functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

export const getDaysRemaining = (endDate: string): number => {
  const today = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export const getDonationsByCategory = (category: string): Donation[] => {
  return [...popularDonations, ...recommendedDonations].filter(
    (donation) => donation.category === category,
  );
};