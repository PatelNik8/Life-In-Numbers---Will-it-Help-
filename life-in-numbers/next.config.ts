import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google OAuth avatars
      { protocol: "https", hostname: "avatars.githubusercontent.com" }, // GitHub avatars
      { protocol: "https", hostname: "res.cloudinary.com" }, // Cloudinary uploads
    ],
  },
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
};

export default nextConfig;
