import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@vyomai/insights", "@vyomai/api-client", "@vyomai/ui"],
};

export default nextConfig;
