import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    domains: [
      "applepakistan.com.pk",
      "i.pinimg.com",
      "images.unsplash.com",
      "minerx.global",
      "vproptrader.com",
    ],
    unoptimized: true,
  },

  experimental: {
    // Next.js 14 ke new features
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },

  // 👇 Add this part to alias the AsyncStorage issue
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage": path.resolve(
        "./src/utils/asyncStorageShim.ts"
      ),
    };
    return config;
  },
};

export default nextConfig;
