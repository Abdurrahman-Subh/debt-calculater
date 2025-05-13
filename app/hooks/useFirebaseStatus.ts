import { useState, useEffect } from "react";
import { db } from "@/app/lib/firebase";
import { collection, getDocs, limit, query } from "firebase/firestore";

export const useFirebaseStatus = () => {
  const [status, setStatus] = useState<"checking" | "connected" | "error">(
    "checking"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Try to fetch a single document from any collection to verify connection
        const testQuery = query(collection(db, "friends"), limit(1));
        await getDocs(testQuery);

        setStatus("connected");
        setError(null);
      } catch (err) {
        console.error("Firebase connection error:", err);
        setStatus("error");
        setError(
          err instanceof Error ? err.message : "Could not connect to Firebase"
        );
      }
    };

    checkConnection();
  }, []);

  return { status, error, isConnected: status === "connected" };
};

export default useFirebaseStatus;
