"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
  Copy,
  QrCode,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useGetCampaignDonationsQuery } from "@/services/public/campaign.service";
import { formatCurrency } from "../data/donations";
import { useI18n } from "@/app/hooks/useI18n";
import { Payment } from "@/types/public/donation"; // Pastikan import Payment type ada

// --- TYPES ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface HistoryTranslations {
  title: string;
  subtitle: string;
  totalDonation: string;
  page: string;
  of: string;
  donation: string;
  method: string;
  channel: string;
  paidAt: string;
  statusPaid: string;
  statusWaiting: string;
  statusFailed: string;
  noHistory: string;
  back: string;
  notFound: string;
  prev: string;
  next: string;
  payNow: string;
  paymentDetail: string;
  accountNumber: string;
  copy: string;
  copied: string;
  scanQRIS: string;
  transferInstruction: string;
  close: string;
}

// --- DATA TRANSLATIONS ---
const translations: Record<LocaleCode, HistoryTranslations> = {
  id: {
    title: "Riwayat Donasi",
    subtitle: "Daftar donasi campaign ini",
    totalDonation: "Total Donasi",
    page: "Halaman",
    of: "dari",
    donation: "donasi",
    method: "Metode",
    channel: "Channel",
    paidAt: "Terbayar pada",
    statusPaid: "Terbayar",
    statusWaiting: "Menunggu",
    statusFailed: "Gagal",
    noHistory: "Belum ada riwayat donasi",
    back: "Kembali ke Donasi",
    notFound: "Campaign ID tidak ditemukan",
    prev: "Sebelumnya",
    next: "Selanjutnya",
    payNow: "Bayar Sekarang",
    paymentDetail: "Detail Pembayaran",
    accountNumber: "Nomor Rekening",
    copy: "Salin",
    copied: "Disalin",
    scanQRIS: "Scan QRIS ini menggunakan e-wallet atau m-banking.",
    transferInstruction:
      "Transfer sesuai nominal tepat hingga 3 digit terakhir.",
    close: "Tutup",
  },
  en: {
    title: "Donation History",
    subtitle: "List of donations for this campaign",
    totalDonation: "Total Donation",
    page: "Page",
    of: "of",
    donation: "donations",
    method: "Method",
    channel: "Channel",
    paidAt: "Paid at",
    statusPaid: "Paid",
    statusWaiting: "Waiting",
    statusFailed: "Failed",
    noHistory: "No donation history yet",
    back: "Back to Donation",
    notFound: "Campaign ID not found",
    prev: "Previous",
    next: "Next",
    payNow: "Pay Now",
    paymentDetail: "Payment Detail",
    accountNumber: "Account Number",
    copy: "Copy",
    copied: "Copied",
    scanQRIS: "Scan this QRIS using e-wallet or m-banking.",
    transferInstruction:
      "Transfer the exact amount including the last 3 digits.",
    close: "Close",
  },
  ar: {
    title: "سجل التبرعات",
    subtitle: "قائمة التبرعات لهذه الحملة",
    totalDonation: "إجمالي التبرعات",
    page: "صفحة",
    of: "من",
    donation: "تبرع",
    method: "طريقة",
    channel: "قناة",
    paidAt: "تم الدفع في",
    statusPaid: "مدفوع",
    statusWaiting: "قيد الانتظار",
    statusFailed: "فاشل",
    noHistory: "لا يوجد سجل تبرعات بعد",
    back: "العودة إلى التبرع",
    notFound: "معرف الحملة غير موجود",
    prev: "السابق",
    next: "التالي",
    payNow: "ادفع الآن",
    paymentDetail: "تفاصيل الدفع",
    accountNumber: "رقم الحساب",
    copy: "نسخ",
    copied: "تم النسخ",
    scanQRIS: "امسح رمز QRIS هذا.",
    transferInstruction: "يرجى تحويل المبلغ المحدد بدقة.",
    close: "إغلاق",
  },
  fr: {
    title: "Historique des dons",
    subtitle: "Liste des dons pour cette campagne",
    totalDonation: "Total des dons",
    page: "Page",
    of: "sur",
    donation: "dons",
    method: "Méthode",
    channel: "Canal",
    paidAt: "Payé le",
    statusPaid: "Payé",
    statusWaiting: "En attente",
    statusFailed: "Échec",
    noHistory: "Pas encore d'historique de dons",
    back: "Retour au don",
    notFound: "ID de campagne introuvable",
    prev: "Précédent",
    next: "Suivant",
    payNow: "Payer Maintenant",
    paymentDetail: "Détails du Paiement",
    accountNumber: "Numéro de Compte",
    copy: "Copier",
    copied: "Copié",
    scanQRIS: "Scannez ce QRIS.",
    transferInstruction: "Veuillez transférer le montant exact.",
    close: "Fermer",
  },
  jp: {
    title: "寄付履歴",
    subtitle: "このキャンペーンの寄付一覧",
    totalDonation: "寄付総額",
    page: "ページ",
    of: "/",
    donation: "件の寄付",
    method: "支払い方法",
    channel: "チャネル",
    paidAt: "支払い日時",
    statusPaid: "支払い済み",
    statusWaiting: "待機中",
    statusFailed: "失敗",
    noHistory: "寄付履歴はまだありません",
    back: "寄付に戻る",
    notFound: "キャンペーンIDが見つかりません",
    prev: "前へ",
    next: "次へ",
    payNow: "今すぐ支払う",
    paymentDetail: "支払い詳細",
    accountNumber: "口座番号",
    copy: "コピー",
    copied: "コピー完了",
    scanQRIS: "このQRISをスキャンしてください。",
    transferInstruction: "正確な金額を振り込んでください。",
    close: "閉じる",
  },
  kr: {
    title: "기부 내역",
    subtitle: "이 캠페인의 기부 목록",
    totalDonation: "총 기부액",
    page: "페이지",
    of: "/",
    donation: "기부",
    method: "결제 방법",
    channel: "채널",
    paidAt: "결제 일시",
    statusPaid: "결제 완료",
    statusWaiting: "대기 중",
    statusFailed: "실패",
    noHistory: "아직 기부 내역이 없습니다",
    back: "기부로 돌아가기",
    notFound: "캠페인 ID를 찾을 수 없습니다",
    prev: "이전",
    next: "다음",
    payNow: "지금 결제",
    paymentDetail: "결제 상세",
    accountNumber: "계좌 번호",
    copy: "복사",
    copied: "복사됨",
    scanQRIS: "이 QRIS를 스캔하세요.",
    transferInstruction: "정확한 금액을 이체해 주세요.",
    close: "닫기",
  },
};

