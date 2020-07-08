// @flow

import type { BuildConfigType } from './configs/BuildConfigType'
import integreatBuildConfig from '../build-configs/configs/integreat'
import integreatTestCmsBuildConfig from '../build-configs/configs/integreat-test-cms'
import integreatE2eBuildConfig from '../build-configs/configs/integreat-e2e'
import malteBuildConfig from '../build-configs/configs/malte'

export const buildConfigs: { [string]: BuildConfigType } = {
  integreat: integreatBuildConfig,
  'integreat-test-cms': integreatTestCmsBuildConfig,
  'integreat-e2e': integreatE2eBuildConfig,
  malte: malteBuildConfig
}

const loadBuildConfig = (buildConfigName: ?string): BuildConfigType => {
  if (!buildConfigName) {
    throw Error('No BUILD_CONFIG_NAME supplied!')
  }
  const buildConfig = buildConfigs[buildConfigName]
  if (!buildConfig) {
    throw Error('Invalid BUILD_CONFIG_NAME supplied!')
  }
  return buildConfig
}

export default loadBuildConfig
