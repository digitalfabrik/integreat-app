// @flow

import { getResourceCacheFilesDirPath } from '../platform/constants/webview'
import getExtension from './getExtension'

const getExtensionWithDot = (urlString: string) => {
  const extension = getExtension(urlString)
  if (!extension) {
    return ''
  }
  return `.${extension}`
}

/**
 * @throws {Error} If urlString is invalid or it is not possible to get an extension from it
 */
export default (urlString: string, path: string, city: string, urlHash: string) => {
  return `${getResourceCacheFilesDirPath(city)}/${urlHash}${getExtensionWithDot(urlString)}`
}
