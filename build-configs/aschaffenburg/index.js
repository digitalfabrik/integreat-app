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

const APPLE_APP_ID = ''

const commonAschaffenburgBuildConfig: CommonBuildConfigType = {
  appName: 'Aschaffenburg App',
  appIcon: 'app_icon_integreat',//TODO in IGAPP-299
  lightTheme,
  darkTheme,
  assets: ASCHAFFENBURG_ASSETS,
  cmsUrl: 'https://cms.integreat-app.de',
  switchCmsUrl: 'https://cms-test.integreat-app.de',
  shareBaseUrl: 'https://aschaffenburg.app',
  allowedHostNames: ['cms.integreat-app.de', 'cms-test.integreat-app.de'],
  internalLinksHijackPattern: 'https?:\\/\\/(cms(-test)?\\.integreat-app\\.de|web\\.integreat-app\\.de|integreat\\.app)(?!\\/[^/]*\\/(wp-content|wp-admin|wp-json)\\/.*).*',
  featureFlags: {
    pois: false,
    newsStream: false,
    pushNotifications: false,
    introSlides: false,
    sentry: true,
    developerFriendly: false,
    selectedCity: 'aschaffenburgapp'
  },
  aboutUrls: {
    default: 'https://integreat-app.de/about/',
    en: 'https://integreat-app.de/en/about/'
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
  googleServices: null,
  launchScreen: 'LaunchScreenDefault'
}

export const webAschaffenburgBuildConfig: WebBuildConfigType = {
  ...commonAschaffenburgBuildConfig,
  mainImprint,
  itunesAppId: APPLE_APP_ID,
  manifestUrl: '/manifest.json',
  icons: {
    appLogo: '/app-logo.png',
    locationMarker: '/location-marker.svg',
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
