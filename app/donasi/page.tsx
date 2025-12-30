"use client";

import { useState } from "react";
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
} from "lucide-react";
import DonationCarousel from "./components/DonationCarousel";
import DonationNavigation from "./components/DonationNavigation";
import DonationRecommendations from "./components/DonationRecommendations";
import {
  popularDonations,
  donationCategories,
  recommendedDonations,
  Donation,
} from "./data/donations";
import Image from "next/image";

export default function DonasiPage() {
  // State untuk Modal Donasi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "bank">("qris");
  const [donationAmount, setDonationAmount] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);

  // Handler saat tombol donasi diklik
  const handleDonateClick = (donation: Donation) => {
    setSelectedDonation(donation);
    setIsModalOpen(true);
    setPaymentMethod("qris"); // Default ke QRIS
    setDonationAmount("");
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

        {/* Donation Recommendations */}
        <section>
          <DonationRecommendations
            donations={recommendedDonations}
            onDonateClick={handleDonateClick}
          />
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
                  className="border-awqaf-border-light text-awqaf-foreground-secondary hover:border-awqaf-primary hover:text-awqaf-primary font-comfortaa"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Bagikan
                </Button>
                <Button
                  variant="outline"
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
              {/* Input Nominal */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 font-comfortaa">
                  Nominal Donasi (Rp)
                </label>
                <Input
                  type="text"
                  placeholder="0"
                  value={donationAmount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setDonationAmount(formatRupiah(val));
                  }}
                  className="text-lg font-bold text-awqaf-primary border-awqaf-border-light focus-visible:ring-awqaf-primary"
                />
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
                  {["10.000", "50.000", "100.000"].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setDonationAmount(amt)}
                      className="px-3 py-1 text-xs bg-accent-50 text-awqaf-primary rounded-full border border-accent-100 hover:bg-accent-100 transition-colors whitespace-nowrap"
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
                      ? "bg-white text-awqaf-primary shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <QrCode className="w-4 h-4" /> QRIS
                </button>
                <button
                  onClick={() => setPaymentMethod("bank")}
                  className={`py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === "bank"
                      ? "bg-white text-awqaf-primary shadow-sm"
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
              <Button className="w-full bg-awqaf-primary font-bold font-comfortaa hover:bg-awqaf-primary/90">
                Konfirmasi Pembayaran
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}