// Exclude libraries from our builds by disabling autolinking
// https://github.com/react-native-community/cli/blob/master/docs/autolinking.md#how-can-i-disable-autolinking-for-unsupported-library

const floss = process.env.BUILD_CONFIG_FEATURE_FLAGS_FLOSS === 'true'
const excludeConfig = { platforms: { android: null, ios: null } }

const firebaseDependencies = floss
  ? {
      '@react-native-firebase/app': excludeConfig,
      '@react-native-firebase/messaging': excludeConfig,
    }
  : {}

module.exports = {
  dependencies: firebaseDependencies,
}
