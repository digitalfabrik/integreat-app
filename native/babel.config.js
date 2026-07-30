export default {
  presets: ['module:@react-native/babel-preset', '@babel/preset-typescript'],
  plugins: [
    // Required for ESM-only dependencies using `export * as ns from '...'` (e.g. htmlparser2),
    // which @react-native/babel-preset does not transform.
    '@babel/plugin-transform-export-namespace-from',
    'react-native-paper/babel',
    'react-native-worklets/plugin',
  ],
}
