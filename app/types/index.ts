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

export type RecurrenceInterval =
  | "daily"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "quarterly"
  | "yearly";

export interface RecurringTransactionSettings {
  isRecurring: boolean;
  interval: RecurrenceInterval;
  endDate?: string; // ISO date string, can be undefined for infinite recurrence
  startDate: string; // ISO date string
  lastProcessedDate?: string; // ISO date string of when the transaction was last processed
}

export interface Transaction {
  id: string;
  friendId: string;
  amount: number;
  description: string;
  date: string;
  type: "borrowed" | "lent" | "payment";
  userId: string;
  category?: TransactionCategory;
  recurring?: RecurringTransactionSettings;
  parentTransactionId?: string; // For generated recurring transactions, points to the original
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
