import { Platform } from 'react-native'
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes'

import { RESOURCE_CACHE_DIR_PATH } from '../utils/DatabaseConnector'

export const URL_PREFIX = 'file://'
export const getResourceCacheFilesDirPath = (city: string): string => `${RESOURCE_CACHE_DIR_PATH}/${city}/files`
export const getFontFaceSource = (fontName: string): string | undefined =>
  Platform.select({
    ios: `local('${fontName}') url('${fontName}.ttf') format('truetype')`,
    android: `url('file:///android_asset/fonts/${fontName}.ttf') format('truetype')`
  })
export const createPostSource = (
  uri: string,
  body: string,
  contentType = 'application/x-www-form-urlencoded'
): WebViewSource => ({
  uri: uri,
  method: 'POST',
  body,
  headers: Platform.select({
    ios: {
      'Content-Type': contentType
    },
    android: undefined
    /* `headers` is not supported on Android.
        In this case Android figures the out which content type to use */
  })
})
export const createGetSource = (uri: string, body: string): WebViewSource => ({
  uri: uri,
  method: 'GET',
  body
})
export const createHtmlSource = (html: string, baseUrl: string): WebViewSource => ({
  baseUrl: baseUrl,
  html: html
})
