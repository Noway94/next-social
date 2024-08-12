// pages/api/following.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/client';
import { auth } from '@clerk/nextjs/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = auth();

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const followings = await prisma.follower.findMany({
      where: { followerId: userId },
      include: { following: true },
    });
    res.status(200).json(followings);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
