"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  X,
  QrCode,
  CreditCard,
  Loader2,
  Share2,
  Heart,
  Clock,
  MapPin,
} from "lucide-react";
import {
  useGetCampaignsQuery,
  useCreateDonationMutation,
  useToggleFavoriteCampaignMutation,
} from "@/services/public/campaign.service";
import { useGetCurrentUserQuery } from "@/services/auth.service";
import { Campaign } from "@/types/public/campaign";
import { CampaignDonation, CreateDonationBody } from "@/types/public/donation";
import { useI18n } from "@/app/hooks/useI18n";
import ImageWithFallback from "../components/ImageWithFallback";
import ShareModal from "../components/ShareModal";
import PaymentStatusModal from "../components/PaymentModal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// --- Interface Response API (Sesuai Struktur JSON Anda) ---
interface ApiResponseWrapper {
  code: number;
  message: string;
  data: CampaignDonation;
}

// --- TYPES ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";
type PaymentMethod = "qris" | "bank_transfer" | "card";
type PaymentChannel = "qris" | "bca" | "bni" | "bri" | "cimb" | "card";

interface ApiError {
  data?: {
    message?: string;
    errors?: Record<string, string[]>;
  };
  status?: number;
  message?: string;
}

interface PageTranslations {
  title: string;
  subtitle: string;
  activePrograms: string;
  totalCollected: string;
  donateNow: string;
  days: string;
  donationModalTitle: string;
  donorName: string;
  emailOptional: string;
  phoneOptional: string;
  amountRequired: string;
  minAmount: string;
  messageOptional: string;
  paymentMethod: string;
  processing: string;
  confirmPayment: string;
  loginRequired: string;
  progress: string;
  of: string;
}

const PAGE_TEXT: Record<LocaleCode, PageTranslations> = {
  id: {
    title: "Donasi",
    subtitle: "Mari berbagi kebaikan untuk sesama yang membutuhkan.",
    activePrograms: "Program Aktif",
    totalCollected: "Total Terkumpul",
    donateNow: "Donasi Sekarang",
    days: "Hari",
    donationModalTitle: "Donasi:",
    donorName: "Nama Donatur",
    emailOptional: "Email (Opsional)",
    phoneOptional: "No. HP (Opsional)",
    amountRequired: "Nominal Donasi",
    minAmount: "Minimal Rp 10.000",
    messageOptional: "Pesan / Doa (Opsional)",
    paymentMethod: "Metode Pembayaran",
    processing: "Memproses...",
    confirmPayment: "Konfirmasi Pembayaran",
    loginRequired: "Silakan login terlebih dahulu.",
    progress: "Tercapai",
    of: "dari",
  },
  en: {
    title: "Donation",
    subtitle: "Let's share kindness for those in need.",
    activePrograms: "Active Programs",
    totalCollected: "Total Collected",
    donateNow: "Donate Now",
    days: "Days",
    donationModalTitle: "Donate:",
    donorName: "Donor Name",
    emailOptional: "Email (Optional)",
    phoneOptional: "Phone (Optional)",
    amountRequired: "Donation Amount",
    minAmount: "Minimum Rp 10,000",
    messageOptional: "Message (Optional)",
    paymentMethod: "Payment Method",
    processing: "Processing...",
    confirmPayment: "Confirm Payment",
    loginRequired: "Please login first.",
    progress: "Reached",
    of: "of",
  },
  ar: {
    title: "تبرع",
    subtitle: "لنشارك الخير للمحتاجين.",
    activePrograms: "برامج نشطة",
    totalCollected: "المجموع الكلي",
    donateNow: "تبرع الآن",
    days: "أيام",
    donationModalTitle: "تبرع:",
    donorName: "اسم المتبرع",
    emailOptional: "البريد الإلكتروني",
    phoneOptional: "رقم الهاتف",
    amountRequired: "مبلغ التبرع",
    minAmount: "الحد الأدنى ١٠,٠٠٠",
    messageOptional: "رسالة (اختياري)",
    paymentMethod: "طريقة الدفع",
    processing: "جاري المعالجة...",
    confirmPayment: "تأكيد الدفع",
    loginRequired: "يرجى تسجيل الدخول.",
    progress: "تم الوصول",
    of: "من",
  },
  fr: {
    title: "Donation",
    subtitle: "Partageons la bonté.",
    activePrograms: "Programmes Actifs",
    totalCollected: "Total Collecté",
    donateNow: "Faire un don",
    days: "Jours",
    donationModalTitle: "Faire un don:",
    donorName: "Nom du Donateur",
    emailOptional: "Email (Optionnel)",
    phoneOptional: "Téléphone (Optionnel)",
    amountRequired: "Montant du Don",
    minAmount: "Minimum 10 000 Rp",
    messageOptional: "Message (Optionnel)",
    paymentMethod: "Méthode de Paiement",
    processing: "Traitement...",
    confirmPayment: "Confirmer",
    loginRequired: "Connectez-vous.",
    progress: "Atteint",
    of: "sur",
  },
  kr: {
    title: "기부",
    subtitle: "친절을 나눕시다.",
    activePrograms: "진행 중인 프로그램",
    totalCollected: "총 모금액",
    donateNow: "기부하기",
    days: "일",
    donationModalTitle: "기부:",
    donorName: "기부자 성함",
    emailOptional: "이메일 (선택)",
    phoneOptional: "전화번호 (선택)",
    amountRequired: "기부 금액",
    minAmount: "최소 10,000 Rp",
    messageOptional: "메시지 (선택)",
    paymentMethod: "결제 방법",
    processing: "처리 중...",
    confirmPayment: "결제 확인",
    loginRequired: "로그인 필요.",
    progress: "달성",
    of: "/",
  },
  jp: {
    title: "寄付",
    subtitle: "優しさを分かち合いましょう。",
    activePrograms: "アクティブなプログラム",
    totalCollected: "総寄付額",
    donateNow: "寄付する",
    days: "日",
    donationModalTitle: "寄付:",
    donorName: "寄付者名",
    emailOptional: "メール (任意)",
    phoneOptional: "電話番号 (任意)",
    amountRequired: "寄付金額",
    minAmount: "最低 10,000 Rp",
    messageOptional: "メッセージ (任意)",
    paymentMethod: "支払い方法",
    processing: "処理中...",
    confirmPayment: "支払い確認",
    loginRequired: "ログインしてください。",
    progress: "達成",
    of: "/",
  },
};

