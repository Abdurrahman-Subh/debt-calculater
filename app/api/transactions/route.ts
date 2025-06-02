import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  FirestoreError,
} from "firebase/firestore";

// Helper function to extract user ID from authorization header
function getUserIdFromHeader(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Extract the token
      const token = authHeader.substring(7);
      if (token && token.length > 0) {
        return token;
      }
    }

    // If we're here, either no auth header or invalid format
    return null;
  } catch (error) {
    console.error("Error extracting user ID from header:", error);
    return null;
  }
}

// Helper function to handle Firestore index errors and extract the creation URL
function handleIndexError(error: any): {
  message: string;
  indexUrl: string | null;
} {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "failed-precondition"
  ) {
    // This is likely an index error
    const errorMessage = error.toString();
    const urlMatch = errorMessage.match(
      /https:\/\/console\.firebase\.google\.com[^\s]+/
    );
    if (urlMatch) {
      return {
        message:
          "This query requires a Firestore index. Click the link in the error message to create it.",
        indexUrl: urlMatch[0],
      };
    }
  }

  return {
    message: error instanceof Error ? error.message : String(error),
    indexUrl: null,
  };
}

// GET all transactions
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const friendId = searchParams.get("friendId");

  // Get user ID from authorization header
  const userId = getUserIdFromHeader(request);

  // For debugging only - in production you would not use a fallback ID
  // This is for development to help identify auth issues
  const effectiveUserId = userId || "dev-fallback-id";

  if (!userId) {
    console.warn(
      "No user ID found in request - using fallback ID for development"
    );
    // In production you would return an error here:
    /*
    return NextResponse.json(
      { error: "Unauthorized - you must be logged in" },
      { status: 401 }
    );
    */
  }

  try {
    const transactionsCollection = collection(db, "transactions");
    let queryRef;

    // Always filter by userId first
    if (friendId) {
      // Get transactions for a specific friend and the current user
      queryRef = query(
        transactionsCollection,
        where("userId", "==", effectiveUserId),
        where("friendId", "==", friendId),
        orderBy("date", "desc")
      );
    } else {
      // Get all transactions for the current user
      queryRef = query(
        transactionsCollection,
        where("userId", "==", effectiveUserId),
        orderBy("date", "desc")
      );
    }

    const snapshot = await getDocs(queryRef);

    const transactions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);

    // Handle Firestore index errors specifically
    const { message, indexUrl } = handleIndexError(error);

    return NextResponse.json(
      {
        error: `Failed to fetch transactions: ${message}`,
        indexUrl: indexUrl, // Include the index creation URL if available
      },
      { status: 500 }
    );
  }
}

// POST a new transaction
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      friendId,
      amount,
      type,
      description,
      date,
      category,
      recurring,
      originalDebtId,
    } = body;

    if (!amount || !type || !date) {
      return NextResponse.json(
        {
          error: "Amount, type, and date are required",
        },
        { status: 400 }
      );
    }

    // For non-expense transactions, friendId is required
    if (type !== "expense" && !friendId) {
      return NextResponse.json(
        {
          error: "Friend ID is required for non-expense transactions",
        },
        { status: 400 }
      );
    }

    // For partial payments, originalDebtId is required
    if (type === "partial-payment" && !originalDebtId) {
      return NextResponse.json(
        {
          error: "Original debt ID is required for partial payments",
        },
        { status: 400 }
      );
    }

    // Validate transaction type
    if (
      !["borrowed", "lent", "payment", "expense", "partial-payment"].includes(
        type
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Transaction type must be one of: borrowed, lent, payment, expense, partial-payment",
        },
        { status: 400 }
      );
    }

    // Get user ID from authorization header
    const userId = getUserIdFromHeader(request);

    // For debugging only - in production you would not use a fallback ID
    const effectiveUserId = userId || "dev-fallback-id";

    if (!userId) {
      console.warn(
        "No user ID found in POST request - using fallback ID for development"
      );
      // In production you would return an error here
      /*
      return NextResponse.json(
        { error: "Unauthorized - you must be logged in" },
        { status: 401 }
      );
      */
    }

    const transactionData: Record<string, any> = {
      amount: Number(amount),
      type,
      description: description || "",
      date,
      userId: effectiveUserId,
      createdAt: new Date().toISOString(),
    };

    // Add friendId only for non-expense transactions
    if (type !== "expense" && friendId) {
      transactionData.friendId = friendId;
    }

    // Add optional fields if they exist
    if (category) {
      transactionData.category = category;
    }

    if (recurring) {
      transactionData.recurring = recurring;
    }

    if (originalDebtId) {
      transactionData.originalDebtId = originalDebtId;
    }

    const transactionsCollection = collection(db, "transactions");
    const docRef = await addDoc(transactionsCollection, transactionData);

    // Return the complete transaction data including the new ID
    return NextResponse.json(
      {
        id: docRef.id,
        ...transactionData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding transaction:", error);

    // Handle Firestore index errors specifically
    const { message, indexUrl } = handleIndexError(error);

    return NextResponse.json(
      {
        error: `Failed to add transaction: ${message}`,
        indexUrl: indexUrl, // Include the index creation URL if available
      },
      { status: 500 }
    );
  }
}
