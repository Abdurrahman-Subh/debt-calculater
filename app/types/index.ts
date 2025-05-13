export interface Friend {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  friendId: string;
  amount: number;
  description: string;
  date: string;
  type: "borrowed" | "lent" | "payment";
}

export interface DebtSummary {
  friendId: string;
  friendName: string;
  balance: number; // Positive: they owe you, Negative: you owe them
}
