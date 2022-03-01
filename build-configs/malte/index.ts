import malteOverrideTranslations from 'translations/override-translations/malte.json'

import { MALTE_ASSETS } from '../AssetsType'
import {
  AndroidBuildConfigType,
  CommonBuildConfigType,
  iOSBuildConfigType,
  WebBuildConfigType
} from '../BuildConfigType'
import mainImprint from './mainImprint'
import { lightTheme } from './theme'

const APPLE_APP_ID = '1535758339'

const commonMalteBuildConfig: CommonBuildConfigType = {
  appName: 'Malte',
  appIcon: 'app_icon_malte',
  lightTheme,
  assets: MALTE_ASSETS,
  cmsUrl: 'https://cms.malteapp.de',
  allowedHostNames: ['cms.malteapp.de'],
  translationsOverride: malteOverrideTranslations,
  internalLinksHijackPattern: 'https?:\\/\\/(cms\\.)?malteapp\\.de(?!\\/[^/]*\\/(wp-content|wp-admin|wp-json)\\/.*).*',
  hostName: 'malteapp.de',
  featureFlags: {
    floss: false,
    pois: false,
    newsStream: true,
    pushNotifications: true,
    introSlides: true,
    jpalTracking: false,
    sentry: true,
    developerFriendly: false,
    fixedCity: null,
    cityNotCooperatingTemplate: null
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
  sha256CertFingerprint:
    '35:0C:AC:0B:70:EC:81:3A:35:41:30:03:27:FE:C1:E4:4A:93:F2:58:FF:C3:C9:BB:6F:08:47:0B:56:80:6B:81',
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
  itunesAppName: 'malte',
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
  appDescription: 'Guide of the Malteser Werke for Refugees. Digital. Multilingual. Free.',
  mainImprint,
  itunesAppId: APPLE_APP_ID,
  icons: {
    appLogo: '/app-logo.png',
    locationMarker: '/location-marker.svg',
    appleTouchIcon: '/apple-touch-icon.png',
    socialMediaPreview: '/social-media-preview.png',
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
