import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: '/api/control-plane/:path*',
        destination: 'http://control-plane:3001/:path*', // Proxy to Backend container
      },
      {
        source: '/api/storage/:path*',
        destination: 'http://storage:3002/:path*', // Proxy to Storage container
      },
      {
        source: '/api/functions/:path*',
        destination: 'http://functions:8787/:path*', // Proxy to Functions container
      },
    ];
  },
};

export default nextConfig;
