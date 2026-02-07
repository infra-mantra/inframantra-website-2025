// pwa/runtimeCaching.js

const CACHE = require('./cacheNames');

module.exports = [
  // Next.js static assets
  {
    urlPattern: /\/_next\/static\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: CACHE.STATIC,
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      },
    },
  },

  // 🅰️ Fonts
  {
    urlPattern: ({ request }) => request.destination === 'font',
    handler: 'CacheFirst',
    options: {
      cacheName: 'font-cache',
      expiration: {
        maxEntries: 20,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
  // Images (CDN / S3)
  {
    urlPattern: /\.(png|jpg|jpeg|webp|svg)$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: CACHE.IMAGES,
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 60 * 60 * 24 * 7,
      },
    },
  },
  {
  urlPattern: /\.(mp4|webm|ogg)$/i,
  handler: 'CacheFirst',
  options: {
    cacheName: CACHE.VIDEOS || 'video-cache', // add a VIDEOS key in cacheNames.js
    expiration: {
      maxEntries: 50, // max number of videos to cache
      maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
    },
    cacheableResponse: {
      statuses: [0, 200], // cache only successful responses
    },
  },
},

  // Public APIs
  {
    urlPattern: /\/api\/(projects|properties|localities|faqs)/,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: CACHE.API,
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 60 * 30,
      },
    },
  },

  // Pages (navigation)
  {
    urlPattern: ({ request }) => request.mode === 'navigate',
    handler: 'NetworkFirst',
    options: {
      cacheName: CACHE.PAGES,
      networkTimeoutSeconds: 5,
    },
  },
];
