// src/app/friends/page.tsx
import prisma from "@/lib/client";
import FriendsComponent from "@/components/FriendsComponent";

const FriendsPage = async ({ params }: { params: { userId: string } }) => {
  const friends = await prisma.follower.findMany({
    where: {
      followerId: params.userId,
    },
    include: {
      following: true,
    },
  });

  return <FriendsComponent friends={friends} />;
};

export default FriendsPage;
