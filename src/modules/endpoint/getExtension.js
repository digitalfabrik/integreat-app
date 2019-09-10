// @flow

import { last } from 'lodash'

export default (urlString: string) => {
  const url = new URL(urlString)
  const pathname = url.pathname

  const lastPath = last(pathname.split('/'))

  if (lastPath === undefined) {
    throw new Error('The URL does not have a pathname!')
  }

  const index = lastPath.lastIndexOf('.')
  if (index === -1) {
    throw new Error('The URL does not have an extension!')
  }
  return lastPath.substring(index + 1)
}
