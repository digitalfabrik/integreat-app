// @flow

import FastImage from 'react-native-fast-image'

export default (uri: string | number) => typeof uri === 'number' ? uri : {
  uri: uri,
  priority: FastImage.priority.normal,
  // disable caching, we want to do it manually
  headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
  cache: FastImage.cacheControl.web
}
