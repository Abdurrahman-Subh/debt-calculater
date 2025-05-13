export interface Friend {
  id: string;
  name: string;
  userId: string;
}

export type TransactionCategory =
  | "food"
  | "entertainment"
  | "rent"
  | "transportation"
  | "shopping"
  | "utilities"
  | "healthcare"
  | "education"
  | "travel"
  | "other";

export interface Transaction {
  id: string;
  friendId: string;
  amount: number;
  description: string;
  date: string;
  type: "borrowed" | "lent" | "payment";
  userId: string;
  category?: TransactionCategory;
}

export interface DebtSummary {
  friendId: string;
  friendName: string;
  balance: number; // Positive: they owe you, Negative: you owe them
  totalBorrowed: number;
  totalLent: number;
  totalPayments: number;
  transactions: Transaction[];
}
