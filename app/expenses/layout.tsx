import ProtectedLayout from "../protected-layout";

export default function ExpensesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
