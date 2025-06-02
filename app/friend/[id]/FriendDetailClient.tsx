"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Trash2,
  BanknoteIcon,
  PiggyBank,
  User,
  AlertTriangle,
  TagIcon,
  FilterIcon,
  XIcon,
  Edit2,
} from "lucide-react";
import TransactionList from "../../components/TransactionList";
import TransactionForm from "../../components/TransactionForm";
import FirestoreIndexError from "../../components/FirestoreIndexError";
import FriendForm from "../../components/FriendForm";
import ShareMenu from "../../components/ShareMenu";
import PartialPaymentManager from "../../components/PartialPaymentManager";
import { useDebtStore } from "../../store/store";
import {
  DebtSummary,
  Transaction,
  TransactionCategory,
  Friend,
  ExtendedDebtSummary,
} from "../../types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryConfig } from "@/app/utils/categoryConfig";

interface FriendDetailClientProps {
  friendId: string;
}

export default function FriendDetailClient({
  friendId,
}: FriendDetailClientProps) {
  const router = useRouter();
  const {
    friends,
    addTransaction,
    deleteTransaction,
    deleteFriend,
    updateFriend,
    getTransactionsForFriend,
    getDebtSummaries,
    makePartialPayment,
    getExtendedDebtSummary,
  } = useDebtStore();

  const [friendSummary, setFriendSummary] = useState<DebtSummary | null>(null);
  const [extendedSummary, setExtendedSummary] =
    useState<ExtendedDebtSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<
    TransactionCategory | "all"
  >("all");

  // Effect to update the friend summary and transactions when the store data changes
  useEffect(() => {
    // Find the friend
    const summary = getDebtSummaries().find((s) => s.friendId === friendId);
    if (!summary) {
      router.push("/");
      return;
    }

    setFriendSummary(summary);

    // Get extended summary with debt details
    const extended = getExtendedDebtSummary(friendId);
    setExtendedSummary(extended);

    const allTransactions = getTransactionsForFriend(friendId);
    setTransactions(allTransactions);
    setFilteredTransactions(allTransactions);
  }, [
    friendId,
    friends,
    getDebtSummaries,
    getTransactionsForFriend,
    getExtendedDebtSummary,
    router,
  ]);

  // Apply category filtering when the filter changes
  useEffect(() => {
    if (categoryFilter === "all") {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(
        transactions.filter((t) => t.category === categoryFilter)
      );
    }
  }, [categoryFilter, transactions]);

  if (!friendSummary) {
    return null; // Will redirect in the useEffect
  }

  const handleDeleteDialogOpen = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    deleteFriend(friendSummary.friendId);
    setIsDeleteDialogOpen(false);
    router.push("/");
  };

  // Handle adding a transaction with immediate UI update
  const handleAddTransaction = async (
    transaction: Omit<Transaction, "id" | "userId">
  ) => {
    const newTransaction = await addTransaction(transaction);
    // We don't need to manually update the transactions list since useEffect will handle that
    // Just return the new transaction for any toast notifications
    return newTransaction;
  };

  // Handle partial payment
  const handlePartialPayment = async (
    debtId: string,
    amount: number,
    description?: string
  ) => {
    await makePartialPayment(debtId, amount, description);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6 max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/" aria-label="Ana sayfaya dön">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl md:text-3xl font-bold flex items-center text-foreground">
          <User className="mr-2 h-6 w-6" />
          {friendSummary.friendName}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsEditDialogOpen(true)}
            className="h-9 w-9"
            aria-label="Arkadaşı düzenle"
          >
            <Edit2 className="h-4 w-4 text-primary" />
          </Button>
          <ShareMenu
            type="friend"
            id={friendSummary.friendId}
            name={friendSummary.friendName}
          />
        </div>
      </div>

      <FirestoreIndexError />

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Borç Durumu
              </h2>
              <div className="flex items-center space-x-2">
                {friendSummary.balance > 0 ? (
                  <>
                    <BanknoteIcon className="h-5 w-5 text-emerald-600" />
                    <p className="text-emerald-600 font-medium text-lg">
                      {friendSummary.friendName} size{" "}
                      <span className="font-bold">
                        {friendSummary.balance} TL
                      </span>{" "}
                      borçlu
                    </p>
                  </>
                ) : friendSummary.balance < 0 ? (
                  <>
                    <PiggyBank className="h-5 w-5 text-rose-500" />
                    <p className="text-rose-600 font-medium text-lg">
                      Siz {friendSummary.friendName}'a{" "}
                      <span className="font-bold">
                        {Math.abs(friendSummary.balance)} TL
                      </span>{" "}
                      borçlusunuz
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground font-medium">Borç yok</p>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteDialogOpen}
              aria-label={`${friendSummary.friendName} sil`}
            >
              <Trash2 className="h-5 w-5 text-destructive" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <TransactionForm
        friends={friends}
        onAddTransaction={handleAddTransaction}
        initialFriendId={friendSummary.friendId}
      />

      {/* Partial Payment Manager */}
      {extendedSummary && extendedSummary.outstandingDebts.length > 0 && (
        <PartialPaymentManager
          outstandingDebts={extendedSummary.outstandingDebts}
          friendName={friendSummary.friendName}
          onMakePartialPayment={handlePartialPayment}
        />
      )}

      {/* Category filter */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <FilterIcon className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Kategori Filtresi:
          </span>
        </div>
        <div className="flex items-center gap-2">
          {categoryFilter !== "all" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 p-0 px-2"
              onClick={() => setCategoryFilter("all")}
            >
              <XIcon className="h-4 w-4 mr-1" />
              Temizle
            </Button>
          )}
          <Select
            value={categoryFilter}
            onValueChange={(value) =>
              setCategoryFilter(value as TransactionCategory | "all")
            }
          >
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Tüm Kategoriler" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Kategoriler</SelectItem>
              {Object.entries(categoryConfig).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center">
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${
                        categoryConfig[key as TransactionCategory].color.split(
                          " "
                        )[0]
                      }`}
                    />
                    <span className="ml-2">{label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-2">
        <TransactionList
          transactions={filteredTransactions}
          friends={friends}
          onDeleteTransaction={deleteTransaction}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Arkadaşı Sil
            </DialogTitle>
            <DialogDescription>
              Gerçekten{" "}
              <span className="font-semibold">{friendSummary.friendName}</span>{" "}
              silmek istiyor musunuz? Bu işlem geri alınamaz ve tüm işlem
              geçmişi de silinecektir.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
            <Button variant="outline" onClick={handleDeleteDialogClose}>
              Vazgeç
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Friend Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-primary" />
              Arkadaşı Düzenle
            </DialogTitle>
            <DialogDescription>
              {friendSummary.friendName} için yeni bir isim girin.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <FriendForm
              onAddFriend={() => Promise.resolve({} as Friend)} // Not used
              onUpdateFriend={updateFriend}
              initialFriend={{
                id: friendSummary.friendId,
                name: friendSummary.friendName,
                userId: "", // Not needed for update
              }}
              isEditing={true}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
    </motion.div>
  );
}
