"use client";

import { Transaction, Friend, TransactionCategory } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Banknote,
  PiggyBank,
  Coins,
  Trash2,
  CalendarIcon,
  User,
  AlertTriangle,
  ArrowUpRight,
  TagIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "../utils/currency";
import { categoryConfig } from "../utils/categoryConfig";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

interface TransactionListProps {
  transactions: Transaction[];
  friends: Friend[];
  onDeleteTransaction: (id: string) => Promise<void>;
}

const TransactionList = ({
  transactions,
  friends,
  onDeleteTransaction,
}: TransactionListProps) => {
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getFriendName = (friendId?: string) => {
    if (!friendId) return "Kişisel Harcama";
    const friend = friends.find((f) => f.id === friendId);
    return friend ? friend.name : "Bilinmeyen Arkadaş";
  };

  const getTransactionTypeLabel = (type: Transaction["type"]) => {
    switch (type) {
      case "borrowed":
        return "Borç Verdiniz";
      case "lent":
        return "Borç Aldınız";
      case "payment":
        return "Ödeme";
      case "partial-payment":
        return "Kısmi Ödeme";
      case "expense":
        return "Harcama";
      default:
        return "";
    }
  };

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "borrowed":
        return <Banknote className="h-4 w-4" />;
      case "lent":
        return <PiggyBank className="h-4 w-4" />;
      case "payment":
        return <Coins className="h-4 w-4" />;
      case "expense":
        return <Coins className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTransactionTypeClass = (type: Transaction["type"]) => {
    switch (type) {
      case "borrowed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "lent":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "payment":
        return "bg-slate-100 text-slate-800 border-slate-200";
      case "partial-payment":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "expense":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTransactionBgClass = (type: Transaction["type"]) => {
    switch (type) {
      case "borrowed":
        return "bg-gradient-to-r from-emerald-50 to-background border-l-4 border-emerald-400";
      case "lent":
        return "bg-gradient-to-r from-rose-50 to-background border-l-4 border-rose-400";
      case "payment":
        return "bg-gradient-to-r from-slate-50 to-background border-l-4 border-slate-400";
      case "partial-payment":
        return "bg-gradient-to-r from-amber-50 to-background border-l-4 border-amber-400";
      case "expense":
        return "bg-gradient-to-r from-amber-50 to-background border-l-4 border-amber-400";
      default:
        return "bg-background";
    }
  };

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!transactionToDelete) return;

    try {
      setDeletingIds((prev) => [...prev, transactionToDelete.id]);
      await onDeleteTransaction(transactionToDelete.id);
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    } finally {
      setDeletingIds((prev) =>
        prev.filter((itemId) => itemId !== (transactionToDelete?.id || ""))
      );
    }
  };

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Henüz işlem bulunmuyor.</p>
        </CardContent>
      </Card>
    );
  }

  // Group transactions by date (most recent first)
  const groupedTransactions: Record<string, Transaction[]> = {};
  transactions.forEach((transaction) => {
    const date = formatDate(transaction.date);
    if (!groupedTransactions[date]) {
      groupedTransactions[date] = [];
    }
    groupedTransactions[date].push(transaction);
  });

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => {
    const dateA = new Date(a.split(".").reverse().join("-"));
    const dateB = new Date(b.split(".").reverse().join("-"));
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center">
            <Coins className="mr-2 h-5 w-5 text-emerald-600" />
            İşlem Geçmişi
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <AnimatePresence>
              {sortedDates.map((date) => (
                <motion.div
                  key={date}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center mb-3 mt-6">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground mr-2" />
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {date}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {groupedTransactions[date].map((transaction) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`rounded-lg ${getTransactionBgClass(
                          transaction.type
                        )} p-4 shadow-sm`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getTransactionTypeClass(
                                  transaction.type
                                )}`}
                              >
                                {getTransactionIcon(transaction.type)}
                                {getTransactionTypeLabel(transaction.type)}
                              </span>

                              {transaction.category && (
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${
                                    categoryConfig[
                                      transaction.category as TransactionCategory
                                    ].color
                                  }`}
                                >
                                  <TagIcon className="h-3 w-3" />
                                  {
                                    categoryConfig[
                                      transaction.category as TransactionCategory
                                    ].label
                                  }
                                </span>
                              )}

                              <div className="flex items-center text-muted-foreground text-sm">
                                <User className="h-3 w-3 mr-1" />
                                <span>
                                  {getFriendName(transaction.friendId)}
                                </span>
                              </div>
                            </div>

                            <h3 className="font-medium text-foreground text-lg">
                              {transaction.description}
                            </h3>

                            <div className="text-lg font-bold">
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
                              {transaction.type === "partial-payment" && (
                                <span className="text-amber-600">
                                  -{formatCurrency(transaction.amount, true)}
                                </span>
                              )}
                              {transaction.type === "expense" && (
                                <span className="text-amber-600">
                                  -{formatCurrency(transaction.amount, true)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              className="h-8 w-8"
                            >
                              <Link
                                href={`/transactions/${transaction.id}`}
                                aria-label="İşlem detayı"
                              >
                                <ArrowUpRight className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 cursor-pointer"
                              onClick={() => handleDeleteClick(transaction)}
                              disabled={deletingIds.includes(transaction.id)}
                              aria-label="İşlemi sil"
                            >
                              <Trash2 className={`h-4 w-4 $`} />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              İşlemi Sil
            </DialogTitle>
            <DialogDescription>
              {transactionToDelete && (
                <>
                  <div className="mb-2">
                    Bu işlemi silmek istediğinizden emin misiniz?
                  </div>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <div className="font-semibold mb-1">
                      {getTransactionTypeLabel(transactionToDelete.type)}
                    </div>
                    <div>{getFriendName(transactionToDelete.friendId)}</div>
                    {transactionToDelete.description && (
                      <div className="mt-1">
                        {transactionToDelete.description}
                      </div>
                    )}
                    <div className="font-semibold mt-1">
                      {formatCurrency(transactionToDelete.amount, true)}
                    </div>
                  </div>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Vazgeç
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionList;
