import { INTEGREAT_ASSETS } from '../AssetsType'
import {
  AndroidBuildConfigType,
  CommonBuildConfigType,
  iOSBuildConfigType,
  WebBuildConfigType,
} from '../BuildConfigType'
import { APP_STORE_TEAM_ID } from '../common/constants'
import cityNotCooperatingTemplate from './assets/cityNotCooperatingTemplate'
import mainImprint from './mainImprint'
import { lightTheme } from './theme'

const APPLICATION_ID = 'tuerantuer.app.integreat'
const BUNDLE_IDENTIFIER = 'de.integreat-app'

const commonIntegreatBuildConfig: CommonBuildConfigType = {
  appName: 'Integreat',
  appIcon: 'app_icon_integreat',
  lightTheme,
  assets: INTEGREAT_ASSETS,
  cmsUrl: 'https://cms.integreat-app.de',
  switchCmsUrl: 'https://cms-test.integreat-app.de',
  hostName: 'integreat.app',
  allowedHostNames: ['cms.integreat-app.de', 'cms-test.integreat-app.de'],
  internalLinksHijackPattern:
    'https?:\\/\\/(cms(-test)?\\.integreat-app\\.de|web\\.integreat-app\\.de|integreat\\.app)(?!\\/(media|[^/]*\\/(wp-content|wp-admin|wp-json))\\/.*).*',
  featureFlags: {
    floss: false,
    pois: true,
    newsStream: true,
    pushNotifications: true,
    introSlides: true,
    jpalTracking: true,
    sentry: true,
    developerFriendly: false,
    fixedCity: null,
    cityNotCooperatingTemplate,
  },
  aboutUrls: {
    default: 'https://integreat-app.de/about/',
    en: 'https://integreat-app.de/en/about/',
  },
  privacyUrls: {
    default: 'https://integreat-app.de/datenschutz/',
    en: 'https://integreat-app.de/en/privacy/',
  },
}
export const androidIntegreatBuildConfig: AndroidBuildConfigType = {
  ...commonIntegreatBuildConfig,
  splashScreen: true,
  applicationId: APPLICATION_ID,
  googleServices: {
    googleAppId: '1:164298278764:android:3fc1f67f3883df306fd549',
    gcmDefaultSenderId: '164298278764',
    defaultWebClientId: '164298278764-hhup7orh5rvg0oumhbabqvp5giudaste.apps.googleusercontent.com',
    gaTrackingId: null,
    firebaseDatabaseUrl: 'https://integreat-2020.firebaseio.com',
    googleApiKey: 'AIzaSyBvc08_Cqww8z2Dh-EXtwHW98HXBk8T7V4',
    googleCrashReportingApiKey: 'AIzaSyBvc08_Cqww8z2Dh-EXtwHW98HXBk8T7V4',
    projectId: 'integreat-2020',
  },
}
export const iosIntegreatBuildConfig: iOSBuildConfigType = {
  ...commonIntegreatBuildConfig,
  bundleIdentifier: BUNDLE_IDENTIFIER,
  provisioningProfileSpecifier: `match Development ${BUNDLE_IDENTIFIER}`,
  googleServices: {
    clientId: '164298278764-pemn49q7v283m0tqml3q8q0ltr5h8pni.apps.googleusercontent.com',
    reversedClientId: 'com.googleusercontent.apps.164298278764-pemn49q7v283m0tqml3q8q0ltr5h8pni',
    apiKey: 'AIzaSyBSnGYrUWfIAPcEsFya1OYvTMbjvfUyOEU',
    gcmSenderId: '164298278764',
    plistVersion: '1',
    bundleId: BUNDLE_IDENTIFIER,
    projectId: 'integreat-2020',
    storageBucket: 'integreat-2020.appspot.com',
    isAdsEnabled: false,
    isAnalyticsEnabled: false,
    isAppInviteEnabled: true,
    isGCMEnabled: true,
    isSigninEnabled: true,
    googleAppId: '1:164298278764:ios:2a69672da4d117116fd549',
    databaseUrl: 'https://integreat-2020.firebaseio.com',
  },
  launchScreen: 'LaunchScreenIntegreat',
}
export const webIntegreatBuildConfig: WebBuildConfigType = {
  ...commonIntegreatBuildConfig,
  appDescription: 'Integreat – die lokale und mehrsprachige Integrations-Plattform für Zugewanderte',
  mainImprint,
  manifestUrl: '/manifest.json',
  icons: {
    appLogo: '/app-logo.png',
    appLogoMobile: '/app-icon-round.png',
    locationMarker: '/location-marker.svg',
    cityNotCooperating: '/city-not-cooperating.svg',
    appleTouchIcon: '/apple-touch-icon.png',
    socialMediaPreview: '/social-media-preview.png',
    favicons: '/favicons/',
  },
  splashScreen: {
    backgroundColor: lightTheme.colors.themeColor,
    imageUrl: '/app-icon-cornered.jpg',
  },
  campaign: {
    campaignAppLogo: '/campaign-app-logo.png',
    startDate: '2021-03-08T00:00:00.000Z',
    endDate: '2021-03-15T00:00:00.000Z',
  },
  apps: {
    android: {
      applicationId: APPLICATION_ID,
      sha256CertFingerprint:
        '66:2E:43:DC:9C:75:DE:7D:99:C5:BA:A9:19:DA:0F:BB:5E:6C:13:3D:03:E8:1D:FB:EF:87:F5:4B:F1:80:D4:B1',
    },
    ios: {
      bundleIdentifier: BUNDLE_IDENTIFIER,
      appStoreId: '1072353915',
      appStoreName: 'integreat',
      appleAppSiteAssociationAppIds: [
        `${APP_STORE_TEAM_ID}.${BUNDLE_IDENTIFIER}`,
        `${APP_STORE_TEAM_ID}.app.integreat.test`,
      ],
    },
  },
}
const platformBuildConfigs = {
  common: commonIntegreatBuildConfig,
  web: webIntegreatBuildConfig,
  android: androidIntegreatBuildConfig,
  ios: iosIntegreatBuildConfig,
}
export default platformBuildConfigs
