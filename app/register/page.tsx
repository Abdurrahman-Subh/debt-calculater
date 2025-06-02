"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "../components/LoadingSpinner";
import { CreditCard, Mail, User } from "lucide-react";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import Image from "next/image";

export default function Register() {
  const { user, loading, signInWithGoogle, signUpWithEmail } = useAuth();
  const [registering, setRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  // Redirect if already signed in
  useEffect(() => {
    if (user && !loading) {
      router.push("/home");
    }
  }, [user, loading, router]);

  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!name.trim()) {
      errors.name = "Ad Soyad gereklidir";
      isValid = false;
    }

    if (!email.trim()) {
      errors.email = "Email gereklidir";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Geçerli bir email adresi giriniz";
      isValid = false;
    }

    if (!password) {
      errors.password = "Şifre gereklidir";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Şifre en az 6 karakter olmalıdır";
      isValid = false;
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Şifre onayı gereklidir";
      isValid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Şifreler eşleşmiyor";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setRegistering(true);
      await signUpWithEmail(email, password, name);
      toast.success("Hesabınız başarıyla oluşturuldu");
    } catch (error: any) {
      console.error("Error signing up:", error);
      if (error.code === "auth/email-already-in-use") {
        toast.error("Bu email adresi zaten kullanımda");
      } else {
        toast.error("Kayıt başarısız oldu. Lütfen tekrar deneyin.");
      }
    } finally {
      setRegistering(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setRegistering(true);
      await signInWithGoogle();
      toast.success("Google hesabınızla başarıyla kayıt oldunuz");
    } catch (error) {
      console.error("Error signing up with Google:", error);
      toast.error("Kayıt başarısız oldu. Lütfen tekrar deneyin.");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-background to-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4 py-10"
      >
        <Card className="shadow-lg border-primary-100 py-0">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="flex items-center">
                <Image
                  src="/muhasebeji6.png"
                  alt="Muhasebeji"
                  width={150}
                  height={150}
                  className="mr-3"
                />
              </div>
              <h1 className="text-2xl font-semibold text-primary">
                Hesap Oluştur
              </h1>
              <div className="w-16 h-1 bg-primary-100 rounded-full"></div>
            </div>

            <form onSubmit={handleRegister} className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ad Soyad"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={formErrors.email ? "border-red-500" : ""}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={formErrors.password ? "border-red-500" : ""}
                />
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={formErrors.confirmPassword ? "border-red-500" : ""}
                />
                {formErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full py-5"
                disabled={registering}
              >
                {registering ? (
                  <LoadingSpinner className="w-5 h-5" showText={false} />
                ) : (
                  <>
                    <User className="mr-2 h-4 w-4" />
                    <span>Hesap Oluştur</span>
                  </>
                )}
              </Button>
            </form>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-card text-muted-foreground">veya</span>
              </div>
            </div>

            <Button
              onClick={handleGoogleSignUp}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 mb-6 py-5"
              disabled={registering}
            >
              {registering ? (
                <LoadingSpinner className="w-5 h-5" showText={false} />
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Google ile Kaydol</span>
                </>
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Zaten bir hesabınız var mı?{" "}
                <Link
                  href="/signin"
                  className="text-primary font-medium hover:underline"
                >
                  Giriş Yap
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <Toaster />
    </div>
  );
}
