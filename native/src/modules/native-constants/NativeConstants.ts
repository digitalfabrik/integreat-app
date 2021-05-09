// @flow

import { NativeModules } from 'react-native'

export type NativeConstantsType = {|
  +appVersion: ?string
|}

const { RNNativeConstants } = NativeModules

const NativeConstants: NativeConstantsType = {
  appVersion: RNNativeConstants.appVersion
}

export default NativeConstants
