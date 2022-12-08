/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.vox-cdn.com'],
  },
  env: {
    BACKEND_URL:'https://morningnews-backend.vercel.app/',
  },
};

module.exports = nextConfig;
