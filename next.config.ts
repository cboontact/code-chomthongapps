import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["@fortawesome/react-fontawesome", "@fortawesome/free-solid-svg-icons"],
  },
};

export default nextConfig;
