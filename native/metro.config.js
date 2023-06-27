/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path')
const Resolver = require('metro-resolver')

// eslint-disable-next-line import/no-extraneous-dependencies
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
// eslint-disable-next-line import/no-extraneous-dependencies
const defaultSourceExts = require('metro-config/src/defaults/defaults').sourceExts
// eslint-disable-next-line import/no-extraneous-dependencies
const defaultAssetExts = require('metro-config/src/defaults/defaults').assetExts

module.exports = mergeConfig(
  getDefaultConfig(__dirname),
  // https://github.com/facebook/react-native/issues/21310#issuecomment-544071895
  // https://github.com/facebook/metro/issues/1#issuecomment-453450709
  // Per default metro is looking for the babel dependencies in the node_modules of the corresponding package.
  // This leads to problems in the build-configs module as the babel dependencies are only in the native .
  {
    resolver: {
      assetExts: defaultAssetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...defaultSourceExts, 'svg'],
      extraNodeModules: new Proxy(
        {},
        {
          get: (target, name) => {
            if (name === 'build-config-name') {
              const buildConfigName = process.env.BUILD_CONFIG_NAME || 'integreat-test-cms'
              // Proxy the (non-existing) module 'build-config-name' to the name of the right build config.
              // Passing environment variables is not possible without either babel or post processing otherwise.
              return path.resolve(__dirname, '../build-configs', buildConfigName, 'build-config-name/index.ts')
            }

            return path.resolve(__dirname, `node_modules/${name}`)
          },
        }
      ),
      // Make sure we use the local copy of react and react-native to avoid multiple copies in the bundle
      // https://github.com/facebook/react/issues/13991#issuecomment-830308729
      resolveRequest: (context, moduleName, platform) => {
        const module =
          moduleName === 'react' || moduleName === 'react-native'
            ? path.join(__dirname, 'node_modules', moduleName)
            : moduleName
        return Resolver.resolve(context, module, platform)
      },
    },
    watchFolders: [path.resolve(__dirname, '../')],
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
  }
)
