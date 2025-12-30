"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Clock,
  Users,
  MapPin,
  Heart,
  Share2,
  X,
  QrCode,
  CreditCard,
  Copy,
  CheckCircle2,
} from "lucide-react";
import {
  getDonationsByCategory,
  formatCurrency,
  formatNumber,
  getDaysRemaining,
  Donation,
} from "../data/donations";
import ImageWithFallback from "../components/ImageWithFallback";
import Link from "next/link";
import Image from "next/image";

export default function KurbanPage() {
  const [favoriteDonations, setFavoriteDonations] = useState<Set<string>>(
    new Set()
  );

  // State untuk Modal Donasi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "bank">("qris");
  const [donationAmount, setDonationAmount] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);

  const kurbanDonations = getDonationsByCategory("kurban");

  // Handler saat tombol Kurban diklik
  const handleDonateClick = (donation: Donation) => {
    setSelectedDonation(donation);
    setIsModalOpen(true);
    setPaymentMethod("qris");
    setDonationAmount("");
  };

  // Handler Copy Rekening
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Helper format input rupiah
  const formatInputRupiah = (value: string) => {
    const number = value.replace(/\D/g, "");
    return new Intl.NumberFormat("id-ID").format(Number(number));
  };

  const handleFavoriteToggle = (donationId: string) => {
    setFavoriteDonations((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(donationId)) {
        newFavorites.delete(donationId);
      } else {
        newFavorites.add(donationId);
      }
      return newFavorites;
    });
  };

  const handleShare = (donation: Donation) => {
    if (navigator.share) {
      navigator.share({
        title: donation.title,
        text: donation.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(
        `${donation.title} - ${donation.description}`
      );
      alert("Link donasi telah disalin ke clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-error to-error/80 text-white">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/donasi">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl">🐄</span>
              <h1 className="text-2xl font-bold font-comfortaa">Kurban</h1>
            </div>
            <p className="text-white/90 font-comfortaa max-w-2xl mx-auto">
              Tunaikan ibadah kurban untuk berbagi kebahagiaan dengan sesama.
              Hewan kurban akan didistribusikan kepada yang membutuhkan
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Info Section */}
        <Card className="border-awqaf-border-light mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-error font-comfortaa mb-1">
                  {kurbanDonations.length}
                </div>
                <div className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  Program Kurban Aktif
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-error font-comfortaa mb-1">
                  {formatCurrency(
                    kurbanDonations.reduce((sum, d) => sum + d.currentAmount, 0)
                  )}
                </div>
                <div className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  Total Terkumpul
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-error font-comfortaa mb-1">
                  {formatNumber(
                    kurbanDonations.reduce((sum, d) => sum + d.donorCount, 0)
                  )}
                </div>
                <div className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  Total Donatur
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donations Grid */}
        <div className="grid grid-cols-1 gap-6">
          {kurbanDonations.map((donation) => {
            const daysRemaining = getDaysRemaining(donation.endDate);
            const isFavorite = favoriteDonations.has(donation.id);

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
                    {donation.isUrgent && (
                      <Badge className="bg-error text-white text-xs px-2 py-1">
                        Urgent
                      </Badge>
                    )}
                    <Badge className="bg-error text-white text-xs px-2 py-1">
                      KURBAN
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFavoriteToggle(donation.id)}
                      className={`w-8 h-8 p-0 rounded-full ${
                        isFavorite
                          ? "bg-error text-white"
                          : "bg-black/20 hover:bg-black/40 text-white"
                      }`}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(donation)}
                      className="w-8 h-8 p-0 rounded-full bg-black/20 hover:bg-black/40 text-white"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
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
                      <span className="text-xs font-medium text-error font-comfortaa">
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
                      <Users className="w-3 h-3" />
                      <span className="font-comfortaa">
                        {formatNumber(donation.donorCount)}
                      </span>
                    </div>
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
                    className="w-full bg-error hover:bg-error/90 text-white text-xs font-comfortaa"
                    size="sm"
                  >
                    Kurban Sekarang
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Motivational Quote */}
        <Card className="border-awqaf-border-light bg-gradient-to-r from-accent-100 to-accent-200 mt-8">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-error font-comfortaa mb-2">
              &quot;Maka dirikanlah shalat karena Tuhanmu dan berkurbanlah&quot;
            </p>
            <p className="text-xs text-awqaf-foreground-secondary font-tajawal">
              - QS. Al-Kautsar: 2
            </p>
          </CardContent>
        </Card>
      </div>

      {/* --- KURBAN PAYMENT MODAL --- */}
      {isModalOpen && selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-error text-white p-4 flex items-center justify-between sticky top-0 z-10">
              <h3 className="font-bold font-comfortaa text-lg truncate pr-4">
                Kurban: {selectedDonation.title}
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
              {/* Input Nominal */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 font-comfortaa">
                  Nominal Kurban (Rp)
                </label>
                <Input
                  type="text"
                  placeholder="0"
                  value={donationAmount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setDonationAmount(formatInputRupiah(val));
                  }}
                  className="text-lg font-bold text-error border-awqaf-border-light focus-visible:ring-error"
                />
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
                  {/* Harga Kurban biasanya lebih besar */}
                  {["2.500.000", "3.500.000", "5.000.000"].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setDonationAmount(amt)}
                      className="px-3 py-1 text-xs bg-red-50 text-error rounded-full border border-red-100 hover:bg-red-100 transition-colors whitespace-nowrap"
                    >
                      Rp {amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setPaymentMethod("qris")}
                  className={`py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === "qris"
                      ? "bg-white text-error shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <QrCode className="w-4 h-4" /> QRIS
                </button>
                <button
                  onClick={() => setPaymentMethod("bank")}
                  className={`py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === "bank"
                      ? "bg-white text-error shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <CreditCard className="w-4 h-4" /> Transfer
                </button>
              </div>

              {/* Payment Content */}
              <div className="min-h-[200px] flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50">
                {paymentMethod === "qris" ? (
                  <div className="space-y-3">
                    <div className="w-48 h-48 bg-white mx-auto p-2 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center relative">
                      {/* QR Code */}
                      <Image
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Kurban%20${encodeURIComponent(
                          selectedDonation.title
                        )}%20Rp${donationAmount || "0"}`}
                        alt="QRIS Code"
                        width={160}
                        height={160}
                        className="w-full h-full object-contain"
                        unoptimized
                      />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded">
                        <span className="text-[10px] font-bold text-error">
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
                          Yayasan Kurban Indonesia
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm relative">
                      <p className="text-xs text-gray-500 text-left mb-1">
                        Nomor Rekening
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-mono font-bold text-error tracking-wider">
                          9990001112
                        </p>
                        <button
                          onClick={() => handleCopy("9990001112")}
                          className="text-gray-400 hover:text-error transition-colors"
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
              <Button className="w-full bg-error hover:bg-error/90 text-white font-bold font-comfortaa">
                Konfirmasi Pembayaran Kurban
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}