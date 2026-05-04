import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zqtgjfzmrfywaaulzoaw.supabase.co",
      },
    ],
  },
};

export default nextConfig;