// --- HELPER FUNCTIONS ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatRupiah = (value: string) => {
  const number = value.replace(/\D/g, "");
  return new Intl.NumberFormat("id-ID").format(Number(number));
};

const getDaysRemaining = (endDate: string) => {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export default function DonationCategoryPage() {
  const params = useParams();
  const { locale } = useI18n();
  const { data: session } = useSession();

  const rawCategory = params?.category as string;
  const categoryTitle = rawCategory
    ? rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1)
    : "Donasi";

  const safeLocale = (
    PAGE_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = PAGE_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  // Modal Visibility States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPaymentStatusOpen, setIsPaymentStatusOpen] = useState(false);

  // Data States
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );
  const [createdDonationData, setCreatedDonationData] =
    useState<CampaignDonation | null>(null);

  // Form States
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qris");
  const [paymentChannel, setPaymentChannel] = useState<PaymentChannel>("qris");
  const [donationAmount, setDonationAmount] = useState<string>("");
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [donorPhone, setDonorPhone] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // API Hooks
  const { data: campaignsData, isLoading } = useGetCampaignsQuery({
    page: 1,
    paginate: 50,
  });
  const [createDonation, { isLoading: isSubmittingMutation }] =
    useCreateDonationMutation();
  const [toggleFavorite] = useToggleFavoriteCampaignMutation();
  const { data: currentUser, refetch: refetchUser } = useGetCurrentUserQuery(
    undefined,
    { skip: !session },
  );

  const filteredCampaigns = useMemo(() => {
    if (!campaignsData?.data) return [];
    return campaignsData.data.filter(
      (c) => c.category.toLowerCase() === rawCategory.toLowerCase(),
    );
  }, [campaignsData, rawCategory]);

  const stats = useMemo(() => {
    const total = filteredCampaigns.reduce(
      (acc, curr) => acc + curr.raised_amount,
      0,
    );
    return { total, count: filteredCampaigns.length };
  }, [filteredCampaigns]);

  const handleDonateClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
    // Reset Form
    setPaymentMethod("qris");
    setPaymentChannel("qris");
    setDonationAmount("");
    setDonorName(session?.user?.name || "");
    setDonorEmail(session?.user?.email || "");
    setDonorPhone("");
    setDescription("");
  };

  const handleFavoriteToggle = async (
    campaignId: number,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    if (!session) {
      MySwal.fire({ icon: "info", text: t.loginRequired });
      return;
    }
    setTogglingId(campaignId);
    try {
      await toggleFavorite({ campaign_id: campaignId }).unwrap();
      refetchUser();
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  const isFavorited = (id: number) => {
    return (
      currentUser?.favorite_campaigns?.some((fav) => fav.campaign_id === id) ??
      false
    );
  };

  const handleShare = (campaign: Campaign, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedCampaign(campaign);
    setIsShareModalOpen(true);
  };

  // --- LOGIC DONASI (MENGADOPSI DONASIPAGE) ---
  const handleSubmitDonation = async () => {
    if (!selectedCampaign) return;

    const amountNum = Number(donationAmount.replace(/\D/g, ""));
    if (amountNum < 10000) {
      MySwal.fire({ icon: "warning", text: t.minAmount });
      return;
    }

    if (!donorName.trim()) {
      MySwal.fire({ icon: "warning", text: "Nama donatur wajib diisi" });
      return;
    }

    try {
      // 1. Eksekusi API
      // Casting ke ApiResponseWrapper agar bisa ambil .data dengan aman
      const response = (await createDonation({
        campaign: selectedCampaign.id, // Argumen 1: ID
        body: {
          // Argumen 2: Body
          donor_name: donorName,
          donor_email: donorEmail || null,
          donor_phone: donorPhone || null,
          description: description || null,
          payment_method: paymentMethod,
          payment_channel: paymentChannel,
          amount: amountNum,
        },
      }).unwrap()) as unknown as ApiResponseWrapper;

      // 2. Sukses (Jika unwrap tidak error)
      setIsModalOpen(false);

      // Ambil data inti dari wrapper. Jika tidak ada wrapper, ambil response-nya langsung (fallback)
      const finalData =
        response.data || (response as unknown as CampaignDonation);
      setCreatedDonationData(finalData);

      setIsPaymentStatusOpen(true);

      // Reset
      setDonationAmount("");
      setDonorName("");
      setDonorEmail("");
      setDonorPhone("");
      setDescription("");
    } catch (error: unknown) {
      // 3. Error Handling
      const err = error as { data?: { message?: string } };
      console.error("Donation Error:", err);
      MySwal.fire({
        icon: "error",
        title: "Gagal",
        text: err.data?.message || "Gagal memproses donasi.",
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20 relative"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header UI */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center gap-3">
              <Link href="/donasi">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors"
                >
                  <ArrowLeft
                    className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`}
                  />
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                  {categoryTitle}
                </h1>
                <p className="text-[10px] text-awqaf-foreground-secondary font-comfortaa">
                  {t.subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-2">
        {/* Statistik Kategori */}
        <Card className="border-awqaf-border-light mb-6 bg-gradient-to-r from-accent-100 to-accent-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-awqaf-foreground-secondary font-comfortaa uppercase tracking-wider">
                  {t.activePrograms}
                </p>
                <p className="text-lg font-bold text-awqaf-primary font-comfortaa">
                  {stats.count}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-awqaf-foreground-secondary font-comfortaa uppercase tracking-wider">
                  {t.totalCollected}
                </p>
                <p className="text-sm font-bold text-awqaf-primary font-comfortaa truncate">
                  {formatCurrency(stats.total)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* List Campaign */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-awqaf-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredCampaigns.map((campaign) => {
              const daysRemaining = getDaysRemaining(campaign.end_date);
              const progressNum =
                campaign.target_amount > 0
                  ? Math.min(
                      100,
                      Math.round(
                        (campaign.raised_amount / campaign.target_amount) * 100,
                      ),
                    )
                  : 0;
              const translation =
                campaign.translations?.find((tr) => tr.locale === locale) ||
                campaign.translations?.find((tr) => tr.locale === "id");
              const displayTitle = translation?.title || campaign.title;
              const displayDesc =
                (translation?.description || campaign.description)
                  .replace(/<[^>]*>/g, "")
                  .substring(0, 100) + "...";

              return (
                <Card
                  key={campaign.id}
                  className="border-awqaf-border-light hover:shadow-md transition-all overflow-hidden bg-background"
                >
                  <div className="relative h-44">
                    <ImageWithFallback
                      src={campaign.image}
                      alt={displayTitle}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleFavoriteToggle(campaign.id, e)}
                        className={`w-8 h-8 p-0 rounded-full ${isFavorited(campaign.id) ? "bg-red-500 text-white" : "bg-black/20 text-white"}`}
                        disabled={togglingId === campaign.id}
                      >
                        {togglingId === campaign.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Heart
                            className={`w-4 h-4 ${isFavorited(campaign.id) ? "fill-current" : ""}`}
                          />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleShare(campaign, e)}
                        className="w-8 h-8 p-0 rounded-full bg-black/20 text-white"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h4 className="font-bold text-card-foreground text-sm font-comfortaa mb-2 line-clamp-2">
                      {displayTitle}
                    </h4>
                    <p className="text-[11px] text-awqaf-foreground-secondary font-comfortaa mb-4 line-clamp-2">
                      {displayDesc}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-end text-[10px]">
                        <span className="text-awqaf-foreground-secondary">
                          {t.progress}
                        </span>
                        <span className="font-bold text-awqaf-primary">
                          {progressNum}%
                        </span>
                      </div>
                      <Progress
                        value={progressNum}
                        className="h-1.5 bg-accent-100"
                      />
                      <div className="flex justify-between text-[10px] font-bold text-awqaf-primary">
                        <span>{formatCurrency(campaign.raised_amount)}</span>
                        <span className="text-awqaf-foreground-secondary font-normal">
                          {t.of} {formatCurrency(campaign.target_amount)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[10px] text-awqaf-foreground-secondary">
                        <Clock className="w-3 h-3" /> {daysRemaining} {t.days}
                      </div>
                      <Button
                        onClick={() => handleDonateClick(campaign)}
                        size="sm"
                        className="bg-awqaf-primary hover:bg-awqaf-primary/90 text-white text-[11px] font-comfortaa px-6"
                      >
                        {t.donateNow}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* --- MODAL STATUS PEMBAYARAN --- */}
      <PaymentStatusModal
        isOpen={isPaymentStatusOpen}
        onClose={() => setIsPaymentStatusOpen(false)}
        donationData={createdDonationData}
      />

      {/* --- SHARE MODAL --- */}
      {selectedCampaign && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          donation={{
            id: selectedCampaign.id.toString(),
            title: selectedCampaign.title,
            image: selectedCampaign.image,
            description: selectedCampaign.description.replace(/<[^>]*>/g, ""),
          }}
        />
      )}

      {/* --- MODAL FORM DONASI --- */}
      {isModalOpen && selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="bg-awqaf-primary text-white p-4 flex items-center justify-between sticky top-0 z-10">
              <h3 className="font-bold font-comfortaa text-lg truncate pr-4">
                {t.donationModalTitle} {selectedCampaign.title}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 font-comfortaa">
                    {t.donorName} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="border-awqaf-border-light focus-visible:ring-awqaf-primary font-comfortaa"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 font-comfortaa">
                    {t.emailOptional}
                  </Label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="border-awqaf-border-light focus-visible:ring-awqaf-primary font-comfortaa"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 font-comfortaa">
                    {t.phoneOptional}
                  </Label>
                  <Input
                    type="tel"
                    placeholder="081234567890"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="border-awqaf-border-light focus-visible:ring-awqaf-primary font-comfortaa"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 font-comfortaa">
                    {t.amountRequired} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="0"
                    value={donationAmount}
                    onChange={(e) =>
                      setDonationAmount(formatRupiah(e.target.value))
                    }
                    className="text-lg font-bold text-awqaf-primary border-awqaf-border-light focus-visible:ring-awqaf-primary font-comfortaa"
                    required
                  />
                  <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
                    {[
                      "10.000",
                      "50.000",
                      "100.000",
                      "500.000",
                      "1.000.000",
                    ].map((amt) => (
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
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 font-comfortaa">
                    {t.messageOptional}
                  </Label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[80px] px-3 py-2 rounded-md border border-awqaf-border-light bg-background text-sm font-comfortaa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-awqaf-primary resize-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-bold text-gray-700 font-comfortaa">
                  {t.paymentMethod}
                </Label>
                <div className="grid grid-cols-3 gap-2 bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("qris");
                      setPaymentChannel("qris");
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 font-comfortaa ${paymentMethod === "qris" ? "bg-white text-awqaf-primary shadow-sm" : "text-gray-500"}`}
                  >
                    <QrCode className="w-4 h-4" /> QRIS
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("bank_transfer");
                      setPaymentChannel("bca");
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 font-comfortaa ${paymentMethod === "bank_transfer" ? "bg-white text-awqaf-primary shadow-sm" : "text-gray-500"}`}
                  >
                    <CreditCard className="w-4 h-4" /> Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("card");
                      setPaymentChannel("card");
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 font-comfortaa ${paymentMethod === "card" ? "bg-white text-awqaf-primary shadow-sm" : "text-gray-500"}`}
                  >
                    <CreditCard className="w-4 h-4" /> Card
                  </button>
                </div>
                {paymentMethod === "bank_transfer" && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {(
                      [
                        { value: "bca", label: "BCA" },
                        { value: "bni", label: "BNI" },
                        { value: "bri", label: "BRI" },
                        { value: "cimb", label: "CIMB" },
                      ] as const
                    ).map((bank) => (
                      <button
                        key={bank.value}
                        type="button"
                        onClick={() => setPaymentChannel(bank.value)}
                        className={`py-2 px-3 rounded-lg text-xs font-bold font-comfortaa ${paymentChannel === bank.value ? "bg-awqaf-primary text-white" : "bg-gray-100"}`}
                      >
                        {bank.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 sticky bottom-0 z-10">
              <Button
                onClick={handleSubmitDonation}
                disabled={
                  isSubmittingMutation || !donorName.trim() || !donationAmount
                }
                className="w-full bg-awqaf-primary font-bold font-comfortaa hover:bg-awqaf-primary/90"
              >
                {isSubmittingMutation ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.processing}
                  </>
                ) : (
                  t.confirmPayment
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}