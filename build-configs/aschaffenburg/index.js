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
  appIcon: 'app_icon_integreat',
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
    newsStream: true,
    pushNotifications: true,
    introSlides: true,
    sentry: true,
    developerFriendly: false
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
  splashScreen: true,
  applicationId: 'app.aschaffenburg',
  googleServices: {
    googleAppId: '',
    gcmDefaultSenderId: '',
    defaultWebClientId: '',
    gaTrackingId: null,
    firebaseDatabaseUrl: '',
    googleApiKey: '',
    googleCrashReportingApiKey: '',
    projectId: 'aschaffenburg-2021'
  }
}

export const iosAschaffenburgBuildConfig: iOSBuildConfigType = {
  ...commonAschaffenburgBuildConfig,
  bundleIdentifier: 'app.aschaffenburg',
  provisioningProfileSpecifier: 'match Development app.aschaffenburg',
  appleId: APPLE_APP_ID,
  googleServices: {
    clientId: '',
    reversedClientId: '',
    apiKey: '',
    gcmSenderId: '',
    plistVersion: '1',
    bundleId: 'app.aschaffenburg',
    projectId: 'aschaffenburg-2021',
    storageBucket: '',
    isAdsEnabled: false,
    isAnalyticsEnabled: false,
    isAppInviteEnabled: true,
    isGCMEnabled: true,
    isSigninEnabled: true,
    googleAppId: '',
    databaseUrl: ''
  },
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
    favicons: '/favicons/'
  },
  splashScreen: {
    backgroundColor: lightTheme.colors.themeColor,
    imageUrl: '/app-icon-cornered.jpg'
  }
}

const platformBuildConfigs = {
  common: commonAschaffenburgBuildConfig,
  web: webAschaffenburgBuildConfig,
  android: androidAschaffenburgBuildConfig,
  ios: iosAschaffenburgBuildConfig
}

export default platformBuildConfigs
