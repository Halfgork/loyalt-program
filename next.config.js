/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir is now the default in Next.js 14, no need to specify
  },
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
      asyncWebAssembly: true,
    };
    return config;
  },
};

module.exports = nextConfig; 