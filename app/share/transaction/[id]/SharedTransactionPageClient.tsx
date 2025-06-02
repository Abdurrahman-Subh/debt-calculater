"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/app/utils/currency";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Banknote,
  PiggyBank,
  CreditCard,
  CalendarIcon,
  User,
} from "lucide-react";
import { Transaction, Friend } from "@/app/types";

export default function SharedTransactionPageClient({ id }: { id: string }) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [friend, setFriend] = useState<Friend | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactionAndFriend = async () => {
      try {
        setIsLoading(true);
        // Fetch transaction data
        const transactionDoc = await getDoc(doc(db, "transactions", id));

        if (!transactionDoc.exists()) {
          setError("Bu işlem bilgisi bulunamadı veya artık mevcut değil.");
          setIsLoading(false);
          return;
        }

        const transactionData = {
          id: transactionDoc.id,
          ...transactionDoc.data(),
        } as Transaction;
        setTransaction(transactionData);

        // Fetch friend data if we have a friendId
        if (transactionData.friendId) {
          const friendDoc = await getDoc(
            doc(db, "friends", transactionData.friendId)
          );
          if (friendDoc.exists()) {
            setFriend({ id: friendDoc.id, ...friendDoc.data() } as Friend);
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Veriler yüklenirken bir hata oluştu.");
        setIsLoading(false);
      }
    };

    fetchTransactionAndFriend();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionTypeLabel = (type: Transaction["type"]) => {
    switch (type) {
      case "borrowed":
        return "Borç Verme";
      case "lent":
        return "Borç Alma";
      case "payment":
        return "Ödeme";
      default:
        return "";
    }
  };

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "borrowed":
        return <Banknote className="h-5 w-5 text-emerald-600" />;
      case "lent":
        return <PiggyBank className="h-5 w-5 text-rose-600" />;
      case "payment":
        return <CreditCard className="h-5 w-5 text-slate-600" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <div className="text-destructive mb-2">Hata</div>
          <p className="text-muted-foreground">
            {error || "İşlem bilgisi yüklenemedi."}
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/">Ana Sayfaya Dön</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Ana Sayfaya Dön
          </Link>
        </Button>

        <div className="mt-4">
          <h1 className="text-2xl font-bold flex items-center">
            {getTransactionIcon(transaction.type)}
            <span className="ml-2">
              {getTransactionTypeLabel(transaction.type)} İşlemi
            </span>
          </h1>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div
            className={`p-6 ${
              transaction.type === "borrowed"
                ? "bg-emerald-50"
                : transaction.type === "lent"
                ? "bg-rose-50"
                : "bg-slate-50"
            }`}
          >
            <div className="text-3xl font-bold mb-2">
              {transaction.type === "borrowed" && (
                <span className="text-emerald-600">
                  +{formatCurrency(transaction.amount, true)}
                </span>
              )}
              {transaction.type === "lent" && (
                <span className="text-rose-600">
                  -{formatCurrency(transaction.amount, true)}
                </span>
              )}
              {transaction.type === "payment" && (
                <span className="text-slate-600">
                  {formatCurrency(transaction.amount, true)}
                </span>
              )}
            </div>

            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
              {formatDate(transaction.date)}
            </div>

            {friend && (
              <div className="flex items-center mb-4 p-3 bg-background rounded-lg border">
                <div className="bg-primary/10 p-1.5 rounded-full mr-2">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Arkadaş</div>
                  <div className="font-medium">{friend.name}</div>
                </div>
              </div>
            )}

            {transaction.description && (
              <div className="mt-4">
                <div className="text-sm text-muted-foreground mb-1">
                  Açıklama
                </div>
                <div className="p-3 bg-background rounded-lg border">
                  {transaction.description}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t">
            <div className="text-sm text-muted-foreground mb-2">
              İşlem Bilgileri
            </div>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-dashed">
                <span className="text-muted-foreground">İşlem Türü</span>
                <span className="font-medium">
                  {getTransactionTypeLabel(transaction.type)}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-dashed">
                <span className="text-muted-foreground">Miktar</span>
                <span className="font-medium">
                  {formatCurrency(transaction.amount, true)}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-dashed">
                <span className="text-muted-foreground">Tarih</span>
                <span className="font-medium">
                  {formatDate(transaction.date)}
                </span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">İşlem ID</span>
                <span className="font-medium text-xs text-muted-foreground">
                  {transaction.id}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {friend && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/share/friend/${friend.id}`}
              className="inline-flex items-center"
            >
              <User className="mr-2 h-4 w-4" />
              {friend.name} ile ilgili tüm işlemleri görüntüle
            </Link>
          </Button>
        </div>
      )}
    </motion.div>
  );
}
