const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",

runtimeCaching: [
  {
    urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
    handler: "CacheFirst",
    options: {
      cacheName: "google-fonts",
      expiration: {
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      },
    },
  },
  {
    urlPattern: /\/_next\/static\//,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "next-static",
    },
  },
  {
    urlPattern: /\/_next\/image\//,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "next-images",
    },
  },
  {
    urlPattern: /^https?.*/,
    handler: "NetworkFirst",
    options: {
      cacheName: "http-cache",
      networkTimeoutSeconds: 5,
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 60 * 60 * 24 * 7,
      },
    },
  },
]
});

module.exports = withPWA({
  reactStrictMode: true,
  turbopack: {},
});