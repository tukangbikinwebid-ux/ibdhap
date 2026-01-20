"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Share2,
  Gift,
  X,
  QrCode,
  CreditCard,
  Copy,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import DonationCarousel from "./components/DonationCarousel";
import DonationNavigation from "./components/DonationNavigation";
import {
  popularDonations,
  donationCategories,
  formatCurrency,
  formatNumber,
  getDaysRemaining,
} from "./data/donations";
import { useGetCampaignsQuery, useCreateDonationMutation } from "@/services/public/campaign.service";
import { Campaign } from "@/types/public/campaign";
import Image from "next/image";
import ImageWithFallback from "./components/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, MapPin } from "lucide-react";
import ShareModal from "./components/ShareModal";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

// Loading Skeleton Component
const DonationSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="border-awqaf-border-light overflow-hidden">
          <div className="h-48 bg-gray-200 animate-pulse" />
          <CardContent className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="h-2 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Helper: Convert Campaign to Donation format
const campaignToDonation = (campaign: Campaign): any => {
  const progress =
    campaign.target_amount > 0
      ? Math.round((campaign.raised_amount / campaign.target_amount) * 100)
      : 0;

  return {
    id: campaign.id.toString(),
    title: campaign.title,
    description: campaign.description.replace(/<[^>]*>/g, ""), // Remove HTML tags
    image: campaign.image,
    category: campaign.category.toLowerCase() as any,
    targetAmount: campaign.target_amount,
    currentAmount: campaign.raised_amount,
    donorCount: 0, // API doesn't provide this
    startDate: campaign.start_date,
    endDate: campaign.end_date,
    progress,
    status: "active" as const,
    organization: "Yayasan Awqaf Indonesia",
    location: "Indonesia",
  };
};

