import {
  AndroidBuildConfigType,
  CommonBuildConfigType,
  iOSBuildConfigType,
  WebBuildConfigType
} from '../BuildConfigType'
import integreatPlatformBuildConfigs from '../integreat'
import cityNotCooperatingTemplate from '../integreat/assets/cityNotCooperatingTemplate'

const integreatE2e = {
  appName: 'IntegreatE2E',
  e2e: true,
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
    cityNotCooperatingTemplate
  }
}
const commonIntegreatE2eBuildConfig: CommonBuildConfigType = {
  ...integreatPlatformBuildConfigs.common,
  ...integreatE2e
}
const webIntegreatE2eBuildConfig: WebBuildConfigType = { ...integreatPlatformBuildConfigs.web, ...integreatE2e }
const androidIntegreatE2eBuildCOnfig: AndroidBuildConfigType = {
  ...integreatPlatformBuildConfigs.android,
  ...integreatE2e
}
const iosIntegreatE2eBuildConfig: iOSBuildConfigType = { ...integreatPlatformBuildConfigs.ios, ...integreatE2e }
const platformBuildConfigs = {
  common: commonIntegreatE2eBuildConfig,
  web: webIntegreatE2eBuildConfig,
  android: androidIntegreatE2eBuildCOnfig,
  ios: iosIntegreatE2eBuildConfig
}
export default platformBuildConfigs
