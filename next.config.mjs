/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GOOGLE_SHEET_API: process.env.GOOGLE_SHEET_API, // This allows access from process.env.GOOGLE_SHEET_API on both client and server
  },
};

export default nextConfig;
