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
  const buildConfigName = process.env.__CONFIG_NAME__
  if (!buildConfigName) {
    throw Error('No __CONFIG_NAME__ supplied!')
  }
  const buildConfig: ?BuildConfigType = buildConfigs[buildConfigName]
  if (!buildConfig) {
    throw Error('Invalid __CONFIG_NAME__ supplied!')
  }
  return buildConfig
}

export default buildConfig
