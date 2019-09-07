// @flow

import { NativeModules } from 'react-native'
import type { FetchResultType } from '../modules/fetcher/FetcherModule'

export const NativeModules = {
  Fetcher: {
    addListener: (eventType: string) => {},
    removeListeners: (count: number) => {},
    fetchAsync: (targetFilePaths: { [url: string]: string }) => {}
  }
}
