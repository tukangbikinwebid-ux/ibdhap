"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
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
import { LogIn, Lock, Mail, ArrowRight, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Menggunakan signIn dari next-auth yang memicu authorize di [...nextauth]
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error("Email atau password salah");
      }

      if (result?.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil Masuk",
          text: "Selamat datang kembali!",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push("/store"); // Redirect ke /store atau dashboard
      }
    } catch (err: unknown) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Gagal Masuk",
        text: "Periksa kembali email dan password Anda.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-awqaf-border-light shadow-lg">
        <CardHeader className="pb-2 text-center">
          <div className="w-12 h-12 bg-awqaf-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-6 h-6 text-awqaf-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-awqaf-primary font-comfortaa">
            Selamat Datang Kembali
          </CardTitle>
          <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
            Masuk untuk mengakses akun Anda
          </p>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <form onSubmit={handleLogin} className="space-y-4">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium font-comfortaa text-gray-700"
                >
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-awqaf-primary hover:underline font-comfortaa"
                >
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 font-comfortaa focus-visible:ring-awqaf-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-awqaf-primary hover:bg-awqaf-primary/90 font-comfortaa mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Masuk"}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center pt-2 pb-6 border-t border-gray-50 mt-2">
          <p className="text-xs text-gray-500 font-comfortaa mb-3 mt-4">
            Belum punya akun?
          </p>
          <Link href="/auth/register" className="w-full">
            <Button
              variant="outline"
              className="w-full border-awqaf-primary text-awqaf-primary hover:bg-accent-50 font-comfortaa"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Daftar Sekarang
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}