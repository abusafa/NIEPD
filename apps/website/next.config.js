/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
  },
  // Environment variables
  env: {
    CMS_API_URL: process.env.CMS_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_CMS_API_URL: process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001',
    PORT: process.env.PORT || '3000',
  },
}

module.exports = nextConfig;
