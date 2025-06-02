import {
  Transaction,
  DebtDetail,
  ExtendedDebtSummary,
  DebtSummary,
  Friend,
} from "../types";

/**
 * Creates a DebtDetail from a borrowed/lent transaction and its partial payments
 */
export const createDebtDetail = (
  originalTransaction: Transaction,
  allTransactions: Transaction[]
): DebtDetail => {
  // Find all partial payments for this debt
  const partialPayments = allTransactions
    .filter(
      (t) =>
        t.type === "partial-payment" &&
        t.originalDebtId === originalTransaction.id
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate total paid amount
  const totalPaid = partialPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  // Calculate remaining balance
  const remainingBalance = originalTransaction.amount - totalPaid;

  // Get last payment date
  const lastPaymentDate =
    partialPayments.length > 0
      ? partialPayments[partialPayments.length - 1].date
      : undefined;

  return {
    id: originalTransaction.id,
    originalTransaction,
    originalAmount: originalTransaction.amount,
    remainingBalance: Math.max(0, remainingBalance), // Ensure non-negative
    partialPayments,
    createdDate: originalTransaction.date,
    lastPaymentDate,
    isFullyPaid: remainingBalance <= 0,
  };
};

/**
 * Gets all outstanding debts for a friend (borrowed/lent transactions with remaining balance)
 */
export const getOutstandingDebtsForFriend = (
  friendId: string,
  allTransactions: Transaction[]
): DebtDetail[] => {
  // Get all debt transactions (borrowed/lent) for this friend
  const debtTransactions = allTransactions.filter(
    (t) =>
      t.friendId === friendId && (t.type === "borrowed" || t.type === "lent")
  );

  // Create debt details for each debt transaction
  const debtDetails = debtTransactions.map((transaction) =>
    createDebtDetail(transaction, allTransactions)
  );

  // Return only debts with remaining balance or fully paid debts (for history)
  return debtDetails.sort((a, b) => {
    // Sort by: unpaid first, then by creation date (newest first)
    if (!a.isFullyPaid && b.isFullyPaid) return -1;
    if (a.isFullyPaid && !b.isFullyPaid) return 1;
    return (
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    );
  });
};

/**
 * Creates an extended debt summary with individual debt details
 */
export const createExtendedDebtSummary = (
  friend: Friend,
  allTransactions: Transaction[]
): ExtendedDebtSummary => {
  // Get regular debt summary calculations
  const friendTransactions = allTransactions.filter(
    (t) => t.friendId === friend.id
  );

  // Calculate totals (excluding partial payments to avoid double counting)
  const totalBorrowed = friendTransactions
    .filter((t) => t.type === "borrowed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalLent = friendTransactions
    .filter((t) => t.type === "lent")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPayments = friendTransactions
    .filter((t) => t.type === "payment")
    .reduce((sum, t) => sum + t.amount, 0);

  // Get outstanding debt details
  const outstandingDebts = getOutstandingDebtsForFriend(
    friend.id,
    allTransactions
  );

  // Calculate total outstanding amount (remaining balances)
  const totalOutstandingAmount = outstandingDebts
    .filter((debt) => !debt.isFullyPaid)
    .reduce((sum, debt) => sum + debt.remainingBalance, 0);

  // Calculate balance considering partial payments
  const partialPaymentTotal = friendTransactions
    .filter((t) => t.type === "partial-payment")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance =
    totalBorrowed - totalLent - totalPayments - partialPaymentTotal;

  const baseSummary: DebtSummary = {
    friendId: friend.id,
    friendName: friend.name,
    balance,
    totalBorrowed,
    totalLent,
    totalPayments,
    transactions: friendTransactions,
  };

  return {
    ...baseSummary,
    outstandingDebts,
    totalOutstandingAmount,
  };
};

/**
 * Creates a partial payment transaction
 */
export const createPartialPaymentTransaction = (
  originalDebtId: string,
  amount: number,
  friendId: string,
  description?: string
): Omit<Transaction, "id" | "userId"> => {
  return {
    friendId,
    amount,
    description: description || `Kısmi ödeme`,
    date: new Date().toISOString(),
    type: "partial-payment",
    originalDebtId,
  };
};

/**
 * Updates the remaining balance of a debt transaction after a partial payment
 */
export const updateDebtRemainingBalance = (
  debtTransaction: Transaction,
  allTransactions: Transaction[]
): number => {
  const partialPayments = allTransactions.filter(
    (t) =>
      t.type === "partial-payment" && t.originalDebtId === debtTransaction.id
  );

  const totalPaid = partialPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  return Math.max(0, debtTransaction.amount - totalPaid);
};
