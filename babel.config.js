module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      // You can add other presets here if needed
    ],
    env: {
      test: {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          'babel-preset-expo',
        ],
      },
    },
  };
};
