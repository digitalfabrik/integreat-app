// @flow

import { NativeModules } from 'react-native'
import type { FetchResultType } from './FetcherModule'

export type NativeFetcherModuleType = {
  downloadAsync: (targetFilePaths: { [url: string]: string }) => Promise<FetchResultType>
}

const NativeFetcherModule: NativeFetcherModuleType = NativeModules.Fetcher

export default NativeFetcherModule
