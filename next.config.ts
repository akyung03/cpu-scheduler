<<<<<<< HEAD
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  output: 'export',
  basePath: '/cpu-scheduler', // MUST match your GitHub repo name exactly!
  assetPrefix: isProd ? '/cpu-scheduler/' : '', // Notice the trailing "/"
};
=======
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
>>>>>>> 15742743a41a543be986deb9d5ef9ac5ef761609
