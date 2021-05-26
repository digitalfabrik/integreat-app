import { NativeModules } from 'react-native'
export type NativeConstantsType = {
  readonly appVersion: string | null | undefined
}
const { RNNativeConstants } = NativeModules
const NativeConstants: NativeConstantsType = {
  appVersion: RNNativeConstants.appVersion
}
export default NativeConstants
