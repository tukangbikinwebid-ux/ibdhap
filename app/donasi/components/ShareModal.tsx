"use client";

import { X, MessageCircle, Instagram, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation: {
    title: string;
    image: string;
    description: string;
    id: string;
  };
}

export default function ShareModal({
  isOpen,
  onClose,
  donation,
}: ShareModalProps) {
  if (!isOpen) return null;

  const shareText = `Mari bantu ${donation.title}! Setiap donasi Anda sangat berarti untuk membantu sesama. Yuk, ikut berdonasi sekarang! 🕌💚`;
  const shareUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/donasi/${donation.id}`
    : "";

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
    window.open(url, "_blank");
  };

  const shareToInstagram = () => {
    // Instagram tidak support direct share via URL, jadi kita copy link
    navigator.clipboard.writeText(shareUrl);
    alert("Link telah disalin! Silakan paste di Instagram Stories atau Post Anda.");
  };

  const shareToTikTok = () => {
    // TikTok juga tidak support direct share, jadi copy link
    navigator.clipboard.writeText(shareUrl);
    alert("Link telah disalin! Silakan paste di TikTok Anda.");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link telah disalin!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-md border-awqaf-border-light shadow-2xl">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-awqaf-primary font-comfortaa">
              Bagikan Donasi
            </h3>
            <button
              onClick={onClose}
              className="hover:bg-accent-50 p-1 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-awqaf-foreground-secondary" />
            </button>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <Button
              onClick={shareToWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white font-comfortaa justify-start"
            >
              <MessageCircle className="w-5 h-5 mr-3" />
              Bagikan ke WhatsApp
            </Button>

            <Button
              onClick={shareToInstagram}
              variant="outline"
              className="w-full border-awqaf-border-light font-comfortaa justify-start"
            >
              <Instagram className="w-5 h-5 mr-3 text-[#E4405F]" />
              Bagikan ke Instagram
            </Button>

            <Button
              onClick={shareToTikTok}
              variant="outline"
              className="w-full border-awqaf-border-light font-comfortaa justify-start"
            >
              <Music className="w-5 h-5 mr-3 text-black" />
              Bagikan ke TikTok
            </Button>

            <Button
              onClick={copyLink}
              variant="outline"
              className="w-full border-awqaf-border-light font-comfortaa"
            >
              Salin Link
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
