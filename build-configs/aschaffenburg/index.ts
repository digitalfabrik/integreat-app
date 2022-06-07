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

const APPLICATION_ID = 'app.aschaffenburg'
const BUNDLE_IDENTIFIER = 'app.aschaffenburg'

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
    newsStream: false,
    pushNotifications: false,
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
  applicationId: APPLICATION_ID,
  googleServices: null
}

export const iosAschaffenburgBuildConfig: iOSBuildConfigType = {
  ...commonAschaffenburgBuildConfig,
  bundleIdentifier: BUNDLE_IDENTIFIER,
  provisioningProfileSpecifier: `match Development ${BUNDLE_IDENTIFIER}`,
  googleServices: null,
  launchScreen: 'LaunchScreenDefault'
}

export const webAschaffenburgBuildConfig: WebBuildConfigType = {
  ...commonAschaffenburgBuildConfig,
  appDescription: 'Ihr digitaler Begleiter für die Stadt Aschaffenburg',
  mainImprint,
  icons: {
    appLogo: '/app-logo.png',
    appleTouchIcon: '/apple-touch-icon.png',
    socialMediaPreview: '/social-media-preview.png',
    favicons: '/favicons/'
  },
  apps: {
    android: {
      applicationId: APPLICATION_ID,
      sha256CertFingerprint:
        '21:BB:E8:40:4D:4E:18:62:68:A8:16:62:64:FB:27:D1:D1:A4:02:F5:96:44:F6:B9:B5:3F:39:14:17:55:50:99'
    },
    ios: {
      bundleIdentifier: BUNDLE_IDENTIFIER,
      appStoreId: '1551810291',
      appStoreName: 'aschaffenburg-app',
      appleAppSiteAssociationAppIds: [`${APP_STORE_TEAM_ID}.${BUNDLE_IDENTIFIER}`]
    }
  }
}

const platformBuildConfigs = {
  common: commonAschaffenburgBuildConfig,
  web: webAschaffenburgBuildConfig,
  android: androidAschaffenburgBuildConfig,
  ios: iosAschaffenburgBuildConfig
}

export default platformBuildConfigs
