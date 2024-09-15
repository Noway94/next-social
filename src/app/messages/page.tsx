import { getFriends } from "@/lib/getFriends";
import prisma from "@/lib/client";

import MessageComponent from "@/components/MessageComponent";
import { auth } from "@clerk/nextjs/server";

const Messages = async ({ params }: { params: { friendsId: string } }) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) {
    console.log("User is not authenticated");
    return <div>Loading...</div>; // Or handle unauthenticated state appropriately
  }

 // console.log("Current User ID:", currentUserId);
 const friends = await prisma.follower.findMany({
  where: {
    followerId: currentUserId,
  },
  include: {
    following: true,
  },
});
const formattedFriends = friends.map(friend => ({
  following: {
    id: friend.following.id,
    username: friend.following.username,
    avatar: friend.following.avatar,
  },
}));
  return <MessageComponent friends={formattedFriends} userId={currentUserId} />;
};

export default Messages;
