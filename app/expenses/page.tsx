"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Banknote,
  Plus,
  Calendar,
  BarChart3,
  PieChart,
  ListFilter,
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useDebtStore } from "../store/store";
import { formatCurrency } from "../utils/currency";
import { getExpenseSummary, getCategoryStatistics } from "../utils/statistics";
import TransactionForm from "../components/TransactionForm";
import CategoryStatsChart from "../components/CategoryStatsChart";
import TopCategoriesCards from "../components/TopCategoriesCards";
import CategoryFilter from "../components/CategoryFilter";
import { TransactionCategory } from "../types";

export default function ExpensesPage() {
  const { transactions, friends, addTransaction } = useDebtStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMonth] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState<
    TransactionCategory | "all"
  >("all");
  const [loading, setLoading] = useState(true);

  // Get expense transactions only
  const expenseTransactions = transactions.filter((t) => t.type === "expense");

  // Get current month expenses
  const currentMonthStart = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const currentMonthEnd = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  const expenseSummary = getExpenseSummary(expenseTransactions, {
    startDate: currentMonthStart,
    endDate: currentMonthEnd,
  });

  // Get all time expense summary
  const allTimeExpenseSummary = getExpenseSummary(expenseTransactions);

  // Get category statistics for expenses only
  const expenseCategoryStats = getCategoryStatistics(
    expenseTransactions.filter(
      (t) => selectedCategory === "all" || t.category === selectedCategory
    ),
    {
      transactionType: "expense",
    }
  );

  // Format current month name
  const currentMonthName = format(currentMonth, "MMMM yyyy", { locale: tr });

  // Get average monthly expense
  const getAverageMonthlyExpense = () => {
    if (expenseTransactions.length === 0) return 0;

    // Get unique months from transactions
    const monthsSet = new Set();
    expenseTransactions.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      monthsSet.add(monthKey);
    });

    const uniqueMonthsCount = monthsSet.size || 1; // Avoid division by zero
    return allTimeExpenseSummary.totalExpenses / uniqueMonthsCount;
  };

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Get section title based on selected category
  const getCategoryTitle = () => {
    if (selectedCategory === "all") return "Kategori İstatistikleri";

    const categoryNames: Record<TransactionCategory, string> = {
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

    return `${categoryNames[selectedCategory]} Kategorisi Harcamaları`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 p-4"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-3xl font-bold flex items-center text-foreground">
          <Banknote className="mr-2 h-7 w-7" />
          Kişisel Harcamalar
        </h1>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-1">
          <Plus size={16} /> Harcama Ekle
        </Button>
      </div>

      {/* Summary Cards */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Toplam Harcama ({currentMonthName})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(expenseSummary.totalExpenses, true)}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <Calendar className="h-3 w-3 mr-1" /> Bu ayki toplam harcama
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aylık Ortalama
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(getAverageMonthlyExpense(), true)}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <BarChart3 className="h-3 w-3 mr-1" /> Ortalama aylık harcama
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En Büyük Harcama Kategorisi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {expenseSummary.byCategory.length > 0
                ? getCategoryLabel(expenseSummary.byCategory[0].category)
                : "-"}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <PieChart className="h-3 w-3 mr-1" />
              {expenseSummary.byCategory.length > 0
                ? `${formatCurrency(
                    expenseSummary.byCategory[0].amount,
                    true
                  )} (${expenseSummary.byCategory[0].percentage.toFixed(0)}%)`
                : "Henüz harcama yok"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Toplam Harcama (Tüm Zamanlar)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(allTimeExpenseSummary.totalExpenses, true)}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <ListFilter className="h-3 w-3 mr-1" /> Tüm zamanlardaki toplam
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Category Stats */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <PieChart className="mr-2 h-5 w-5" />
          {getCategoryTitle()}
        </h2>

        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="mb-6">
          <TopCategoriesCards
            data={expenseCategoryStats}
            limit={selectedCategory === "all" ? 4 : 1}
          />
        </div>

        <CategoryStatsChart data={expenseCategoryStats} />
      </section>

      {/* New Expense Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-primary" />
              Yeni Harcama Ekle
            </DialogTitle>
          </DialogHeader>

          <TransactionForm
            friends={friends}
            onAddTransaction={async (transaction) => {
              // Force transaction type to "expense"
              const result = await addTransaction({
                ...transaction,
                type: "expense",
              });
              setIsDialogOpen(false);
              return result;
            }}
          />
        </DialogContent>
      </Dialog>

      <Toaster />
    </motion.div>
  );
}

// Helper to convert category codes to Turkish names
function getCategoryLabel(category: TransactionCategory): string {
  const labels: Record<TransactionCategory, string> = {
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
}
