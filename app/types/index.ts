export interface Friend {
  id: string;
  name: string;
  userId: string;
}

export interface Transaction {
  id: string;
  friendId: string;
  amount: number;
  description: string;
  date: string;
  type: "borrowed" | "lent" | "payment";
  userId: string;
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
