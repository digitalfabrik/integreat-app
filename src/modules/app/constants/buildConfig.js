// @flow

import type { BuildConfigType } from '../../../../build-configs/configs/BuildConfigType'
import integreatBuildConfig from '../../../../build-configs/configs/integreat'
import integreatTestCmsBuildConfig from '../../../../build-configs/configs/integreat-test-cms'
import malteBuildConfig from '../../../../build-configs/configs/malte'

const buildConfigs = {
  integreat: integreatBuildConfig,
  'integreat-test-cms': integreatTestCmsBuildConfig,
  malte: malteBuildConfig
}

const buildConfig = (): BuildConfigType => {
  const buildConfigName = process.env.BUILD_CONFIG_NAME
  if (!buildConfigName) {
    throw Error('No BUILD_CONFIG_NAME supplied!')
  }
  const buildConfig: ?BuildConfigType = buildConfigs[buildConfigName]
  if (!buildConfig) {
    throw Error('Invalid BUILD_CONFIG_NAME supplied!')
  }
  return buildConfig
}

export default buildConfig
