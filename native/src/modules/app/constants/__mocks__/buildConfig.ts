import { darkTheme, lightTheme } from 'build-configs/integreat/theme'
import type { CommonBuildConfigType } from 'build-configs/BuildConfigType'
import { INTEGREAT_ASSETS } from 'build-configs/AssetsType'
export const buildConfigIconSet = (): {
  appLogo: string
  locationMarker: string
} => {
  throw new Error('Mock not yet implemented!')
}
export const buildConfigAssets = () => {
  return {}
}
const buildConfig = jest.fn<[], CommonBuildConfigType>(
  (): CommonBuildConfigType => ({
    appName: 'Integreat',
    appIcon: 'app_icon_integreat',
    lightTheme,
    darkTheme,
    assets: INTEGREAT_ASSETS,
    cmsUrl: 'https://cms.integreat-app.de',
    switchCmsUrl: 'https://cms-test.integreat-app.de',
    hostName: 'integreat.app',
    allowedHostNames: ['cms.integreat-app.de', 'cms-test.integreat-app.de'],
    internalLinksHijackPattern:
      'https?:\\/\\/(cms(-test)?\\.integreat-app\\.de|web\\.integreat-app\\.de|integreat\\.app)(?!\\/[^/]*\\/(wp-content|wp-admin|wp-json)\\/.*).*',
    featureFlags: {
      pois: false,
      newsStream: false,
      pushNotifications: false,
      introSlides: true,
      jpalTracking: false,
      sentry: true,
      developerFriendly: false,
      fixedCity: null
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
