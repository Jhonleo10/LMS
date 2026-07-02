/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Prefer explicit NEXTAUTH_URL; otherwise use each Vercel deployment's URL.
    NEXTAUTH_URL: process.env.NEXTAUTH_URL
      ? process.env.NEXTAUTH_URL
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
