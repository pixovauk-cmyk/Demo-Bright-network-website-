import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "apps.brightpeakgroup.com", pathname: "/**" },
      { protocol: "https", hostname: "www.brightpeakgroup.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
