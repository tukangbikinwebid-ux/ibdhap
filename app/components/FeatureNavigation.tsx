"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Compass,
  BookOpen,
  GraduationCap,
  MessageCircle,
  ChevronRight,
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

      <div className="grid grid-cols-2 gap-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.name} href={feature.href}>
              <Card className="border-awqaf-border-light hover:shadow-md transition-all duration-200 active:scale-95">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-awqaf-primary" />
                  </div>
                  <h3 className="font-semibold text-card-foreground text-sm font-comfortaa mb-1">
                    {feature.name}
                  </h3>
                  <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
