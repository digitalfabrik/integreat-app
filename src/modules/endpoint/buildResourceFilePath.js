// @flow

import { getResourceCacheFilesDirPath } from '../platform/constants/webview'
import getExtension from './getExtension'

export default (url: string, city: string, urlHash: string) => {
  return `${getResourceCacheFilesDirPath(city)}/${urlHash}.${getExtension(url)}`
}
