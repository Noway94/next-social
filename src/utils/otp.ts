import { authenticator } from "otplib";

export function verifyOTP(token: string, secret: string) {
    return authenticator.verify({ token, secret });
  }
  
  export function generateOTPSecret() {
    return authenticator.generateSecret();
  }