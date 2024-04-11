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
  allowedLookalikes: [],
  supportedIframeSources: ['vimeo.com'],
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
    default: 'https://tuerantuer.de/digitalfabrik/projekte/netzwerkobdachwohnen/',
  },
  privacyUrls: {
    default: 'https://integreat-app.de/datenschutz/',
    en: 'https://integreat-app.de/en/privacy-policy/',
  },
}
export const webObdachBuildConfig: WebBuildConfigType = {
  ...commonObdachBuildConfig,
  appDescription:
    'Netzwerk Obdach & Wohnen – die lokale und mehrsprachige Plattform für Obdachlose und Menschen die von Obdachlosigkeit bedroht sind',
  mainImprint,
  manifestUrl: '/manifest.json',
  icons: {
    appLogo: '/app-logo.svg',
    appLogoMobile: '/app-icon-round.svg',
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
