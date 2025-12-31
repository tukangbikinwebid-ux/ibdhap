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
import { Mail, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";
import Link from "next/link";
import { useResetPasswordMutation } from "@/services/auth.service";
import Swal from "sweetalert2";
// Pastikan file ini ada atau sesuaikan path import-nya
import { ApiError } from "@/lib/error-types";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Perbaikan: Menghapus 'as any'
      // Pastikan service 'useResetPasswordMutation' menerima payload { email: string }
      await resetPassword({ email }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Terkirim",
        text: "Link reset password telah dikirim ke email Anda.",
      });
    } catch (err: unknown) {
      // Type assertion yang lebih aman daripada 'any'
      const error = err as ApiError;
      const errorMsg =
        error?.data?.message || "Terjadi kesalahan saat mengirim permintaan.";

      Swal.fire({
        icon: "error",
        title: "Gagal Mengirim",
        text: errorMsg,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-awqaf-border-light shadow-lg">
        <CardHeader className="pb-2 text-center">
          <div className="w-12 h-12 bg-awqaf-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-6 h-6 text-awqaf-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-awqaf-primary font-comfortaa">
            Reset Password
          </CardTitle>
          <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
            Masukkan email untuk mereset password
          </p>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium font-comfortaa text-gray-700"
              >
                Email Terdaftar
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  className="pl-10 font-comfortaa focus-visible:ring-awqaf-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-awqaf-primary hover:bg-awqaf-primary/90 font-comfortaa mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Mengirim..." : "Kirim Link Reset"}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center pt-2 pb-6 border-t border-gray-50 mt-2">
          <Link
            href="/auth/login"
            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Kembali ke Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}