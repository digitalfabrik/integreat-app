import { Platform } from 'react-native'
import buildConfig from '../constants/buildConfig'

export default (id: string) => {
  if (buildConfig().e2e) {
    return Platform.OS === 'android'
      ? {
          accessible: true,
          accessibilityLabel: id
        }
      : {
          testID: id
        }
  }

  return {}
}
