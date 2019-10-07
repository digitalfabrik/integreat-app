// @flow

import type { FetchResultType } from '../FetcherModule'
import { NativeEventEmitter } from 'react-native'

const NativeFetcherModule = {
  addListener: jest.fn<[string], void>(),
  removeListeners: jest.fn<[number], void>(),
  fetchAsync: jest.fn<[{ [url: string]: string }], [Promise<FetchResultType>]>()
}

export const NativeFetcherModuleEmitter = new NativeEventEmitter(NativeFetcherModule)

export default NativeFetcherModule
