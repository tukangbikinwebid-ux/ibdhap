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
  ChevronLeft,
  ChevronRight,
  Loader2,
  Clock,
  MapPin,
} from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DonationCarousel, { CarouselDonation } from "./components/DonationCarousel";
import DonationNavigation from "./components/DonationNavigation";
import {
  popularDonations,
  donationCategories,
  formatCurrency,
  getDaysRemaining,
  Donation,
} from "./data/donations";
import {
  useGetCampaignsQuery,
  useCreateDonationMutation,
} from "@/services/public/campaign.service";
import { Campaign } from "@/types/public/campaign";
import { CreateDonationBody, CampaignDonation } from "@/types/public/donation";
import ImageWithFallback from "./components/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ShareModal from "./components/ShareModal";
import PaymentStatusModal from "./components/PaymentModal";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/app/hooks/useI18n";
import { useGetCurrentUserQuery } from "@/services/auth.service";
import { useSession } from "next-auth/react";

const MySwal = withReactContent(Swal);

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

// Type for converted donation from campaign
type ConvertedDonation = Omit<Donation, "isUrgent" | "isPopular">;

const carouselDonationToConvertedDonation = (
  donation: CarouselDonation,
): ConvertedDonation => ({
  id: donation.id.toString(),
  title: donation.title,
  description: "",
  image: donation.image,
  category: donation.category as ConvertedDonation["category"],
  targetAmount: donation.targetAmount,
  currentAmount: donation.currentAmount,
  donorCount: donation.donorCount,
  startDate: "",
  endDate: donation.endDate,
  progress: donation.progress,
  status: "active",
  organization: "Yayasan Awqaf Indonesia",
  location: "Indonesia",
});

/**
 * Helper: Convert Campaign to Donation format dengan dukungan Translation
 * Fungsi ini memastikan data yang muncul sesuai dengan locale aktif.
 */
const campaignToDonation = (
  campaign: Campaign,
  currentLocale: string,
): ConvertedDonation => {
  const translation = campaign.translations?.find(
    (t) => t.locale === currentLocale,
  );

  const displayTitle = translation?.title || campaign.title;
  const displayDescription = translation?.description || campaign.description;

  const progress =
    campaign.target_amount > 0
      ? Math.round((campaign.raised_amount / campaign.target_amount) * 100)
      : 0;

  const categoryMap: Record<string, Donation["category"]> = {
    infaq: "infaq",
    wakaf: "wakaf",
    zakat: "zakat",
    kurban: "kurban",
  };

  const categoryLower = campaign.category.toLowerCase();
  const mappedCategory = categoryMap[categoryLower] || "infaq";

  return {
    id: campaign.id.toString(),
    title: displayTitle,
    description: displayDescription.replace(/<[^>]*>/g, ""),
    image: campaign.image,
    category: mappedCategory,
    targetAmount: campaign.target_amount,
    currentAmount: campaign.raised_amount,
    donorCount: 0,
    startDate: campaign.start_date,
    endDate: campaign.end_date,
    progress,
    status: "active" as const,
    organization: "Yayasan Awqaf Indonesia",
    location: "Indonesia",
  };
};

