import { OBDACH_ASSETS } from '../AssetsType'
import { CommonBuildConfigType, WebBuildConfigType } from '../BuildConfigType'
import mainImprint from './mainImprint'
import { lightTheme } from './theme'

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
    cityNotCooperatingTemplate: null,
  },
  aboutUrls: {
    default: 'https://vernetztesobdach.de/about/',
    en: 'https://vernetztesobdach.de/en/about/',
  },
  privacyUrls: {
    default: 'https://vernetztesobdach.de/datenschutz/',
    en: 'https://vernetztesobdach.de/en/privacy/',
  },
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
    favicons: '/favicons/',
  },
  apps: null,
}
const platformBuildConfigs = {
  common: commonObdachBuildConfig,
  web: webObdachBuildConfig,
  android: null,
  ios: null,
}
export default platformBuildConfigs
