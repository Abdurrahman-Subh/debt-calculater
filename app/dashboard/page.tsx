"use client";

import { Toaster } from "@/components/ui/sonner";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  BarChart4,
  Banknote,
  TrendingDown,
  TrendingUp,
  Wallet,
  PieChart,
  Tag,
} from "lucide-react";
import { useState } from "react";
import FriendStatTable from "../components/FriendStatTable";
import MonthlyBalanceChart from "../components/MonthlyBalanceChart";
import CategoryStatsChart from "../components/CategoryStatsChart";
import TopCategoriesCards from "../components/TopCategoriesCards";
import CategoryFilter from "../components/CategoryFilter";
import StatCard from "../components/StatCard";
import FirestoreIndexError from "../components/FirestoreIndexError";
import { useDebtStore } from "../store/store";
import { formatCurrency } from "../utils/currency";
import { TransactionCategory } from "../types";
import {
  getFriendStatisticsByMonth,
  getMonthlyStatistics,
  getTotalDebt,
  getCategoryStatistics,
} from "../utils/statistics";

export default function Dashboard() {
  const { friends, transactions } = useDebtStore();
  const [currentMonth] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState<
    TransactionCategory | "all"
  >("all");

  // Calculate statistics
  const monthlyStats = getMonthlyStatistics(transactions);
  const currentMonthFriendStats = getFriendStatisticsByMonth(
    transactions,
    friends,
    currentMonth
  );

  // Get all category statistics
  const allCategoryStats = getCategoryStatistics(transactions);

  // Filter transactions by selected category if needed
  const filteredTransactions =
    selectedCategory === "all"
      ? transactions
      : transactions.filter((t) => t.category === selectedCategory);

  // Get filtered category statistics
  const currentMonthCategoryStats = getCategoryStatistics(
    selectedCategory === "all" ? transactions : filteredTransactions,
    {
      startDate: startOfMonth(currentMonth),
      endDate: endOfMonth(currentMonth),
    }
  );

  const debtSummaries = useDebtStore().getDebtSummaries();
  const totalDebt = getTotalDebt(debtSummaries);

  // Get the current month formatted
  const currentMonthName = format(currentMonth, "MMMM yyyy", { locale: tr });

  // Check if we have previous month data to calculate change percentage
  const hasHistory = monthlyStats.length >= 2;
  const currentMonthStat = monthlyStats[0] || {
    totalBorrowed: 0,
    totalLent: 0,
    netBalance: 0,
  };
  const prevMonthStat = hasHistory
    ? monthlyStats[1]
    : { totalBorrowed: 0, totalLent: 0, netBalance: 0 };

  // Calculate percentage changes
  const calculateChange = (current: number, previous: number) => {
    if (!previous) return 0;
    return Math.round(((current - previous) / Math.abs(previous)) * 100);
  };

  const borrowedChange = hasHistory
    ? calculateChange(
        currentMonthStat.totalBorrowed,
        prevMonthStat.totalBorrowed
      )
    : 0;

  const lentChange = hasHistory
    ? calculateChange(currentMonthStat.totalLent, prevMonthStat.totalLent)
    : 0;

  // Get category stats for display - if a category is selected, show only that one
  const displayCategoryStats =
    selectedCategory === "all"
      ? allCategoryStats
      : allCategoryStats.filter((c) => c.category === selectedCategory);

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

    return `${categoryNames[selectedCategory]} Kategorisi İstatistikleri`;
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
          <BarChart4 className="mr-2 h-7 w-7" />
          Borç İstatistikleri
        </h1>
      </div>

      <FirestoreIndexError />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Bu Ay Verilen Borç"
          value={formatCurrency(currentMonthStat.totalBorrowed, true)}
          icon={Banknote}
          color="success"
          change={borrowedChange}
        />

        <StatCard
          title="Bu Ay Alınan Borç"
          value={formatCurrency(currentMonthStat.totalLent, true)}
          icon={Wallet}
          color="danger"
          change={lentChange}
        />

        <StatCard
          title="Toplam Alacak"
          value={formatCurrency(totalDebt.totalOwed, true)}
          icon={TrendingUp}
          color="primary"
          description="Arkadaşlarınızın size toplam borcu"
        />

        <StatCard
          title="Toplam Borç"
          value={formatCurrency(totalDebt.totalOwing, true)}
          icon={TrendingDown}
          color="accent"
          description="Sizin arkadaşlarınıza toplam borcunuz"
        />
      </section>

      <section>
        <MonthlyBalanceChart data={monthlyStats} />
      </section>

      {/* Category Statistics */}
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
            data={displayCategoryStats}
            limit={selectedCategory === "all" ? 4 : 1}
          />
        </div>

        <CategoryStatsChart data={displayCategoryStats} />
      </section>

      <section>
        <FriendStatTable
          data={currentMonthFriendStats}
          monthName={currentMonthName}
        />
      </section>

      <Toaster />
    </motion.div>
  );
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}
