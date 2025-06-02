import SharedFriendPageClient from "./SharedFriendPageClient";

// Server component that properly unwraps the params
export default async function SharedFriendPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SharedFriendPageClient id={id} />;
}
