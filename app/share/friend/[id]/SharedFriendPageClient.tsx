"use client";

import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/app/utils/currency";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Banknote,
  PiggyBank,
  CreditCard,
  Calendar,
  User,
  CalendarIcon,
} from "lucide-react";
import { Friend, Transaction, DebtSummary, ExtendedDebtSummary } from "@/app/types";
import { createExtendedDebtSummary } from "@/app/utils/debtCalculations";

export default function SharedFriendPageClient({ id }: { id: string }) {
  const [friend, setFriend] = useState<Friend | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [extendedSummary, setExtendedSummary] = useState<ExtendedDebtSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTransactions, setShowTransactions] = useState(false);

  useEffect(() => {
    let unsubscribeFriend: (() => void) | null = null;
    let unsubscribeTransactions: (() => void) | null = null;

    const setupRealtimeListeners = async () => {
      try {
        setIsLoading(true);
        
        // Set up real-time listener for friend data
        const friendDocRef = doc(db, "friends", id);
        unsubscribeFriend = onSnapshot(friendDocRef, (doc) => {
          if (!doc.exists()) {
            setError("Bu arkadaş bilgisi bulunamadı veya artık mevcut değil.");
            setIsLoading(false);
            return;
          }
          
          const friendData = { id: doc.id, ...doc.data() } as Friend;
          setFriend(friendData);
        });

        // Set up real-time listener for transactions
        const transactionsQuery = query(
          collection(db, "transactions"),
          where("friendId", "==", id),
          orderBy("date", "desc")
        );

        unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
          const transactionList: Transaction[] = [];
          
          snapshot.forEach((doc) => {
            transactionList.push({ id: doc.id, ...doc.data() } as Transaction);
          });

          setTransactions(transactionList);
          setIsLoading(false);
        });

      } catch (err) {
        console.error("Error setting up real-time listeners:", err);
        setError("Veriler yüklenirken bir hata oluştu.");
        setIsLoading(false);
      }
    };

    setupRealtimeListeners();

    // Cleanup function to unsubscribe from listeners
    return () => {
      if (unsubscribeFriend) unsubscribeFriend();
      if (unsubscribeTransactions) unsubscribeTransactions();
    };
  }, [id]);

  // Calculate extended summary whenever friend or transactions change
  useEffect(() => {
    if (friend && transactions.length >= 0) {
      const summary = createExtendedDebtSummary(friend, transactions);
      setExtendedSummary(summary);
    }
  }, [friend, transactions]);

  // Use the extended summary if available, otherwise create a default summary
  const summary: DebtSummary = extendedSummary || {
    friendId: id,
    friendName: friend?.name || "Bilinmeyen",
    balance: 0,
    totalBorrowed: 0,
    totalLent: 0,
    totalPayments: 0,
    transactions: [],
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <div className="text-destructive mb-2">Hata</div>
          <p className="text-muted-foreground">{error}</p>
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

        <div className="mt-4 flex items-center">
          <div className="bg-primary/10 p-2 rounded-full mr-3">
            <User className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{friend?.name}</h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div
                className={`rounded-lg p-4 ${
                  summary.balance > 0
                    ? "bg-emerald-50 border border-emerald-100"
                    : summary.balance < 0
                    ? "bg-rose-50 border border-rose-100"
                    : "bg-muted"
                }`}
              >
                <div className="text-sm text-muted-foreground mb-1">
                  Genel Durum
                </div>
                <div className="text-xl font-bold flex items-center">
                  {summary.balance > 0 ? (
                    <>
                      <ChevronUp className="text-emerald-500 mr-1 h-5 w-5" />
                      <span className="text-emerald-600">
                        {formatCurrency(summary.balance, true)} alacak
                      </span>
                    </>
                  ) : summary.balance < 0 ? (
                    <>
                      <ChevronDown className="text-rose-500 mr-1 h-5 w-5" />
                      <span className="text-rose-600">
                        {formatCurrency(Math.abs(summary.balance), true)} borç
                      </span>
                    </>
                  ) : (
                    "Borç yok"
                  )}
                </div>
              </div>

              <div className="rounded-lg p-4 bg-muted/30 border">
                <div className="text-sm text-muted-foreground mb-1">
                  Verilen Borç
                </div>
                <div className="text-xl font-bold flex items-center text-emerald-600">
                  <Banknote className="mr-1 h-5 w-5" />
                  {formatCurrency(summary.totalBorrowed, true)}
                </div>
              </div>

              <div className="rounded-lg p-4 bg-muted/30 border">
                <div className="text-sm text-muted-foreground mb-1">
                  Alınan Borç
                </div>
                <div className="text-xl font-bold flex items-center text-destructive">
                  <PiggyBank className="mr-1 h-5 w-5" />
                  {formatCurrency(summary.totalLent, true)}
                </div>
              </div>
            </div>

            {/* Show outstanding debts with partial payment info if extended summary is available */}
            {extendedSummary && extendedSummary.outstandingDebts.filter(d => !d.isFullyPaid).length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">Bekleyen Borçlar</h3>
                {extendedSummary.outstandingDebts
                  .filter(d => !d.isFullyPaid)
                  .map((debt) => (
                    <div
                      key={debt.id}
                      className="rounded-lg p-3 bg-amber-50 border border-amber-100"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {debt.originalTransaction.description || 
                              (debt.originalTransaction.type === "borrowed" ? "Borç Verme" : "Borç Alma")}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatDate(debt.createdDate)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Toplam:</span>{" "}
                            <span className="font-medium">{formatCurrency(debt.originalAmount, true)}</span>
                          </div>
                          {debt.partialPayments.length > 0 && (
                            <div className="text-sm text-emerald-600">
                              <span className="text-muted-foreground">Ödenen:</span>{" "}
                              <span className="font-medium">
                                {formatCurrency(debt.originalAmount - debt.remainingBalance, true)}
                              </span>
                            </div>
                          )}
                          <div className="text-sm text-rose-600">
                            <span className="text-muted-foreground">Kalan:</span>{" "}
                            <span className="font-bold">{formatCurrency(debt.remainingBalance, true)}</span>
                          </div>
                        </div>
                      </div>
                      {debt.partialPayments.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-amber-200">
                          <div className="text-xs text-muted-foreground">
                            {debt.partialPayments.length} kısmi ödeme yapıldı
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTransactions(!showTransactions)}
              className="w-full mt-6 flex items-center justify-center"
            >
              {showTransactions ? "İşlemleri Gizle" : "İşlemleri Göster"}
              {showTransactions ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-2 h-4 w-4" />
              )}
            </Button>

            {showTransactions && (
              <div className="mt-6 space-y-4">
                <h3 className="font-medium flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-primary" />
                  İşlem Geçmişi ({transactions.length})
                </h3>

                {transactions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Henüz işlem bulunmuyor.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className={`rounded-lg p-4 border ${
                          transaction.type === "borrowed"
                            ? "bg-emerald-50 border-emerald-100"
                            : transaction.type === "lent"
                            ? "bg-rose-50 border-rose-100"
                            : transaction.type === "partial-payment"
                            ? "bg-amber-50 border-amber-100"
                            : "bg-primary/10 border-primary/20"
                        }`}
                      >
                        <div className="flex justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <CalendarIcon className="mr-1 h-3 w-3" />
                              {formatDate(transaction.date)}
                            </div>

                            <div className="text-lg font-medium">
                              {transaction.description ||
                                (transaction.type === "borrowed"
                                  ? "Borç Verme"
                                  : transaction.type === "lent"
                                  ? "Borç Alma"
                                  : "Ödeme")}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs">
                              {transaction.type === "borrowed" && (
                                <span className="text-emerald-600 flex items-center">
                                  <Banknote className="mr-1 h-3 w-3" />
                                  Borç Verme
                                </span>
                              )}
                              {transaction.type === "lent" && (
                                <span className="text-rose-600 flex items-center">
                                  <PiggyBank className="mr-1 h-3 w-3" />
                                  Borç Alma
                                </span>
                              )}
                              {transaction.type === "payment" && (
                                <span className="text-slate-600 flex items-center">
                                  <CreditCard className="mr-1 h-3 w-3" />
                                  Ödeme
                                </span>
                              )}
                              {transaction.type === "partial-payment" && (
                                <span className="text-amber-600 flex items-center">
                                  <CreditCard className="mr-1 h-3 w-3" />
                                  Kısmi Ödeme
                                </span>
                              )}
                            </div>

                            <div className="mt-1 font-bold text-lg">
                              {transaction.type === "borrowed" && (
                                <span className="text-emerald-600">
                                  +{formatCurrency(transaction.amount, true)}
                                </span>
                              )}
                              {transaction.type === "lent" && (
                                <span className="text-destructive">
                                  -{formatCurrency(transaction.amount, true)}
                                </span>
                              )}
                              {transaction.type === "payment" && (
                                <span className="text-primary">
                                  {formatCurrency(transaction.amount, true)}
                                </span>
                              )}
                              {transaction.type === "partial-payment" && (
                                <span className="text-amber-600">
                                  -{formatCurrency(transaction.amount, true)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
