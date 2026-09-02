/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/app\.[a-z0-9.-]+\/api\/.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: { maxEntries: 100, maxAgeSeconds: 300 },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /^https:\/\/www\.youtube\.com\/embed\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'youtube-embeds',
        expiration: { maxEntries: 50, maxAgeSeconds: 86400 },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: { maxEntries: 200, maxAgeSeconds: 604800 },
      },
    },
  ],
});

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
};

module.exports = withPWA(nextConfig);
