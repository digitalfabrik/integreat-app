import { FetchResultType, TargetFilePathsType } from '../FetcherModule'
import { NativeEventEmitter } from 'react-native'
import { mapValues } from 'lodash/object'

function mockFetchAsync(targetFilePaths: TargetFilePathsType): Promise<FetchResultType> {
  const fetchResult = mapValues(targetFilePaths, url => ({
    lastUpdate: '2004-06-14T23:34:30Z',
    url: url,
    errorMessage: null
  }))
  return Promise.resolve(fetchResult)
}

const NativeFetcherModule = {
  addListener: jest.fn<[string], void>(),
  removeListeners: jest.fn<[number], void>(),
  fetchAsync: jest.fn<[TargetFilePathsType], Promise<FetchResultType>>(mockFetchAsync)
}
export const NativeFetcherModuleEmitter = new NativeEventEmitter(NativeFetcherModule)
export default NativeFetcherModule
