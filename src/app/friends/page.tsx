// src/app/friends/page.tsx
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
      followerId: params.userId,
    },
    include: {
      following: true,
    },
  });

  return <FriendsList friends={friends}  currentUserId={currentUserId} />;
};

export default FriendsPage;
