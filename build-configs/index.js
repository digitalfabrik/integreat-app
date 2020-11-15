// @flow

import type { AndroidBuildConfigType, iOSBuildConfigType, WebBuildConfigType } from './BuildConfigType'
import integreatBuildConfig from './integreat'
import integreatTestCmsBuildConfig from './integreat-test-cms'
import integreatE2eBuildConfig from './integreat-e2e'
import malteBuildConfig from './malte'

export const ANDROID = 'android'
export const IOS = 'ios'
export const WEB = 'web'

const PLATFORMS = [ANDROID, IOS, WEB]

type BuildConfigPlatformType = {
  android: AndroidBuildConfigType,
  ios: iOSBuildConfigType,
  web: WebBuildConfigType
}

export const buildConfigs: { [string]: BuildConfigPlatformType } = {
  integreat: integreatBuildConfig,
  'integreat-test-cms': integreatTestCmsBuildConfig,
  'integreat-e2e': integreatE2eBuildConfig,
  malte: malteBuildConfig
}

const loadBuildConfig = (buildConfigName: ?string, platform: ?string) => {
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
