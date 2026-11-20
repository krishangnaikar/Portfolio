import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `npm run build` writes the site to ./out, which Cloudflare Pages serves as-is.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: false,
  reactStrictMode: true,
  transpilePackages: ["skinview3d"],
};

export default nextConfig;
