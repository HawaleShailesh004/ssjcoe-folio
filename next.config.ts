import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Silence "multiple lockfiles" warning when repo has parent package.json
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
