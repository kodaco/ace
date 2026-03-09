import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'export',
  reactStrictMode: true,
  basePath: '/ace',
};

export default nextConfig;
