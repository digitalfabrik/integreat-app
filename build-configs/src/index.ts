import type {
  AndroidBuildConfigType,
  CommonBuildConfigType,
  IosBuildConfigType,
  WebBuildConfigType,
} from './BuildConfigType.ts'
import aschaffenburgBuildConfigName from './aschaffenburg/build-config-name/index.ts'
import aschaffenburgBuildConfig from './aschaffenburg/index.ts'
import integreatE2eBuildConfigName from './integreat-e2e/build-config-name/index.ts'
import integreatE2eBuildConfig from './integreat-e2e/index.ts'
import integreatTestCmsBuildConfigName from './integreat-test-cms/build-config-name/index.ts'
import integreatTestCmsBuildConfig from './integreat-test-cms/index.ts'
import integreatBuildConfigName from './integreat/build-config-name/index.ts'
import integreatBuildConfig from './integreat/index.ts'
import malteTestCmsBuildConfigName from './malte-test-cms/build-config-name/index.ts'
import malteTestCmsBuildConfig from './malte-test-cms/index.ts'
import malteBuildConfigName from './malte/build-config-name/index.ts'
import malteBuildConfig from './malte/index.ts'
import obdachBuildConfigName from './obdach/build-config-name/index.ts'
import obdachBuildConfig from './obdach/index.ts'

export type { ThemeKey } from './ThemeKey.ts'

export const COMMON = 'common'
export const ANDROID = 'android'
export const IOS = 'ios'
export const WEB = 'web'

type BuildConfigPlatformType = {
  common: CommonBuildConfigType
  android: AndroidBuildConfigType | null
  ios: IosBuildConfigType | null
  web: WebBuildConfigType
}

export type PlatformType = keyof BuildConfigPlatformType

const PLATFORMS = [COMMON, ANDROID, IOS, WEB]

export const buildConfigs: Record<string, BuildConfigPlatformType> = {
  [integreatBuildConfigName]: integreatBuildConfig,
  [integreatTestCmsBuildConfigName]: integreatTestCmsBuildConfig,
  [integreatE2eBuildConfigName]: integreatE2eBuildConfig,
  [malteBuildConfigName]: malteBuildConfig,
  [malteTestCmsBuildConfigName]: malteTestCmsBuildConfig,
  [aschaffenburgBuildConfigName]: aschaffenburgBuildConfig,
  [obdachBuildConfigName]: obdachBuildConfig,
}

const loadBuildConfig = <T extends PlatformType>(
  buildConfigName: string | null | undefined,
  platform: T,
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

  return buildConfig[platform]
}

export default loadBuildConfig
