import { AndroidBuildConfigType, CommonBuildConfigType } from '../BuildConfigType'
import integreatPlatformBuildConfigs from '../integreat'

const commonIntegreatFlossBuildConfig: CommonBuildConfigType = {
  ...integreatPlatformBuildConfigs.common,
  featureFlags: {
    ...integreatPlatformBuildConfigs.common.featureFlags,
    floss: true,
  },
}
const androidIntegreatFlossBuildConfig: AndroidBuildConfigType = {
  ...integreatPlatformBuildConfigs.android,
  ...commonIntegreatFlossBuildConfig,
  googleServices: null,
  // TODO IGAPP-174 Use correct applicationId
  applicationId: 'app.integreat.floss',
}
const platformBuildConfigs = {
  ...integreatPlatformBuildConfigs,
  common: commonIntegreatFlossBuildConfig,
  android: androidIntegreatFlossBuildConfig,
}
export default platformBuildConfigs
