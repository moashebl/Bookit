/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@bookit/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/aida-public/**',
      },
    ],
  },
};

module.exports = nextConfig;
