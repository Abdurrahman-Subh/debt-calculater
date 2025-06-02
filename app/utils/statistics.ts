import {
  format,
  isWithinInterval,
  parse,
  startOfMonth,
  endOfMonth,
  subMonths,
} from "date-fns";
import { tr } from "date-fns/locale";
import {
  Transaction,
  Friend,
  DebtSummary,
  TransactionCategory,
  ExpenseSummary,
} from "../types";

export interface MonthlyStats {
  month: string;
  totalBorrowed: number;
  totalLent: number;
  totalPayments: number;
  totalExpenses: number;
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

export interface CategoryStats {
  category: TransactionCategory;
  totalAmount: number;
  borrowedAmount: number;
  lentAmount: number;
  expenseAmount: number;
  count: number;
  percentage: number;
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

    const totalExpenses = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalBorrowed - totalLent - totalPayments;

    stats.push({
      month: format(month, "MMMM yyyy", { locale: tr }),
      totalBorrowed,
      totalLent,
      totalPayments,
      totalExpenses,
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

export function getExpenseSummary(
  transactions: Transaction[],
  timeRange?: {
    startDate: Date;
    endDate: Date;
  }
): ExpenseSummary {
  // Filter only expense transactions
  let expenses = transactions.filter((t) => t.type === "expense");

  // Apply time range filter if provided
  if (timeRange) {
    expenses = expenses.filter((t) => {
      const transactionDate = new Date(t.date);
      return isWithinInterval(transactionDate, {
        start: timeRange.startDate,
        end: timeRange.endDate,
      });
    });
  }

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  // Group by category
  const categoryMap = new Map<TransactionCategory, number>();

  // Initialize all categories with zero
  const allCategories: TransactionCategory[] = [
    "food",
    "entertainment",
    "rent",
    "transportation",
    "shopping",
    "utilities",
    "healthcare",
    "education",
    "travel",
    "other",
  ];
  allCategories.forEach((category) => categoryMap.set(category, 0));

  // Sum expenses by category
  expenses.forEach((expense) => {
    const category = expense.category || "other";
    categoryMap.set(
      category,
      (categoryMap.get(category) || 0) + expense.amount
    );
  });

  // Convert to array with percentages
  const byCategory = Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    }))
    .filter((item) => item.amount > 0) // Only include categories with expenses
    .sort((a, b) => b.amount - a.amount); // Sort by amount descending

  return {
    totalExpenses,
    byCategory,
  };
}

export function getCategoryStatistics(
  transactions: Transaction[],
  filter?: {
    startDate?: Date;
    endDate?: Date;
    transactionType?: "borrowed" | "lent" | "payment" | "expense";
  }
): CategoryStats[] {
  // Filter transactions if filter parameters are provided
  let filteredTransactions = [...transactions];

  if (filter) {
    if (filter.startDate && filter.endDate) {
      filteredTransactions = filteredTransactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return isWithinInterval(transactionDate, {
          start: filter.startDate!,
          end: filter.endDate!,
        });
      });
    }

    if (filter.transactionType) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.type === filter.transactionType
      );
    }
  }

  // Group transactions by category
  const categoryMap = new Map<
    TransactionCategory,
    {
      totalAmount: number;
      borrowedAmount: number;
      lentAmount: number;
      expenseAmount: number;
      count: number;
    }
  >();

  // Initialize with all categories to ensure we have entries for all categories
  const allCategories: TransactionCategory[] = [
    "food",
    "entertainment",
    "rent",
    "transportation",
    "shopping",
    "utilities",
    "healthcare",
    "education",
    "travel",
    "other",
  ];

  allCategories.forEach((category) => {
    categoryMap.set(category, {
      totalAmount: 0,
      borrowedAmount: 0,
      lentAmount: 0,
      expenseAmount: 0,
      count: 0,
    });
  });

  // Process each transaction
  filteredTransactions.forEach((transaction) => {
    const category = transaction.category || "other";
    const current = categoryMap.get(category)!;

    // Update totals based on transaction type
    if (transaction.type === "borrowed") {
      current.borrowedAmount += transaction.amount;
      current.totalAmount += transaction.amount;
    } else if (transaction.type === "lent") {
      current.lentAmount += transaction.amount;
      current.totalAmount -= transaction.amount;
    } else if (transaction.type === "expense") {
      current.expenseAmount += transaction.amount;
      // For expense statistics, use positive values for sorting
      current.totalAmount += transaction.amount;
    }

    current.count += 1;
    categoryMap.set(category, current);
  });

  // Calculate total amount for determining percentages
  let totalForPercentage = 0;
  if (filter?.transactionType === "expense") {
    // For expenses, use the sum of all expense amounts
    totalForPercentage = Array.from(categoryMap.values()).reduce(
      (sum, { expenseAmount }) => sum + expenseAmount,
      0
    );
  } else {
    // For debt transactions, use absolute values
    totalForPercentage = Array.from(categoryMap.values()).reduce(
      (sum, { totalAmount }) => sum + Math.abs(totalAmount),
      0
    );
  }

  // Convert to array and calculate percentages
  const result: CategoryStats[] = Array.from(categoryMap.entries()).map(
    ([
      category,
      { totalAmount, borrowedAmount, lentAmount, expenseAmount, count },
    ]) => {
      let percentage = 0;
      if (totalForPercentage > 0) {
        if (filter?.transactionType === "expense") {
          percentage = (expenseAmount / totalForPercentage) * 100;
        } else {
          percentage = (Math.abs(totalAmount) / totalForPercentage) * 100;
        }
      }

      return {
        category,
        totalAmount,
        borrowedAmount,
        lentAmount,
        expenseAmount,
        count,
        percentage,
      };
    }
  );

  // Sort appropriately based on transaction type
  if (filter?.transactionType === "expense") {
    return result.sort((a, b) => b.expenseAmount - a.expenseAmount);
  } else {
    return result.sort(
      (a, b) => Math.abs(b.totalAmount) - Math.abs(a.totalAmount)
    );
  }
}
