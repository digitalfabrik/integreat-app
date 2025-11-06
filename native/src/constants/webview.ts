import { Platform } from 'react-native'

import { ANDROID_FILE_PREFIX } from '../utils/helpers'

export const ERROR_MESSAGE_TYPE = 'error'
export const WARNING_MESSAGE_TYPE = 'warning'
export const HEIGHT_MESSAGE_TYPE = 'height'
export const ALLOW_EXTERNAL_SOURCE_MESSAGE_TYPE = 'iframe'
export const OPEN_SETTINGS_MESSAGE_TYPE = 'settings'

export const getFontFaceSource = (fontName: string): string | undefined =>
  Platform.select({
    ios: `local('${fontName}') url('${fontName}.ttf') format('truetype')`,
    android: `url('${ANDROID_FILE_PREFIX}/android_asset/fonts/${fontName}.ttf') format('truetype')`,
  })
