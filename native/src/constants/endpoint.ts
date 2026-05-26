import { Platform } from 'react-native'

import NativeConstants from './NativeConstants'
import buildConfig from './buildConfig'

export const tuNewsApiUrl = 'https://tunews.integreat-app.de'
export const tuNewsWebsiteUrl = 'https://tunewsinternational.com'

export const userAgent = `${buildConfig().appName}/${Platform.OS} ${NativeConstants.appVersion}`
