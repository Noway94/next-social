import bcrypt from 'bcryptjs';
import { generateOTPSecret } from '../../../utils/otp';

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/client';

export default async function signup(req: NextApiRequest, res: NextApiResponse) {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      id: crypto.randomUUID(), // Make sure you set ID manually if Prisma complains
      email,
      username,
      password: hashedPassword,
      otpSecret: generateOTPSecret(),
    },
  });

  res.status(200).json({ message: 'User created successfully' });
}