import { Platform } from 'react-native'

import { URL_PREFIX } from '../constants/webview'
import { LanguageResourceCacheStateType } from './DataContainer'

const getCachedThumbnail = (thumbnail: string, resourceCache: LanguageResourceCacheStateType | undefined): string => {
  const cachedThumbnail = resourceCache?.[thumbnail]?.filePath
  if (!cachedThumbnail) {
    return thumbnail
  }

  // For ios you should not use the absolute path, since it can change with a future build version, therefore we use home directory
  // https://github.com/facebook/react-native/commit/23909cd6f62056de0cd0f7c06e3997dd967c139a
  if (Platform.OS === 'ios') {
    return `~${cachedThumbnail.substring(cachedThumbnail.indexOf('/Documents'))}`
  }
  return `${URL_PREFIX}${cachedThumbnail}`
}

export default getCachedThumbnail
