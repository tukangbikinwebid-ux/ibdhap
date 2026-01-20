"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Package,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Helper Format Rupiah
const formatRupiah = (num: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
};

interface CartItem {
  id: number;
  name: string;
  price: number;
  markup_price: number;
  image: string;
  store: { id: number; name: string };
  quantity: number;
  stock: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.min(newQuantity, item.stock) } : item
    );
    updateCart(updatedCart);
  };

  const removeItem = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    updateCart(updatedCart);
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal();
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    router.push("/store/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
        <header className="sticky top-0 z-30">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
              <div className="flex items-center justify-between">
                <Link href="/store">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                  Keranjang
                </h1>
                <div className="w-10 h-10"></div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-6">
          <Card className="border-awqaf-border-light">
            <CardContent className="p-12 text-center">
              <ShoppingCart className="w-16 h-16 text-awqaf-foreground-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-card-foreground font-comfortaa mb-2">
                Keranjang Kosong
              </h3>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa mb-6">
                Belum ada produk di keranjang Anda
              </p>
              <Link href="/store">
                <Button className="bg-awqaf-primary hover:bg-awqaf-primary/90 text-white font-comfortaa">
                  Mulai Belanja
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-24">
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/store">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                Keranjang ({cart.length})
              </h1>
              <div className="w-10 h-10"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Cart Items */}
        {cart.map((item) => (
          <Card key={item.id} className="border-awqaf-border-light">
            <CardContent className="p-4">
              <div className="flex gap-4">
                {/* Image */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder-image.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-card-foreground font-comfortaa text-sm line-clamp-2">
                      {item.name}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="w-6 h-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 text-[10px] mb-2"
                  >
                    {item.store.name}
                  </Badge>

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-bold text-awqaf-primary font-comfortaa">
                      {formatRupiah(item.price * item.quantity)}
                    </p>
                    {item.markup_price > item.price && (
                      <p className="text-xs text-awqaf-foreground-secondary line-through">
                        {formatRupiah(item.markup_price * item.quantity)}
                      </p>
                    )}
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 p-0"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm font-semibold text-card-foreground font-comfortaa w-8 text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-8 h-8 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    {item.stock < 10 && (
                      <span className="text-xs text-red-500 font-comfortaa ml-2">
                        Stok: {item.stock}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Summary */}
        <Card className="border-awqaf-border-light bg-gradient-to-br from-accent-50 to-white">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                Subtotal
              </span>
              <span className="text-sm font-semibold text-card-foreground font-comfortaa">
                {formatRupiah(calculateSubtotal())}
              </span>
            </div>
            <div className="border-t border-awqaf-border-light pt-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-card-foreground font-comfortaa">
                  Total
                </span>
                <span className="text-xl font-bold text-awqaf-primary font-comfortaa">
                  {formatRupiah(calculateTotal())}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Checkout Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white shadow-lg border-t-2 border-awqaf-border-light p-4 z-50">
        <Button
          onClick={handleCheckout}
          className="w-full bg-awqaf-primary hover:bg-awqaf-primary/90 text-white font-comfortaa h-12 shadow-md"
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Checkout ({formatRupiah(calculateTotal())})
        </Button>
      </div>
    </div>
  );
}
