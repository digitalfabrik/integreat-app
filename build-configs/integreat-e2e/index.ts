import {
  AndroidBuildConfigType,
  CommonBuildConfigType,
  IosBuildConfigType,
  WebBuildConfigType,
} from '../BuildConfigType'
import integreatPlatformBuildConfigs from '../integreat'
import cityNotCooperatingTemplate from '../integreat/assets/cityNotCooperatingTemplate'

const integreatE2e = {
  appName: 'IntegreatE2E',
  e2e: true,
  featureFlags: {
    introSlides: false,
    sentry: false,
    developerFriendly: false,
    fixedCity: null,
    cityNotCooperatingTemplate,
    chat: false,
  },
}
const commonIntegreatE2eBuildConfig: CommonBuildConfigType = {
  ...integreatPlatformBuildConfigs.common,
  ...integreatE2e,
}
const webIntegreatE2eBuildConfig: WebBuildConfigType = { ...integreatPlatformBuildConfigs.web, ...integreatE2e }
const androidIntegreatE2eBuildConfig: AndroidBuildConfigType = {
  ...integreatPlatformBuildConfigs.android,
  ...integreatE2e,
}
const iosIntegreatE2eBuildConfig: IosBuildConfigType = { ...integreatPlatformBuildConfigs.ios, ...integreatE2e }
const platformBuildConfigs = {
  common: commonIntegreatE2eBuildConfig,
  web: webIntegreatE2eBuildConfig,
  android: androidIntegreatE2eBuildConfig,
  ios: iosIntegreatE2eBuildConfig,
}
export default platformBuildConfigs
