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
  DollarSign,
  PiggyBank,
  CreditCard,
  Calendar,
  User,
  CalendarIcon,
} from "lucide-react";
import { Friend, Transaction, DebtSummary } from "@/app/types";

export default function SharedFriendPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const [friend, setFriend] = useState<Friend | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTransactions, setShowTransactions] = useState(false);

  useEffect(() => {
    const fetchFriendAndTransactions = async () => {
      try {
        setIsLoading(true);
        // Fetch friend data
        const friendDoc = await getDoc(doc(db, "friends", id));

        if (!friendDoc.exists()) {
          setError("Bu arkadaş bilgisi bulunamadı veya artık mevcut değil.");
          setIsLoading(false);
          return;
        }

        const friendData = { id: friendDoc.id, ...friendDoc.data() } as Friend;
        setFriend(friendData);

        // Fetch related transactions
        const transactionsQuery = query(
          collection(db, "transactions"),
          where("friendId", "==", id),
          orderBy("date", "desc")
        );

        const transactionSnapshot = await getDocs(transactionsQuery);
        const transactionList: Transaction[] = [];

        transactionSnapshot.forEach((doc) => {
          transactionList.push({ id: doc.id, ...doc.data() } as Transaction);
        });

        setTransactions(transactionList);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Veriler yüklenirken bir hata oluştu.");
        setIsLoading(false);
      }
    };

    fetchFriendAndTransactions();
  }, [id]);

  // Calculate summary information
  const calculateSummary = (): DebtSummary => {
    if (!friend || transactions.length === 0) {
      return {
        friendId: id,
        friendName: friend?.name || "Bilinmeyen",
        balance: 0,
        totalBorrowed: 0,
        totalLent: 0,
        totalPayments: 0,
        transactions: [],
      };
    }

    let totalBorrowed = 0;
    let totalLent = 0;
    let totalPayments = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "borrowed") {
        totalBorrowed += transaction.amount;
      } else if (transaction.type === "lent") {
        totalLent += transaction.amount;
      } else if (transaction.type === "payment") {
        totalPayments += transaction.amount;
      }
    });

    // Calculate balance (positive means friend owes user, negative means user owes friend)
    const balance = totalBorrowed - totalLent;

    return {
      friendId: id,
      friendName: friend.name,
      balance,
      totalBorrowed,
      totalLent,
      totalPayments,
      transactions,
    };
  };

  const summary = calculateSummary();

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
                    ? "bg-success-50 border border-success-100"
                    : summary.balance < 0
                    ? "bg-destructive/10 border border-destructive/20"
                    : "bg-muted"
                }`}
              >
                <div className="text-sm text-muted-foreground mb-1">
                  Genel Durum
                </div>
                <div className="text-xl font-bold flex items-center">
                  {summary.balance > 0 ? (
                    <>
                      <ChevronUp className="text-success-500 mr-1 h-5 w-5" />
                      <span className="text-success-600">
                        {formatCurrency(summary.balance, true)} alacak
                      </span>
                    </>
                  ) : summary.balance < 0 ? (
                    <>
                      <ChevronDown className="text-destructive mr-1 h-5 w-5" />
                      <span className="text-destructive">
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
                <div className="text-xl font-bold flex items-center text-success-600">
                  <DollarSign className="mr-1 h-5 w-5" />
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
                            ? "bg-success-50 border-success-100"
                            : transaction.type === "lent"
                            ? "bg-destructive/10 border-destructive/20"
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
                                <span className="text-success-600 flex items-center">
                                  <DollarSign className="mr-1 h-3 w-3" />
                                  Borç Verme
                                </span>
                              )}
                              {transaction.type === "lent" && (
                                <span className="text-destructive flex items-center">
                                  <PiggyBank className="mr-1 h-3 w-3" />
                                  Borç Alma
                                </span>
                              )}
                              {transaction.type === "payment" && (
                                <span className="text-primary flex items-center">
                                  <CreditCard className="mr-1 h-3 w-3" />
                                  Ödeme
                                </span>
                              )}
                            </div>

                            <div className="mt-1 font-bold text-lg">
                              {transaction.type === "borrowed" && (
                                <span className="text-success-600">
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
