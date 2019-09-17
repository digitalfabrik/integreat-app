// @flow

import MD5 from 'md5.js'

export default (urlString: string) => {
  return new MD5().update(urlString).digest('hex')
}
