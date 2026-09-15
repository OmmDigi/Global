import redirects from "./redirects.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true }, // Generates a static `out/` folder
  redirects,
};

export default nextConfig;
