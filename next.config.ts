import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/faq",
        destination: "/waiver",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
