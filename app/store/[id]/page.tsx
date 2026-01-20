"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  ShoppingCart,
  Minus,
  Plus,
  Heart,
  Share2,
  Store,
  Package,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useGetPublicProductsQuery } from "@/services/public/store.service";
import { Product } from "@/types/public/store/product";
import { dummyProducts } from "../data/dummy-products";

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

/* ================= Types ================= */

type CartItem = {
  id: number;
  name: string;
  price: number;
  markup_price: number;
  image: string;
  store: Product["store"];
  quantity: number;
  stock: number;
};

/* ================= Page ================= */

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);

  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [showAddToCartDialog, setShowAddToCartDialog] = useState(false);

  const { data: productsData } = useGetPublicProductsQuery({
    page: 1,
    paginate: 100,
  });

  const product: Product | undefined =
    productsData?.data.find((p) => p.id === productId) ||
    dummyProducts.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Produk tidak ditemukan</p>
          <Link href="/store">
            <Button className="mt-4">Kembali ke Toko</Button>
          </Link>
        </div>
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.markup_price);
  const isInStock = product.stock > 0;

  /* ================= Actions ================= */

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      markup_price: product.markup_price,
      image: product.image,
      store: product.store,
      quantity,
      stock: product.stock,
    };

    const savedCart = localStorage.getItem("cart");
    const currentCart: CartItem[] = savedCart
      ? JSON.parse(savedCart)
      : [];

    const existingIndex = currentCart.findIndex(
      (item) => item.id === product.id
    );

    if (existingIndex >= 0) {
      currentCart[existingIndex].quantity += quantity;
    } else {
      currentCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(currentCart));

    setIsAddedToCart(true);
    setShowAddToCartDialog(true);

    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => router.push("/store/cart"), 500);
  };

  /* ================= Render ================= */

  return (
    <div className="min-h-screen pb-20">
      {/* HEADER */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="bg-white rounded-xl border px-4 py-3 flex justify-between items-center">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-bold">Detail Produk</h1>
            <div className="flex gap-2">
              <Share2 className="w-5 h-5" />
              <Heart className="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* IMAGE */}
        <Card>
          <div className="relative aspect-square">
            <Image
              src={product.image || "/placeholder-image.jpg"}
              alt={product.name}
              fill
              className="object-cover"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded">
                {discount}% OFF
              </span>
            )}
          </div>
        </Card>

        {/* INFO */}
        <Card>
          <CardContent className="space-y-3">
            <Badge>{product.store.name}</Badge>
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p className="text-xl font-bold">
              {formatRupiah(product.price)}
            </p>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span>
                {isInStock
                  ? `Stok tersedia (${product.stock})`
                  : "Stok habis"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* QUANTITY */}
        <Card>
          <CardContent className="flex justify-between items-center">
            <span>Jumlah</span>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus />
              </Button>
              <span>{quantity}</span>
              <Button
                size="sm"
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                disabled={quantity >= product.stock}
              >
                <Plus />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ACTION */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleAddToCart}
            disabled={!isInStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Keranjang
          </Button>
          <Button
            className="flex-1"
            onClick={handleBuyNow}
            disabled={!isInStock}
          >
            Beli Sekarang
          </Button>
        </div>
      </main>

      {/* DIALOG */}
      <Dialog
        open={showAddToCartDialog}
        onOpenChange={setShowAddToCartDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Produk Ditambahkan
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowAddToCartDialog(false)}
            >
              Lanjut Belanja
            </Button>
            <Link href="/store/cart">
              <Button>Lihat Keranjang</Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
