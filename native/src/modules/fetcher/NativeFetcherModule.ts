import { NativeEventEmitter, NativeModules } from 'react-native'

const NativeFetcherModule = NativeModules.Fetcher
export const NativeFetcherModuleEmitter = new NativeEventEmitter(NativeFetcherModule)
export default NativeFetcherModule
