import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: "/diffusion-all-methods",
        destination: "/visualizations/diffusion-all-methods",
      },
    ];
  },
};

export default nextConfig;
