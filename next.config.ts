import { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProd ? '/cpu-scheduler' : '', // base path for production deployment on GitHub Pages
  assetPrefix: isProd ? '/cpu-scheduler/' : '', // asset prefix for production
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false, // Fix for missing 'fs' module in the browser
      };
    }
    return config;
  },
};

export default nextConfig;
