import {
  AndroidBuildConfigType,
  CommonBuildConfigType,
  iOSBuildConfigType,
  WebBuildConfigType,
} from './BuildConfigType'
import aschaffenburgBuildConfig from './aschaffenburg'
import aschaffenburgBuildConfigName from './aschaffenburg/build-config-name'
import integreatBuildConfig from './integreat'
import integreatE2eBuildConfig from './integreat-e2e'
import integreatE2eBuildConfigName from './integreat-e2e/build-config-name'
import integreatFlossBuildConfig from './integreat-floss'
import integreatFlossBuildConfigName from './integreat-floss/build-config-name'
import integreatTestCmsBuildConfig from './integreat-test-cms'
import integreatTestCmsBuildConfigName from './integreat-test-cms/build-config-name'
import integreatBuildConfigName from './integreat/build-config-name'
import malteBuildConfig from './malte'
import malteTestCmsBuildConfig from './malte-test-cms'
import malteTestCmsBuildConfigName from './malte-test-cms/build-config-name'
import malteBuildConfigName from './malte/build-config-name'
import obdachBuildConfig from './obdach'
import obdachBuildConfigName from './obdach/build-config-name'

export type { ThemeType } from './ThemeType'

export const COMMON = 'common'
export const ANDROID = 'android'
export const IOS = 'ios'
export const WEB = 'web'

type BuildConfigPlatformType = {
  common: CommonBuildConfigType
  android: AndroidBuildConfigType | null
  ios: iOSBuildConfigType | null
  web: WebBuildConfigType
}

export type PlatformType = keyof BuildConfigPlatformType

const PLATFORMS = [COMMON, ANDROID, IOS, WEB]

export const buildConfigs: Record<string, BuildConfigPlatformType> = {
  [integreatBuildConfigName]: integreatBuildConfig,
  [integreatFlossBuildConfigName]: integreatFlossBuildConfig,
  [integreatTestCmsBuildConfigName]: integreatTestCmsBuildConfig,
  [integreatE2eBuildConfigName]: integreatE2eBuildConfig,
  [malteBuildConfigName]: malteBuildConfig,
  [malteTestCmsBuildConfigName]: malteTestCmsBuildConfig,
  [aschaffenburgBuildConfigName]: aschaffenburgBuildConfig,
  [obdachBuildConfigName]: obdachBuildConfig,
}

const loadBuildConfig = <T extends PlatformType>(
  buildConfigName: string | null | undefined,
  platform: T
): BuildConfigPlatformType[T] => {
  if (!buildConfigName) {
    throw Error('No BUILD_CONFIG_NAME supplied!')
  }

  const buildConfig = buildConfigs[buildConfigName]

  if (!buildConfig) {
    throw Error(`Invalid BUILD_CONFIG_NAME supplied: ${buildConfigName}`)
  }

  if (!PLATFORMS.includes(platform)) {
    throw Error(`Invalid platform supplied: ${platform}`)
  }

  if (!buildConfig[platform]) {
    throw Error(`Build config not available for platform: ${platform}`)
  }

  buildConfig.common.featureFlags.cityNotCooperating =
    !!buildConfig.common.featureFlags.cityNotCooperatingTemplate && !!buildConfig.web.icons.cityNotCooperating

  return buildConfig[platform]
}

export default loadBuildConfig
