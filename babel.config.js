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
  plugins: [
    [
      'transform-inline-environment-variables',
      {
        include: ['__CONFIG_NAME__', 'E2E_TEST_IDS']
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
