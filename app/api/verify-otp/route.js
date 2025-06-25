//app\api\verify-otp\route.js
import { getOtp, deleteOtp } from "@/lib/otpStore";
import { fetchUserMap } from "@/lib/fetchUserMap";

export async function POST(req) {
  const { email, otp } = await req.json();
  const userMap = await fetchUserMap();
  const userEmail = email?.trim().toLowerCase();
  const savedOtp = await getOtp(userEmail);

if (savedOtp === "expired") {
  return Response.json({ success: false, message: "OTP expired. Please request a new one." });
}

if (savedOtp && savedOtp === otp) {
  await deleteOtp(userEmail);
  return Response.json({ success: true, uid: userMap[userEmail] });
}

return Response.json({ success: false, message: "Invalid OTP." });
}
