import { INTEGREAT_ASSETS } from 'build-configs/AssetsType'
import { CommonBuildConfigType } from 'build-configs/BuildConfigType'
import { lightTheme } from 'build-configs/integreat/theme'

export const buildConfigIconSet = (): {
  appLogo: string
  locationMarker: string
} => {
  throw new Error('Mock not yet implemented!')
}
export const buildConfigAssets = (): Record<string, never> => ({})

const buildConfig = jest.fn<CommonBuildConfigType, []>(
  (): CommonBuildConfigType => ({
    appName: 'Integreat',
    appIcon: 'app_icon_integreat',
    lightTheme,
    assets: INTEGREAT_ASSETS,
    cmsUrl: 'https://cms.integreat-app.de',
    switchCmsUrl: 'https://cms-test.integreat-app.de',
    hostName: 'integreat.app',
    allowedHostNames: ['cms.integreat-app.de', 'cms-test.integreat-app.de'],
    internalLinksHijackPattern:
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
      cityNotCooperatingTemplate: 'template'
    },
    aboutUrls: {
      default: 'https://integreat-app.de/about/',
      en: 'https://integreat-app.de/en/about/'
    },
    privacyUrls: {
      default: 'https://integreat-app.de/datenschutz/',
      en: 'https://integreat-app.de/en/privacy/'
    }
  })
)
export default buildConfig
