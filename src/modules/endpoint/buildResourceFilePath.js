// @flow

import fnv from 'fnv-plus'
import { getResourceCacheFilesDirPath } from '../platform/constants/webview'
import getExtension from './getExtension'

export default (url: string, path: string, city: string) => {
  const urlHash = fnv.hash(url).hex()
  return `${getResourceCacheFilesDirPath(city)}/${urlHash}.${getExtension(url)}`
}
