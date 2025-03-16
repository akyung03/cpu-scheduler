const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  output: 'export',
  basePath: '/cpu-scheduler', // MUST match your GitHub repo name exactly!
  assetPrefix: isProd ? '/cpu-scheduler/' : '', // Notice the trailing "/"
};
