import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  try {
    const friends = await prisma.follower.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: true,
      },
    });
    res.status(200).json(friends);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching friends' });
  }
}
