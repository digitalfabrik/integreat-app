// @flow

import { typeof I18nManager as I18nManagerType } from 'react-native'

const isRTL = false

const I18nManager: I18nManagerType = {
  isRTL,
  doLeftAndRightSwapInRTL: true,
  allowRTL: (allowRTL: boolean) => {
    throw Error('Not yet implemented.')
  },
  forceRTL: (forceRTL: boolean) => {
    I18nManager.isRTL = forceRTL
  },
  getConstants: (): {| doLeftAndRightSwapInRTL: boolean, isRTL: boolean |} => {
    return { doLeftAndRightSwapInRTL: true, isRTL }
  },
  swapLeftAndRightInRTL: (flipStyles: boolean) => {
    throw Error('Not yet implemented.')
  }
}

module.exports = I18nManager
