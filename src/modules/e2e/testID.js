// @flow

import { Platform } from 'react-native'

export default id => {
  if (__DEV__ || process.env.E2E_TEST_IDS) { // This is replaced by transform-inline-environment-variables during bundling
    return Platform.OS === 'android' ? { accessible: true, accessibilityLabel: id } : { testID: id }
  }

  return {}
}
