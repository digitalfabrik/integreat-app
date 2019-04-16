import { Platform } from 'react-native'

export default id => {
  if (process.env.E2E_TAGGING) { // This is replaced by transform-inline-environment-variables during bundling
    return Platform.OS === 'android' ? {accessible: true, accessibilityLabel: id} : {testID: id}
  }

  return {}
}
