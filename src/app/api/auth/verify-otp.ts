import { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from 'nookies';
import { verifyOTP } from '../../../utils/otp';
import prisma from '@/lib/client';

export default async function verifyOTPHandler(req: NextApiRequest, res: NextApiResponse) {
  const { email, otp } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.otpExpiresAt || !user.otpSecret || user.otpExpiresAt < new Date() || !verifyOTP(otp, user.otpSecret)) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  await prisma.user.update({
    where: { email },
    data: { otpToken: null, otpExpiresAt: null },
  });

  // Set session cookie
  setCookie({ res }, 'user', JSON.stringify({ id: user.id, email: user.email }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60, // 1 day
    path: '/',
  });

  res.status(200).json({ message: 'OTP verified and user logged in' });
}