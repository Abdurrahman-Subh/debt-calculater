import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

// Helper function to extract user ID from authorization header
function getUserIdFromHeader(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Extract the token
    return authHeader.substring(7);
  }

  return null;
}

// DELETE a transaction by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  // Get user ID from authorization header
  const userId = getUserIdFromHeader(request);

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized - you must be logged in" },
      { status: 401 }
    );
  }

  try {
    // First, verify that the transaction belongs to the current user
    const transactionRef = doc(db, "transactions", id);
    const transactionDoc = await getDoc(transactionRef);

    if (!transactionDoc.exists()) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    const transactionData = transactionDoc.data();

    // If the transaction does not belong to the current user, deny access
    if (transactionData.userId !== userId) {
      return NextResponse.json(
        {
          error:
            "Unauthorized - you do not have permission to delete this transaction",
        },
        { status: 403 }
      );
    }

    // Delete the transaction
    await deleteDoc(transactionRef);

    return NextResponse.json(
      { message: "Transaction deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
