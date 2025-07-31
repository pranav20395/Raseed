import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
  experimental: {
    optimizeCss: false, // Disable LightningCSS optimization to avoid build errors
  },
};

export default nextConfig;
