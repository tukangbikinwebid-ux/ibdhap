"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Repeat,
  Store,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

// --- TIPE DATA (Sama dengan StorePage) ---
type TransactionStatus = "pending" | "completed" | "cancelled";

interface LocalHistoryItem {
  id: string;
  date: string;
  productName: string;
  price: number;
  quantity: number;
  totalPrice: number;
  status: TransactionStatus;
  vendor: string;
  vendorLink: string;
  image?: string;
}

type FilterType = "all" | TransactionStatus;

const TABS: { id: FilterType; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "pending", label: "Berlangsung" },
  { id: "completed", label: "Selesai" },
  { id: "cancelled", label: "Dibatalkan" },
];

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<FilterType>("all");
  const [transactions, setTransactions] = useState<LocalHistoryItem[]>([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("purchase_history");
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  // Format Rupiah
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Helper Status Badge
  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 gap-1 pl-1.5 pr-2.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200 gap-1 pl-1.5 pr-2.5">
            <Clock className="w-3.5 h-3.5" /> Diproses
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200 gap-1 pl-1.5 pr-2.5">
            <XCircle className="w-3.5 h-3.5" /> Dibatalkan
          </Badge>
        );
    }
  };

  // Filter Logic
  const filteredData = transactions.filter((item) => {
    if (activeTab === "all") return true;
    return item.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header Sticky */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-awqaf-border-light shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/store">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full -ml-2 hover:bg-accent-100 text-awqaf-primary"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
              Riwayat Pembelian
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Tabs Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {TABS.map((tab) => (
            <Button
              key={tab.id}
              size="sm"
              variant={activeTab === tab.id ? "default" : "outline"}
              className={`rounded-full px-5 font-comfortaa text-xs whitespace-nowrap h-8 transition-all ${
                activeTab === tab.id
                  ? "bg-awqaf-primary hover:bg-awqaf-primary/90 shadow-md"
                  : "bg-white border-awqaf-border-light text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Transaction List */}
        <div className="space-y-4">
          {filteredData.length > 0 ? (
            filteredData.map((trx) => (
              <Card
                key={trx.id}
                className="border-awqaf-border-light hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                {/* Card Header: Date & Status */}
                <div className="px-4 py-3 bg-accent-50/50 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Store className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold font-comfortaa">
                      {trx.vendor}
                    </span>
                    <span className="text-[10px] text-gray-400">•</span>
                    <span className="text-[10px] font-mono">
                      {new Date(trx.date).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  {getStatusBadge(trx.status)}
                </div>

                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image Placeholder (Real image if available) */}
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {trx.image ? (
                        <img
                          src={trx.image}
                          alt={trx.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="w-8 h-8 text-gray-300" />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 text-sm font-comfortaa line-clamp-2 leading-tight mb-1">
                        {trx.productName}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {trx.quantity} barang x {formatRupiah(trx.price)}
                      </p>
                    </div>
                  </div>

                  {/* Total Price Section */}
                  <div className="flex items-end justify-between mt-3 pt-3 border-t border-dashed border-gray-100">
                    <div>
                      <p className="text-[10px] text-gray-400">Total Belanja</p>
                      <p className="text-sm font-bold text-awqaf-primary font-comfortaa">
                        {formatRupiah(trx.totalPrice)}
                      </p>
                    </div>

                    {/* Action Button based on Status */}
                    {trx.status === "completed" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-comfortaa gap-1.5 border-awqaf-primary text-awqaf-primary hover:bg-accent-50"
                        onClick={() => window.open(trx.vendorLink, "_blank")}
                      >
                        <Repeat className="w-3.5 h-3.5" /> Beli Lagi
                      </Button>
                    ) : trx.status === "pending" ? (
                      <Button
                        variant="default"
                        size="sm"
                        className="h-8 text-xs font-comfortaa gap-1.5 bg-awqaf-primary hover:bg-awqaf-primary/90"
                        onClick={() => window.open(trx.vendorLink, "_blank")}
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> Lanjut Bayar
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs font-comfortaa gap-1 text-gray-400 hover:text-gray-600"
                      >
                        Lihat Detail <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 font-comfortaa mb-1">
                Belum ada transaksi
              </h3>
              <p className="text-sm text-gray-500 max-w-[250px] font-comfortaa mb-6">
                Mulai belanja kebutuhan ibadahmu dan dukung program wakaf.
              </p>
              <Link href="/store">
                <Button className="bg-awqaf-primary font-comfortaa">
                  Mulai Belanja
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}