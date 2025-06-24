"use client";

import { useState } from "react";

export default function UIDVerificationPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [uid, setUid] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");

  const sendOtp = async () => {
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setMessage("OTP sent to your email.");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setStatus("idle");
    }
  };

  const verifyOtp = async () => {
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (data.success) {
        setUid(data.uid);
        setMessage("OTP verified successfully.");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Verification failed. Try again.");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-6 md:p-10 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Get Your UID</h1>
        <p className="text-center text-sm text-gray-600 mb-6">
          Verify your registered email to receive your Unique Identification Number for the Social Hub Design Competition.
        </p>

        {!otpSent ? (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={sendOtp}
              disabled={status === "loading"}
              className="w-full mt-4 py-2 px-4 bg-blue-900 text-white rounded-md hover:bg-black transition disabled:opacity-50"
            >
              {status === "loading" ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="Enter the 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={verifyOtp}
              disabled={status === "loading"}
              className="w-full mt-4 py-2 px-4 bg-blue-900 text-white rounded-md hover:bg-black transition disabled:opacity-50"
            >
              {status === "loading" ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {uid && (
          <div className="mt-6 text-center text-green-700 text-base font-medium bg-green-50 border border-green-200 rounded-md px-4 py-2">
            Your Unique ID: <strong>{uid}</strong>
          </div>
        )}

        {message && (
          <div className="mt-4 text-center text-sm text-red-600">
            {message}
          </div>
        )}

        <p className="mt-6 text-sm text-gray-500 text-center">
          Need help? Contact us at
          <a
            href="mailto:customercare.discoverarch@gmail.com"
            className="text-blue-600 ml-1 hover:underline"
          >
            customercare.discoverarch@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
