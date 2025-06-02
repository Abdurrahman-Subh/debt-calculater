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
  updateDoc,
} from "firebase/firestore";

// Helper function to extract user ID from authorization header
function getUserIdFromHeader(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Extract the token
    return authHeader.substring(7);
  }

  return null;
}

// DELETE a friend by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Get user ID from authorization header
  const userId = getUserIdFromHeader(request);

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized - you must be logged in" },
      { status: 401 }
    );
  }

  try {
    // First, verify that the friend belongs to the current user
    const friendRef = doc(db, "friends", id);
    const friendDoc = await getDoc(friendRef);

    if (!friendDoc.exists()) {
      return NextResponse.json({ error: "Friend not found" }, { status: 404 });
    }

    const friendData = friendDoc.data();

    // If the friend does not belong to the current user, deny access
    if (friendData.userId !== userId) {
      return NextResponse.json(
        {
          error:
            "Unauthorized - you do not have permission to delete this friend",
        },
        { status: 403 }
      );
    }

    // Delete the friend
    await deleteDoc(friendRef);

    // Delete all associated transactions
    const transactionsCollection = collection(db, "transactions");
    const transactionsQuery = query(
      transactionsCollection,
      where("friendId", "==", id),
      where("userId", "==", userId)
    );

    const transactionSnapshot = await getDocs(transactionsQuery);

    // Delete all transactions for this friend
    const deletePromises = transactionSnapshot.docs.map((transactionDoc) => {
      return deleteDoc(doc(db, "transactions", transactionDoc.id));
    });

    await Promise.all(deletePromises);

    return NextResponse.json(
      { message: "Friend and associated transactions deleted successfully" },
      { status: 200 }
    );
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

// PATCH to update a friend
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Get user ID from authorization header
  const userId = getUserIdFromHeader(request);

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized - you must be logged in" },
      { status: 401 }
    );
  }

  try {
    // First, verify that the friend belongs to the current user
    const friendRef = doc(db, "friends", id);
    const friendDoc = await getDoc(friendRef);

    if (!friendDoc.exists()) {
      return NextResponse.json({ error: "Friend not found" }, { status: 404 });
    }

    const friendData = friendDoc.data();

    // If the friend does not belong to the current user, deny access
    if (friendData.userId !== userId) {
      return NextResponse.json(
        {
          error:
            "Unauthorized - you do not have permission to update this friend",
        },
        { status: 403 }
      );
    }

    // Get update data from request
    const updateData = await request.json();

    // Validate the update data
    if (!updateData.name || updateData.name.trim() === "") {
      return NextResponse.json(
        { error: "Friend name cannot be empty" },
        { status: 400 }
      );
    }

    // Update the friend
    await updateDoc(friendRef, {
      name: updateData.name.trim(),
      updatedAt: new Date().toISOString(),
    });

    // Get the updated friend
    const updatedFriendDoc = await getDoc(friendRef);

    return NextResponse.json({
      id: updatedFriendDoc.id,
      ...updatedFriendDoc.data(),
    });
  } catch (error) {
    console.error("Error updating friend:", error);
    return NextResponse.json(
      { error: "Failed to update friend" },
      { status: 500 }
    );
  }
}
