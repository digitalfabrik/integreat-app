// @flow

import MD5 from 'md5.js'

export default (url: string) => {
  return new MD5().update(url).digest('hex')
}
