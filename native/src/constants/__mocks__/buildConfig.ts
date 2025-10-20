import { INTEGREAT_ASSETS } from 'build-configs/AssetsType'
import { CommonBuildConfigType } from 'build-configs/BuildConfigType'
import { legacyLightTheme, legacyContrastTheme, lightTheme, darkTheme } from 'build-configs/integreat/theme'
import { typography } from 'build-configs/integreat/theme/typography'

export const buildConfigIconSet = (): {
  appLogo: string
  locationMarker: string
} => {
  throw new Error('Mock not yet implemented!')
}
export const buildConfigAssets = jest.requireActual('../buildConfig').buildConfigAssets

const buildConfig = jest.fn<CommonBuildConfigType, []>(
  (): CommonBuildConfigType => ({
    appName: 'Integreat',
    appIcon: 'app_icon_integreat',
    notificationIcon: 'notification_icon_integreat',
    lightTheme,
    darkTheme,
    legacyLightTheme,
    legacyContrastTheme,
    typography,
    assets: INTEGREAT_ASSETS,
    cmsUrl: 'https://cms.integreat-app.de',
    switchCmsUrl: 'https://cms-test.integreat-app.de',
    hostName: 'integreat.app',
    allowedHostNames: ['cms.integreat-app.de', 'cms-test.integreat-app.de', 'admin.integreat-app.de'],
    allowedLookalikes: ['https://integreat.app', 'https://integreat-app.de'],
    supportedIframeSources: ['vimeo.com'],
    internalUrlPattern:
      'https?:\\/\\/(cms(-test)?\\.integreat-app\\.de|web\\.integreat-app\\.de|integreat\\.app)(?!\\/[^/]*\\/(wp-content|wp-admin|wp-json)\\/.*).*',
    featureFlags: {
      floss: false,
      pois: false,
      newsStream: false,
      pushNotifications: false,
      introSlides: true,
      jpalTracking: false,
      sentry: true,
      developerFriendly: false,
      fixedCity: null,
      cityNotCooperatingTemplate: 'template',
      chat: false,
      tts: true,
    },
    aboutUrls: {
      default: 'https://integreat-app.de/about/',
      en: 'https://integreat-app.de/en/about/',
    },
    privacyUrls: {
      default: 'https://integreat-app.de/datenschutz/',
      en: 'https://integreat-app.de/en/privacy/',
    },
  }),
)
export default buildConfig
