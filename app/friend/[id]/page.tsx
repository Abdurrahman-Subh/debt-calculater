import FriendDetailClient from "./FriendDetailClient";

// Server component that properly unwraps the params
export default function FriendDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // In a server component, we can directly use params without React.use()
  // Next.js warns about direct access to params.id, but at this level we can safely use it
  return <FriendDetailClient friendId={params.id} />;
}
