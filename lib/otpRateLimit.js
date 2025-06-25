// lib/otpRateLimit.js
const lastOtpMap = {};

export const getOtpTimestamp = async (email) => {
  return lastOtpMap[email];
};

export const updateOtpTimestamp = async (email) => {
  lastOtpMap[email] = Date.now();
};
