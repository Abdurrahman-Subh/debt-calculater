import { Transaction, RecurrenceInterval } from "../types";

/**
 * Calculates the next occurrence date based on the provided date and interval
 */
export const calculateNextDate = (
  currentDate: Date,
  interval: RecurrenceInterval
): Date => {
  const nextDate = new Date(currentDate);

  switch (interval) {
    case "daily":
      nextDate.setDate(currentDate.getDate() + 1);
      break;
    case "weekly":
      nextDate.setDate(currentDate.getDate() + 7);
      break;
    case "biweekly":
      nextDate.setDate(currentDate.getDate() + 14);
      break;
    case "monthly":
      nextDate.setMonth(currentDate.getMonth() + 1);
      break;
    case "quarterly":
      nextDate.setMonth(currentDate.getMonth() + 3);
      break;
    case "yearly":
      nextDate.setFullYear(currentDate.getFullYear() + 1);
      break;
  }

  return nextDate;
};

/**
 * Checks if a recurring transaction is due for processing
 */
export const isTransactionDue = (transaction: Transaction): boolean => {
  if (!transaction.recurring || !transaction.recurring.isRecurring) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  // If there's an end date and it's in the past, the transaction is no longer recurring
  if (transaction.recurring.endDate) {
    const endDate = new Date(transaction.recurring.endDate);
    endDate.setHours(0, 0, 0, 0);
    if (endDate < today) {
      return false;
    }
  }

  // Get the date of the last processed instance
  const lastProcessedDate = transaction.recurring.lastProcessedDate
    ? new Date(transaction.recurring.lastProcessedDate)
    : new Date(transaction.recurring.startDate);

  lastProcessedDate.setHours(0, 0, 0, 0);

  // Calculate when the next instance should occur
  const nextDueDate = calculateNextDate(
    lastProcessedDate,
    transaction.recurring.interval
  );
  nextDueDate.setHours(0, 0, 0, 0);

  // Check if the next due date is today or in the past
  return nextDueDate <= today;
};

/**
 * Generates a transaction instance based on a recurring template
 */
export const generateRecurringInstance = (
  transaction: Transaction,
  occurenceDate: Date = new Date()
): Omit<Transaction, "id" | "userId"> => {
  const date = new Date(occurenceDate);

  return {
    friendId: transaction.friendId,
    amount: transaction.amount,
    description: transaction.description,
    date: date.toISOString(),
    type: transaction.type,
    category: transaction.category,
    parentTransactionId: transaction.id,
  };
};

/**
 * Creates a human-readable string for the recurrence pattern
 */
export const getRecurrenceText = (interval: RecurrenceInterval): string => {
  switch (interval) {
    case "daily":
      return "Her gün";
    case "weekly":
      return "Her hafta";
    case "biweekly":
      return "İki haftada bir";
    case "monthly":
      return "Her ay";
    case "quarterly":
      return "Üç ayda bir";
    case "yearly":
      return "Her yıl";
  }
};

/**
 * Returns a more detailed description of the recurrence pattern
 */
export const getDetailedRecurrenceText = (transaction: Transaction): string => {
  if (!transaction.recurring || !transaction.recurring.isRecurring) {
    return "Tek seferlik işlem";
  }

  const interval = getRecurrenceText(transaction.recurring.interval);
  const startDate = new Date(
    transaction.recurring.startDate
  ).toLocaleDateString("tr-TR");

  let description = `${interval}, ${startDate} tarihinden itibaren`;

  if (transaction.recurring.endDate) {
    const endDate = new Date(transaction.recurring.endDate).toLocaleDateString(
      "tr-TR"
    );
    description += ` ${endDate} tarihine kadar`;
  } else {
    description += " süresiz olarak";
  }

  return description;
};
