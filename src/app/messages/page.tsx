import { getFriends } from "@/lib/getFriends";
import MessageComponent from "@/components/MessageComponent";
import { auth } from "@clerk/nextjs/server";

const Messages = async ({ params }: { params: { friendsId: string } }) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) {
    console.log("User is not authenticated");
    return <div>Loading...</div>; // Or handle unauthenticated state appropriately
  }

 // console.log("Current User ID:", currentUserId);
  const friends = await getFriends(params.friendsId);
  return <MessageComponent friends={friends} userId={currentUserId} />;
};

export default Messages;
