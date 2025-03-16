import { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export', 
  basePath: isProd ? '/cpu-scheduler' : '', 
  assetPrefix: isProd ? '/cpu-scheduler/' : '', 
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
     
      config.resolve.fallback = {
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;