// @flow

import type { BuildConfigType } from './BuildConfigType'
import integreatBuildConfig from './integreat'
import integreatTestCmsBuildConfig from './integreat-test-cms'
import integreatE2eBuildConfig from './integreat-e2e'
import malteBuildConfig from './malte'

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
    throw Error(`Invalid BUILD_CONFIG_NAME supplied: ${buildConfigName}`)
  }
  return buildConfig
}

export default loadBuildConfig
