// @flow

import type { BuildConfigType } from './configs/BuildConfigType'

const integreatBuildConfig = require('../build-configs/configs/integreat')
const integreatTestCmsBuildConfig = require('../build-configs/configs/integreat-test-cms')
const malteBuildConfig = require('../build-configs/configs/malte')

export const buildConfigs: { [string]: BuildConfigType } = {
  integreat: integreatBuildConfig,
  'integreat-test-cms': integreatTestCmsBuildConfig,
  malte: malteBuildConfig
}

const loadBuildConfig = (buildConfigName: string): BuildConfigType => {
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
