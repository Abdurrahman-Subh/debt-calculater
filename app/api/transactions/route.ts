import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

// GET all transactions
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const friendId = searchParams.get("friendId");

  try {
    const transactionsCollection = collection(db, "transactions");
    let queryRef;

    if (friendId) {
      // Get transactions for a specific friend
      queryRef = query(
        transactionsCollection,
        where("friendId", "==", friendId),
        orderBy("date", "desc")
      );
    } else {
      // Get all transactions
      queryRef = query(transactionsCollection, orderBy("date", "desc"));
    }

    const snapshot = await getDocs(queryRef);

    const transactions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// POST a new transaction
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { friendId, amount, type, description, date } = body;

    if (!friendId || !amount || !type || !date) {
      return NextResponse.json(
        {
          error: "Friend ID, amount, type, and date are required",
        },
        { status: 400 }
      );
    }

    // Validate transaction type
    if (!["borrowed", "lent", "payment"].includes(type)) {
      return NextResponse.json(
        {
          error: "Transaction type must be one of: borrowed, lent, payment",
        },
        { status: 400 }
      );
    }

    const transactionsCollection = collection(db, "transactions");
    const docRef = await addDoc(transactionsCollection, {
      friendId,
      amount: Number(amount),
      type,
      description: description || "",
      date,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        id: docRef.id,
        friendId,
        amount: Number(amount),
        type,
        description: description || "",
        date,
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding transaction:", error);
    return NextResponse.json(
      { error: "Failed to add transaction" },
      { status: 500 }
    );
  }
}
