import ProtectedLayout from "../protected-layout";

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
