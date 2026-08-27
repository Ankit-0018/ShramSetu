import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.shramsetu.work";

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
  // Proxy backend calls through this app's own origin so the browser sees
  // same-origin requests — the backend's CORS allowlist (shramsetu.work
  // only) never comes into play, since the actual cross-origin call now
  // happens server-to-server (Next -> backend), which isn't CORS-checked.
  async rewrites() {
    return [
      { source: "/auth/:path*", destination: `${API_URL}/auth/:path*` },
      { source: "/api/v1/:path*", destination: `${API_URL}/api/v1/:path*` },
    ];
  },
};

export default nextConfig;
