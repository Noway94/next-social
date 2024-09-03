import nodemailer from 'nodemailer';

export const sendOtp = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${token}`,
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    console.log('OTP sent successfully', response);
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};
