import { Platform } from 'react-native'

export default id => {
  if (process.env.E2E_TAGGING) {
    return Platform.OS === 'android' ? {accessible: true, accessibilityLabel: id} : {testID: id}
  }

  return {}
}
