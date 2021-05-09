// @flow

import { last } from 'lodash'
import Url from 'url-parse'

/**
 * @throws {Error} If urlString is invalid or it is not possible to get an extension from it
 */
export default (urlString: string) => {
  const url = new Url(urlString)

  if (!url.protocol) {
    throw new Error('Invalid URL! Missing protocol.')
  }

  const pathname = url.pathname

  const lastPath = last(pathname.split('/'))

  if (lastPath === undefined) {
    throw new Error('The URL does not have a pathname!')
  }

  const index = lastPath.lastIndexOf('.')
  if (index === -1) {
    return ''
  }
  return lastPath.substring(index + 1)
}
