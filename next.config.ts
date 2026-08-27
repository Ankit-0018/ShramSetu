import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: __dirname,
  },
  images: {
    domains: ["images.unsplash.com"]
  },
   experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "*.devtunnels.ms"
      ],
    },
  },
};

export default nextConfig;
