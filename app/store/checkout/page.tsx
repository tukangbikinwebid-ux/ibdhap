"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  CreditCard,
  QrCode,
  Building2,
  CheckCircle2,
  Copy,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";

/* ================= Utils ================= */

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);

/* ================= Types ================= */

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

type PaymentMethod = "manual" | "automatic";
type ManualPaymentType = "qris" | "bank_transfer";

type QrisPaymentInfo = {
  order_id: string;
  total: number;
  payment_type: "qris";
  qris_code: string;
  qris_number: string;
};

type BankTransferPaymentInfo = {
  order_id: string;
  total: number;
  payment_type: "bank_transfer";
  bank_name: string;
  account_number: string;
  account_name: string;
};

type PaymentInfo = QrisPaymentInfo | BankTransferPaymentInfo;

/* ================= Page ================= */

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("manual");
  const [manualPaymentType, setManualPaymentType] =
    useState<ManualPaymentType>("qris");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      router.push("/store/cart");
    }
  }, [router]);

  const calculateTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateOrderId = () =>
    `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const handleCheckout = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      alert("Mohon lengkapi semua data yang wajib diisi");
      return;
    }

    setIsProcessing(true);

    const orderId = generateOrderId();
    const total = calculateTotal();

    if (paymentMethod === "manual") {
      const paymentData: PaymentInfo =
        manualPaymentType === "qris"
          ? {
              order_id: orderId,
              total,
              payment_type: "qris",
              qris_code:
                "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
                encodeURIComponent(`ORDER-${orderId}-${total}`),
              qris_number: orderId,
            }
          : {
              order_id: orderId,
              total,
              payment_type: "bank_transfer",
              bank_name: "Bank BCA",
              account_number: "1234567890",
              account_name: "Yayasan Awqaf Indonesia",
            };

      setPaymentInfo(paymentData);
      setShowPaymentDialog(true);
      setIsProcessing(false);
    }
  };

  const confirmManualPayment = () => {
    if (!paymentInfo) return;

    const order = {
      id: paymentInfo.order_id,
      date: new Date().toISOString(),
      items: cart,
      total: paymentInfo.total,
      payment_method: "manual",
      payment_info: paymentInfo,
      payment_status: "pending",
      customer: formData,
    };

    const history = JSON.parse(
      localStorage.getItem("purchase_history") || "[]"
    );
    history.unshift(order);
    localStorage.setItem("purchase_history", JSON.stringify(history));

    localStorage.removeItem("cart");
    router.push("/store/checkout/success");
  };

  if (cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-24">
      {/* HEADER */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="bg-background/90 backdrop-blur-md rounded-2xl border px-4 py-3">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-bold text-awqaf-primary">
                Checkout
              </h1>
              <div className="w-10" />
            </div>
          </div>
        </div>
      </header>

      {/* BUTTON */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white p-4">
        <Button
          onClick={handleCheckout}
          disabled={isProcessing}
          className="w-full h-12"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Proses Pembayaran
            </>
          )}
        </Button>
      </div>

      {/* DIALOG */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Instruksi Pembayaran</DialogTitle>
          </DialogHeader>

          {paymentInfo?.payment_type === "qris" && (
            <div className="text-center space-y-3">
              <Image
                src={paymentInfo.qris_code}
                alt="QRIS"
                width={200}
                height={200}
              />
              <p className="text-xs">
                Nomor Pesanan: {paymentInfo.qris_number}
              </p>
            </div>
          )}

          {paymentInfo?.payment_type === "bank_transfer" && (
            <div className="space-y-2">
              <p>{paymentInfo.bank_name}</p>
              <div className="flex gap-2 items-center">
                <span className="font-mono">
                  {paymentInfo.account_number}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    handleCopy(paymentInfo.account_number)
                  }
                >
                  {copied ? "✔" : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p>{paymentInfo.account_name}</p>
              <p className="font-bold">
                {formatRupiah(paymentInfo.total)}
              </p>
            </div>
          )}

          <Button onClick={confirmManualPayment}>
            Saya Sudah Bayar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
