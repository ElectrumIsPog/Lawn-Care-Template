/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Don't run ESLint during build for faster builds
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['eaqpeouchyrtsamimmis.supabase.co'],
  },
};

module.exports = nextConfig; 