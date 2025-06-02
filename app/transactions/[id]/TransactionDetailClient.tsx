"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/app/utils/currency";
import { formatDistance } from "date-fns";
import { tr } from "date-fns/locale";
import {
  ArrowLeft,
  Banknote,
  PiggyBank,
  CreditCard,
  CalendarIcon,
  User,
  Trash2,
  AlertTriangle,
  Edit2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Transaction, Friend } from "@/app/types";
import { useDebtStore } from "@/app/store/store";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import ShareMenu from "@/app/components/ShareMenu";
import TransactionForm from "@/app/components/TransactionForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface TransactionDetailClientProps {
  transactionId: string;
}

export default function TransactionDetailClient({
  transactionId,
}: TransactionDetailClientProps) {
  const router = useRouter();
  const { friends, transactions, deleteTransaction, updateTransaction } =
    useDebtStore();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [friend, setFriend] = useState<Friend | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch transaction data
  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      // Find transaction
      const foundTransaction = transactions.find((t) => t.id === transactionId);

      if (!foundTransaction) {
        toast.error("İşlem bulunamadı");
        router.push("/transactions");
        return;
      }

      setTransaction(foundTransaction);

      // Find associated friend
      const foundFriend = friends.find(
        (f) => f.id === foundTransaction.friendId
      );
      if (foundFriend) {
        setFriend(foundFriend);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [transactionId, transactions, friends, router]);

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
      case "expense":
        return "Harcama";
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
      case "expense":
        return <Banknote className="h-5 w-5 text-purple-600" />;
      default:
        return null;
    }
  };

  const handleDelete = useCallback(async () => {
    if (!transaction) return;

    try {
      await deleteTransaction(transaction.id);
      toast.success("İşlem başarıyla silindi");
      router.push("/transactions");
    } catch (error) {
      toast.error("İşlem silinirken bir hata oluştu");
      console.error("Error deleting transaction:", error);
    }
  }, [transaction, deleteTransaction, router]);

  const handleUpdate = useCallback(
    async (updatedTransaction: Omit<Transaction, "id" | "userId">) => {
      if (!transaction) return {} as Transaction;

      try {
        const result = await updateTransaction(
          transaction.id,
          updatedTransaction
        );
        setIsEditDialogOpen(false);
        toast.success("İşlem başarıyla güncellendi");

        // Update the local state
        setTransaction(result);

        return result;
      } catch (error) {
        toast.error("İşlem güncellenirken bir hata oluştu");
        console.error("Error updating transaction:", error);
        throw error;
      }
    },
    [transaction, updateTransaction]
  );

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      food: "Yemek",
      entertainment: "Eğlence",
      rent: "Kira",
      transportation: "Ulaşım",
      shopping: "Alışveriş",
      utilities: "Faturalar",
      healthcare: "Sağlık",
      education: "Eğitim",
      travel: "Seyahat",
      other: "Diğer",
    };
    return labels[category] || category;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <LoadingSpinner />
      </div>
    );
  }

  if (!transaction) {
    return null; // We'll redirect in useEffect
  }

  const timeAgo = formatDistance(new Date(transaction.date), new Date(), {
    addSuffix: true,
    locale: tr,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto p-4"
    >
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/transactions" className="inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tüm İşlemler
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
            className="inline-flex items-center"
          >
            <Edit2 className="mr-1 h-4 w-4" />
            Düzenle
          </Button>

          <ShareMenu
            type="transaction"
            id={transaction.id}
            name={
              transaction.description ||
              getTransactionTypeLabel(transaction.type)
            }
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <h1 className="text-2xl font-bold flex items-center">
          {getTransactionIcon(transaction.type)}
          <span className="ml-2">
            {getTransactionTypeLabel(transaction.type)} İşlemi
          </span>
        </h1>
        <p className="text-muted-foreground text-sm flex items-center mt-1">
          <CalendarIcon className="h-3.5 w-3.5 mr-1" />
          {formatDate(transaction.date)} ({timeAgo})
        </p>
      </div>

      <Card className="overflow-hidden mb-6 py-0">
        <CardContent className="p-0">
          <div
            className={`p-6 ${
              transaction.type === "borrowed"
                ? "bg-success-50"
                : transaction.type === "lent"
                ? "bg-destructive/10"
                : transaction.type === "payment"
                ? "bg-primary/10"
                : transaction.type === "expense"
                ? "bg-purple-50"
                : "bg-gray-50"
            }`}
          >
            <div className="text-3xl font-bold mb-2">
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
              {transaction.type === "expense" && (
                <span className="text-purple-600">
                  -{formatCurrency(transaction.amount, true)}
                </span>
              )}
            </div>

            {/* Display the category if present */}
            {transaction.category && (
              <div className="mb-4 inline-block px-3 py-1 rounded-full text-sm font-medium bg-muted">
                <span>Kategori: {getCategoryLabel(transaction.category)}</span>
              </div>
            )}

            {/* Only show friend info for non-expense transactions */}
            {friend && transaction.type !== "expense" && (
              <div className="flex items-center p-3 bg-background rounded-lg border">
                <div className="bg-primary/10 p-1.5 rounded-full mr-2">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Arkadaş</div>
                  <div className="font-medium">{friend.name}</div>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto" asChild>
                  <Link href={`/friend/${friend.id}`}>Detay</Link>
                </Button>
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

            {/* Recurring transaction info */}
            {transaction.recurring && transaction.recurring.isRecurring && (
              <div className="mt-4">
                <div className="text-sm text-muted-foreground mb-1">
                  Tekrarlayan İşlem
                </div>
                <div className="p-3 bg-background rounded-lg border">
                  <p>
                    <strong>Sıklık:</strong>{" "}
                    {transaction.recurring.interval === "daily"
                      ? "Her gün"
                      : transaction.recurring.interval === "weekly"
                      ? "Her hafta"
                      : transaction.recurring.interval === "biweekly"
                      ? "İki haftada bir"
                      : transaction.recurring.interval === "monthly"
                      ? "Her ay"
                      : transaction.recurring.interval === "quarterly"
                      ? "Üç ayda bir"
                      : "Her yıl"}
                  </p>
                  <p>
                    <strong>Başlangıç:</strong>{" "}
                    {new Date(
                      transaction.recurring.startDate
                    ).toLocaleDateString("tr-TR")}
                  </p>
                  {transaction.recurring.endDate && (
                    <p>
                      <strong>Bitiş:</strong>{" "}
                      {new Date(
                        transaction.recurring.endDate
                      ).toLocaleDateString("tr-TR")}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              İşlemi Sil
            </DialogTitle>
            <DialogDescription>
              Bu işlemi silmek istediğinizden emin misiniz? Bu işlem geri
              alınamaz.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted p-3 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">
                {getTransactionTypeLabel(transaction.type)}
              </div>
              <div className="font-bold">
                {formatCurrency(transaction.amount, true)}
              </div>
            </div>
            {friend && (
              <div className="text-sm text-muted-foreground">{friend.name}</div>
            )}
            {transaction.description && (
              <div className="text-sm mt-2 border-t pt-2">
                {transaction.description}
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Vazgeç
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Transaction Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-primary" />
              İşlemi Düzenle
            </DialogTitle>
            <DialogDescription>
              İşlem bilgilerini güncelleyebilirsiniz.
            </DialogDescription>
          </DialogHeader>

          {transaction && (
            <TransactionForm
              friends={friends}
              onAddTransaction={handleUpdate}
              initialFriendId={transaction.friendId}
              initialTransaction={transaction}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
