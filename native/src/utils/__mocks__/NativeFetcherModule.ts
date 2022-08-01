import { mapValues } from 'lodash'
import { NativeEventEmitter } from 'react-native'

import { FetchResultType, TargetFilePathsType } from '../FetcherModule'

const mockFetchAsync = (targetFilePaths: TargetFilePathsType): Promise<FetchResultType> => {
  const fetchResult = mapValues(targetFilePaths, (url: string) => ({
    lastUpdate: '2004-06-14T23:34:30Z',
    url,
    errorMessage: null,
  }))
  return Promise.resolve(fetchResult)
}

const NativeFetcherModule = {
  addListener: jest.fn<void, [string]>(),
  removeListeners: jest.fn<void, [number]>(),
  fetchAsync: jest.fn<Promise<FetchResultType>, [TargetFilePathsType]>(mockFetchAsync),
  addSubscription: jest.fn(),
  removeSubscription: jest.fn(),
  removeAllSubscriptions: jest.fn(),
  getSubscriptionsForType: jest.fn(),
}
export const NativeFetcherModuleEmitter = new NativeEventEmitter(NativeFetcherModule)
export default NativeFetcherModule
