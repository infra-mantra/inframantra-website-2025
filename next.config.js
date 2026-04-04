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

  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 63072000,
    domains: [
      'infra-mantra.s3.ap-south-1.amazonaws.com',
      'i.ytimg.com',
      'infra-mantra.s3.amazonaws.com',
      'infra-mantra-new.s3.ap-south-1.amazonaws.com',
      'infra-mantra-new.s3.amazonaws.com',
      'inframantra.blr1.cdn.digitaloceanspaces.com',
      'cms.inframantra.com',
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