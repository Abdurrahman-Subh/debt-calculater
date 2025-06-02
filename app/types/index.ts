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
  friendId?: string; // Optional for expense transactions
  amount: number;
  description: string;
  date: string;
  type: "borrowed" | "lent" | "payment" | "expense" | "partial-payment";
  userId: string;
  category?: TransactionCategory;
  recurring?: RecurringTransactionSettings;
  parentTransactionId?: string; // For generated recurring transactions, points to the original
  originalDebtId?: string; // For partial payments, references the original debt transaction
  remainingBalance?: number; // For debt transactions, tracks remaining balance after partial payments
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

// New interface for tracking individual debts and their partial payments
export interface DebtDetail {
  id: string;
  originalTransaction: Transaction;
  originalAmount: number;
  remainingBalance: number;
  partialPayments: Transaction[];
  createdDate: string;
  lastPaymentDate?: string;
  isFullyPaid: boolean;
}

// Extended debt summary with individual debt details
export interface ExtendedDebtSummary extends DebtSummary {
  outstandingDebts: DebtDetail[];
  totalOutstandingAmount: number;
}

// Expense summary interface for personal expense tracking
export interface ExpenseSummary {
  totalExpenses: number;
  byCategory: {
    category: TransactionCategory;
    amount: number;
    percentage: number;
  }[];
}
