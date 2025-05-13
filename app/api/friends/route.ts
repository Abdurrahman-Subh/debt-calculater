import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

// GET all friends
export async function GET() {
  try {
    const friendsCollection = collection(db, "friends");
    const snapshot = await getDocs(friendsCollection);

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

    const friendsCollection = collection(db, "friends");
    const docRef = await addDoc(friendsCollection, {
      name,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        id: docRef.id,
        name,
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
