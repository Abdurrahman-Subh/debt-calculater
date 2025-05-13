"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "../components/LoadingSpinner";
import { CreditCard, LogIn } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function SignIn() {
  const { user, loading, signInWithGoogle } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const router = useRouter();

  // Redirect if already signed in
  useEffect(() => {
    if (user && !loading) {
      router.push("/home");
    }
  }, [user, loading, router]);

  const handleSignIn = async () => {
    try {
      setSigningIn(true);
      await signInWithGoogle();
      toast.success("Başarıyla giriş yapıldı");
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Giriş başarısız oldu. Lütfen tekrar deneyin.");
    } finally {
      setSigningIn(false);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <Card className="shadow-lg border-primary-100">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 mb-4">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-semibold text-primary mb-2">
                BorçTakip
              </h1>
              <p className="text-gray-500 text-sm mb-2">
                Arkadaşlarınızla borç takibi yapmanın en kolay yolu
              </p>
              <div className="w-16 h-1 bg-primary-100 rounded-full"></div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Button
                onClick={handleSignIn}
                className="w-full flex items-center justify-center gap-2 mb-4 py-6"
                disabled={signingIn}
              >
                {signingIn ? (
                  <LoadingSpinner className="w-5 h-5" />
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
                    <span>Google ile Giriş Yap</span>
                  </>
                )}
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          &copy; {new Date().getFullYear()} BorçTakip - Tüm hakları saklıdır
        </p>
      </motion.div>
      <Toaster />
    </div>
  );
}
