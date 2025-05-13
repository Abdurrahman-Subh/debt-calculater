"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Check,
  CreditCard,
  DollarSign,
  PiggyBank,
  Share,
  User,
} from "lucide-react";

export default function JoinPage() {
  return (
    <div className="max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          BorçTakip'e Hoş Geldiniz
        </h1>
        <p className="text-muted-foreground mb-6">
          Bir arkadaşınız sizinle borç bilgisi paylaştı. Siz de kolayca borç
          takibi yapmak ister misiniz?
        </p>

        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="p-3 rounded-full bg-primary/10"
          >
            <Share className="h-10 w-10 text-primary" />
          </motion.div>
        </div>
      </motion.div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            BorçTakip ile Neler Yapabilirsiniz?
          </h2>
          <ul className="space-y-3">
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-start"
            >
              <div className="bg-success-50 p-1.5 rounded-full mr-3 mt-0.5">
                <DollarSign className="h-4 w-4 text-success-600" />
              </div>
              <div>
                <span className="font-medium">Borç Verme</span>
                <p className="text-sm text-muted-foreground">
                  Arkadaşlarınıza verdiğiniz borçları takip edin
                </p>
              </div>
            </motion.li>

            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start"
            >
              <div className="bg-destructive/10 p-1.5 rounded-full mr-3 mt-0.5">
                <PiggyBank className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <span className="font-medium">Borç Alma</span>
                <p className="text-sm text-muted-foreground">
                  Aldığınız borçları unutmadan kaydedin
                </p>
              </div>
            </motion.li>

            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-start"
            >
              <div className="bg-primary/10 p-1.5 rounded-full mr-3 mt-0.5">
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
              <div>
                <span className="font-medium">Ödemeleri Kaydedin</span>
                <p className="text-sm text-muted-foreground">
                  Yapılan ödemeleri sisteme girin ve bakiyeleri otomatik
                  güncelleyin
                </p>
              </div>
            </motion.li>

            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-start"
            >
              <div className="bg-muted p-1.5 rounded-full mr-3 mt-0.5">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <span className="font-medium">Arkadaşlarla Paylaşın</span>
                <p className="text-sm text-muted-foreground">
                  Borç durumunu ve işlemleri arkadaşlarınızla paylaşın
                </p>
              </div>
            </motion.li>
          </ul>
        </CardContent>
      </Card>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center gap-3"
      >
        <Button asChild className="w-full">
          <Link href="/register">Ücretsiz Hesap Oluştur</Link>
        </Button>

        <p className="text-sm text-muted-foreground">
          Zaten hesabınız var mı?{" "}
          <Link href="/signin" className="text-primary hover:underline">
            Giriş Yapın
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
