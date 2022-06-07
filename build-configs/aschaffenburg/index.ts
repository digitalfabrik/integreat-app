import aschaffenburgOverrideTranslations from 'translations/override-translations/aschaffenburg.json'

import { ASCHAFFENBURG_ASSETS } from '../AssetsType'
import {
  AndroidBuildConfigType,
  CommonBuildConfigType,
  iOSBuildConfigType,
  WebBuildConfigType
} from '../BuildConfigType'
import { APP_STORE_TEAM_ID } from '../common/constants'
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
    'https?:\\/\\/(cms(-test)?\\.integreat-app\\.de|web\\.integreat-app\\.de|integreat\\.app|aschaffenburg\\.app)(?!\\/(media|[^/]*\\/(wp-content|wp-admin|wp-json))\\/.*).*',
  featureFlags: {
    floss: false,
    pois: false,
    newsStream: true,
    pushNotifications: true,
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
  sha256CertFingerprint:
    '21:BB:E8:40:4D:4E:18:62:68:A8:16:62:64:FB:27:D1:D1:A4:02:F5:96:44:F6:B9:B5:3F:39:14:17:55:50:99',
  googleServices: {
    googleAppId: '1:164298278764:android:2e968d165bb8c80c6fd549',
    gcmDefaultSenderId: '164298278764',
    defaultWebClientId: '164298278764-hhup7orh5rvg0oumhbabqvp5giudaste.apps.googleusercontent.com',
    gaTrackingId: null,
    firebaseDatabaseUrl: 'https://integreat-2020.firebaseio.com',
    googleApiKey: 'AIzaSyBvc08_Cqww8z2Dh-EXtwHW98HXBk8T7V4',
    googleCrashReportingApiKey: 'AIzaSyBvc08_Cqww8z2Dh-EXtwHW98HXBk8T7V4',
    projectId: 'integreat-2020'
  }
}

export const iosAschaffenburgBuildConfig: iOSBuildConfigType = {
  ...commonAschaffenburgBuildConfig,
  bundleIdentifier: 'app.aschaffenburg',
  provisioningProfileSpecifier: 'match Development app.aschaffenburg',
  appleId: APPLE_APP_ID,
  itunesAppName: 'aschaffenburg-app',
  appleAppSiteAssociationAppIds: [`${APP_STORE_TEAM_ID}.app.aschaffenburg`],
  googleServices: {
    clientId: '164298278764-b6gagnbo2vmickaeq2070fg4jipithsk.apps.googleusercontent.com',
    reversedClientId: 'com.googleusercontent.apps.164298278764-b6gagnbo2vmickaeq2070fg4jipithsk',
    apiKey: 'AIzaSyBSnGYrUWfIAPcEsFya1OYvTMbjvfUyOEU',
    gcmSenderId: '164298278764',
    plistVersion: '1',
    bundleId: 'app.aschaffenburg',
    projectId: 'integreat-2020',
    storageBucket: 'integreat-2020.appspot.com',
    isAdsEnabled: false,
    isAnalyticsEnabled: false,
    isAppInviteEnabled: true,
    isGCMEnabled: true,
    isSigninEnabled: true,
    googleAppId: '1:164298278764:ios:ce4707c860f0a2cb6fd549',
    databaseUrl: 'https://integreat-2020.firebaseio.com'
  },
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