export default function DonasiPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { data: session } = useSession();

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Modals Visibility State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isPaymentStatusOpen, setIsPaymentStatusOpen] =
    useState<boolean>(false);

  // Data State
  const [selectedDonation, setSelectedDonation] =
    useState<ConvertedDonation | null>(null);
  const [createdDonationData, setCreatedDonationData] =
    useState<CampaignDonation | null>(null);

  // Form State dengan Type Strict dari Interface CreateDonationBody
  const [paymentMethod, setPaymentMethod] =
    useState<CreateDonationBody["payment_method"]>("qris");
  const [paymentChannel, setPaymentChannel] =
    useState<CreateDonationBody["payment_channel"]>("qris");

  const [donationAmount, setDonationAmount] = useState<string>("");
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [donorPhone, setDonorPhone] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // API Hooks
  const [createDonation, { isLoading: isCreatingDonation }] =
    useCreateDonationMutation();
  const { data: currentUser, refetch: refetchUser } = useGetCurrentUserQuery(
    session ? { forceRefresh: true } : undefined,
    { skip: !session, refetchOnMountOrArgChange: true },
  );

  const [togglingCampaignId, setTogglingCampaignId] = useState<number | null>(
    null,
  );

  // Helper functions
  const isCampaignFavorited = (campaignId: number): boolean => {
    if (!currentUser?.favorite_campaigns) return false;
    return currentUser.favorite_campaigns.some(
      (fav: { campaign_id: number }) => fav.campaign_id === campaignId,
    );
  };

  const handleToggleFavorite = async (
    campaignId: number,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    if (!session?.user?.token) {
      router.push("/auth/login");
      return;
    }
    setTogglingCampaignId(campaignId);
    try {
      const toggleResponse = await fetch(
        "https://cms.ibadahapps.com/api/v1/user/toggle-favorite-campaign",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({ campaign_id: campaignId }),
        },
      );
      if (!toggleResponse.ok) throw new Error("Failed to toggle favorite");
      await refetchUser();
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal mengubah status favorit.",
      });
    } finally {
      setTogglingCampaignId(null);
    }
  };

  const {
    data: campaignsData,
    isLoading: isLoadingCampaigns,
    isFetching: isFetchingCampaigns,
  } = useGetCampaignsQuery({
    page: currentPage,
    paginate: itemsPerPage,
  });

  const donations = useMemo(() => {
    if (!campaignsData?.data) return [];
    return campaignsData.data.map((campaign) =>
      campaignToDonation(campaign, locale),
    );
  }, [campaignsData, locale]);

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

  const handleDonateClick = (donation: ConvertedDonation) => {
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

  const handleDonateFromCarousel = (donation: CarouselDonation) => {
    const converted = carouselDonationToConvertedDonation(donation);
    handleDonateClick(converted);
  };

  const handleShare = (donation: ConvertedDonation) => {
    setSelectedDonation(donation);
    setIsShareModalOpen(true);
  };

  const handleRiwayatDonasi = () => {
    // 1. Jika sudah ada yang terpilih di state, langsung gas ke history
    if (selectedDonation) {
      router.push(`/donasi/riwayat?campaign=${selectedDonation.id}`);
      return;
    }

    // 2. Jika belum ada, tampilkan pilihan dari daftar donasi yang sedang muncul di layar
    if (donations.length > 0) {
      MySwal.fire({
        title:
          locale === "id"
            ? "Pilih Riwayat Campaign"
            : "Select Campaign History",
        text:
          locale === "id"
            ? "Pilih salah satu campaign di bawah ini:"
            : "Choose one of the campaigns below:",
        icon: "question",
        input: "select",
        inputOptions: Object.fromEntries(donations.map((d) => [d.id, d.title])),
        inputPlaceholder:
          locale === "id"
            ? "--- Pilih Campaign ---"
            : "--- Select Campaign ---",
        showCancelButton: true,
        confirmButtonColor: "#00A859",
        confirmButtonText: locale === "id" ? "Lihat Riwayat" : "View History",
        cancelButtonText: locale === "id" ? "Batal" : "Cancel",
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          // Arahkan ke halaman riwayat berdasarkan ID yang dipilih dari dropdown SweetAlert
          router.push(`/donasi/riwayat?campaign=${result.value}`);
        }
      });
    } else {
      // 3. Jika data donasi dari API memang kosong
      MySwal.fire({
        icon: "info",
        text:
          locale === "id"
            ? "Tidak ada daftar campaign tersedia."
            : "No campaigns available.",
      });
    }
  };

  const handleSubmitDonation = async () => {
    if (!selectedDonation) return;

    const amountNum = Number(donationAmount.replace(/\D/g, ""));
    if (amountNum < 10000) {
      MySwal.fire({ icon: "warning", text: t("donation.minimumDonation") });
      return;
    }

    if (!donorName.trim()) {
      MySwal.fire({ icon: "warning", text: "Nama donor wajib diisi" });
      return;
    }

    setIsSubmitting(true);

    try {
      const result: CampaignDonation = await createDonation({
        campaign: Number(selectedDonation.id),
        body: {
          donor_name: donorName,
          donor_email: donorEmail || null,
          donor_phone: donorPhone || null,
          description: description || null,
          payment_method: paymentMethod,
          payment_channel: paymentChannel,
          amount: amountNum,
        },
      }).unwrap();

      setIsModalOpen(false);
      setCreatedDonationData(result);
      setIsPaymentStatusOpen(true);

      setDonationAmount("");
      setDonorName("");
      setDonorEmail("");
      setDonorPhone("");
      setDescription("");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      MySwal.fire({
        icon: "error",
        title: "Gagal",
        text: err.data?.message || "Gagal memproses donasi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                {t("donation.title")}
              </h1>
            </div>
            <p className="text-white/90 font-comfortaa max-w-2xl mx-auto">
              {t("donation.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-8">
        <section>
          <DonationCarousel
            // donations={popularDonations}
            onDonateClick={handleDonateFromCarousel}
          />
        </section>

        <section>
          <DonationNavigation categories={donationCategories} />
        </section>

        <section>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-card-foreground font-comfortaa">
                  {t("donation.donationList")}
                </h3>
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  {t("donation.selectDonation")}
                </p>
              </div>
              {paginationInfo && (
                <Badge
                  variant="secondary"
                  className="bg-awqaf-primary text-white text-xs px-2 py-1"
                >
                  {paginationInfo.total} {t("donation.donations")}
                </Badge>
              )}
            </div>

            {(isLoadingCampaigns || isFetchingCampaigns) && (
              <DonationSkeleton />
            )}

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
                          <div className="relative h-48 overflow-hidden">
                            <ImageWithFallback
                              src={donation.image}
                              alt={donation.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                              <Badge className="bg-awqaf-primary text-white text-xs px-2 py-1 uppercase">
                                {donation.category}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) =>
                                handleToggleFavorite(Number(donation.id), e)
                              }
                              disabled={
                                togglingCampaignId === Number(donation.id)
                              }
                              className={`absolute top-3 right-3 w-8 h-8 p-0 rounded-full transition-all ${
                                isCampaignFavorited(Number(donation.id))
                                  ? "bg-red-500/80 hover:bg-red-500 text-white"
                                  : "bg-black/20 hover:bg-black/40 text-white"
                              } ${togglingCampaignId === Number(donation.id) ? "opacity-50 cursor-wait" : ""}`}
                            >
                              {togglingCampaignId === Number(donation.id) ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Heart
                                  className={`w-4 h-4 transition-all ${isCampaignFavorited(Number(donation.id)) ? "fill-current" : ""}`}
                                />
                              )}
                            </Button>
                          </div>

                          <CardContent className="p-4">
                            <div className="mb-3">
                              <h4 className="font-semibold text-card-foreground text-sm font-comfortaa mb-1 line-clamp-2">
                                {donation.title}
                              </h4>
                              <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                                {donation.organization}
                              </p>
                            </div>
                            <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mb-3 line-clamp-2">
                              {donation.description}
                            </p>
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                                  {t("donation.progress")}
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
                                <span>
                                  {formatCurrency(donation.currentAmount)}
                                </span>
                                <span>
                                  {formatCurrency(donation.targetAmount)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mb-3 text-xs text-awqaf-foreground-secondary">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span className="font-comfortaa">
                                  {daysRemaining} {t("donation.days")}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span className="font-comfortaa truncate max-w-20">
                                  {donation.location}
                                </span>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleDonateClick(donation)}
                              className="w-full bg-awqaf-primary hover:bg-awqaf-primary/90 text-white text-xs font-comfortaa"
                              size="sm"
                            >
                              {t("donation.donateNow")}
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {paginationInfo && paginationInfo.lastPage > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1 || isFetchingCampaigns}
                        className="border-awqaf-border-light font-comfortaa"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        {t("donation.previous")}
                      </Button>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                          {t("donation.page")} {paginationInfo.currentPage}{" "}
                          {t("donation.of")} {paginationInfo.lastPage}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(paginationInfo.lastPage, prev + 1),
                          )
                        }
                        disabled={
                          currentPage === paginationInfo.lastPage ||
                          isFetchingCampaigns
                        }
                        className="border-awqaf-border-light font-comfortaa"
                      >
                        {t("donation.next")}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </>
              )}
          </div>
        </section>

        <section>
          <Card className="border-awqaf-border-light">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-card-foreground font-comfortaa mb-2">
                  {t("donation.needHelp")}
                </h3>
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  {t("donation.helpDescription")}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <Button
                  variant="outline"
                  className="border-awqaf-border-light text-awqaf-foreground-secondary hover:border-awqaf-primary hover:text-awqaf-secondary font-comfortaa"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  {t("donation.favoriteDonation")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleShare(selectedDonation || donations[0])}
                  className="border-awqaf-border-light text-awqaf-foreground-secondary hover:border-awqaf-primary hover:text-awqaf-secondary font-comfortaa"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {t("donation.share")}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRiwayatDonasi}
                  className="border-awqaf-border-light text-awqaf-foreground-secondary hover:border-awqaf-primary hover:text-awqaf-secondary font-comfortaa"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  {t("donation.donationHistory")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="border-awqaf-border-light bg-gradient-to-r from-accent-100 to-accent-200">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-awqaf-primary font-comfortaa mb-2">
                &quot;{t("donation.motivationalQuote")}&quot;
              </p>
              <p className="text-xs text-awqaf-foreground-secondary font-tajawal">
                - HR. Thabrani
              </p>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* --- DONATION FORM MODAL --- */}
      {isModalOpen && selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
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

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 font-comfortaa">
                    {t("donation.donorName")}{" "}
                    <span className="text-error">*</span>
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
                    {t("donation.emailOptional")}
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
                    {t("donation.phoneOptional")}
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
                    {t("donation.donationAmountRequired")}{" "}
                    <span className="text-error">*</span>
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
                    {t("donation.messageOptional")}
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
                  {t("donation.paymentMethod")}
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
                  isSubmitting ||
                  isCreatingDonation ||
                  !donorName.trim() ||
                  !donationAmount
                }
                className="w-full bg-awqaf-primary font-bold font-comfortaa hover:bg-awqaf-primary/90"
              >
                {isSubmitting || isCreatingDonation ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  t("donation.confirmPayment")
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- PAYMENT INSTRUCTION MODAL --- */}
      <PaymentStatusModal
        isOpen={isPaymentStatusOpen}
        onClose={() => setIsPaymentStatusOpen(false)}
        donationData={createdDonationData}
      />

      {/* --- SHARE MODAL --- */}
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
