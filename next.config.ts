import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', // allow all paths
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/**', // allow all paths
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**', // allow all paths
      },
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // keep the edge-runtime/esm optimizations available for newer Next versions
    esmExternals: 'loose',
  },
};

export default nextConfig;
