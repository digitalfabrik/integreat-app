import { Platform } from 'react-native'

import buildConfig from '../constants/buildConfig'

type TestIDType =
  | {
      accessible: boolean
      accessibilityLabel: string
    }
  | {
      testID: string
    }
  | Record<string, never>

export default (id: string): TestIDType => {
  if (buildConfig().e2e) {
    return Platform.OS === 'android'
      ? {
          accessible: true,
          accessibilityLabel: id,
        }
      : {
          testID: id,
        }
  }

  return {}
}
