import ProtectedLayout from "../protected-layout";

export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
