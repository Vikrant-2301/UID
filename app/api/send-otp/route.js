import nodemailer from "nodemailer";
import { setOtp, getOtpTimestamp } from "@/lib/otpStore";
import { fetchUserMap } from "@/lib/fetchUserMap";

export async function POST(req) {
  const { email } = await req.json();
  const userMap = await fetchUserMap();
  const userEmail = email?.trim().toLowerCase();

  if (!userMap[userEmail]) {
    return Response.json({ success: false, message: "Email not registered." });
  }

  // Rate limiting: block if requested within last 30s
  const lastOtpTime = await getOtpTimestamp(userEmail);
  if (lastOtpTime && Date.now() - lastOtpTime < 30 * 1000) {
    return Response.json({
      success: false,
      message: "Please wait before requesting a new OTP.",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await setOtp(userEmail, otp);
  console.log(`OTP for ${userEmail}: ${otp}`);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_ID,
    to: email,
    subject: "Your OTP for UID verification",
    text: `Your OTP is: ${otp}`,
  });

  return Response.json({ success: true });
}
