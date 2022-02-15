import aschaffenburgOverrideTranslations from 'translations/override-translations/aschaffenburg.json'

import { ASCHAFFENBURG_ASSETS } from '../AssetsType'
import {
  AndroidBuildConfigType,
  CommonBuildConfigType,
  iOSBuildConfigType,
  WebBuildConfigType
} from '../BuildConfigType'
import mainImprint from './mainImprint'
import { lightTheme } from './theme'

const APPLE_APP_ID = '1551810291'

const commonAschaffenburgBuildConfig: CommonBuildConfigType = {
  appName: 'hallo aschaffenburg',
  appIcon: 'app_icon_aschaffenburg',
  lightTheme,
  assets: ASCHAFFENBURG_ASSETS,
  cmsUrl: 'https://cms.integreat-app.de',
  hostName: 'halloaschaffenburg.de',
  allowedHostNames: ['cms.integreat-app.de'],
  translationsOverride: aschaffenburgOverrideTranslations,
  internalLinksHijackPattern:
    'https?:\\/\\/(cms(-test)?\\.integreat-app\\.de|web\\.integreat-app\\.de|integreat\\.app|aschaffenburg\\.app)(?!\\/[^/]*\\/(wp-content|wp-admin|wp-json)\\/.*).*',
  featureFlags: {
    floss: false,
    pois: false,
    newsStream: false,
    pushNotifications: false,
    introSlides: false,
    jpalTracking: false,
    sentry: true,
    developerFriendly: false,
    fixedCity: 'hallo',
    cityNotCooperatingTemplate: null
  },
  aboutUrls: {
    default: 'https://www.aschaffenburg.de/halloaschaffenburg'
  },
  privacyUrls: {
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
  appDescription: 'Ihr digitaler Begleiter für die Stadt Aschaffenburg',
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
