import {
  CommonBuildConfigType,
  AndroidBuildConfigType,
  iOSBuildConfigType,
  WebBuildConfigType
} from './BuildConfigType'
import integreatBuildConfig from './integreat'
import integreatBuildConfigName from './integreat/build-config-name'
import integreatTestCmsBuildConfig from './integreat-test-cms'
import integreatTestCmsBuildConfigName from './integreat-test-cms/build-config-name'
import integreatE2eBuildConfig from './integreat-e2e'
import integreatE2eBuildConfigName from './integreat-e2e/build-config-name'
import malteBuildConfig from './malte'
import malteBuildConfigName from './malte/build-config-name'
import aschaffenburgBuildConfig from './aschaffenburg'
import aschaffenburgBuildConfigName from './aschaffenburg/build-config-name'

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
  [integreatBuildConfigName]: integreatBuildConfig,
  [integreatTestCmsBuildConfigName]: integreatTestCmsBuildConfig,
  [integreatE2eBuildConfigName]: integreatE2eBuildConfig,
  [malteBuildConfigName]: malteBuildConfig,
  [aschaffenburgBuildConfigName]: aschaffenburgBuildConfig
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
