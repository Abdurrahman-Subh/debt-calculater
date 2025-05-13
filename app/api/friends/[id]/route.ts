import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import {
  doc,
  getDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// DELETE a friend
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Friend ID is required" },
        { status: 400 }
      );
    }

    // Check if friend exists
    const friendRef = doc(db, "friends", id);
    const friendSnap = await getDoc(friendRef);

    if (!friendSnap.exists()) {
      return NextResponse.json({ error: "Friend not found" }, { status: 404 });
    }

    // Delete the friend
    await deleteDoc(friendRef);

    // Also delete related transactions
    const transactionsCollection = collection(db, "transactions");
    const q = query(transactionsCollection, where("friendId", "==", id));
    const transactionsSnapshot = await getDocs(q);

    const deletePromises = transactionsSnapshot.docs.map((docSnapshot) =>
      deleteDoc(doc(db, "transactions", docSnapshot.id))
    );

    await Promise.all(deletePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting friend:", error);
    return NextResponse.json(
      { error: "Failed to delete friend" },
      { status: 500 }
    );
  }
}

// GET a single friend
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Friend ID is required" },
        { status: 400 }
      );
    }

    const friendRef = doc(db, "friends", id);
    const friendSnap = await getDoc(friendRef);

    if (!friendSnap.exists()) {
      return NextResponse.json({ error: "Friend not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: friendSnap.id,
      ...friendSnap.data(),
    });
  } catch (error) {
    console.error("Error fetching friend:", error);
    return NextResponse.json(
      { error: "Failed to fetch friend" },
      { status: 500 }
    );
  }
}
