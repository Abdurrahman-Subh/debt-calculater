"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ListIcon, Plus, X } from "lucide-react";
import TransactionList from "../components/TransactionList";
import TransactionForm from "../components/TransactionForm";
import { useDebtStore } from "../store/store";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Transactions() {
  const {
    friends,
    transactions,
    addTransaction,
    deleteTransaction,
    fetchFriends,
    fetchTransactions,
    isLoading,
    error,
  } = useDebtStore();

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchFriends();
    fetchTransactions();
  }, [fetchFriends, fetchTransactions]);

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      toast.success("İşlem başarıyla silindi");
    } catch (error) {
      toast.error("İşlem silinirken bir hata oluştu");
      console.error("Failed to delete transaction:", error);
    }
  };

  if (isLoading && transactions.length === 0) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && transactions.length === 0) {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <section className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center text-foreground">
          <ListIcon className="mr-2 h-7 w-7" />
          Tüm İşlemler
        </h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          aria-label={
            showForm ? "İşlem ekleme formunu kapat" : "Yeni işlem ekle"
          }
          variant={showForm ? "destructive" : "default"}
        >
          {showForm ? (
            <>
              <X className="mr-2 h-4 w-4" />
              İptal
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Yeni İşlem Ekle
            </>
          )}
        </Button>
      </section>

      <AnimatePresence>
        {showForm && friends.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TransactionForm
              friends={friends}
              onAddTransaction={(transaction) => {
                return addTransaction(transaction).then((newTransaction) => {
                  setShowForm(false);
                  toast.success("İşlem başarıyla eklendi");
                  return newTransaction;
                });
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {showForm && friends.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-card rounded-lg p-6 text-center mb-6"
        >
          <p className="text-muted-foreground">
            İşlem eklemek için önce arkadaş eklemelisiniz.
          </p>
        </motion.div>
      )}

      <TransactionList
        transactions={sortedTransactions}
        friends={friends}
        onDeleteTransaction={handleDeleteTransaction}
      />

      <Toaster />
    </motion.div>
  );
}
