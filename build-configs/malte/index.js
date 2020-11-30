// @flow

import { lightTheme, darkTheme } from './theme'
import type { AndroidBuildConfigType, iOSBuildConfigType, WebBuildConfigType } from '../BuildConfigType'
import { MALTE_ASSETS } from '../AssetsType'
import malteOverrideTranslations from 'translations/override-translations/malte.json'
import mainImprint from './mainImprint'

const APPLE_APP_ID = '1535758339'

const commonMalteBuildConfig = {
  appName: 'Malte',
  appIcon: 'app_icon_malte',
  lightTheme,
  darkTheme,
  assets: MALTE_ASSETS,
  cmsUrl: 'https://cms.malteapp.de',
  allowedHostNames: ['cms.malteapp.de'],
  translationsOverride: malteOverrideTranslations,
  internalLinksHijackPattern: 'https?:\\/\\/malteapp\\.de(?!\\/[^/]*\\/(wp-content|wp-admin|wp-json)\\/.*).*',
  shareBaseUrl: 'https://malteapp.de',
  featureFlags: {
    pois: false,
    newsStream: true,
    pushNotifications: true,
    introSlides: true,
    sentry: true,
    developerFriendly: false
  },
  aboutUrls: {
    default: 'https://www.malteser-werke.de/malte-app'
  },
  privacyUrls: {
    default: 'https://www.malteser-werke.de/datenschutzerklaerung-malte.html'
  }
}

const androidMalteBuildConfig: AndroidBuildConfigType = {
  ...commonMalteBuildConfig,
  splashScreen: false,
  applicationId: 'de.malteapp',
  googleServices: {
    googleAppId: '1:146599424234:android:b110d70b79ff7ce351a793',
    gcmDefaultSenderId: '146599424234',
    defaultWebClientId: '146599424234-ekfbl5uo9bfi7u1p6lu417tbdolorhnl.apps.googleusercontent.com',
    gaTrackingId: null,
    firebaseDatabaseUrl: 'https://malte-2020.firebaseio.com',
    googleApiKey: 'AIzaSyDZNWm7Cvh3O4DjfTupTGErQVtvz1o77q8',
    googleCrashReportingApiKey: 'AIzaSyDZNWm7Cvh3O4DjfTupTGErQVtvz1o77q8',
    projectId: 'malte-2020'
  }
}
const iosMalteBuildConfig: iOSBuildConfigType = {
  ...commonMalteBuildConfig,
  bundleIdentifier: 'de.malteapp',
  provisioningProfileSpecifier: 'match Development de.malteapp',
  appleId: APPLE_APP_ID,
  googleServices: {
    clientId: '146599424234-b6rfm4skhbsv4qvob3ieh34s2chjm54k.apps.googleusercontent.com',
    reversedClientId: 'com.googleusercontent.apps.146599424234-b6rfm4skhbsv4qvob3ieh34s2chjm54k',
    apiKey: 'AIzaSyAWOaqdFwZ7-tbwiQ79dwMyzpmR_g1cBbI',
    googleAppId: '1:146599424234:ios:56dde1442250260651a793',
    gcmSenderId: '146599424234',
    bundleId: 'de.malteapp',
    databaseUrl: 'https://malte-2020.firebaseio.com',
    projectId: 'malte-2020',
    plistVersion: '1',
    storageBucket: 'malte-2020.appspot.com',
    isAdsEnabled: false,
    isAnalyticsEnabled: false,
    isAppInviteEnabled: true,
    isGCMEnabled: true,
    isSigninEnabled: true
  },
  launchScreen: 'LaunchScreenDefault'
}
const webMalteBuildConfig: WebBuildConfigType = {
  ...commonMalteBuildConfig,
  mainImprint,
  itunesAppId: APPLE_APP_ID,
  icons: {
    appLogo: '/app-logo.png',
    locationMarker: '/location-marker.svg',
    appleTouchIcon: '/apple-touch-icon.png',
    favicons: '/favicons/'
  }
}

const platformBuildConfigs = {
  common: commonMalteBuildConfig,
  web: webMalteBuildConfig,
  android: androidMalteBuildConfig,
  ios: iosMalteBuildConfig
}

export default platformBuildConfigs
