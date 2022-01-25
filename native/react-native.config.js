const floss = JSON.parse(process.env.BUILD_CONFIG_FEATURE_FLAGS_FLOSS ?? 'false')
const developerFriendly = JSON.parse(process.env.BUILD_CONFIG_FEATURE_FLAGS_DEVELOPER_FRIENDLY)
const excludeConfig = { platforms: { android: null } }

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
