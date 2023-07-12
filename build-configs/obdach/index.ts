import { OBDACH_ASSETS } from '../AssetsType'
import { CommonBuildConfigType, WebBuildConfigType } from '../BuildConfigType'
import mainImprint from './mainImprint'
import { lightTheme } from './theme'

const commonObdachBuildConfig: CommonBuildConfigType = {
  appName: 'Netzwerk Obdach & Wohnen',
  appIcon: 'app_icon_obdach',
  lightTheme,
  assets: OBDACH_ASSETS,
  cmsUrl: 'https://cms.netzwerkobdachwohnen.de',
  hostName: 'netzwerkobdachwohnen.de',
  allowedHostNames: ['cms.netzwerkobdachwohnen.de', 'admin.netzwerkobdachwohnen.de'],
  internalLinksHijackPattern:
    'https?:\\/\\/((cms\\.)?netzwerkobdachwohnen\\.de)(?!\\/(media|[^/]*\\/(wp-content|wp-admin|wp-json))\\/.*).*',
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
    default: 'https://netzwerkobdachwohnen.de/about/',
    en: 'https://netzwerkobdachwohnen.de/en/about/',
  },
  privacyUrls: {
    default: 'https://netzwerkobdachwohnen.de/datenschutz/',
    en: 'https://netzwerkobdachwohnen.de/en/privacy/',
  },
}
export const webObdachBuildConfig: WebBuildConfigType = {
  ...commonObdachBuildConfig,
  appDescription:
    'Netzwerk Obdach Wohnen – die lokale und mehrsprachige Plattform für Obdachlose und Menschen die von Obdachlosigkeit bedroht sind',
  mainImprint,
  manifestUrl: '/manifest.json',
  icons: {
    appLogo: '/app-logo.png',
    appLogoMobile: '/app-icon-round.png',
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
