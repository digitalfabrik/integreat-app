/* eslint-disable @typescript-eslint/no-var-requires */
import { getDefaultConfig, mergeConfig } from '@react-native/metro-config'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

/** @type {import('@react-native/metro-config').MetroConfig} */
const defaultConfig = getDefaultConfig(dirname)
// Needed for rn-header-buttons, will be enabled by default in a future version of react-native
// https://github.com/vonovak/react-navigation-header-buttons/blob/master/INSTALL.md#installation--setup
defaultConfig.resolver.unstable_enablePackageExports = true
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
        dirname,
        '../build-configs',
        process.env.BUILD_CONFIG_NAME || 'integreat-test-cms',
        'build-config-name',
      ),
    },
    nodeModulesPaths: [path.resolve(dirname, './node_modules')],

    // Make sure we use the local copy of react and react-native to avoid multiple copies in the bundle
    // https://github.com/facebook/react/issues/13991#issuecomment-830308729
    resolveRequest: (context, moduleName, platform) => {
      const module =
        moduleName === 'react' || moduleName === 'react-native'
          ? path.join(dirname, 'node_modules', moduleName)
          : moduleName
      return context.resolveRequest(context, module, platform)
    },
    unstable_enablePackageExports: true,
  },
  watchFolders: [path.resolve(dirname, '../')],
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer/react-native'),
  },
}

export default mergeConfig(defaultConfig, config)
