import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { NextRequest, NextResponse } from "next/server";

// Helper function to extract user ID from authorization header
function getUserIdFromHeader(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Extract the token
    return authHeader.substring(7);
  }

  return null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = getUserIdFromHeader(request);

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized: Please log in" },
      { status: 401 }
    );
  }

  const transactionId = params.id;

  if (!transactionId) {
    return NextResponse.json(
      { error: "Transaction ID is required" },
      { status: 400 }
    );
  }

  try {
    // First, check if the transaction exists and belongs to the user
    const transactionRef = doc(db, "transactions", transactionId);
    const transactionSnapshot = await getDoc(transactionRef);

    if (!transactionSnapshot.exists()) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    const transactionData = transactionSnapshot.data();

    if (transactionData.userId !== userId) {
      return NextResponse.json(
        {
          error:
            "Unauthorized: You don't have permission to update this transaction",
        },
        { status: 403 }
      );
    }

    // Get the update data from the request
    const updates = await request.json();

    // Don't allow updating userId or id
    delete updates.userId;
    delete updates.id;

    // Update the transaction
    await updateDoc(transactionRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    // Fetch the updated transaction
    const updatedSnapshot = await getDoc(transactionRef);

    if (!updatedSnapshot.exists()) {
      return NextResponse.json(
        { error: "Failed to retrieve updated transaction" },
        { status: 500 }
      );
    }

    // Return the updated transaction
    return NextResponse.json({
      id: updatedSnapshot.id,
      ...updatedSnapshot.data(),
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = getUserIdFromHeader(request);

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized: Please log in" },
      { status: 401 }
    );
  }

  const transactionId = params.id;

  if (!transactionId) {
    return NextResponse.json(
      { error: "Transaction ID is required" },
      { status: 400 }
    );
  }

  try {
    // Check if the transaction exists and belongs to the user
    const transactionRef = doc(db, "transactions", transactionId);
    const transactionDoc = await getDoc(transactionRef);

    if (!transactionDoc.exists()) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    const transaction = transactionDoc.data();

    if (transaction.userId !== userId) {
      return NextResponse.json(
        {
          error:
            "Unauthorized: You don't have permission to delete this transaction",
        },
        { status: 403 }
      );
    }

    // Delete the transaction
    await deleteDoc(transactionRef);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
