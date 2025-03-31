/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/slides/:path*',
        destination: '/slides/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
