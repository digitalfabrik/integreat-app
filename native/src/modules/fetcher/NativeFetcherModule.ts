import { NativeEventEmitter, NativeModules } from 'react-native'
import { FetchResultType } from './FetcherModule'
export type NativeFetcherModuleType = {
  readonly addListener: (eventType: string) => void
  readonly removeListeners: (count: number) => void
  fetchAsync: (targetFilePaths: Record<string, string>) => Promise<FetchResultType>
}
const NativeFetcherModule: NativeFetcherModuleType = NativeModules.Fetcher
export const NativeFetcherModuleEmitter = new NativeEventEmitter(NativeFetcherModule)
export default NativeFetcherModule
