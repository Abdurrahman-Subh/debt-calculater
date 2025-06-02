import FriendDetailClient from "./FriendDetailClient";
import { Suspense } from "react";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export const metadata = {
  title: "Arkadaş Detayları | Muhasebeji",
};

// Server component that properly unwraps the params
export default async function FriendDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: friendId } = await params;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <FriendDetailClient friendId={friendId} />
    </Suspense>
  );
}