// Loading Skeleton
const DonationHistorySkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="border-awqaf-border-light">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

function RiwayatDonasiContent() {
  const { locale } = useI18n();
  const safeLocale = (
    translations[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const dict = translations[safeLocale];
  const isRtl = safeLocale === "ar";

  const searchParams = useSearchParams();
  const campaignId = searchParams.get("campaign");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State untuk modal pembayaran
  const [viewingPayment, setViewingPayment] = useState<Payment | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const {
    data: donationsData,
    isLoading,
    isFetching,
  } = useGetCampaignDonationsQuery(
    {
      campaign: campaignId ? Number(campaignId) : 0,
      page: currentPage,
      paginate: itemsPerPage,
    },
    { skip: !campaignId },
  );

  const paginationInfo = useMemo(() => {
    if (!donationsData) return null;
    return {
      currentPage: donationsData.current_page,
      lastPage: donationsData.last_page,
      total: donationsData.total,
      from: donationsData.from,
      to: donationsData.to,
    };
  }, [donationsData]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const localeMap: Record<string, string> = {
      id: "id-ID",
      en: "en-US",
      ar: "ar-SA",
      fr: "fr-FR",
      jp: "ja-JP",
      kr: "ko-KR",
    };
    return date.toLocaleDateString(localeMap[locale] || "id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getStatusBadge = (status: number, paidAt: string | null) => {
    if (paidAt) {
      return (
        <Badge className="bg-success text-white text-xs">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          {dict.statusPaid}
        </Badge>
      );
    }
    if (status === 0) {
      return (
        <Badge variant="secondary" className="bg-warning text-white text-xs">
          <Clock className="w-3 h-3 mr-1" />
          {dict.statusWaiting}
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" className="text-xs">
        <XCircle className="w-3 h-3 mr-1" />
        {dict.statusFailed}
      </Badge>
    );
  };

  if (!campaignId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
        <div className="max-w-md mx-auto px-4 py-6">
          <Card className="border-awqaf-border-light">
            <CardContent className="p-6 text-center">
              <p className="text-awqaf-foreground-secondary font-comfortaa">
                {dict.notFound}
              </p>
              <Link href="/donasi">
                <Button className="mt-4 font-comfortaa bg-awqaf-primary hover:bg-awqaf-primary/90 text-white">
                  {dict.back}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center gap-3">
              <Link href="/donasi">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200 ${isRtl ? "rotate-180" : ""}`}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                  {dict.title}
                </h1>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                  {dict.subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {paginationInfo && (
          <Card className="border-awqaf-border-light mb-6 bg-gradient-to-r from-accent-100 to-accent-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                    {dict.totalDonation}
                  </p>
                  <p className="text-lg font-bold text-awqaf-primary font-comfortaa">
                    {paginationInfo.total} {dict.donation}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                    {dict.page} {paginationInfo.currentPage} {dict.of}{" "}
                    {paginationInfo.lastPage}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {(isLoading || isFetching) && <DonationHistorySkeleton />}

        {!isLoading &&
          !isFetching &&
          donationsData?.data &&
          donationsData.data.length > 0 && (
            <>
              <div className="space-y-4">
                {donationsData.data.map((donation) => (
                  <Card
                    key={donation.id}
                    className="border-awqaf-border-light hover:shadow-md transition-all duration-200"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-card-foreground font-comfortaa mb-1">
                            {donation.donor_name}
                          </h4>
                          <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                            {formatDate(donation.created_at)}
                          </p>
                        </div>
                        {getStatusBadge(
                          donation.status,
                          donation.payment.paid_at,
                        )}
                      </div>

                      <div className="mb-3">
                        <p className="text-lg font-bold text-awqaf-primary font-comfortaa">
                          {formatCurrency(donation.amount)}
                        </p>
                      </div>

                      {donation.description && (
                        <p className="text-sm text-awqaf-foreground-secondary font-comfortaa mb-3 line-clamp-2">
                          {donation.description}
                        </p>
                      )}

                      <div className="flex flex-col gap-2 pt-3 border-t border-awqaf-border-light">
                        <div className="flex items-center gap-4 text-xs text-awqaf-foreground-secondary font-comfortaa">
                          <div>
                            <span className="font-medium">{dict.method}:</span>{" "}
                            {donation.payment.payment_type
                              .replace("_", " ")
                              .toUpperCase()}
                          </div>
                          {donation.payment.channel && (
                            <div>
                              <span className="font-medium">
                                {dict.channel}:
                              </span>{" "}
                              {donation.payment.channel.toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* TOMBOL BAYAR (MODAL) */}
                        {donation.status === 0 && !donation.payment.paid_at && (
                          <Button
                            size="sm"
                            className="w-full mt-2 bg-info hover:bg-info/90 text-white font-comfortaa text-xs flex items-center justify-center gap-2"
                            onClick={() => setViewingPayment(donation.payment)}
                          >
                            <CreditCard className="w-3 h-3" />
                            {dict.payNow}
                          </Button>
                        )}

                        {donation.payment.paid_at && (
                          <div className="mt-2 text-xs text-success font-comfortaa">
                            {dict.paidAt}:{" "}
                            {formatDate(donation.payment.paid_at)}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {paginationInfo && paginationInfo.lastPage > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1 || isFetching}
                    className="border-awqaf-border-light font-comfortaa"
                  >
                    <ChevronLeft
                      className={`w-4 h-4 ${isRtl ? "ml-1 rotate-180" : "mr-1"}`}
                    />
                    {dict.prev}
                  </Button>
                  <span className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                    {dict.page} {paginationInfo.currentPage} {dict.of}{" "}
                    {paginationInfo.lastPage}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(paginationInfo.lastPage, prev + 1),
                      )
                    }
                    disabled={
                      currentPage === paginationInfo.lastPage || isFetching
                    }
                    className="border-awqaf-border-light font-comfortaa"
                  >
                    {dict.next}
                    <ChevronRight
                      className={`w-4 h-4 ${isRtl ? "mr-1 rotate-180" : "ml-1"}`}
                    />
                  </Button>
                </div>
              )}
            </>
          )}

        {!isLoading &&
          !isFetching &&
          (!donationsData?.data || donationsData.data.length === 0) && (
            <Card className="border-awqaf-border-light">
              <CardContent className="p-6 text-center">
                <p className="text-awqaf-foreground-secondary font-comfortaa">
                  {dict.noHistory}
                </p>
              </CardContent>
            </Card>
          )}
      </main>

      {/* --- PAYMENT MODAL --- */}
      {viewingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-info text-white p-4 flex items-center justify-between">
              <h3 className="font-bold font-comfortaa text-lg">
                {dict.paymentDetail}
              </h3>
              <button
                onClick={() => setViewingPayment(null)}
                className="hover:bg-white/20 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
              {/* JIKA QRIS */}
              {viewingPayment.payment_type === "qris" &&
                viewingPayment.account_number && (
                  <div className="space-y-4 w-full">
                    <div className="relative w-48 h-48 mx-auto border rounded-lg p-2 bg-white shadow-sm">
                      <Image
                        src={viewingPayment.account_number}
                        alt="QRIS"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <p className="text-xs text-gray-500 font-comfortaa">
                      {dict.scanQRIS}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        window.open(
                          viewingPayment.account_number || "",
                          "_blank",
                        )
                      }
                    >
                      <ExternalLink className="w-3 h-3 mr-2" /> Buka Gambar
                    </Button>
                  </div>
                )}

              {/* JIKA BANK TRANSFER */}
              {viewingPayment.payment_type !== "qris" &&
                viewingPayment.account_number && (
                  <div className="w-full space-y-4">
                    <div className="flex items-center gap-3 justify-start bg-gray-50 p-3 rounded-lg border">
                      <CreditCard className="w-8 h-8 text-info" />
                      <div className="text-left">
                        <p className="text-xs text-gray-500 uppercase">
                          {viewingPayment.channel}
                        </p>
                        <p className="text-sm font-bold">
                          Yayasan Awqaf Indonesia
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                      <p className="text-xs text-gray-400 text-left mb-1">
                        {dict.accountNumber}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xl text-info tracking-wide">
                          {viewingPayment.account_number}
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(viewingPayment.account_number || "")
                          }
                          className="text-gray-400 hover:text-info"
                        >
                          {isCopied ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <p className="text-[10px] text-right mt-1 text-gray-400">
                        {isCopied ? dict.copied : dict.copy}
                      </p>
                    </div>

                    <div className="bg-blue-50 p-3 rounded text-left">
                      <p className="text-xs text-blue-700 font-comfortaa">
                        <span className="font-bold">
                          Total: {formatCurrency(viewingPayment.amount)}
                        </span>
                        <br />
                        {dict.transferInstruction}
                      </p>
                    </div>
                  </div>
                )}

              <Button
                className="w-full bg-info hover:bg-info/90 text-white font-comfortaa"
                onClick={() => setViewingPayment(null)}
              >
                {dict.close}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RiwayatDonasiPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
          <div className="max-w-md mx-auto px-4 py-6">
            <Card className="border-awqaf-border-light">
              <CardContent className="p-6 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-awqaf-primary mx-auto" />
              </CardContent>
            </Card>
          </div>
        </div>
      }
    >
      <RiwayatDonasiContent />
    </Suspense>
  );
}