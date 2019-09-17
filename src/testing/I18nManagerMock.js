// @flow

import { typeof I18nManager as I18nManagerType } from 'react-native'

const I18nManager: I18nManagerType = {
  isRTL: false,
  doLeftAndRightSwapInRTL: true,
  allowRTL: (allowRTL: boolean) => { throw Error('Not yet implemented.') },
  forceRTL: (forceRTL: boolean) => {
    I18nManager.isRTL = forceRTL
    return {}
  },
  swapLeftAndRightInRTL: (flipStyles: boolean) => { throw Error('Not yet implemented.') }
}

module.exports = I18nManager
