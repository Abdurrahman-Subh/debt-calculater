import { Suspense } from "react";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import TransactionDetailClient from "./TransactionDetailClient";

export const metadata = {
  title: "İşlem Detayları | Muhasebeji",
};

// Server component that properly unwraps the params
export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: transactionId } = await params;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TransactionDetailClient transactionId={transactionId} />
    </Suspense>
  );
}
