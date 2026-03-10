import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'api.monzaares.ro' },
    ],
    qualities: [25, 50, 75, 90],
  },
};

export default nextConfig;