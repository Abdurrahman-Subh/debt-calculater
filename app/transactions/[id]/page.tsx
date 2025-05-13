import { Suspense } from "react";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import TransactionDetailClient from "./TransactionDetailClient";

export const metadata = {
  title: "İşlem Detayları | BorçTakip",
};

// Server component that properly unwraps the params
export default function TransactionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const transactionId = params.id;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TransactionDetailClient transactionId={transactionId} />
    </Suspense>
  );
}
