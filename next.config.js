/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

const path = require('path');
const loaderUtils = require('loader-utils');
const { redirects } = require('./utils/redirectUrl');

/* ───────────────────────────────────────────────────────────── */
/*  CUSTOM CLASS NAME GENERATOR                                   */
/* ───────────────────────────────────────────────────────────── */

const WANT_HASH = false;

const customGetLocalIdent = (context, _, exportName) => {
  if (!WANT_HASH) return exportName;

  return (
    exportName +
    '__' +
    loaderUtils
      .getHashDigest(
        Buffer.from(
          [
            path
              .relative(context.rootContext, context.resourcePath)
              .replace(/\\+/g, '/'),
            exportName,
          ].join('#'),
        ),
        'md4',
        'base64',
        4,
      )
      .replace(/[^a-zA-Z0-9-_]/g, '_')
  );
};

/* ───────────────────────────────────────────────────────────── */
/*  NEXT CONFIG                                                   */
/* ───────────────────────────────────────────────────────────── */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // `next dev` and `next build` share one build directory, so running a
  // production build while a dev server is live deletes .next/static/development
  // out from under it and every dev request starts 500ing
  // ("Cannot find module ./chunks/..."). Setting NEXT_DIST_DIR lets a production
  // build go somewhere else — e.g. NEXT_DIST_DIR=.next-prod npm run build — so
  // the two can coexist. Unset, the default .next is used exactly as before.
  distDir: process.env.NEXT_DIST_DIR || ".next",

  // Skip per-page file-tracing (.nft.json). It's only needed for standalone/
  // serverless output — not for a normal `next start` deploy — and on Windows
  // it opens thousands of @mui/icons-material files at once, causing EMFILE.
  outputFileTracing: false,

  // optimizeCss (critters) inlines above-the-fold critical CSS and defers the
  // rest, removing the render-blocking CSS chain that gates FCP/LCP — a real
  // mobile-speed win, and it works on the live (Linux) deploy. It is ON by
  // default so production gets that benefit.
  //
  // CAVEAT: on some LOCAL Windows `next build`s, critters mis-handles this
  // project's large unhashed global CSS and ships the home page with almost no
  // CSS (blank / Lighthouse NO_FCP). For a local production build on Windows,
  // disable it: `DISABLE_OPTIMIZE_CSS=1 npm run build` (then `npm run start`).
  // `next dev` never uses critters, so local dev is unaffected either way.
  experimental: {
    optimizeCss: process.env.DISABLE_OPTIMIZE_CSS !== '1',
  },

  images: {
    // Serve AVIF/WebP; add small widths so tiny card thumbnails aren't sent at
    // 640px+. This is what cuts the multi-MB "improve image delivery" savings.
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 63072000,
    domains: [
      'infra-mantra.s3.ap-south-1.amazonaws.com',
      'i.ytimg.com',
      'infra-mantra.s3.amazonaws.com',
      'infra-mantra-new.s3.ap-south-1.amazonaws.com',
      'infra-mantra-new.s3.amazonaws.com',
      'inframantra.blr1.cdn.digitaloceanspaces.com',
      'inframantra.blr1.digitaloceanspaces.com',
      'cms.inframantra.com',
      'images.unsplash.com',
    ],
  },

  env: {
    apiUrl: 'https://api.inframantra.com/api',
    apiUrl1: 'https://apitest.inframantra.com/api/v1',
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: 'AIzaSyDh6uhpwkkniyiztlDDWEHO7Ph_sBxuJFw',
  },

  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },

  async redirects() {
    return redirects;
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [{ key: 'x-edge-runtime', value: 'true' }],
      },
      {
        // Self-hosted fonts + pre-compressed hero images never change (stable
        // content) — cache them hard so repeat visits reuse them from disk.
        source: '/:dir(fonts|banner|gallery)/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [{ source: '/sitemap.xml', destination: '/sitemap.xml' }];
  },

  webpack(config) {
    const cssModuleRules = config.module.rules
      .find((rule) => Array.isArray(rule.oneOf))
      .oneOf.filter((rule) => Array.isArray(rule.use));

    cssModuleRules.forEach((rule) => {
      rule.use.forEach((loader) => {
        if (loader.loader?.includes('css-loader') && loader.options?.modules) {
          loader.options.modules = {
            ...loader.options.modules,
            getLocalIdent: customGetLocalIdent,
            localIdentName: '[local]',
          };
        }
      });
    });

    return config;
  },
};

module.exports = nextConfig;