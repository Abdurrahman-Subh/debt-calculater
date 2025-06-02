"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ListIcon, Plus, X, FilterIcon, TagIcon } from "lucide-react";
import TransactionList from "../components/TransactionList";
import TransactionForm from "../components/TransactionForm";
import { useDebtStore } from "../store/store";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast, Toaster } from "sonner";
import LoadingSpinner from "../components/LoadingSpinner";
import { TransactionCategory } from "../types";
import { categoryConfig } from "@/app/utils/categoryConfig";

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
  const [categoryFilter, setCategoryFilter] = useState<
    TransactionCategory | "all"
  >("all");
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);

  useEffect(() => {
    fetchFriends();
    fetchTransactions();
  }, [fetchFriends, fetchTransactions]);

  // Sort transactions by date (newest first)
  useEffect(() => {
    let filtered = [...transactions];

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((t) => t.category === categoryFilter);
    }

    // Sort by date
    filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setFilteredTransactions(filtered);
  }, [transactions, categoryFilter]);

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
      <section className="flex justify-between items-center py-4">
        <h1 className="text-xl md:text-3xl font-bold flex items-center text-foreground">
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
            İşlem eklemek için önce kişi eklemelisiniz.
          </p>
        </motion.div>
      )}

      {/* Category filter */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center p-4 bg-muted/30 rounded-lg border">
        <div className="flex items-center">
          <FilterIcon className="h-4 w-4 mr-2 text-primary" />
          <span className="text-sm font-medium">Kategoriye Göre Filtrele</span>
        </div>

        <div className="flex items-center gap-2">
          {categoryFilter !== "all" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCategoryFilter("all")}
              className="h-9"
            >
              <X className="h-4 w-4 mr-1" />
              Filtreyi Temizle
            </Button>
          )}

          <Select
            value={categoryFilter}
            onValueChange={(value) =>
              setCategoryFilter(value as TransactionCategory | "all")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Kategori Seçin" />
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

      {/* Display filtered count if filtering is active */}
      {categoryFilter !== "all" && (
        <div className="text-sm text-muted-foreground -mt-4 ml-1">
          <TagIcon className="h-3.5 w-3.5 inline mr-1" />
          <span>
            {filteredTransactions.length} {categoryConfig[categoryFilter].label}{" "}
            kategorisindeki işlem gösteriliyor
          </span>
        </div>
      )}

      <TransactionList
        transactions={filteredTransactions}
        friends={friends}
        onDeleteTransaction={handleDeleteTransaction}
      />

      <Toaster />
    </motion.div>
  );
}
