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
 * Builds a file path for a resource given the specified parameters.
 *
 * @throws {Error} If urlString is invalid or it is not possible to get an extension from it
 * @returns a non-empty URL-string which points to a file
 */
export default (urlString: string, city: string, urlHash: string) => {
  return `${getResourceCacheFilesDirPath(city)}/${urlHash}${getExtensionWithDot(urlString)}`
}
