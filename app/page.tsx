"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import LoadingSpinner from "./components/LoadingSpinner";

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/home");
      } else {
        router.push("/signin");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <LoadingSpinner />
    </div>
  );
}
