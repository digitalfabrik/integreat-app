// @flow

import fnv from 'fnv-plus'
import { getResourceCacheFilesDirPath } from '../platform/constants/webview'
import getExtension from './getExtension'

export default (url: string, path: string, city: string) => {
  const urlHash = fnv.hash(url).hex()
  const pathHash = fnv.hash(path).hex()
  return `${getResourceCacheFilesDirPath(city)}/${pathHash}/${urlHash}.${getExtension(url)}`
}
