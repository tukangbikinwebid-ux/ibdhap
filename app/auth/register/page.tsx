"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Mail, ArrowRight, ArrowLeft, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/services/auth.service"; // Pastikan path benar
import Swal from "sweetalert2";
import { ApiError } from "@/lib/error-types";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "", // Menambahkan phone sesuai body request
    password: "",
    password_confirmation: "", // Sesuai body request
  });

  const [register, { isLoading }] = useRegisterMutation();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      Swal.fire({
        icon: "error",
        title: "Validasi Gagal",
        text: "Konfirmasi password tidak cocok!",
      });
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      }).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Pendaftaran Berhasil",
        text: "Silakan cek email Anda untuk verifikasi, lalu login.",
      });

      router.push("/auth/login");
    } catch (err: unknown) {
      // Gunakan type assertion ke interface ApiError
      const error = err as ApiError;
      const errorMsg =
        error?.data?.message || "Terjadi kesalahan saat mendaftar.";

      Swal.fire({
        icon: "error",
        title: "Pendaftaran Gagal",
        text: errorMsg,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-awqaf-border-light shadow-lg">
        <CardHeader className="pb-2 text-center">
          <div className="w-12 h-12 bg-awqaf-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-awqaf-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-awqaf-primary font-comfortaa">
            Buat Akun Baru
          </CardTitle>
          <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
            Mulai perjalanan ibadah digital Anda
          </p>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium font-comfortaa text-gray-700"
              >
                Nama Lengkap
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Nama Anda"
                  className="pl-10 font-comfortaa focus-visible:ring-awqaf-primary"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium font-comfortaa text-gray-700"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  className="pl-10 font-comfortaa focus-visible:ring-awqaf-primary"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium font-comfortaa text-gray-700"
              >
                Nomor Telepon
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  className="pl-10 font-comfortaa focus-visible:ring-awqaf-primary"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium font-comfortaa text-gray-700"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 8 karakter"
                  className="pl-10 font-comfortaa focus-visible:ring-awqaf-primary"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password_confirmation"
                className="text-sm font-medium font-comfortaa text-gray-700"
              >
                Konfirmasi Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password_confirmation"
                  type="password"
                  placeholder="Ulangi password"
                  className="pl-10 font-comfortaa focus-visible:ring-awqaf-primary"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-awqaf-primary hover:bg-awqaf-primary/90 font-comfortaa mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Mendaftar..." : "Daftar Akun"}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center pt-2 pb-6 border-t border-gray-50 mt-2">
          <div className="flex items-center gap-1 text-xs text-gray-500 font-comfortaa mt-4">
            Sudah punya akun?
            <Link
              href="/auth/login"
              className="text-awqaf-primary font-bold hover:underline"
            >
              Masuk di sini
            </Link>
          </div>

          <Link
            href="/"
            className="mt-6 text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Kembali ke Beranda
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}