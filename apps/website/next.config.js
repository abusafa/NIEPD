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
  // Configure i18n
  // experimental: {
  //   ppr: true, // Only available in canary versions
  // },
  // Environment variables
  env: {
    CMS_API_URL: process.env.CMS_API_URL || 'http://localhost:3000',
  },
}

module.exports = nextConfig;
