// @flow

import { NativeModules } from 'react-native'

type NativeConstantsType = {
  +appVersion: ?string
}

const { RNNativeConstants } = NativeModules

const NativeConstants: NativeConstantsType = {
  appVersion: RNNativeConstants.appVersion
}

export default NativeConstants
