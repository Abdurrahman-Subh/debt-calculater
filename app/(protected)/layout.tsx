import ProtectedLayout from "../protected-layout";

export default function ProtectedRouteGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
