import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    // @ts-expect-error - Next.js 15+ indicator config
    appIsrStatus: false,
    buildActivity: false,
    buildActivityPosition: "bottom-right",
  },
};

export default nextConfig;