export default function DonasiPage() {
  const router = useRouter();
  
  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // State untuk Modal Donasi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "bank_transfer" | "card">("qris");
  const [paymentChannel, setPaymentChannel] = useState<"qris" | "bca" | "bni" | "bri" | "cimb" | "card">("qris");
  const [donationAmount, setDonationAmount] = useState<string>("");
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [donorPhone, setDonorPhone] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mutation untuk create donation
  const [createDonation, { isLoading: isCreatingDonation }] = useCreateDonationMutation();

  // Fetch Campaigns from API
  const {
    data: campaignsData,
    isLoading: isLoadingCampaigns,
    isFetching: isFetchingCampaigns,
  } = useGetCampaignsQuery({
    page: currentPage,
    paginate: itemsPerPage,
  });

  // Convert campaigns to donations format
  const donations = useMemo(() => {
    if (!campaignsData?.data) return [];
    return campaignsData.data.map(campaignToDonation);
  }, [campaignsData]);

  // Pagination info
  const paginationInfo = useMemo(() => {
    if (!campaignsData) return null;
    return {
      currentPage: campaignsData.current_page,
      lastPage: campaignsData.last_page,
      total: campaignsData.total,
      from: campaignsData.from,
      to: campaignsData.to,
    };
  }, [campaignsData]);

  // Handler saat tombol donasi diklik
  const handleDonateClick = (donation: any) => {
    setSelectedDonation(donation);
    setIsModalOpen(true);
    setPaymentMethod("qris");
    setPaymentChannel("qris");
    setDonationAmount("");
    setDonorName("");
    setDonorEmail("");
    setDonorPhone("");
    setDescription("");
  };

  // Handler untuk share
  const handleShare = (donation: any) => {
    setSelectedDonation(donation);
    setIsShareModalOpen(true);
  };

  // Handler untuk riwayat donasi
  const handleRiwayatDonasi = () => {
    if (selectedDonation) {
      router.push(`/donasi/riwayat?campaign=${selectedDonation.id}`);
    } else {
      router.push("/donasi/riwayat");
    }
  };

  // Handler submit donasi
  const handleSubmitDonation = async () => {
    if (!selectedDonation) return;

    const amount = Number(donationAmount.replace(/\D/g, ""));
    if (amount < 10000) {
      alert("Minimum donasi adalah Rp 10.000");
      return;
    }

    if (!donorName.trim()) {
      alert("Nama donor wajib diisi");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createDonation({
        campaign: Number(selectedDonation.id),
        body: {
          donor_name: donorName,
          donor_email: donorEmail || null,
          donor_phone: donorPhone || null,
          description: description || null,
          payment_method: paymentMethod,
          payment_channel: paymentChannel,
          amount: amount,
        },
      }).unwrap();

      // Redirect ke payment atau tampilkan success
      if (result?.data?.payment?.account_number) {
        // Jika QRIS, bisa redirect ke QR code
        alert("Donasi berhasil dibuat! Silakan lakukan pembayaran.");
        setIsModalOpen(false);
        // Reset form
        setDonationAmount("");
        setDonorName("");
        setDonorEmail("");
        setDonorPhone("");
        setDescription("");
      }
    } catch (error: any) {
      alert(error?.data?.message || "Gagal membuat donasi. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler Copy Rekening
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Helper format rupiah
  const formatRupiah = (value: string) => {
    const number = value.replace(/\D/g, "");
    return new Intl.NumberFormat("id-ID").format(Number(number));
  };

  return (
    <div className="min-h-screen bg-background pb-20 relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-awqaf-primary to-awqaf-primary/80 text-white">
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Gift className="w-8 h-8" />
              <h1 className="text-2xl font-bold font-comfortaa">
                Donasi & Sedekah
              </h1>
            </div>
            <p className="text-white/90 font-comfortaa max-w-2xl mx-auto">
              Berikan donasi terbaik Anda untuk kemaslahatan umat. Setiap rupiah
              yang Anda berikan akan membantu sesama yang membutuhkan.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-8">
        {/* Popular Donations Carousel */}
        <section>
          <DonationCarousel
            donations={popularDonations}
            onDonateClick={handleDonateClick}
          />
        </section>

        {/* Donation Categories Navigation */}
        <section>
          <DonationNavigation categories={donationCategories} />
        </section>

        {/* Campaigns List from API */}
        <section>
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-card-foreground font-comfortaa">
                  Daftar Donasi
                </h3>
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  Pilih donasi yang ingin Anda dukung
                </p>
              </div>
              {paginationInfo && (
                <Badge
                  variant="secondary"
                  className="bg-awqaf-primary text-white text-xs px-2 py-1"
                >
                  {paginationInfo.total} Donasi
                </Badge>
              )}
            </div>

            {/* Loading State */}
            {(isLoadingCampaigns || isFetchingCampaigns) && <DonationSkeleton />}

            {/* Campaigns Grid */}
            {!isLoadingCampaigns &&
              !isFetchingCampaigns &&
              donations.length > 0 && (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    {donations.map((donation) => {
                      const daysRemaining = getDaysRemaining(donation.endDate);

                      return (
                        <Card
                          key={donation.id}
                          className="border-awqaf-border-light hover:shadow-lg transition-all duration-300 overflow-hidden group"
                        >
                          {/* Image */}
                          <div className="relative h-48 overflow-hidden">
                            <ImageWithFallback
                              src={donation.image}
                              alt={donation.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />

                            {/* Overlay Badges */}
                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                              <Badge className="bg-awqaf-primary text-white text-xs px-2 py-1">
                                {donation.category.toUpperCase()}
                              </Badge>
                            </div>

                            {/* Favorite Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-3 right-3 w-8 h-8 p-0 rounded-full bg-black/20 hover:bg-black/40 text-white"
                            >
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>

                          <CardContent className="p-4">
                            {/* Title and Organization */}
                            <div className="mb-3">
                              <h4 className="font-semibold text-card-foreground text-sm font-comfortaa mb-1 line-clamp-2">
                                {donation.title}
                              </h4>
                              <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                                {donation.organization}
                              </p>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mb-3 line-clamp-2">
                              {donation.description}
                            </p>

                            {/* Progress */}
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                                  Progress
                                </span>
                                <span className="text-xs font-medium text-awqaf-primary font-comfortaa">
                                  {donation.progress}%
                                </span>
                              </div>
                              <Progress
                                value={donation.progress}
                                className="h-1.5 bg-accent-100"
                              />
                              <div className="flex justify-between text-xs text-awqaf-foreground-secondary font-comfortaa mt-1">
                                <span>{formatCurrency(donation.currentAmount)}</span>
                                <span>{formatCurrency(donation.targetAmount)}</span>
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between mb-3 text-xs text-awqaf-foreground-secondary">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span className="font-comfortaa">
                                  {daysRemaining} hari
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span className="font-comfortaa truncate max-w-20">
                                  {donation.location}
                                </span>
                              </div>
                            </div>

                            {/* Action Button */}
                            <Button
                              onClick={() => handleDonateClick(donation)}
                              className="w-full bg-awqaf-primary hover:bg-awqaf-primary/90 text-white text-xs font-comfortaa"
                              size="sm"
                            >
                              Donasi Sekarang
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {paginationInfo && paginationInfo.lastPage > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1 || isFetchingCampaigns}
                        className="border-awqaf-border-light font-comfortaa"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Sebelumnya
                      </Button>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                          Halaman {paginationInfo.currentPage} dari{" "}
                          {paginationInfo.lastPage}
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(paginationInfo.lastPage, prev + 1)
                          )
                        }
                        disabled={
                          currentPage === paginationInfo.lastPage ||
                          isFetchingCampaigns
                        }
                        className="border-awqaf-border-light font-comfortaa"
                      >
                        Selanjutnya
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </>
              )}

            {/* Empty State */}
            {!isLoadingCampaigns &&
              !isFetchingCampaigns &&
              donations.length === 0 && (
                <Card className="border-awqaf-border-light">
                  <CardContent className="p-6 text-center">
                    <p className="text-awqaf-foreground-secondary font-comfortaa">
                      Belum ada donasi tersedia saat ini
                    </p>
                  </CardContent>
                </Card>
              )}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <Card className="border-awqaf-border-light">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-card-foreground font-comfortaa mb-2">
                  Butuh Bantuan?
                </h3>
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  Tim kami siap membantu Anda dalam proses donasi
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Button
                  variant="outline"
                  className="border-awqaf-border-light text-awqaf-foreground-secondary hover:border-awqaf-primary hover:text-awqaf-primary font-comfortaa"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Donasi Favorit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleShare(selectedDonation || donations[0])}
                  className="border-awqaf-border-light text-awqaf-foreground-secondary hover:border-awqaf-primary hover:text-awqaf-primary font-comfortaa"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Bagikan
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRiwayatDonasi}
                  className="border-awqaf-border-light text-awqaf-foreground-secondary hover:border-awqaf-primary hover:text-awqaf-primary font-comfortaa"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Riwayat Donasi
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Motivational Quote */}
        <section>
          <Card className="border-awqaf-border-light bg-gradient-to-r from-accent-100 to-accent-200">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-awqaf-primary font-comfortaa mb-2">
                &quot;Sesungguhnya sedekah itu akan memadamkan panas kubur bagi
                pelakunya, dan sesungguhnya di hari kiamat seorang mukmin akan
                berlindung di bawah naungan sedekahnya&quot;
              </p>
              <p className="text-xs text-awqaf-foreground-secondary font-tajawal">
                - HR. Thabrani
              </p>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* --- DONATION MODAL --- */}
      {isModalOpen && selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-awqaf-primary text-white p-4 flex items-center justify-between sticky top-0 z-10">
              <h3 className="font-bold font-comfortaa text-lg truncate pr-4">
                Donasi: {selectedDonation.title}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Form Donasi */}
              <div className="space-y-4">
                {/* Nama Donor */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 font-comfortaa">
                    Nama Donor <span className="text-error">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Masukkan nama Anda"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="border-awqaf-border-light focus-visible:ring-awqaf-primary font-comfortaa"
                    required
                  />
                </div>

                {/* Email Donor */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 font-comfortaa">
                    Email (Opsional)
                  </Label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="border-awqaf-border-light focus-visible:ring-awqaf-primary font-comfortaa"
                  />
                </div>

                {/* Phone Donor */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 font-comfortaa">
                    No. Telepon (Opsional)
                  </Label>
                  <Input
                    type="tel"
                    placeholder="081234567890"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="border-awqaf-border-light focus-visible:ring-awqaf-primary font-comfortaa"
                  />
                </div>

              {/* Input Nominal */}
              <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 font-comfortaa">
                    Nominal Donasi (Rp) <span className="text-error">*</span>
                  </Label>
                <Input
                  type="text"
                  placeholder="0"
                  value={donationAmount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setDonationAmount(formatRupiah(val));
                  }}
                    className="text-lg font-bold text-awqaf-primary border-awqaf-border-light focus-visible:ring-awqaf-primary font-comfortaa"
                    required
                />
                  <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                    Minimum donasi: Rp 10.000
                  </p>
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
                    {["10.000", "50.000", "100.000", "500.000", "1.000.000"].map((amt) => (
                    <button
                      key={amt}
                        type="button"
                      onClick={() => setDonationAmount(amt)}
                        className="px-3 py-1 text-xs bg-accent-50 text-awqaf-primary rounded-full border border-accent-100 hover:bg-accent-100 transition-colors whitespace-nowrap font-comfortaa"
                    >
                      Rp {amt}
                    </button>
                  ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 font-comfortaa">
                    Pesan/Doa (Opsional)
                  </Label>
                  <textarea
                    placeholder="Tuliskan pesan atau doa Anda..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[80px] px-3 py-2 rounded-md border border-awqaf-border-light bg-background text-sm font-comfortaa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-awqaf-primary resize-none"
                  />
                </div>
              </div>

              {/* Payment Method Tabs */}
              <div className="space-y-3">
                <Label className="text-sm font-bold text-gray-700 font-comfortaa">
                  Metode Pembayaran
                </Label>
                <div className="grid grid-cols-3 gap-2 bg-gray-100 p-1 rounded-xl">
                <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("qris");
                      setPaymentChannel("qris");
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all font-comfortaa ${
                    paymentMethod === "qris"
                      ? "bg-white text-awqaf-primary shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <QrCode className="w-4 h-4" /> QRIS
                </button>
                <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("bank_transfer");
                      setPaymentChannel("bca");
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all font-comfortaa ${
                      paymentMethod === "bank_transfer"
                      ? "bg-white text-awqaf-primary shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <CreditCard className="w-4 h-4" /> Transfer
                </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("card");
                      setPaymentChannel("card");
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all font-comfortaa ${
                      paymentMethod === "card"
                        ? "bg-white text-awqaf-primary shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" /> Card
                  </button>
                </div>

                {/* Payment Channel Selection for Bank Transfer */}
                {paymentMethod === "bank_transfer" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-700 font-comfortaa">
                      Pilih Bank
                    </Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { value: "bca", label: "BCA" },
                        { value: "bni", label: "BNI" },
                        { value: "bri", label: "BRI" },
                        { value: "cimb", label: "CIMB" },
                      ].map((bank) => (
                        <button
                          key={bank.value}
                          type="button"
                          onClick={() => setPaymentChannel(bank.value as any)}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all font-comfortaa ${
                            paymentChannel === bank.value
                              ? "bg-awqaf-primary text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {bank.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Content */}
              <div className="min-h-[200px] flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50">
                {paymentMethod === "qris" ? (
                  <div className="space-y-3">
                    {/* VISUAL QRIS YANG MUNCUL */}
                    <div className="w-48 h-48 bg-white mx-auto p-2 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center relative">
                      {/* Menggunakan API QR Server untuk generate QR Code secara dinamis agar terlihat nyata */}
                      <Image
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Donasi%20Awqaf%20${encodeURIComponent(
                          selectedDonation.title
                        )}%20Rp${donationAmount || "0"}`}
                        alt="QRIS Code"
                        width={160}
                        height={160}
                        className="w-full h-full object-contain"
                        unoptimized
                      />
                      {/* Logo Overlay Simulasi QRIS */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded">
                        <span className="text-[10px] font-bold text-awqaf-primary">
                          QRIS
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 font-comfortaa">
                      Scan QRIS di atas menggunakan e-wallet (Gopay, OVO, Dana)
                      atau Mobile Banking.
                    </p>
                  </div>
                ) : (
                  <div className="w-full space-y-4">
                    <div className="flex items-center gap-3 justify-start bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xs">
                        BSI
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-xs text-gray-500">
                          Bank Syariah Indonesia
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          Yayasan Awqaf Indonesia
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm relative">
                      <p className="text-xs text-gray-500 text-left mb-1">
                        Nomor Rekening
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-mono font-bold text-awqaf-primary tracking-wider">
                          7123456789
                        </p>
                        <button
                          onClick={() => handleCopy("7123456789")}
                          className="text-gray-400 hover:text-awqaf-primary transition-colors"
                        >
                          {isCopied ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 font-comfortaa">
                      Mohon transfer sesuai nominal hingga 3 digit terakhir
                      untuk verifikasi otomatis.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 sticky bottom-0 z-10">
              <Button
                onClick={handleSubmitDonation}
                disabled={isSubmitting || isCreatingDonation || !donorName.trim() || !donationAmount}
                className="w-full bg-awqaf-primary font-bold font-comfortaa hover:bg-awqaf-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || isCreatingDonation ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Konfirmasi Pembayaran"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {selectedDonation && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          donation={{
            title: selectedDonation.title,
            image: selectedDonation.image,
            description: selectedDonation.description,
            id: selectedDonation.id,
          }}
        />
      )}
    </div>
  );
}