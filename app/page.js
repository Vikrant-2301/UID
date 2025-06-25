"use client";

import { useState, useEffect } from "react";

export default function UIDVerificationPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [uid, setUid] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    if (resendCooldown > 0) {
      const interval = setInterval(() => {
        setResendCooldown((c) => c - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendCooldown]);

  const sendOtp = async () => {
    if (!email.trim()) {
      setMessage("Please enter your email.");
      return;
    }

    if (resendCooldown > 0) return;

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
        setResendCooldown(30);
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
    if (!otp.trim()) {
      setMessage("Please enter the OTP.");
      return;
    }

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
        setShowSuccessPopup(true);
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
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-xl w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Get Your UID
          </h1>
          <p className="text-center text-sm text-gray-600 mb-6">
            Verify your registered email to receive your Unique Identification Number for the Social Hub Design Competition.
          </p>

          {!otpSent ? (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-gray-900 bg-white"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={sendOtp}
                disabled={status === "loading" || resendCooldown > 0}
                className="w-full mt-4 py-2 px-4 bg-blue-900 text-white rounded-md hover:bg-black transition disabled:opacity-50"
              >
                {status === "loading"
                  ? "Sending OTP..."
                  : resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Send OTP"}
              </button>
            </>
          ) : (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none transition text-gray-900 bg-white"
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
              <button
                onClick={sendOtp}
                disabled={resendCooldown > 0}
                className="w-full mt-3 py-2 px-4 border border-blue-900 text-blue-900 rounded-md hover:bg-blue-50 transition disabled:opacity-50"
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend OTP"}
              </button>
            </>
          )}

          {message && (
            <div className="mt-4 text-center text-sm text-red-600">{message}</div>
          )}

          <p className="mt-6 text-sm text-gray-500 text-center">
            Need help? Contact us at{" "}
            <a
              href="mailto:customercare.discoverarch@gmail.com"
              className="text-blue-600 ml-1 hover:underline"
            >
              customercare.discoverarch@gmail.com
            </a>
          </p>
        </div>
      </div>

      {/* ✅ Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-xl text-center animate-fade-in">
            <h2 className="text-3xl font-bold text-green-600 mb-4">Thank You!</h2>
            <p className="text-gray-700 mb-3">Your Unique ID has been generated:</p>
            <div className="bg-green-100 text-green-800 rounded-md py-2 px-4 font-mono text-lg mb-4">
              {uid}
            </div>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
