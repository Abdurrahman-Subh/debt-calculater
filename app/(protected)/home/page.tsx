"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  X,
  Wallet,
  ArrowRight,
  Receipt,
  UserPlus,
  CreditCard,
  ListIcon,
  BarChart2,
  PenLine,
} from "lucide-react";
import FriendCard from "@/app/components/FriendCard";
import FriendForm from "@/app/components/FriendForm";
import TransactionForm from "@/app/components/TransactionForm";
import FirestoreIndexError from "@/app/components/FirestoreIndexError";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { useDebtStore } from "@/app/store/store";
import { getTotalDebt } from "@/app/utils/statistics";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { cn } from "@/lib/utils";

// Helper function to format currency
const formatCurrency = (value: number) => {
  return `${Math.abs(value).toFixed(0)} TL`;
};

export default function Home() {
  const {
    friends,
    transactions,
    isLoading,
    error,
    fetchFriends,
    fetchTransactions,
    addFriend,
    addTransaction,
    deleteFriend,
    getDebtSummaries,
  } = useDebtStore();

  const [activeForm, setActiveForm] = useState<"friend" | "transaction" | null>(
    null
  );

  // Initial data fetching
  useEffect(() => {
    fetchFriends();
    fetchTransactions();
  }, [fetchFriends, fetchTransactions]);

  const debtSummaries = getDebtSummaries();
  const totalDebt = getTotalDebt(debtSummaries);

  const toggleForm = (formType: "friend" | "transaction") => {
    if (activeForm === formType) {
      setActiveForm(null);
    } else {
      setActiveForm(formType);
    }
  };

  if (isLoading && friends.length === 0) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && friends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <h2 className="text-xl font-semibold text-danger-600 mb-4">
          Bir hata oluştu
        </h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button
          onClick={() => {
            fetchFriends();
            fetchTransactions();
          }}
        >
          Yeniden Dene
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}

      {/* FirestoreIndexError */}
      <FirestoreIndexError />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">Borç Takip</h2>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8"
              onClick={() =>
                activeForm === "transaction"
                  ? setActiveForm(null)
                  : setActiveForm("transaction")
              }
            >
              <Receipt className="w-3.5 h-3.5 mr-1" />
              İşlem Ekle
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Arkadaşlarınızla aranızdaki borç durumunu kolayca takip edin
          </p>

          <AnimatePresence>
            {activeForm === "transaction" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mb-6"
              >
                <Card className="border shadow-sm overflow-hidden">
                  <CardContent className="p-5">
                    <TransactionForm
                      friends={friends}
                      onAddTransaction={(transaction: any) => {
                        return addTransaction(transaction).then(
                          (newTransaction: any) => {
                            setActiveForm(null);
                            toast.success("İşlem başarıyla kaydedildi");
                            return newTransaction;
                          }
                        );
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeForm === "friend" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mb-6"
              >
                <Card className="border shadow-sm overflow-hidden">
                  <CardContent className="p-5">
                    <FriendForm
                      onAddFriend={(friend: any) => {
                        return addFriend(friend).then((newFriend: any) => {
                          setActiveForm(null);
                          toast.success("Arkadaş başarıyla eklendi");
                          return newFriend;
                        });
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4">
            <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Borç Durumu
            </h2>

            {debtSummaries.length === 0 ? (
              <Card className="bg-gradient-to-r from-gray-50 to-transparent p-6 text-center">
                <p className="text-muted-foreground mb-3">
                  Henüz arkadaş eklenmemiş.
                </p>
                <Button
                  onClick={() => toggleForm("friend")}
                  size="sm"
                  variant="outline"
                  className="mx-auto"
                >
                  <UserPlus className="mr-1 h-3.5 w-3.5" />
                  Arkadaş Ekle
                </Button>
              </Card>
            ) : (
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                {debtSummaries.map((summary: any) => (
                  <FriendCard
                    key={summary.friendId}
                    debtSummary={summary}
                    onDelete={deleteFriend}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="mb-4">
            <CardContent className="p-4">
              <h2 className="text-base font-medium flex items-center mb-3">
                <Wallet className="mr-2 h-4 w-4 text-primary" />
                Genel Bakış
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white shadow-sm rounded-md p-3 border">
                  <p className="text-xs text-muted-foreground mb-1">
                    Toplam Alacak
                  </p>
                  <p className="text-lg font-bold text-success-600">
                    {formatCurrency(totalDebt.totalOwed)}
                  </p>
                </div>

                <div className="bg-white shadow-sm rounded-md p-3 border">
                  <p className="text-xs text-muted-foreground mb-1">
                    Toplam Borç
                  </p>
                  <p className="text-lg font-bold text-danger-600">
                    {formatCurrency(totalDebt.totalOwing)}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3 text-xs"
                asChild
              >
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center"
                >
                  Detaylı İstatistikler
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Button
            onClick={() => toggleForm("friend")}
            size="sm"
            variant="outline"
            className="w-full h-9 mb-4"
          >
            <UserPlus className="mr-1 h-3.5 w-3.5" />
            Arkadaş Ekle
          </Button>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
