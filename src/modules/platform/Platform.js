// @flow

import Expo from 'expo'
import { Platform as ExpoPlatform } from 'react-native'

class Platform {
  get statusBarHeight (): number {
    return ExpoPlatform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight
  }
}

export default Platform
