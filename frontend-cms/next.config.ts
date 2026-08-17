import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // TypeScript errors build fail nahi karenge
    ignoreBuildErrors: true,
  },
};

export default nextConfig;