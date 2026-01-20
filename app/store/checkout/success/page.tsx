"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <Card className="border-awqaf-border-light">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-card-foreground font-comfortaa mb-2">
                Pesanan Berhasil!
              </h1>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                Terima kasih atas pembelian Anda. Pesanan sedang diproses.
              </p>
            </div>
            <div className="space-y-3 pt-4">
              <Link href="/store/history">
                <Button className="w-full bg-awqaf-primary hover:bg-awqaf-primary/90 text-white font-comfortaa">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Lihat Riwayat Pesanan
                </Button>
              </Link>
              <Link href="/store">
                <Button
                  variant="outline"
                  className="w-full border-awqaf-border-light font-comfortaa"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Kembali ke Toko
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
