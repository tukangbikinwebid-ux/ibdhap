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
} from "lucide-react";
import Link from "next/link";
import { useGetCampaignDonationsQuery } from "@/services/public/campaign.service";
import { formatCurrency } from "../data/donations";

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
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("campaign");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    { skip: !campaignId }
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
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: number, paidAt: string | null) => {
    if (paidAt) {
      return (
        <Badge className="bg-success text-white text-xs">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Terbayar
        </Badge>
      );
    }
    if (status === 0) {
      return (
        <Badge variant="secondary" className="bg-warning text-white text-xs">
          <Clock className="w-3 h-3 mr-1" />
          Menunggu
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" className="text-xs">
        <XCircle className="w-3 h-3 mr-1" />
        Gagal
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
                Campaign ID tidak ditemukan
              </p>
              <Link href="/donasi">
                <Button className="mt-4 font-comfortaa">Kembali ke Donasi</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center gap-3">
              <Link href="/donasi">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                  Riwayat Donasi
                </h1>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                  Daftar donasi campaign ini
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Summary */}
        {paginationInfo && (
          <Card className="border-awqaf-border-light mb-6 bg-gradient-to-r from-accent-100 to-accent-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                    Total Donasi
                  </p>
                  <p className="text-lg font-bold text-awqaf-primary font-comfortaa">
                    {paginationInfo.total} donasi
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                    Halaman {paginationInfo.currentPage} dari {paginationInfo.lastPage}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {(isLoading || isFetching) && <DonationHistorySkeleton />}

        {/* Donations List */}
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
                        {getStatusBadge(donation.status, donation.payment.paid_at)}
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

                      <div className="flex items-center gap-4 text-xs text-awqaf-foreground-secondary font-comfortaa pt-3 border-t border-awqaf-border-light">
                        <div>
                          <span className="font-medium">Metode:</span>{" "}
                          {donation.payment.payment_type.toUpperCase()}
                        </div>
                        {donation.payment.channel && (
                          <div>
                            <span className="font-medium">Channel:</span>{" "}
                            {donation.payment.channel.toUpperCase()}
                          </div>
                        )}
                      </div>

                      {donation.payment.paid_at && (
                        <div className="mt-2 text-xs text-success font-comfortaa">
                          Terbayar pada: {formatDate(donation.payment.paid_at)}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {paginationInfo && paginationInfo.lastPage > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || isFetching}
                    className="border-awqaf-border-light font-comfortaa"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Sebelumnya
                  </Button>

                  <span className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                    Halaman {paginationInfo.currentPage} dari {paginationInfo.lastPage}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(paginationInfo.lastPage, prev + 1)
                      )
                    }
                    disabled={
                      currentPage === paginationInfo.lastPage || isFetching
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
        {!isLoading &&
          !isFetching &&
          (!donationsData?.data || donationsData.data.length === 0) && (
            <Card className="border-awqaf-border-light">
              <CardContent className="p-6 text-center">
                <p className="text-awqaf-foreground-secondary font-comfortaa">
                  Belum ada riwayat donasi
                </p>
              </CardContent>
            </Card>
          )}
      </main>
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
