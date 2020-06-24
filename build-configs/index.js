// @flow

const integreatBuildConfig = require('../build-configs/configs/integreat')
const integreatTestCmsBuildConfig = require('../build-configs/configs/integreat-test-cms')
const malteBuildConfig = require('../build-configs/configs/malte')

export const buildConfigs = {
  integreat: integreatBuildConfig,
  'integreat-test-cms': integreatTestCmsBuildConfig,
  malte: malteBuildConfig
}

const loadBuildConfig = buildConfigName => {
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
