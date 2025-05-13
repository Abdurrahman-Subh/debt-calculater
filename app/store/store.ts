import { create } from "zustand";
import { Friend, Transaction, DebtSummary } from "../types";
import { persist } from "zustand/middleware";
import { auth } from "@/app/lib/firebase";

interface DebtState {
  friends: Friend[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  indexUrl: string | null;

  // Methods
  fetchFriends: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  addFriend: (friend: Omit<Friend, "id" | "userId">) => Promise<Friend>;
  deleteFriend: (id: string) => Promise<void>;
  addTransaction: (
    transaction: Omit<Transaction, "id" | "userId">
  ) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;
  getDebtSummaries: () => DebtSummary[];
  getTransactionsForFriend: (friendId: string) => Transaction[];
  clearError: () => void;
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

// Helper function to get the current user ID with better error handling
const getCurrentUserId = (): string | null => {
  try {
    return auth.currentUser?.uid ?? null;
  } catch (error) {
    console.error("Error getting current user ID:", error);
    return null;
  }
};

// Helper to add authorization header to fetch requests
const addAuthHeader = (): HeadersInit => {
  const userId = getCurrentUserId();
  console.log(
    "Current user ID for request:",
    userId ? "authenticated" : "not authenticated"
  );
  return {
    "Content-Type": "application/json",
    Authorization: userId ? `Bearer ${userId}` : "",
  };
};

export const useDebtStore = create<DebtState>()(
  persist(
    (set, get) => ({
      friends: [],
      transactions: [],
      isLoading: false,
      error: null,
      indexUrl: null,

      clearError: () => set({ error: null, indexUrl: null }),

      fetchFriends: async () => {
        const userId = getCurrentUserId();

        // Wait for a brief moment to allow authentication to settle
        if (!userId) {
          console.log(
            "User not authenticated yet, waiting before fetching friends..."
          );
          // If no user ID, first wait for a short time in case auth is still initializing
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Check again after waiting
          const delayedUserId = getCurrentUserId();
          if (!delayedUserId) {
            console.log(
              "Still no user ID after waiting, aborting friends fetch"
            );
            set({
              error: "You must be logged in to view friends",
              isLoading: false,
              friends: [],
            });
            return;
          }
        }

        set({ isLoading: true, error: null, indexUrl: null });
        try {
          console.log("Fetching friends from API...");
          const response = await fetch("/api/friends", {
            headers: addAuthHeader(),
          });

          console.log("Friends response status:", response.status);
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Friends API error:", errorData);
            throw new Error(
              errorData.error || `Failed to fetch friends: ${response.status}`
            );
          }

          const data = await response.json();
          console.log(`Fetched ${data.length} friends successfully`);
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
        const userId = getCurrentUserId();

        // Wait for a brief moment to allow authentication to settle
        if (!userId) {
          console.log(
            "User not authenticated yet, waiting before fetching transactions..."
          );
          // If no user ID, first wait for a short time in case auth is still initializing
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Check again after waiting
          const delayedUserId = getCurrentUserId();
          if (!delayedUserId) {
            console.log(
              "Still no user ID after waiting, aborting transaction fetch"
            );
            set({
              error: "You must be logged in to view transactions",
              isLoading: false,
              transactions: [],
            });
            return;
          }
        }

        set({ isLoading: true, error: null, indexUrl: null });
        try {
          console.log("Fetching transactions from API...");
          const response = await fetch("/api/transactions", {
            headers: addAuthHeader(),
          });

          console.log("Transaction response status:", response.status);
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Transaction API error:", errorData);

            // Check if this is an index error
            if (errorData.indexUrl) {
              set({
                error:
                  errorData.error || "This query requires a Firestore index",
                indexUrl: errorData.indexUrl,
                isLoading: false,
              });
              return;
            }

            throw new Error(
              errorData.error ||
                `Failed to fetch transactions: ${response.status}`
            );
          }

          const data = await response.json();
          console.log(`Fetched ${data.length} transactions successfully`);
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
        const userId = getCurrentUserId();
        if (!userId) {
          throw new Error("You must be logged in to add a friend");
        }

        set({ isLoading: true, error: null, indexUrl: null });
        try {
          const response = await fetch("/api/friends", {
            method: "POST",
            headers: addAuthHeader(),
            body: JSON.stringify(friend),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to add friend");
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
        const userId = getCurrentUserId();
        if (!userId) {
          throw new Error("You must be logged in to delete a friend");
        }

        set({ isLoading: true, error: null, indexUrl: null });
        try {
          const response = await fetch(`/api/friends/${id}`, {
            method: "DELETE",
            headers: addAuthHeader(),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to delete friend");
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
        const userId = getCurrentUserId();
        if (!userId) {
          throw new Error("You must be logged in to add a transaction");
        }

        set({ isLoading: true, error: null, indexUrl: null });
        try {
          const response = await fetch("/api/transactions", {
            method: "POST",
            headers: addAuthHeader(),
            body: JSON.stringify(transaction),
          });

          if (!response.ok) {
            const errorData = await response.json();

            // Check if this is an index error
            if (errorData.indexUrl) {
              set({
                error:
                  errorData.error ||
                  "This transaction requires a Firestore index",
                indexUrl: errorData.indexUrl,
                isLoading: false,
              });
              throw new Error(
                errorData.error || "This transaction requires a Firestore index"
              );
            }

            throw new Error(errorData.error || "Failed to add transaction");
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
        const userId = getCurrentUserId();
        if (!userId) {
          throw new Error("You must be logged in to delete a transaction");
        }

        set({ isLoading: true, error: null, indexUrl: null });
        try {
          const response = await fetch(`/api/transactions/${id}`, {
            method: "DELETE",
            headers: addAuthHeader(),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to delete transaction");
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
      partialize: (state) => ({
        // Don't persist these fields in localStorage
        friends: [],
        transactions: [],
      }),
    }
  )
);
