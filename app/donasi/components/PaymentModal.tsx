"use client";

import { useState } from "react";
import { X, Copy, CheckCircle2, QrCode, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/app/hooks/useI18n";
import Image from "next/image";
import { CampaignDonation } from "@/types/public/donation";

// --- DATA TRANSLATIONS (Diletakkan di dalam file yang sama) ---
const translationsData = {
  id: {
    qrisTitle: "Instruksi Pembayaran QRIS",
    transferTitle: "Instruksi Transfer Bank",
    accountNumber: "Nomor Rekening / VA",
    scanInstruction:
      "Scan QR Code di atas menggunakan aplikasi pembayaran pilihan Anda",
    totalAmount: "Total Nominal Donasi",
    done: "Selesai & Tutup",
  },
  en: {
    qrisTitle: "QRIS Payment Instructions",
    transferTitle: "Bank Transfer Instructions",
    accountNumber: "Account Number / VA",
    scanInstruction: "Scan the QR Code above using your preferred payment app",
    totalAmount: "Total Donation Amount",
    done: "Finish & Close",
  },
  ar: {
    qrisTitle: "تعليمات دفع QRIS",
    transferTitle: "تعليمات التحويل البنكي",
    accountNumber: "رقم الحساب / VA",
    scanInstruction: "امسح رمز QR أعلاه باستخدام تطبيق الدفع المفضل لديك",
    totalAmount: "إجمالي مبلغ التبرع",
    done: "إنهاء وإغلاق",
  },
  fr: {
    qrisTitle: "Instructions de paiement QRIS",
    transferTitle: "Instructions de virement bancaire",
    accountNumber: "Numéro de compte / VA",
    scanInstruction:
      "Scannez le code QR ci-dessus avec votre application de paiement préférée",
    totalAmount: "Montant total du don",
    done: "Terminer et fermer",
  },
  jp: {
    qrisTitle: "QRIS支払い方法",
    transferTitle: "銀行振込の手順",
    accountNumber: "口座番号 / VA",
    scanInstruction:
      "お好みの決済アプリを使用して、上記のQRコードをスキャンしてください",
    totalAmount: "寄付総額",
    done: "完了して閉じる",
  },
  kr: {
    qrisTitle: "QRIS 결제 안내",
    transferTitle: "계좌 이체 안내",
    accountNumber: "계좌 번호 / VA",
    scanInstruction: "원하는 결제 앱을 사용하여 위의 QR 코드를 스캔하세요",
    totalAmount: "총 기부 금액",
    done: "완료 및 닫기",
  },
};

interface PaymentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  donationData: CampaignDonation | null;
}

export default function PaymentStatusModal({
  isOpen,
  onClose,
  donationData,
}: PaymentStatusModalProps) {
  const { locale } = useI18n();
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Ambil translasi berdasarkan locale aktif, default ke 'id' jika tidak ditemukan
  const dict =
    translationsData[locale as keyof typeof translationsData] ||
    translationsData.id;

  if (!isOpen || !donationData) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const isQris = donationData.payment.payment_type === "qris";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="bg-awqaf-primary text-white p-4 flex items-center justify-between">
          <h3 className="font-bold font-comfortaa">
            {isQris ? dict.qrisTitle : dict.transferTitle}
          </h3>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-1 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-center">
          {isQris ? (
            /* --- TAMPILAN QRIS --- */
            <div className="space-y-4">
              <div className="w-64 h-64 bg-white mx-auto p-4 rounded-xl border-2 border-awqaf-primary/20 flex items-center justify-center relative shadow-inner">
                {donationData.payment.account_number && (
                  <Image
                    src={donationData.payment.account_number}
                    alt="QRIS Code"
                    width={240}
                    height={240}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                )}
              </div>
              <div className="flex items-center justify-center gap-2 text-awqaf-primary font-bold">
                <QrCode className="w-5 h-5" />
                <span className="font-comfortaa">QRIS DYNAMIC</span>
              </div>
              <p className="text-sm text-gray-500 font-comfortaa px-4">
                {dict.scanInstruction}
              </p>
            </div>
          ) : (
            /* --- TAMPILAN TRANSFER BANK / CARD --- */
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold font-comfortaa">
                  {dict.accountNumber}
                </p>
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-awqaf-border-light shadow-sm">
                  <span className="text-xl font-mono font-bold text-awqaf-primary tracking-wider">
                    {donationData.payment.account_number ||
                      donationData.payment.transaction_id}
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(donationData.payment.account_number || "")
                    }
                    className="text-gray-400 hover:text-awqaf-primary transition-all active:scale-90"
                  >
                    {isCopied ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Copy className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-awqaf-primary font-bold">
                <CreditCard className="w-5 h-5" />
                <span className="uppercase font-comfortaa">
                  {donationData.payment.channel}
                </span>
              </div>
            </div>
          )}

          {/* Ringkasan Nominal */}
          <div className="border-t border-dashed pt-5">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1 font-comfortaa">
              {dict.totalAmount}
            </p>
            <p className="text-3xl font-bold text-awqaf-primary font-comfortaa">
              Rp {new Intl.NumberFormat("id-ID").format(donationData.amount)}
            </p>
          </div>

          {/* Action Button */}
          <Button
            onClick={onClose}
            className="w-full bg-awqaf-primary hover:bg-awqaf-primary/90 text-white font-bold font-comfortaa h-12 shadow-lg shadow-awqaf-primary/20"
          >
            {dict.done}
          </Button>
        </div>
      </div>
    </div>
  );
}