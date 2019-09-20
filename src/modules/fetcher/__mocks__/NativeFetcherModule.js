// @flow

import type { FetchResultType } from '../FetcherModule'
import { NativeEventEmitter } from 'react-native'

export type NativeFetcherModuleType = {
  +addListener: (eventType: string) => void,
  +removeListeners: (count: number) => void,
  fetchAsync: (targetFilePaths: { [url: string]: string }) => Promise<FetchResultType>
}

const NativeFetcherModule = {
  addListener: jest.fn<[string], void>(),
  removeListeners: jest.fn<[number], void>(),
  fetchAsync: jest.fn<[{ [url: string]: string }], [Promise<FetchResultType>]>()
}

export const NativeFetcherModuleEmitter = new NativeEventEmitter(NativeFetcherModule)

export default NativeFetcherModule
