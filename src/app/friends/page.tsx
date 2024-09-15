import prisma from "@/lib/client";
import FriendsList from "@/components/FriendsList";
import { auth } from "@clerk/nextjs/server";

const FriendsPage = async ({ params }: { params: { userId: string } }) => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) {
    console.log("User is not authenticated");
    return <div>Loading...</div>; // Or handle unauthenticated state appropriately
  }

  const friends = await prisma.follower.findMany({
    where: {
      followerId: currentUserId,
    },
    include: {
      following: true,
    },
  });

  //console.log("Raw Friends Data for User:", currentUserId, friends);

  const formattedFriends = friends.map(friend => ({
    following: {
      id: friend.following.id,
      username: friend.following.username,
      avatar: friend.following.avatar,
    },
  }));

 // console.log("Formatted Friends Data for User:", params.userId, formattedFriends);

  return <FriendsList friends={formattedFriends} currentUserId={currentUserId} />;
};

export default FriendsPage;
