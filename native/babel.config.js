module.exports = {
  presets: ['module:@react-native/babel-preset', '@babel/preset-typescript'],
  plugins: [
    '@babel/plugin-transform-export-namespace-from',
    'react-native-paper/babel',
    'react-native-worklets/plugin',
  ],
}
