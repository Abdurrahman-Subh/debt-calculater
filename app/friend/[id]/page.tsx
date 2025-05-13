import FriendDetailClient from "./FriendDetailClient";
import { Suspense } from "react";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export const metadata = {
  title: "Arkadaş Detayları | BorçTakip",
};

// Server component that properly unwraps the params
export default function FriendDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const friendId = params.id;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <FriendDetailClient friendId={friendId} />
    </Suspense>
  );
}
