"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  ShoppingCart,
  ExternalLink,
  Store,
  ShoppingBag,
  Heart,
  History,
  X,
  ChevronRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  useGetPublicStoresQuery,
  useGetPublicProductsQuery,
} from "@/services/public/store.service";
import { Product } from "@/types/public/store/product";

// Helper Format Rupiah
const formatRupiah = (num: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
};

// Interface Local History
interface LocalHistoryItem {
  id: string;
  date: string;
  productName: string;
  price: number;
  quantity: number;
  totalPrice: number;
  status: "pending" | "completed" | "cancelled";
  vendor: string;
  vendorLink: string;
  image: string;
}

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState<number | undefined>(
    undefined
  );
  const [showHistory, setShowHistory] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);
  const [historyData, setHistoryData] = useState<LocalHistoryItem[]>([]);

  // 1. Fetch API
  const { data: storesData, isLoading: isLoadingStores } =
    useGetPublicStoresQuery({ page: 1, paginate: 100 });

  const { data: productsData, isLoading: isLoadingProducts } =
    useGetPublicProductsQuery({
      page: 1,
      paginate: 50,
      store_id: selectedStoreId,
    });

  // 2. Load History from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("purchase_history");
    if (saved) {
      setHistoryData(JSON.parse(saved));
    }
  }, []);

  // 3. Save History Handler
  const handlePurchaseClick = (product: Product) => {
    const newHistory: LocalHistoryItem = {
      id: `TRX-${Date.now()}`,
      date: new Date().toISOString(),
      productName: product.name,
      price: product.price,
      quantity: 1,
      totalPrice: product.price,
      status: "pending",
      vendor: product.store.name,
      vendorLink: product.external_link,
      image: product.image,
    };

    const updatedHistory = [newHistory, ...historyData];
    setHistoryData(updatedHistory);
    localStorage.setItem("purchase_history", JSON.stringify(updatedHistory));

    // Open External Link
    window.open(product.external_link, "_blank");
  };

  // Close history when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        historyRef.current &&
        !historyRef.current.contains(event.target as Node)
      ) {
        setShowHistory(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter Logic (Client Side Search for better UX on small data)
  const filteredProducts = useMemo(() => {
    if (!productsData) return [];
    return productsData.data.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [productsData, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header Sticky */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-awqaf-border-light shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3 relative">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-awqaf-primary rounded-lg flex items-center justify-center text-white">
                <Store className="w-5 h-5" />
              </div>
              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                Awqaf Store
              </h1>
            </div>

            {/* Container Tombol & Floating History */}
            <div className="relative" ref={historyRef}>
              <Button
                variant="ghost"
                size="icon"
                className={`relative transition-colors ${
                  showHistory
                    ? "bg-accent-100 text-awqaf-primary"
                    : "text-awqaf-primary"
                }`}
                onClick={() => setShowHistory(!showHistory)}
              >
                <ShoppingBag className="w-5 h-5" />
                {historyData.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </Button>

              {/* FLOATING HISTORY COMPONENT */}
              {showHistory && (
                <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-awqaf-border-light z-50 animate-in slide-in-from-top-2 fade-in duration-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-accent-50/50">
                    <h3 className="font-bold text-awqaf-primary font-comfortaa text-sm flex items-center gap-2">
                      <History className="w-4 h-4" /> Riwayat Pembelian
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 rounded-full"
                      onClick={() => setShowHistory(false)}
                    >
                      <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </Button>
                  </div>

                  <div className="max-h-[320px] overflow-y-auto p-2 space-y-2">
                    {historyData.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors group relative"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-[10px] text-gray-400 font-mono">
                            {new Date(item.date).toLocaleDateString("id-ID")}
                          </p>
                          <Badge
                            variant="outline"
                            className="text-[10px] h-5 bg-yellow-50 text-yellow-700 border-yellow-200 gap-1 pl-1 pr-2"
                          >
                            <Clock className="w-3 h-3" /> Proses
                          </Badge>
                        </div>
                        <h4 className="text-sm font-bold text-gray-800 font-comfortaa line-clamp-1">
                          {item.productName}
                        </h4>
                        <div className="flex justify-between items-end mt-2">
                          <div>
                            <p className="text-[10px] text-gray-500 mb-0.5">
                              Via: {item.vendor}
                            </p>
                            <p className="text-sm font-bold text-awqaf-primary font-comfortaa">
                              {formatRupiah(item.price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {historyData.length === 0 && (
                      <p className="text-center text-xs text-gray-400 py-4">
                        Belum ada riwayat pembelian.
                      </p>
                    )}
                    <div className="text-center pt-2 pb-1">
                      <Link
                        href="/store/history"
                        className="text-xs text-awqaf-primary font-bold hover:underline"
                      >
                        Lihat Semua Transaksi
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari produk..."
              className="pl-9 h-10 bg-white border-awqaf-border-light rounded-full font-comfortaa focus-visible:ring-awqaf-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-6">
        {/* Banner Promo */}
        <div className="relative h-32 rounded-2xl bg-gradient-to-r from-awqaf-primary to-emerald-600 overflow-hidden shadow-md flex items-center px-6">
          <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-4 translate-y-4">
            <ShoppingCart className="w-32 h-32 text-white" />
          </div>
          <div className="relative z-10 text-white">
            <p className="text-xs font-bold bg-white/20 inline-block px-2 py-1 rounded mb-1 backdrop-blur-sm">
              PROMO
            </p>
            <h2 className="text-xl font-bold font-comfortaa">Berkah Belanja</h2>
            <p className="text-xs opacity-90 font-comfortaa">
              Sebagian keuntungan untuk wakaf.
            </p>
          </div>
        </div>

        {/* Categories (Stores) */}
        <div>
          {isLoadingStores ? (
            <div className="flex gap-2 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Button
                size="sm"
                variant={selectedStoreId === undefined ? "default" : "outline"}
                className={`rounded-full px-4 font-comfortaa text-xs whitespace-nowrap h-8 ${
                  selectedStoreId === undefined
                    ? "bg-awqaf-primary hover:bg-awqaf-primary/90"
                    : "bg-white border-awqaf-border-light text-gray-600"
                }`}
                onClick={() => setSelectedStoreId(undefined)}
              >
                Semua Toko
              </Button>
              {storesData?.data.map((store) => (
                <Button
                  key={store.id}
                  size="sm"
                  variant={selectedStoreId === store.id ? "default" : "outline"}
                  className={`rounded-full px-4 font-comfortaa text-xs whitespace-nowrap h-8 ${
                    selectedStoreId === store.id
                      ? "bg-awqaf-primary hover:bg-awqaf-primary/90"
                      : "bg-white border-awqaf-border-light text-gray-600"
                  }`}
                  onClick={() => setSelectedStoreId(store.id)}
                >
                  {store.name}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-4">
          {isLoadingProducts ? (
            // Loading Skeleton
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-xl bg-gray-100 animate-pulse"
              />
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden border-awqaf-border-light hover:shadow-md transition-all duration-200 group bg-white flex flex-col h-full"
              >
                {/* Image Area */}
                <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                  <Image
                    src={product.image || "/placeholder-image.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  {product.stock < 1 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                      <span className="text-white font-bold text-xs bg-red-600 px-2 py-1 rounded">
                        HABIS
                      </span>
                    </div>
                  )}

                  {/* Wishlist Button Overlay */}
                  <button className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors backdrop-blur-sm z-20">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                <CardContent className="p-3 flex-1 flex flex-col">
                  {/* Vendor Badge */}
                  <div className="flex justify-between items-center mb-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10px]"
                    >
                      {product.store.name}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-800 text-sm font-comfortaa line-clamp-2 mb-1 flex-1">
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="mt-2">
                    <p className="text-awqaf-primary font-bold font-comfortaa text-base">
                      {formatRupiah(product.price)}
                    </p>
                    {product.stock > 0 && product.stock < 10 && (
                      <p className="text-[10px] text-red-500 mt-1">
                        Tersisa {product.stock} stok!
                      </p>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="p-3 pt-0">
                  <Button
                    className={`w-full h-9 font-comfortaa text-xs gap-2 ${
                      product.stock < 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed hover:bg-gray-200"
                        : "bg-accent-50 text-awqaf-primary hover:bg-accent-100 border border-accent-100"
                    }`}
                    disabled={product.stock < 1}
                    onClick={() => handlePurchaseClick(product)}
                  >
                    {product.stock < 1 ? (
                      "Stok Habis"
                    ) : (
                      <>
                        Beli Sekarang <ExternalLink className="w-3 h-3" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-medium font-comfortaa">
                Produk tidak ditemukan
              </p>
              <p className="text-xs text-gray-500 font-comfortaa">
                Coba kata kunci lain atau toko berbeda
              </p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-center pb-6 pt-4">
          <p className="text-[10px] text-gray-400 font-comfortaa">
            Awqaf Store bekerja sama dengan vendor terpercaya.
            <br />
            Transaksi dilakukan di platform partner.
          </p>
        </div>
      </main>
    </div>
  );
}