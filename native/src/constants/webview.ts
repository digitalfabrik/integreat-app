import { Platform } from 'react-native'
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes'

export const ERROR_MESSAGE_TYPE = 'error'
export const WARNING_MESSAGE_TYPE = 'warning'
export const HEIGHT_MESSAGE_TYPE = 'height'

export const URL_PREFIX = 'file://'
export const getFontFaceSource = (fontName: string): string | undefined =>
  Platform.select({
    ios: `local('${fontName}') url('${fontName}.ttf') format('truetype')`,
    android: `url('file:///android_asset/fonts/${fontName}.ttf') format('truetype')`,
  })
export const createPostSource = (
  uri: string,
  body: string,
  contentType = 'application/x-www-form-urlencoded'
): WebViewSource => ({
  uri,
  method: 'POST',
  body,
  headers: Platform.select({
    ios: {
      'Content-Type': contentType,
    },
    android: undefined,
    /* `headers` is not supported on Android.
        In this case Android figures the out which content type to use */
  }),
})
export const createGetSource = (uri: string): WebViewSource => ({
  uri,
  method: 'GET',
})
