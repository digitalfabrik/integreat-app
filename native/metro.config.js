/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const path = require('path')

/** @type {import('metro-config').MetroConfig} */
const defaultConfig = getDefaultConfig(__dirname)
const {
  resolver: { assetExts, sourceExts },
} = defaultConfig

/** @type {import('metro-config').MetroConfig} */
const config = {
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
    extraNodeModules: {
      'build-config-name': path.resolve(
        __dirname,
        '../build-configs',
        process.env.BUILD_CONFIG_NAME || 'integreat-test-cms',
        'build-config-name/index.ts',
      ),
    },
    nodeModulesPaths: [path.resolve(__dirname, './node_modules')],
    
    // Make sure we use the local copy of react and react-native to avoid multiple copies in the bundle
    // https://github.com/facebook/react/issues/13991#issuecomment-830308729
    resolveRequest: (context, moduleName, platform) => {
      const module =
        moduleName === 'react' || moduleName === 'react-native'
          ? path.join(__dirname, 'node_modules', moduleName)
          : moduleName
      return context.resolveRequest(context, module, platform)
    },
  },
  watchFolders: [path.resolve(__dirname, '../')],
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  }
}
  

module.exports = mergeConfig(defaultConfig, config)