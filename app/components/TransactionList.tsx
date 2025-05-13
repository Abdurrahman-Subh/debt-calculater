"use client";

import { Transaction, Friend } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  PiggyBank,
  Coins,
  Trash2,
  CalendarIcon,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getFriendName = (friendId: string) => {
    const friend = friends.find((f) => f.id === friendId);
    return friend ? friend.name : "Bilinmeyen Arkadaş";
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
        return <DollarSign className="h-4 w-4" />;
      case "lent":
        return <PiggyBank className="h-4 w-4" />;
      case "payment":
        return <Coins className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTransactionTypeClass = (type: Transaction["type"]) => {
    switch (type) {
      case "borrowed":
        return "bg-success-100 text-success-800 border-success-200";
      case "lent":
        return "bg-danger-100 text-danger-800 border-danger-200";
      case "payment":
        return "bg-primary-100 text-primary-800 border-primary-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTransactionBgClass = (type: Transaction["type"]) => {
    switch (type) {
      case "borrowed":
        return "bg-gradient-to-r from-success-50 to-background border-l-4 border-success-400";
      case "lent":
        return "bg-gradient-to-r from-danger-50 to-background border-l-4 border-danger-400";
      case "payment":
        return "bg-gradient-to-r from-primary-50 to-background border-l-4 border-primary-400";
      default:
        return "bg-background";
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Bu işlemi silmek istediğinizden emin misiniz?")) {
      try {
        setDeletingIds((prev) => [...prev, id]);
        await onDeleteTransaction(id);
      } catch (error) {
        console.error("Error deleting transaction:", error);
      } finally {
        setDeletingIds((prev) => prev.filter((itemId) => itemId !== id));
      }
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
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Coins className="mr-2 h-5 w-5 text-primary" />
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

                            <div className="flex items-center text-muted-foreground text-sm">
                              <User className="h-3 w-3 mr-1" />
                              <span>{getFriendName(transaction.friendId)}</span>
                            </div>
                          </div>

                          <h3 className="font-medium text-foreground text-lg">
                            {transaction.description}
                          </h3>

                          <div className="text-lg font-bold">
                            {transaction.type === "borrowed" && (
                              <span className="text-success-600">
                                +{transaction.amount} TL
                              </span>
                            )}
                            {transaction.type === "lent" && (
                              <span className="text-danger-600">
                                -{transaction.amount} TL
                              </span>
                            )}
                            {transaction.type === "payment" && (
                              <span className="text-primary-600">
                                {transaction.amount} TL
                              </span>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(transaction.id)}
                          disabled={deletingIds.includes(transaction.id)}
                          aria-label="İşlemi sil"
                        >
                          <Trash2
                            className={`h-4 w-4 ${
                              deletingIds.includes(transaction.id)
                                ? "animate-spin text-muted-foreground"
                                : "text-destructive"
                            }`}
                          />
                        </Button>
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
  );
};

export default TransactionList;
