import { NextResponse } from "next/server";
import { db, auth } from "@/app/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { cookies } from "next/headers";

// Helper function to extract user ID from authorization header
function getUserIdFromHeader(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Extract the token
    return authHeader.substring(7);
  }

  return null;
}

// GET all friends for the current user
export async function GET(request: Request) {
  try {
    // Get user ID from authorization header
    const userId = getUserIdFromHeader(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - you must be logged in" },
        { status: 401 }
      );
    }

    const friendsCollection = collection(db, "friends");
    // Only get friends for the current user
    const friendsQuery = query(
      friendsCollection,
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(friendsQuery);

    const friends = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(friends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json(
      { error: "Failed to fetch friends" },
      { status: 500 }
    );
  }
}

// POST a new friend
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Friend name is required" },
        { status: 400 }
      );
    }

    // Get user ID from authorization header
    const userId = getUserIdFromHeader(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - you must be logged in" },
        { status: 401 }
      );
    }

    const friendsCollection = collection(db, "friends");
    const docRef = await addDoc(friendsCollection, {
      name,
      userId, // Associate the friend with the current user
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        id: docRef.id,
        name,
        userId, // Include the userId in the response
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding friend:", error);
    return NextResponse.json(
      { error: "Failed to add friend" },
      { status: 500 }
    );
  }
}
