module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    '@babel/preset-flow'
  ],
  env: {
    development: {
      plugins: []
    },
    production: {
      plugins: ['transform-remove-console']
    }
  },
  // prevent babel error - only windows (using backslash)
  exclude: [/node_modules\\decamelize.*/],
  plugins: [
    [
      'transform-inline-environment-variables',
      {
        include: ['BUILD_CONFIG_NAME']
      }
    ],
    [
      'module-resolver',
      {
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.json'
        ]
      }
    ]
  ]
}
