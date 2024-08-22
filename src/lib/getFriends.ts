// src/lib/getFriends.ts
import prisma from "@/lib/client";

export const getFriends = async (userId: string) => {
  const friends = await prisma.follower.findMany({
    where: {
      followerId: userId,
    },
    include: {
      following: true,
    },
  });

  return friends;
};
