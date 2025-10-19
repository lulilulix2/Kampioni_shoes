/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: false, // Disable Turbopack for Amplify compatibility
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
