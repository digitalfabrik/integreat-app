import malteOverrideTranslations from 'translations/override-translations/malte.json'

import { MALTE_ASSETS } from '../AssetsType'
import {
  AndroidBuildConfigType,
  CommonBuildConfigType,
  iOSBuildConfigType,
  WebBuildConfigType
} from '../BuildConfigType'
import { APP_STORE_TEAM_ID } from '../common/constants'
import mainImprint from './mainImprint'
import { lightTheme } from './theme'

const APPLICATION_ID = 'de.malteapp'
const BUNDLE_IDENTIFIER = 'de.malteapp'

const commonMalteBuildConfig: CommonBuildConfigType = {
  appName: 'Malte',
  appIcon: 'app_icon_malte',
  lightTheme,
  assets: MALTE_ASSETS,
  cmsUrl: 'https://cms.malteapp.de',
  switchCmsUrl: 'https://malte-test.tuerantuer.org',
  allowedHostNames: ['cms.malteapp.de', 'malte-test.tuerantuer.org'],
  translationsOverride: malteOverrideTranslations,
  internalLinksHijackPattern:
    'https?:\\/\\/((cms\\.)?malteapp\\.de|malte-test\\.tuerantuer\\.org)(?!\\/(media|[^/]*\\/(wp-content|wp-admin|wp-json))\\/.*).*',
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
  applicationId: APPLICATION_ID,
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
  bundleIdentifier: BUNDLE_IDENTIFIER,
  provisioningProfileSpecifier: `match Development ${BUNDLE_IDENTIFIER}`,
  googleServices: {
    clientId: '146599424234-b6rfm4skhbsv4qvob3ieh34s2chjm54k.apps.googleusercontent.com',
    reversedClientId: 'com.googleusercontent.apps.146599424234-b6rfm4skhbsv4qvob3ieh34s2chjm54k',
    apiKey: 'AIzaSyAWOaqdFwZ7-tbwiQ79dwMyzpmR_g1cBbI',
    googleAppId: '1:146599424234:ios:56dde1442250260651a793',
    gcmSenderId: '146599424234',
    bundleId: BUNDLE_IDENTIFIER,
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
  icons: {
    appLogo: '/app-logo.png',
    locationMarker: '/location-marker.svg',
    appleTouchIcon: '/apple-touch-icon.png',
    socialMediaPreview: '/social-media-preview.png',
    favicons: '/favicons/'
  },
  apps: {
    android: {
      applicationId: APPLICATION_ID,
      sha256CertFingerprint:
        '35:0C:AC:0B:70:EC:81:3A:35:41:30:03:27:FE:C1:E4:4A:93:F2:58:FF:C3:C9:BB:6F:08:47:0B:56:80:6B:81'
    },
    ios: {
      bundleIdentifier: BUNDLE_IDENTIFIER,
      appStoreId: '1535758339',
      appStoreName: 'malte',
      appleAppSiteAssociationAppIds: [
        `${APP_STORE_TEAM_ID}.${BUNDLE_IDENTIFIER}`,
        `${APP_STORE_TEAM_ID}.de.malteapp.test`
      ]
    }
  }
}

const platformBuildConfigs = {
  common: commonMalteBuildConfig,
  web: webMalteBuildConfig,
  android: androidMalteBuildConfig,
  ios: iosMalteBuildConfig
}

export default platformBuildConfigs
