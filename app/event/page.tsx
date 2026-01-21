"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Video,
  User,
  ExternalLink,
  ArrowLeft,
  Ticket,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// Import Service & Type
import { useGetEventsQuery } from "@/services/public/event.service";
import { useI18n } from "@/app/hooks/useI18n";

type FilterType = "all" | "online" | "offline";

export default function EventPage() {
  const { t, locale } = useI18n();
  const [filter, setFilter] = useState<FilterType>("all");

  // Fetch Events from API
  const {
    data: eventsData,
    isLoading,
    isError,
  } = useGetEventsQuery({
    page: 1,
    paginate: 20, // Fetch more items for client-side filtering if needed
  });

  // Helper Format Tanggal & Jam
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const localeMap: Record<string, string> = {
      id: "id-ID",
      en: "en-US",
      ar: "ar-SA",
      fr: "fr-FR",
      kr: "ko-KR",
      jp: "ja-JP",
    };
    const currentLocale = localeMap[locale] || "id-ID";
    return {
      day: date.toLocaleDateString(currentLocale, { day: "numeric" }),
      month: date.toLocaleDateString(currentLocale, { month: "short" }),
      fullDate: date.toLocaleDateString(currentLocale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      time: date.toLocaleTimeString(currentLocale, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  // Filter Logic
  const filteredEvents = useMemo(() => {
    if (!eventsData?.data) return [];

    return eventsData.data.filter((evt) => {
      if (filter === "all") return true;
      if (filter === "online") return evt.is_online === 1; // API returns 1 for true
      if (filter === "offline") return evt.is_online === 0; // API returns 0 for false
      return true;
    });
  }, [eventsData, filter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header Sticky */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-awqaf-border-light shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full -ml-2 hover:bg-accent-100 text-awqaf-primary"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                {t("event.title")}
              </h1>
              <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                {t("event.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: "all", label: t("event.all"), icon: Calendar },
            { id: "online", label: t("event.online"), icon: Video },
            { id: "offline", label: t("event.offline"), icon: MapPin },
          ].map((item) => (
            <Button
              key={item.id}
              size="sm"
              variant={filter === item.id ? "default" : "outline"}
              className={`rounded-full px-4 font-comfortaa text-xs h-9 gap-2 transition-all ${
                filter === item.id
                  ? "bg-awqaf-primary hover:bg-awqaf-primary/90"
                  : "bg-white border-awqaf-border-light text-gray-500 hover:bg-gray-50"
              }`}
              onClick={() => setFilter(item.id as FilterType)}
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </Button>
          ))}
        </div>

        {/* Event List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-awqaf-primary mb-2" />
              <p className="text-sm text-gray-500 font-comfortaa">
                {t("event.loading")}
              </p>
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-500 font-comfortaa text-sm">
              {t("event.failedToLoad")}
            </div>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((evt) => {
              const dateInfo = formatEventDate(evt.start_date);

              return (
                <Card
                  key={evt.id}
                  className="overflow-hidden border-awqaf-border-light hover:shadow-md transition-shadow duration-200 group flex flex-col"
                >
                  {/* Optional Image Banner if available from API */}
                  {evt.image && (
                    <div className="relative h-32 w-full bg-gray-100">
                      <Image
                        src={evt.image}
                        alt={evt.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex">
                    {/* Left Column: Date Badge */}
                    <div className="w-20 bg-accent-50 border-r border-gray-100 flex flex-col items-center justify-center p-2 text-center shrink-0">
                      <span className="text-sm font-bold text-awqaf-primary uppercase font-comfortaa">
                        {dateInfo.month}
                      </span>
                      <span className="text-3xl font-bold text-gray-800 font-comfortaa leading-none my-1">
                        {dateInfo.day}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {dateInfo.time}
                      </span>
                    </div>

                    {/* Right Column: Content */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        {/* Category & Status */}
                        <div className="flex justify-between items-start mb-2">
                          <Badge
                            variant="outline"
                            className="text-[10px] border-accent-200 text-awqaf-primary bg-accent-50/50"
                          >
                            Event {/* API doesn't provide category name yet */}
                          </Badge>
                          {evt.is_online === 1 ? (
                            <Badge className="text-[10px] bg-sky-100 text-sky-700 hover:bg-sky-200 border-0 px-1.5 h-5 gap-1">
                              <Video className="w-3 h-3" /> Online
                            </Badge>
                          ) : (
                            <Badge className="text-[10px] bg-orange-100 text-orange-700 hover:bg-orange-200 border-0 px-1.5 h-5 gap-1">
                              <MapPin className="w-3 h-3" /> Offline
                            </Badge>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-gray-800 text-base font-comfortaa leading-snug mb-2 group-hover:text-awqaf-primary transition-colors line-clamp-2">
                          {evt.title}
                        </h3>

                        {/* Organizer */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                          <User className="w-3.5 h-3.5" />
                          <span className="font-comfortaa truncate">
                            {evt.organizer}
                          </span>
                        </div>

                        {/* Location Text */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          {evt.is_online === 1 ? (
                            <Video className="w-3.5 h-3.5 text-sky-500" />
                          ) : (
                            <MapPin className="w-3.5 h-3.5 text-orange-500" />
                          )}
                          <span className="font-comfortaa line-clamp-1">
                            {evt.location}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      {evt.registration_link && (
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <Button
                            className="w-full h-8 text-xs font-comfortaa bg-white border border-awqaf-primary text-awqaf-primary hover:bg-awqaf-primary hover:text-white transition-all shadow-sm"
                            onClick={() =>
                              window.open(evt.registration_link, "_blank")
                            }
                          >
                            {t("event.registerNow")}{" "}
                            <ExternalLink className="w-3 h-3 ml-2" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            // Empty State
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-sm">
                <Ticket className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="font-bold text-gray-800 font-comfortaa">
                {t("event.noEvents")}
              </h3>
              <p className="text-sm text-gray-500 font-comfortaa">
                {t("event.noEventsInCategory")}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}