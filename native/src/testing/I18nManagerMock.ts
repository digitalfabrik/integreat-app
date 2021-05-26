import { I18nManager as I18nManagerType } from 'react-native'

const isRTL = false
const doLeftAndRightSwapInRTL = false
export const I18nManager = {
  isRTL,
  allowRTL: (allowRTL: boolean) => {
    throw Error('Not yet implemented.')
  },
  forceRTL: (forceRTL: boolean) => {
    I18nManager.isRTL = forceRTL
    return I18nManager
  },
  getConstants: () => ({
    isRTL: isRTL,
    doLeftAndRightSwapInRTL: doLeftAndRightSwapInRTL
  }),
  swapLeftAndRightInRTL: (swapLeftAndRight: boolean) => {
    throw Error('Not yet implemented.')
  },
  doLeftAndRightSwapInRTL: doLeftAndRightSwapInRTL
} as I18nManagerType
