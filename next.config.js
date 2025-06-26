/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode and SWC Minification for performance
  reactStrictMode: true,
  swcMinify: true,

  // Custom Image Configuration
  images: {
    loader: 'custom',         // Using a custom image loader
    unoptimized: true,        // Disable Next.js image optimization
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 31536000,      // Set cache TTL for images
    domains: [
      'infra-mantra.s3.ap-south-1.amazonaws.com',
      'i.ytimg.com',
      'infra-mantra.s3.amazonaws.com',
      'infra-mantra-new.s3.ap-south-1.amazonaws.com',
      'infra-mantra-new.s3.amazonaws.com',
      'inframantra.blr1.cdn.digitaloceanspaces.com',
    ],
  },

  // Environment Variables
  env: {
    apiUrl: 'https://api.inframantra.com/api',
    apiUrl1: 'https://apitest.inframantra.com/api/v1',
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEYs: 'AIzaSyDh6uhpwkkniyiztlDDWEHO7Ph_sBxuJFw',
  },

  // Internationalization (i18n) Configuration
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/property/bptp-terra-sector-37d-gurgaon',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Ignore ESLint Warnings During Build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Apply Edge Runtime for Specific API Routes (if needed)
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'x-edge-runtime',
            value: 'true',
          },
        ],
      },
    ];
  },

  // Add a rewrite for the sitemap
  async rewrites() {
    return [
      {
        source: '/sitemap.xml', // The URL path to access the sitemap
        destination: '/sitemap.xml', // The dynamic API route generating the sitemap
      },
    ];
  },
};

module.exports = nextConfig;
