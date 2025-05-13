import { create } from "zustand";
import { Friend, Transaction, DebtSummary } from "../types";
import { persist } from "zustand/middleware";

interface DebtState {
  friends: Friend[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;

  // Methods
  fetchFriends: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  addFriend: (friend: Omit<Friend, "id">) => Promise<Friend>;
  deleteFriend: (id: string) => Promise<void>;
  addTransaction: (
    transaction: Omit<Transaction, "id">
  ) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;
  getDebtSummaries: () => DebtSummary[];
  getTransactionsForFriend: (friendId: string) => Transaction[];
}

// Calculate the debt summaries based on friends and transactions
const calculateDebtSummaries = (
  friends: Friend[],
  transactions: Transaction[]
): DebtSummary[] => {
  return friends.map((friend) => {
    const friendTransactions = transactions.filter(
      (t) => t.friendId === friend.id
    );

    // Calculate total borrowed (positive for you)
    const totalBorrowed = friendTransactions
      .filter((t) => t.type === "borrowed")
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate total lent (negative for you)
    const totalLent = friendTransactions
      .filter((t) => t.type === "lent")
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate total payments (negative for you)
    const totalPayments = friendTransactions
      .filter((t) => t.type === "payment")
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate final balance (positive means they owe you, negative means you owe them)
    const balance = totalBorrowed - totalLent - totalPayments;

    return {
      friendId: friend.id,
      friendName: friend.name,
      totalBorrowed,
      totalLent,
      totalPayments,
      balance,
      transactions: friendTransactions,
    };
  });
};

export const useDebtStore = create<DebtState>()(
  persist(
    (set, get) => ({
      friends: [],
      transactions: [],
      isLoading: false,
      error: null,

      fetchFriends: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/friends");
          if (!response.ok) {
            throw new Error("Failed to fetch friends");
          }
          const data = await response.json();
          set({ friends: data, isLoading: false });
        } catch (error) {
          console.error("Error fetching friends:", error);
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
        }
      },

      fetchTransactions: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/transactions");
          if (!response.ok) {
            throw new Error("Failed to fetch transactions");
          }
          const data = await response.json();
          set({ transactions: data, isLoading: false });
        } catch (error) {
          console.error("Error fetching transactions:", error);
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
        }
      },

      addFriend: async (friend) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/friends", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(friend),
          });

          if (!response.ok) {
            throw new Error("Failed to add friend");
          }

          const newFriend = await response.json();
          set((state) => ({
            friends: [...state.friends, newFriend],
            isLoading: false,
          }));

          return newFriend;
        } catch (error) {
          console.error("Error adding friend:", error);
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },

      deleteFriend: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/friends/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Failed to delete friend");
          }

          set((state) => ({
            friends: state.friends.filter((f) => f.id !== id),
            transactions: state.transactions.filter((t) => t.friendId !== id),
            isLoading: false,
          }));
        } catch (error) {
          console.error("Error deleting friend:", error);
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },

      addTransaction: async (transaction) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/transactions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(transaction),
          });

          if (!response.ok) {
            throw new Error("Failed to add transaction");
          }

          const newTransaction = await response.json();
          set((state) => ({
            transactions: [...state.transactions, newTransaction],
            isLoading: false,
          }));

          return newTransaction;
        } catch (error) {
          console.error("Error adding transaction:", error);
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },

      deleteTransaction: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/transactions/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Failed to delete transaction");
          }

          set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          console.error("Error deleting transaction:", error);
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },

      getDebtSummaries: () => {
        return calculateDebtSummaries(get().friends, get().transactions);
      },

      getTransactionsForFriend: (friendId: string) => {
        return get().transactions.filter((t) => t.friendId === friendId);
      },
    }),
    {
      name: "debt-tracker-storage",
    }
  )
);
