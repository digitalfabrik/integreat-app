// @flow

import { NativeEventEmitter, NativeModules } from 'react-native'
import type { FetchResultType } from './FetcherModule'

export type NativeFetcherModuleType = {
  +addListener: (eventType: string) => void,
  +removeListeners: (count: number) => void,
  fetchAsync: (targetFilePaths: { [url: string]: string }) => Promise<FetchResultType>
}

const NativeFetcherModule: NativeFetcherModuleType = NativeModules.Fetcher

export const NativeFetcherModuleEmitter = new NativeEventEmitter(NativeFetcherModule)

export default NativeFetcherModule
