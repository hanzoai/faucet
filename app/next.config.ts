import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Disable features that don't work with static export
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
