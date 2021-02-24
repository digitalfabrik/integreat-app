// @flow

import { lightTheme, darkTheme } from './theme'
import type {
  AndroidBuildConfigType,
  CommonBuildConfigType,
  iOSBuildConfigType,
  WebBuildConfigType
} from '../BuildConfigType'
import { ASCHAFFENBURG_ASSETS } from '../AssetsType'
import mainImprint from './mainImprint'

const APPLE_APP_ID = '1551810291'

const commonAschaffenburgBuildConfig: CommonBuildConfigType = {
  appName: 'Aschaffenburg App', // TODO maybe we have to change this to 'AB App'
  appIcon: 'app_icon_aschaffenburg',
  lightTheme,
  darkTheme,
  assets: ASCHAFFENBURG_ASSETS,
  cmsUrl: 'https://cms.integreat-app.de',
  shareBaseUrl: 'https://aschaffenburg.app',
  allowedHostNames: ['cms.integreat-app.de'],
  internalLinksHijackPattern: 'https?:\\/\\/aschaffenburg\\.app(?!\\/[^/]*\\/(wp-content|wp-admin|wp-json)\\/.*).*',
  featureFlags: {
    pois: false,
    newsStream: false,
    pushNotifications: false,
    introSlides: false,
    sentry: true,
    developerFriendly: false,
    fixedCity: 'abapp'
  },
  aboutUrls: { // TODO
    default: 'https://integreat-app.de/about/',
    en: 'https://integreat-app.de/en/about/'
  },
  privacyUrls: { // TODO
    default: 'https://integreat-app.de/datenschutz/',
    en: 'https://integreat-app.de/en/privacy/'
  }
}

export const androidAschaffenburgBuildConfig: AndroidBuildConfigType = {
  ...commonAschaffenburgBuildConfig,
  splashScreen: false,
  applicationId: 'app.aschaffenburg',
  googleServices: null
}

export const iosAschaffenburgBuildConfig: iOSBuildConfigType = {
  ...commonAschaffenburgBuildConfig,
  bundleIdentifier: 'app.aschaffenburg',
  provisioningProfileSpecifier: 'match Development app.aschaffenburg',
  appleId: APPLE_APP_ID,
  itunesAppName: 'aschaffenburg-app',
  googleServices: null,
  launchScreen: 'LaunchScreenDefault'
}

export const webAschaffenburgBuildConfig: WebBuildConfigType = {
  ...commonAschaffenburgBuildConfig,
  appDescription: 'App of the city Aschaffenburg to inform about social topics.', // TODO in #453 must be adjusted
  mainImprint,
  itunesAppId: APPLE_APP_ID,
  icons: {
    appLogo: '/app-logo.png',
    appleTouchIcon: '/apple-touch-icon.png',
    socialMediaPreview: '/social-media-preview.png',
    favicons: '/favicons/'
  }
}

const platformBuildConfigs = {
  common: commonAschaffenburgBuildConfig,
  web: webAschaffenburgBuildConfig,
  android: androidAschaffenburgBuildConfig,
  ios: iosAschaffenburgBuildConfig
}

export default platformBuildConfigs
