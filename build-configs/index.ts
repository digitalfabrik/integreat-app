import {
  CommonBuildConfigType,
  AndroidBuildConfigType,
  iOSBuildConfigType,
  WebBuildConfigType
} from './BuildConfigType'
import integreatBuildConfig from './integreat'
import integreatTestCmsBuildConfig from './integreat-test-cms'
import integreatE2eBuildConfig from './integreat-e2e'
import malteBuildConfig from './malte'
import aschaffenburgBuildConfig from './aschaffenburg'
export const COMMON = 'common'
export const ANDROID = 'android'
export const IOS = 'ios'
export const WEB = 'web'
const PLATFORMS = [COMMON, ANDROID, IOS, WEB]
type BuildConfigPlatformType = {
  common: CommonBuildConfigType
  android: AndroidBuildConfigType
  ios: iOSBuildConfigType
  web: WebBuildConfigType
}
export const buildConfigs: Record<string, BuildConfigPlatformType> = {
  integreat: integreatBuildConfig,
  'integreat-test-cms': integreatTestCmsBuildConfig,
  'integreat-e2e': integreatE2eBuildConfig,
  malte: malteBuildConfig,
  aschaffenburg: aschaffenburgBuildConfig
}

const loadBuildConfig = (buildConfigName: string | null | undefined, platform: string | null | undefined) => {
  if (!buildConfigName) {
    throw Error('No BUILD_CONFIG_NAME supplied!')
  }

  const buildConfig = buildConfigs[buildConfigName]

  if (!buildConfig) {
    throw Error(`Invalid BUILD_CONFIG_NAME supplied: ${buildConfigName}`)
  }

  if (!platform || !PLATFORMS.includes(platform)) {
    throw Error(`Invalid platform supplied: ${platform || 'undefined'}`)
  }

  return buildConfig[platform]
}

export default loadBuildConfig
