"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search,
  ShoppingCart,
  Store,
  ShoppingBag,
  History,
  X,
  Filter,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useGetPublicStoresQuery,
  useGetPublicProductsQuery,
} from "@/services/public/store.service";
import { Product } from "@/types/public/store/product";
import { dummyProducts } from "./data/dummy-products";

/* ================= Utils ================= */

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);

const calculateDiscount = (price: number, markupPrice: number) => {
  if (markupPrice <= price) return 0;
  return Math.round(((markupPrice - price) / markupPrice) * 100);
};

/* ================= Constants ================= */

const categories = [
  { id: "all", name: "Semua", icon: "📦" },
  { id: "mukena", name: "Mukena", icon: "🧕" },
  { id: "sajadah", name: "Sajadah", icon: "🕌" },
  { id: "buku", name: "Buku", icon: "📚" },
  { id: "aksesoris", name: "Aksesoris", icon: "✨" },
];

const sortOptions = [
  { value: "newest", label: "Terbaru" },
  { value: "price_low", label: "Harga Terendah" },
  { value: "price_high", label: "Harga Tertinggi" },
  { value: "name", label: "Nama A-Z" },
];

type CartItem = {
  id: number;
  quantity: number;
};

/* ================= Page ================= */

export default function StorePage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState<number | undefined>();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  /* ================= API ================= */

  const { data: storesData } = useGetPublicStoresQuery({
    page: 1,
    paginate: 100,
  });

  const { data: productsData, isLoading: isLoadingProducts } =
    useGetPublicProductsQuery({
      page: 1,
      paginate: 100,
      store_id: selectedStoreId,
    });

  /* ================= Cart ================= */

  useEffect(() => {
    const updateCartCount = () => {
      const cart = localStorage.getItem("cart");
      const items: CartItem[] = cart ? JSON.parse(cart) : [];
      setCartCount(items.length);
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  /* ================= Products ================= */

  const allProducts = useMemo(() => {
    const apiProducts = productsData?.data || [];
    return apiProducts.length < 3
      ? [...apiProducts, ...dummyProducts]
      : apiProducts;
  }, [productsData]);

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => {
        const name = p.name.toLowerCase();
        if (selectedCategory === "mukena") return name.includes("mukena");
        if (selectedCategory === "sajadah") return name.includes("sajadah");
        if (selectedCategory === "buku")
          return name.includes("buku") || name.includes("quran");
        if (selectedCategory === "aksesoris")
          return name.includes("tasbih") || name.includes("peci");
        return true;
      });
    }

    filtered.sort((a, b) => {
      if (sortBy === "price_low") return a.price - b.price;
      if (sortBy === "price_high") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return (
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
      );
    });

    return filtered;
  }, [allProducts, searchQuery, selectedCategory, sortBy]);

  /* ================= Actions ================= */

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();

    const saved = localStorage.getItem("cart");
    const cart: CartItem[] = saved ? JSON.parse(saved) : [];

    const index = cart.findIndex((i) => i.id === product.id);

    if (index >= 0) {
      cart[index].quantity += 1;
    } else {
      cart.push({ id: product.id, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setCartCount(cart.length);
  };

  const handleProductClick = (product: Product) => {
    router.push(`/store/${product.id}`);
  };

  /* ================= Render ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b">
        <div className="max-w-md mx-auto px-4 py-3 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-awqaf-primary rounded-lg flex items-center justify-center text-white">
                <Store className="w-5 h-5" />
              </div>
              <h1 className="font-bold text-awqaf-primary">Awqaf Store</h1>
            </div>

            <div className="flex gap-2">
              <Link href="/store/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/store/history">
                <Button variant="ghost" size="icon">
                  <History className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              className="pl-9 rounded-full"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Category */}
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Kategori</h3>
          <Button size="sm" variant="ghost" onClick={() => setShowFilters(true)}>
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              size="sm"
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.icon} {cat.name}
            </Button>
          ))}
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 gap-4">
          {isLoadingProducts
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-xl bg-gray-100 animate-pulse"
                />
              ))
            : filteredProducts.map((product) => {
                const discount = calculateDiscount(
                  product.price,
                  product.markup_price
                );
                const isInStock = product.stock > 0;

                return (
                  <Card
                    key={product.id}
                    className="cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={product.image || "/placeholder-image.jpg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {discount > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          {discount}% OFF
                        </span>
                      )}
                    </div>

                    <CardContent className="p-3">
                      <Badge className="mb-1">{product.store.name}</Badge>
                      <h3 className="text-sm font-bold line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="font-bold text-awqaf-primary">
                        {formatRupiah(product.price)}
                      </p>
                    </CardContent>

                    <CardFooter>
                      <Button
                        className="w-full"
                        disabled={!isInStock}
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Keranjang
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
        </div>
      </main>
    </div>
  );
}
