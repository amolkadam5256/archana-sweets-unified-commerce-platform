import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@archana/ui",
    "@archana/hooks",
    "@archana/utils",
    "@archana/constants",
    "@archana/types",
  ],
};

export default nextConfig;
