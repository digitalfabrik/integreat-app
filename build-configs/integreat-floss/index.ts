import { AndroidBuildConfigType } from '../BuildConfigType'
import integreatPlatformBuildConfigs from '../integreat'

export const androidIntegreatBuildConfig: AndroidBuildConfigType = {
  ...integreatPlatformBuildConfigs.android,
  googleServices: null,
  // TODO Use correct applicationId
  applicationId: 'tuerantuer.app.integreat',
  floss: true
}
const platformBuildConfigs = {
  ...integreatPlatformBuildConfigs,
  android: androidIntegreatBuildConfig
}
export default platformBuildConfigs
