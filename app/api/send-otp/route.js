import nodemailer from "nodemailer";
import { setOtp } from "@/lib/otpStore";
import { fetchUserMap } from "@/lib/fetchUserMap";

export async function POST(req) {
  const { email } = await req.json();
  const userMap = await fetchUserMap();
  const userEmail = email?.trim().toLowerCase();

  if (!userMap[userEmail]) {
    return Response.json({ success: false, message: "Email not registered." });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  setOtp(userEmail, otp);
  console.log(`OTP for ${userEmail}: ${otp}`);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
  from: `"DiscoverArch Team" <${process.env.EMAIL_ID}>`,
  to: email,
  subject: "Your DiscoverArch OTP for Verification",
  html: `
    <p>Hi,</p>
    <p>Your One-Time Password (OTP) for verifying your UID on <strong>DiscoverArch</strong> is:</p>
    <h2 style="color: #4CAF50;">${otp}</h2>
    <p>Please enter this OTP to complete your verification. <strong>Do not share</strong> this code with anyone.</p>
    <p>This OTP is valid for the next <strong>10 minutes</strong>.</p>
    <p>If you did not request this, please ignore this email.</p>
    <br/>
    <p>Thanks,<br/>DiscoverArch Team</p>
  `,
});


  return Response.json({ success: true });
}
