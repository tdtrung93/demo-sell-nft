const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === true
});

const isProd = process.env.NEXT_PUBLIC_DEPLOY_ENV === 'production';

const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

const sharedConfig = require('./webpack.sharedConfig.js');

let config = {
  webpack: sharedConfig,
  reactStrictMode: true,
  pwa: {
    disable: !isProd,
    dest: 'public',
    publicExcludes: ['!images/detail/*', '!images/inventory/*', '!images/networks/*', '!images/shops/*', '!svg/SVG/*'],
    runtimeCaching,
    register: true
  },
  images: {
    domains: [
      'gateway.pinata.cloud',
      'ipfs.io',
      'cdn.dribbble.com',
      'ctfassets.net',
      'images.ctfassets.net',
      'lh3.googleusercontent.com',
      'rinkeby-storage.opensea.io',
      'picsum.photos',
      'storage.googleapis.com',
      'storage.opensea.io',
      'raw.githubusercontent.com',
      'www.onikami.com',
      'valt-mvp-dev.s3.ap-southeast-1.amazonaws.com'
    ],
    deviceSizes: [400, 600, 768, 1024, 1200, 1400, 1920]
  }
};

console.log('DEPLOY_ENV: ', process.env.NEXT_PUBLIC_DEPLOY_ENV);

if (process.env.ANALYZE === true) {
  config = withBundleAnalyzer(withPWA(config));
}

module.exports = withPWA(config);
