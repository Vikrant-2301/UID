// lib/config/db.js
import mongoose from "mongoose";

let isConnected = false;

export async function ConnectDB() {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("❌ MONGODB_URI is not defined in environment variables.");
  }

  try {
    await mongoose.connect(uri, {
      dbName: "discoverarch-otp", // customize as needed
    });

    isConnected = true;
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    throw err;
  }
}
