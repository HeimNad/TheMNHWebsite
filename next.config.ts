import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      // Force browser ESM build — the node build pulls in fflate/node.cjs which
      // uses dynamic Worker creation that Turbopack can't statically resolve.
      jspdf: "jspdf/dist/jspdf.es.min.js",
    },
  },
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
