import { I18nManager as I18nManagerType } from 'react-native'

const isRTL = false
export const I18nManager: I18nManagerType = {
  isRTL,
  allowRTL: (allowRTL: boolean) => {
    throw Error('Not yet implemented.')
  },
  forceRTL: (forceRTL: boolean) => {
    I18nManager.isRTL = forceRTL
    return I18nManager
  }
}
