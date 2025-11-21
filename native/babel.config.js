module.exports = {
  presets: ['module:@react-native/babel-preset', '@babel/preset-typescript'],
  plugins: [
    'react-native-reanimated/plugin',
    '@babel/plugin-transform-export-namespace-from',
    'react-native-paper/babel',
  ],
}
