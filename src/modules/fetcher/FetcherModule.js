// @flow

import { NativeModules } from 'react-native'

export type FetchResultType = {
  failureMessages: { [url: string]: string },
  successFilePaths: { [url: string]: string }
}
export type FetcherModuleType = {
  downloadAsync: (targetFilePaths: { [url: string]: string }) => Promise<FetchResultType>
}

const fetcher: FetcherModuleType = NativeModules.Fetcher
export default fetcher
