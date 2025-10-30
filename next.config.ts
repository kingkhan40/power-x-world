import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
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

  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "@react-native-async-storage/async-storage": path.resolve(
        "./src/utils/asyncStorageShim.ts"
      ),
    };
    return config;
  },
};

export default nextConfig;
