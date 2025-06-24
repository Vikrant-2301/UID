import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "otps.json");

function readOtpStore() {
  if (!fs.existsSync(filePath)) return {};
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

function writeOtpStore(store) {
  fs.writeFileSync(filePath, JSON.stringify(store), "utf8");
}

export const setOtp = (email, otp) => {
  const store = readOtpStore();
  store[email] = { otp, time: Date.now() };
  writeOtpStore(store);
};

export const getOtp = (email) => {
  const store = readOtpStore();
  const record = store[email];
  if (!record) return null;

  const { otp, time } = record;
  const expired = Date.now() - time > 5 * 60 * 1000;
  return expired ? null : otp;
};

export const deleteOtp = (email) => {
  const store = readOtpStore();
  delete store[email];
  writeOtpStore(store);
};
