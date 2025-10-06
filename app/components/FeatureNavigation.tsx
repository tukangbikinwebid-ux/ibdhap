"use client";

import { Button } from "@/components/ui/button";
import {
  Clock,
  Compass,
  BookOpen,
  GraduationCap,
  MessageCircle,
  ChevronRight,
  Target,
} from "lucide-react";
import Link from "next/link";

interface Feature {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  description: string;
}

const features: Feature[] = [
  {
    name: "Prayer Time",
    icon: Clock,
    href: "/sholat",
    description: "Waktu sholat",
  },
  {
    name: "Prayer Tracker",
    icon: Target,
    href: "/prayer-tracker",
    description: "Pantau sholat",
  },
  {
    name: "Kiblat",
    icon: Compass,
    href: "/kiblat",
    description: "Arah kiblat",
  },
  {
    name: "Al-Qur'an",
    icon: BookOpen,
    href: "/quran",
    description: "Baca & terjemahan",
  },
  {
    name: "Kajian",
    icon: GraduationCap,
    href: "/kajian",
    description: "Video kajian",
  },
  {
    name: "Tanya Ustadz",
    icon: MessageCircle,
    href: "/tanya-ustadz",
    description: "Konsultasi",
  },
];

export default function FeatureNavigation() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
          Fitur Utama
        </h2>
        <Link href="/features">
          <Button
            variant="ghost"
            size="sm"
            className="text-awqaf-foreground-secondary hover:text-awqaf-primary hover:bg-accent-100 font-comfortaa transition-colors duration-200"
          >
            Lihat Semua
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.name} href={feature.href}>
              <div className="flex flex-col items-center p-3 rounded-xl border border-awqaf-border-light bg-white hover:shadow-md hover:bg-accent-50 transition-all duration-200 active:scale-95 h-full">
                <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center mb-2 flex-shrink-0">
                  <Icon className="w-5 h-5 text-awqaf-primary" />
                </div>
                <h3 className="font-medium text-card-foreground text-[10px] font-comfortaa text-center leading-tight flex-1 flex items-center justify-center">
                  {feature.name}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
