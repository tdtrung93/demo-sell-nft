module.exports = (config = {}) => {
  config.module.rules.push({
    test: /\.svg$/,
    issuer: /\.(ts)x?$/,
    use: [
      {
        loader: '@svgr/webpack',
        options: {
          icon: true,
          memo: true,
          replaceAttrValues: {
            '#000000': 'currentcolor',
            '#000': 'currentcolor'
          },
          svgoConfig: {
            plugins: [
              {
                // cleanupIDs: false,
                addAttributesToSVGElement: {
                  attributes: ['preserveAspectRatio="xMidYMid meet"']
                }
              }
            ]
          }
        }
      },
      'url-loader'
    ]
  });

  config.resolve.fallback = {
    ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
    // by next.js will be dropped. Doesn't make much sense, but how it is
    fs: false // the solution
  };

  return config;
};
