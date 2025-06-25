import { ConnectDB } from "./config/db";
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  otp: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // TTL: 5 minutes
  },
});

const OtpModel = mongoose.models.Otp || mongoose.model("Otp", otpSchema);

export const setOtp = async (email, otp) => {
  await ConnectDB();
  await OtpModel.findOneAndUpdate(
    { email },
    { otp, createdAt: new Date() },
    { upsert: true, new: true }
  );
};

export const getOtp = async (email) => {
  await ConnectDB();
  const record = await OtpModel.findOne({ email });

  if (!record) return null;

  const isExpired = Date.now() - new Date(record.createdAt).getTime() > 5 * 60 * 1000;
  if (isExpired) {
    await deleteOtp(email);
    return "expired";
  }

  return record.otp;
};

export const deleteOtp = async (email) => {
  await ConnectDB();
  await OtpModel.deleteOne({ email });
};

export const getOtpTimestamp = async (email) => {
  await ConnectDB();
  const record = await OtpModel.findOne({ email });
  return record ? new Date(record.createdAt).getTime() : null;
};
