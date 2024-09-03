import { NextApiRequest, NextApiResponse } from 'next';

import { sendEmail } from '../../../utils/email';

import prisma from '@/lib/client';
import { generateOTPSecret } from '@/utils/otp';

export default async function sendOTP(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  const otp = generateOTPSecret();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

  await prisma.user.update({
    where: { email },
    data: { otpToken: otp, otpExpiresAt },
  });

  await sendEmail(email, 'Your OTP Code', `Your OTP code is ${otp}`);

  res.status(200).json({ message: 'OTP sent successfully' });
}