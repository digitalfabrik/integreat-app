import { Platform } from 'react-native'
import NativeConstants from './NativeConstants'
import buildConfig from './buildConfig'

export const tunewsApiUrl = 'https://tunews.integreat-app.de'
export const tunewsWebsiteUrl = 'https://tunewsinternational.com'

export const userAgent = `${buildConfig().appName}/${Platform.OS} ${NativeConstants.appVersion}`
