/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path')

module.exports = {
  // https://github.com/facebook/react-native/issues/21310#issuecomment-544071895
  // https://github.com/facebook/metro/issues/1#issuecomment-453450709
  // Per default metro is looking for the babel dependencies in the node_modules of the corresponding package.
  // This leads to problems in the build-configs module as the babel dependencies are only in the native node_modules.
  resolver: {
    extraNodeModules: new Proxy({}, {
      get: (target, name) => path.join(process.cwd(), `node_modules/${name}`)
    })
  },
  watchFolders: [path.resolve(__dirname, '../')],
  transformer: {
    assetPlugins: ['react-native-svg-asset-plugin'],
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false
      }
    })
  }
}
