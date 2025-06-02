import SharedTransactionPageClient from "./SharedTransactionPageClient";

// Server component that properly unwraps the params
export default async function SharedTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SharedTransactionPageClient id={id} />;
}
