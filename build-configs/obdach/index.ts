import { OBDACH_ASSETS } from '../AssetsType'
import {
  AndroidBuildConfigType,
  CommonBuildConfigType,
  iOSBuildConfigType,
  WebBuildConfigType
} from '../BuildConfigType'
import { APP_STORE_TEAM_ID } from '../common/constants'
import mainImprint from './mainImprint'
import { lightTheme } from './theme'

const APPLE_APP_ID = '1072353915'

const commonObdachBuildConfig: CommonBuildConfigType = {
  appName: 'Vernetztes Obdach',
  appIcon: 'app_icon_obdach',
  lightTheme,
  assets: OBDACH_ASSETS,
  cmsUrl: 'https://cms.vernetztesobdach.de',
  hostName: 'vernetztesobdach.de',
  allowedHostNames: ['cms.vernetztesobdach.de'],
  internalLinksHijackPattern:
    'https?:\\/\\/((cms\\.)?vernetztesobdach\\.de)(?!\\/(media|[^/]*\\/(wp-content|wp-admin|wp-json))\\/.*).*',
  featureFlags: {
    floss: false,
    pois: true,
    newsStream: true,
    pushNotifications: false,
    introSlides: false,
    jpalTracking: false,
    sentry: false,
    developerFriendly: false,
    fixedCity: null,
    cityNotCooperatingTemplate: null
  },
  aboutUrls: {
    default: 'https://vernetztesobdach.de/about/',
    en: 'https://vernetztesobdach.de/en/about/'
  },
  privacyUrls: {
    default: 'https://vernetztesobdach.de/datenschutz/',
    en: 'https://vernetztesobdach.de/en/privacy/'
  }
}
export const androidObdachBuildConfig: AndroidBuildConfigType = {
  ...commonObdachBuildConfig,
  splashScreen: true,
  applicationId: 'tuerantuer.app.integreat',
  sha256CertFingerprint:
    '66:2E:43:DC:9C:75:DE:7D:99:C5:BA:A9:19:DA:0F:BB:5E:6C:13:3D:03:E8:1D:FB:EF:87:F5:4B:F1:80:D4:B1',
  googleServices: {
    googleAppId: '1:164298278764:android:3fc1f67f3883df306fd549',
    gcmDefaultSenderId: '164298278764',
    defaultWebClientId: '164298278764-hhup7orh5rvg0oumhbabqvp5giudaste.apps.googleusercontent.com',
    gaTrackingId: null,
    firebaseDatabaseUrl: 'https://integreat-2020.firebaseio.com',
    googleApiKey: 'AIzaSyBvc08_Cqww8z2Dh-EXtwHW98HXBk8T7V4',
    googleCrashReportingApiKey: 'AIzaSyBvc08_Cqww8z2Dh-EXtwHW98HXBk8T7V4',
    projectId: 'integreat-2020'
  }
}
export const iosObdachBuildConfig: iOSBuildConfigType = {
  ...commonObdachBuildConfig,
  bundleIdentifier: 'de.integreat-app',
  provisioningProfileSpecifier: 'match Development de.integreat-app',
  appleId: APPLE_APP_ID,
  itunesAppName: 'integreat',
  appleAppSiteAssociationAppIds: [`${APP_STORE_TEAM_ID}.de.integreat-app`, `${APP_STORE_TEAM_ID}.app.integreat.test`],
  googleServices: {
    clientId: '164298278764-pemn49q7v283m0tqml3q8q0ltr5h8pni.apps.googleusercontent.com',
    reversedClientId: 'com.googleusercontent.apps.164298278764-pemn49q7v283m0tqml3q8q0ltr5h8pni',
    apiKey: 'AIzaSyBSnGYrUWfIAPcEsFya1OYvTMbjvfUyOEU',
    gcmSenderId: '164298278764',
    plistVersion: '1',
    bundleId: 'de.integreat-app',
    projectId: 'integreat-2020',
    storageBucket: 'integreat-2020.appspot.com',
    isAdsEnabled: false,
    isAnalyticsEnabled: false,
    isAppInviteEnabled: true,
    isGCMEnabled: true,
    isSigninEnabled: true,
    googleAppId: '1:164298278764:ios:2a69672da4d117116fd549',
    databaseUrl: 'https://integreat-2020.firebaseio.com'
  },
  launchScreen: 'LaunchScreenIntegreat'
}
export const webObdachBuildConfig: WebBuildConfigType = {
  ...commonObdachBuildConfig,
  appDescription:
    'Vernetztes Obdach – die lokale und mehrsprachige Plattform für Obdachlose und Menschen die von Obdachlosigkeit bedroht sind',
  mainImprint,
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
  common: commonObdachBuildConfig,
  web: webObdachBuildConfig,
  android: androidObdachBuildConfig,
  ios: iosObdachBuildConfig
}
export default platformBuildConfigs
