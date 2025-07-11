/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true }, // Generates a static `out/` folder
};

export default nextConfig;
