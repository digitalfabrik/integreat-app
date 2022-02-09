// Exclude libraries from our builds by disabling autolinking
// https://github.com/react-native-community/cli/blob/master/docs/autolinking.md#how-can-i-disable-autolinking-for-unsupported-library
const floss = JSON.parse(process.env.BUILD_CONFIG_FEATURE_FLAGS_FLOSS ?? 'false')
const developerFriendly = JSON.parse(process.env.BUILD_CONFIG_FEATURE_FLAGS_DEVELOPER_FRIENDLY ?? 'false')
const excludeConfig = { platforms: { android: null, ios: null } }

const firebase = floss
  ? {
      '@react-native-firebase/app': excludeConfig,
      '@react-native-firebase/messaging': excludeConfig
    }
  : {}

const flipper = developerFriendly ? {} : { 'react-native-flipper': excludeConfig }

module.exports = {
  dependencies: { ...firebase, ...flipper }
}
