"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendPasswordResetEmail } from "firebase/auth";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import LoadingSpinner from "../components/LoadingSpinner";
import { auth } from "../lib/firebase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    let isValid = true;
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Email gereklidir");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Geçerli bir email adresi giriniz");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await sendPasswordResetEmail(auth, email);
      setIsSubmitted(true);
      toast.success("Şifre sıfırlama bağlantısı gönderildi");
    } catch (error: any) {
      console.error("Error sending password reset email:", error);
      if (error.code === "auth/user-not-found") {
        toast.error("Bu email adresiyle kayıtlı bir kullanıcı bulunamadı");
      } else {
        toast.error("Şifre sıfırlama başarısız oldu. Lütfen tekrar deneyin.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-background to-gray-50 container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4 py-10"
      >
        <Card className="shadow-lg border-primary-100 py-0">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-50">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-semibold text-primary mb-2">
                Şifremi Unuttum
              </h1>
              <p className="text-gray-500 text-sm mb-2">
                Şifrenizi sıfırlamak için email adresinizi girin
              </p>
              <div className="w-16 h-1 bg-primary-100 rounded-full"></div>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={emailError ? "border-red-500" : ""}
                  />
                  {emailError && (
                    <p className="text-red-500 text-xs mt-1">{emailError}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full py-5"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <LoadingSpinner className="w-5 h-5" showText={false} />
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      <span>Şifre Sıfırlama Bağlantısı Gönder</span>
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="bg-green-50 p-4 rounded-md border border-green-100 mb-6">
                <p className="text-green-700 text-sm">
                  Şifre sıfırlama bağlantısı <strong>{email}</strong> adresine
                  gönderildi. Lütfen email kutunuzu kontrol edin ve şifrenizi
                  sıfırlamak için bağlantıya tıklayın.
                </p>
              </div>
            )}

            <div className="text-center">
              <Link
                href="/signin"
                className="flex items-center justify-center text-sm text-primary font-medium hover:underline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Giriş sayfasına dön
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <Toaster />
    </div>
  );
}
