import ProtectedLayout from "../protected-layout";

export default function FriendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
