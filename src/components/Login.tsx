import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOtp = async () => {
    try {
      await axios.post('/api/auth/send-otp', { email });
      setMessage('OTP sent to your email');
    } catch (error:any) {
      setMessage(error.response?.data?.error || 'An error occurred');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('/api/auth/verify-otp', { email, otp });
      setMessage(response.data.message);
    } catch (error:any) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <button onClick={handleSendOtp}>Send OTP</button>

      <input type="text" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
      <button onClick={handleVerifyOtp}>Verify OTP</button>

      <p>{message}</p>
    </div>
  );
};

export default Login;