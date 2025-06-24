import { getOtp, deleteOtp } from "@/lib/otpStore";
import { fetchUserMap } from "@/lib/fetchUserMap";

export async function POST(req) {
  const { email, otp } = await req.json();
  const userMap = await fetchUserMap();
  const userEmail = email?.trim().toLowerCase();
  const savedOtp = getOtp(userEmail);

  if (savedOtp && savedOtp === otp) {
    deleteOtp(userEmail);
    return Response.json({ success: true, uid: userMap[userEmail] });
  }

  return Response.json({ success: false, message: "Invalid or expired OTP." });
}
