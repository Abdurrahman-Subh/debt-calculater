import {
  format,
  isWithinInterval,
  parse,
  startOfMonth,
  endOfMonth,
  subMonths,
} from "date-fns";
import { tr } from "date-fns/locale";
import { Transaction, Friend, DebtSummary } from "../types";

export interface MonthlyStats {
  month: string;
  totalBorrowed: number;
  totalLent: number;
  totalPayments: number;
  netBalance: number;
}

export interface FriendMonthlyStats {
  friendId: string;
  friendName: string;
  totalBorrowed: number;
  totalLent: number;
  totalPayments: number;
  netBalance: number;
}

export function getMonthlyStatistics(
  transactions: Transaction[],
  months = 6
): MonthlyStats[] {
  const stats: MonthlyStats[] = [];
  const currentDate = new Date();

  for (let i = 0; i < months; i++) {
    const month = subMonths(currentDate, i);
    const start = startOfMonth(month);
    const end = endOfMonth(month);

    const monthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return isWithinInterval(transactionDate, { start, end });
    });

    const totalBorrowed = monthTransactions
      .filter((t) => t.type === "borrowed")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalLent = monthTransactions
      .filter((t) => t.type === "lent")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalPayments = monthTransactions
      .filter((t) => t.type === "payment")
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalBorrowed - totalLent - totalPayments;

    stats.push({
      month: format(month, "MMMM yyyy", { locale: tr }),
      totalBorrowed,
      totalLent,
      totalPayments,
      netBalance,
    });
  }

  return stats;
}

export function getFriendStatisticsByMonth(
  transactions: Transaction[],
  friends: Friend[],
  month: Date
): FriendMonthlyStats[] {
  const start = startOfMonth(month);
  const end = endOfMonth(month);

  return friends.map((friend) => {
    const friendTransactions = transactions.filter((t) => {
      return (
        t.friendId === friend.id &&
        isWithinInterval(new Date(t.date), { start, end })
      );
    });

    const totalBorrowed = friendTransactions
      .filter((t) => t.type === "borrowed")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalLent = friendTransactions
      .filter((t) => t.type === "lent")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalPayments = friendTransactions
      .filter((t) => t.type === "payment")
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalBorrowed - totalLent - totalPayments;

    return {
      friendId: friend.id,
      friendName: friend.name,
      totalBorrowed,
      totalLent,
      totalPayments,
      netBalance,
    };
  });
}

export function getCurrentMonthTransactions(
  transactions: Transaction[]
): Transaction[] {
  const currentDate = new Date();
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);

  return transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return isWithinInterval(transactionDate, { start, end });
  });
}

export function getTotalDebt(summaries: DebtSummary[]): {
  totalOwed: number;
  totalOwing: number;
  netBalance: number;
} {
  let totalOwed = 0;
  let totalOwing = 0;

  summaries.forEach((summary) => {
    if (summary.balance > 0) {
      totalOwed += summary.balance;
    } else if (summary.balance < 0) {
      totalOwing += Math.abs(summary.balance);
    }
  });

  return {
    totalOwed,
    totalOwing,
    netBalance: totalOwed - totalOwing,
  };
}
