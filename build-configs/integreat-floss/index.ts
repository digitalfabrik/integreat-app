import { AndroidBuildConfigType, CommonBuildConfigType } from '../BuildConfigType'
import integreatPlatformBuildConfigs from '../integreat'

const commonIntegreatFlossBuildConfig: CommonBuildConfigType = {
  ...integreatPlatformBuildConfigs.common,
  featureFlags: {
    ...integreatPlatformBuildConfigs.common.featureFlags,
    floss: true
  }
}
const androidIntegreatFlossBuildConfig: AndroidBuildConfigType = {
  ...integreatPlatformBuildConfigs.android,
  ...commonIntegreatFlossBuildConfig,
  googleServices: null,
  // TODO Use correct applicationId
  applicationId: 'tuerantuer.app.integreat'
}
const platformBuildConfigs = {
  ...integreatPlatformBuildConfigs,
  common: commonIntegreatFlossBuildConfig,
  android: androidIntegreatFlossBuildConfig
}
export default platformBuildConfigs
