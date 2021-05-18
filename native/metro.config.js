/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Resolver = require("metro-resolver")

module.exports = {
  // https://github.com/facebook/react-native/issues/21310#issuecomment-544071895
  // https://github.com/facebook/metro/issues/1#issuecomment-453450709
  // Per default metro is looking for the babel dependencies in the node_modules of the corresponding package.
  // This leads to problems in the build-configs module as the babel dependencies are only in the native .
  resolver: {
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => {
          if (name === 'build-config-name') {
            const buildConfigName = process.env.BUILD_CONFIG_NAME
            // Proxy the (non-existing) module 'build-config-name' to the name of the right build config.
            // Passing environment variables is not possible without either babel or post processing otherwise.
            return path.resolve(__dirname, '../build-configs', buildConfigName, 'build-config-name/index.ts')
          }

          return path.resolve(__dirname, `node_modules/${name}`)
        }
      }
    ),
    // Make sure we use the local copy of react and react-native to avoid multiple copies in the bundle
    // https://github.com/facebook/react/issues/13991#issuecomment-830308729
    resolveRequest: (context, realModuleName, platform, moduleName) => {
      const clearContext = { ...context, resolveRequest: undefined }
      const module = moduleName === "react" || moduleName === "react-native"
        ? path.join(__dirname, "node_modules", realModuleName)
        : realModuleName
      return Resolver.resolve(clearContext, module, platform)
    }
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
