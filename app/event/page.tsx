"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Video,
  User,
  ExternalLink,
  ArrowLeft,
  Filter,
  Ticket,
} from "lucide-react";
import Link from "next/link";

// --- 1. TIPE DATA ---
interface EventItem {
  id: string;
  event_name: string;
  organizer: string;
  date_start: string; // ISO String
  location_name: string;
  is_online: boolean;
  link_registration: string;
  category?: "Kajian" | "Webinar" | "Workshop"; // Opsional untuk UI
}

// --- 2. DATA DUMMY ---
const EVENTS: EventItem[] = [
  {
    id: "EVT-001",
    event_name: "Kajian Akbar: Menjemput Rezeki Berkah",
    organizer: "Masjid Raya Al-Falah",
    date_start: "2025-02-10T09:00:00",
    location_name: "Aula Utama Masjid Raya Al-Falah, Jakarta",
    is_online: false,
    link_registration: "https://bit.ly/kajian-alfalah",
    category: "Kajian",
  },
  {
    id: "EVT-002",
    event_name: "Webinar Fiqih Muamalah Kontemporer",
    organizer: "Awqaf Academy",
    date_start: "2025-02-15T19:30:00",
    location_name: "Zoom Meeting",
    is_online: true,
    link_registration: "https://zoom.us/meeting/register",
    category: "Webinar",
  },
  {
    id: "EVT-003",
    event_name: "Workshop Desain Dakwah Visual",
    organizer: "Komunitas Pemuda Hijrah",
    date_start: "2025-02-20T13:00:00",
    location_name: "Co-working Space Tebet",
    is_online: false,
    link_registration: "https://ticket.com/workshop-dakwah",
    category: "Workshop",
  },
  {
    id: "EVT-004",
    event_name: "Bedah Buku: Sirah Nabawiyah",
    organizer: "Pustaka Ilmu",
    date_start: "2025-02-25T15:30:00",
    location_name: "Google Meet",
    is_online: true,
    link_registration: "https://meet.google.com/",
    category: "Webinar",
  },
];

type FilterType = "all" | "online" | "offline";

export default function EventPage() {
  const [filter, setFilter] = useState<FilterType>("all");

  // Helper Format Tanggal & Jam
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString("id-ID", { day: "numeric" }),
      month: date.toLocaleDateString("id-ID", { month: "short" }),
      fullDate: date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  // Filter Logic
  const filteredEvents = EVENTS.filter((evt) => {
    if (filter === "all") return true;
    if (filter === "online") return evt.is_online;
    if (filter === "offline") return !evt.is_online;
    return true;
  });

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
                Agenda & Kajian
              </h1>
              <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                Temukan majelis ilmu terdekat
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: "all", label: "Semua", icon: Calendar },
            { id: "online", label: "Online", icon: Video },
            { id: "offline", label: "Offline", icon: MapPin },
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
          {filteredEvents.length > 0 ? (
            filteredEvents.map((evt) => {
              const dateInfo = formatEventDate(evt.date_start);

              return (
                <Card
                  key={evt.id}
                  className="overflow-hidden border-awqaf-border-light hover:shadow-md transition-shadow duration-200 group"
                >
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
                            {evt.category || "Event"}
                          </Badge>
                          {evt.is_online ? (
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
                        <h3 className="font-bold text-gray-800 text-base font-comfortaa leading-snug mb-2 group-hover:text-awqaf-primary transition-colors">
                          {evt.event_name}
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
                          {evt.is_online ? (
                            <Video className="w-3.5 h-3.5 text-sky-500" />
                          ) : (
                            <MapPin className="w-3.5 h-3.5 text-orange-500" />
                          )}
                          <span className="font-comfortaa line-clamp-1">
                            {evt.location_name}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <Button
                          className="w-full h-8 text-xs font-comfortaa bg-white border border-awqaf-primary text-awqaf-primary hover:bg-awqaf-primary hover:text-white transition-all shadow-sm"
                          onClick={() =>
                            window.open(evt.link_registration, "_blank")
                          }
                        >
                          Daftar Sekarang{" "}
                          <ExternalLink className="w-3 h-3 ml-2" />
                        </Button>
                      </div>
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
                Tidak ada event
              </h3>
              <p className="text-sm text-gray-500 font-comfortaa">
                Belum ada jadwal untuk kategori ini.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}