"use client";

import { Toaster } from "@/components/ui/sonner";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  BarChart4,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import FriendStatTable from "../components/FriendStatTable";
import MonthlyBalanceChart from "../components/MonthlyBalanceChart";
import StatCard from "../components/StatCard";
import FirestoreIndexError from "../components/FirestoreIndexError";
import { useDebtStore } from "../store/store";
import { formatCurrency } from "../utils/currency";
import {
  getFriendStatisticsByMonth,
  getMonthlyStatistics,
  getTotalDebt,
} from "../utils/statistics";

export default function Dashboard() {
  const { friends, transactions } = useDebtStore();
  const [currentMonth] = useState(new Date());

  // Calculate statistics
  const monthlyStats = getMonthlyStatistics(transactions);
  const currentMonthFriendStats = getFriendStatisticsByMonth(
    transactions,
    friends,
    currentMonth
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 p-4"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center text-foreground">
          <BarChart4 className="mr-2 h-7 w-7" />
          Borç İstatistikleri
        </h1>
      </div>

      <FirestoreIndexError />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Bu Ay Verilen Borç"
          value={formatCurrency(currentMonthStat.totalBorrowed)}
          icon={DollarSign}
          color="success"
          change={borrowedChange}
        />

        <StatCard
          title="Bu Ay Alınan Borç"
          value={formatCurrency(currentMonthStat.totalLent)}
          icon={Wallet}
          color="danger"
          change={lentChange}
        />

        <StatCard
          title="Toplam Alacak"
          value={formatCurrency(totalDebt.totalOwed)}
          icon={TrendingUp}
          color="primary"
          description="Arkadaşlarınızın size toplam borcu"
        />

        <StatCard
          title="Toplam Borç"
          value={formatCurrency(totalDebt.totalOwing)}
          icon={TrendingDown}
          color="accent"
          description="Sizin arkadaşlarınıza toplam borcunuz"
        />
      </section>

      <section>
        <MonthlyBalanceChart data={monthlyStats} />
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
